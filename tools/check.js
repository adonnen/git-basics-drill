#!/usr/bin/env node
/*
 * check.js — verify the page without opening a browser.
 *
 *     node tools/check.js
 *
 * There is no test framework and no dependency to install. This boots the real
 * engine against a small stand-in for the browser, so a change can be checked
 * from a terminal or by an agent. It reports:
 *
 *   - syntax errors in any data file or in the engine
 *   - everything validateData() finds (missing fields, unknown reference keys,
 *     duplicate cards)
 *   - a smoke test of the parts most easily broken by an edit: rendering,
 *     stage filtering, keyword search, view switching, and the save/load round
 *     trip including a file written before the lab existed
 *
 * Exit code 0 means everything passed; 1 means something failed.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = [
  'data/references.js',
  'data/cards.js',
  'data/lab.js',
  'js/drill.js'
];

/* ------------------------------------------------------------------ report */

const failures = [];
const pass = message => console.log('  ok    ' + message);
const fail = message => { failures.push(message); console.log('  FAIL  ' + message); };
const check = (condition, message) => condition ? pass(message) : fail(message);

/* ------------------------------------------------- a stand-in for the DOM
   Only what the engine touches: enough to build elements, set classes and
   read them back. Nothing is rendered; this is about behaviour, not pixels. */

function makeElement(tag = 'div') {
  const classes = new Set();
  return {
    tagName: String(tag).toUpperCase(),
    children: [], dataset: {}, style: {},
    className: '', textContent: '', innerHTML: '',
    hidden: false, files: [], type: '', checked: false, value: '',
    classList: {
      add:      (...names) => names.forEach(n => classes.add(n)),
      remove:   (...names) => names.forEach(n => classes.delete(n)),
      contains: name => classes.has(name),
      toggle(name, force) {
        const on = force === undefined ? !classes.has(name) : !!force;
        on ? classes.add(name) : classes.delete(name);
        return on;
      }
    },
    append(...nodes) { this.children.push(...nodes); },
    appendChild(node) { this.children.push(node); return node; },
    replaceChildren(...nodes) { this.children = [...nodes]; },
    querySelectorAll(selector) {
      const wanted = selector.replace('.', '');
      const found = [];
      const walk = node => {
        if (String(node.className).split(' ').includes(wanted)) found.push(node);
        (node.children || []).forEach(walk);
      };
      (this.children || []).forEach(walk);
      return found;
    },
    closest: () => makeElement(),
    setAttribute() {}, getAttribute: () => null, focus() {}, blur() {}, click() {}
  };
}

const registry = {};
global.document = {
  documentElement: { dataset: {} },
  createElement: makeElement,
  createTextNode: text => ({ textContent: text }),
  getElementById: id => (registry[id] ||= makeElement(id === 'pInput' ? 'input' : 'div')),
  addEventListener() {}
};
global.window = { scrollTo() {} };
global.matchMedia = () => ({ matches: false });
global.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
global.Blob = class {};

// The two segmented switches need their buttons to exist before boot.
for (const [id, key, values] of [
  ['view',  'view',  ['cards', 'lab']],
  ['theme', 'theme', ['auto', 'light', 'dark']]
]) {
  const host = document.getElementById(id);
  values.forEach(value => {
    const button = makeElement('button');
    button.dataset[key] = value;
    host.children.push(button);
  });
}

/* ------------------------------------------------------------------- boot */

console.log('\nfiles');
const parts = [];
for (const file of SOURCES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) { fail(file + ' is missing'); continue; }
  parts.push(fs.readFileSync(full, 'utf8'));
  pass(file);
}
if (failures.length) { console.log('\n' + failures.length + ' failure(s)\n'); process.exit(1); }

// index.html must reference exactly these files, or the browser sees something
// different from what this script just checked.
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const file of SOURCES) {
  check(html.includes('src="' + file + '"'), 'index.html loads ' + file);
}

const warnings = [];
const realWarn = console.warn;
console.warn = (...args) => warnings.push(args.join(' '));

// The probe runs inside the same scope as the engine, so it can see its
// internals — there are no exports to import.
const probe = `
globalThis.api = {
  DECK, CARDS, LAB, LAB_STEPS, STAGES, REFERENCES, el, grades, labDone,
  visible, applySearch, applyView, showSummary, restart,
  serialize, deserialize, applyTheme, renderLines,
  get filter(){ return filter; }, set filter(v){ filter = v; },
  get theme(){ return theme; }
};`;

try {
  (0, eval)(parts.join('\n;\n') + probe);
} catch (error) {
  console.warn = realWarn;
  console.log('\nengine failed to start:');
  console.log('  ' + error.message);
  process.exit(1);
}
console.warn = realWarn;
const api = globalThis.api;

/* ------------------------------------------------------------- validation */

console.log('\ncontent');
check(warnings.length === 0, 'validateData() reports no problems');
warnings.forEach(w => console.log('        ' + w));
check(api.DECK.length > 0, api.DECK.length + ' cards across ' + api.STAGES.length + ' stages');
check(api.LAB_STEPS.length > 0, api.LAB_STEPS.length + ' lab steps');

// Stage labels carry a two-digit prefix that fixes their order.
const unprefixed = api.STAGES.filter(s => !/^\d\d /.test(s));
check(unprefixed.length === 0, 'every stage label starts with a number' +
  (unprefixed.length ? ' — offenders: ' + unprefixed.join(', ') : ''));

// Two cards sharing a key would share one slot in a saved progress file.
const keys = new Set(api.DECK.map(c => c.key));
check(keys.size === api.DECK.length, 'every card has a distinct progress key');

const labKeys = new Set(api.LAB_STEPS.map(s => s.key));
check(labKeys.size === api.LAB_STEPS.length, 'every lab step has a distinct progress key');

/* ---------------------------------------------------------------- render */

console.log('\nrendering');
check(api.renderLines(['plain `code` here']).includes('<code>code</code>'), 'backticks become code');
check(api.renderLines(['**bold**']).includes('<b>bold</b>'), 'double asterisks become bold');
check(api.renderLines(['*italic*']).includes('<em>italic</em>'), 'single asterisks become italic');
check(api.renderLines(['$ git status']).includes('class="cmdline"'), '"$" lines become a terminal block');
check(api.renderLines(['| A ── B']).includes('class="drawing"'), '"|" lines become a drawing');
check(api.renderLines(['a < b & c']).includes('&lt;'), 'angle brackets and ampersands are escaped');
check((api.renderLines(['$ one', '$ two']).match(/cmdline/g) || []).length === 1,
      'consecutive "$" lines share one block');

const withDrawings = api.DECK.filter(c => c.answer.includes('class="drawing"')).length;
pass(withDrawings + ' cards show a drawing on the card itself');

/* --------------------------------------------------------------- filters */

console.log('\nfilters');
const total = api.visible().length;
api.applySearch('rebase');
const rebase = api.visible().length;
api.applySearch('stash');
const stash = api.visible().length;
api.applySearch('rebase stash');
const either = api.visible().length;
check(rebase > 0 && stash > 0, 'keyword search finds cards');
check(either >= Math.max(rebase, stash), 'multiple keywords are OR-ed, not AND-ed');
api.applySearch('span');
check(api.visible().length < 5, 'markup is not searchable — "span" matches almost nothing');
api.applySearch('');
check(api.visible().length === total, 'clearing the search restores every card');

api.filter = api.STAGES[1];
const staged = api.visible().length;
check(staged > 0 && staged < total, 'the stage filter narrows the deck');
api.filter = 'all';

/* ----------------------------------------------------------------- views */

console.log('\nviews');
api.applyView('lab');
check(!api.el.lab.hidden && api.el.stage.hidden, 'the lab view hides the deck');
check(api.el.filters.hidden, 'the deck filters hide with it');
api.showSummary();
api.applyView('cards');
check(!api.el.summary.hidden && api.el.stage.hidden, 'leaving and returning restores the summary');
api.restart(false);
check(!api.el.stage.hidden && api.el.summary.hidden, 'restart returns to the card');

/* --------------------------------------------------------------- storage */

console.log('\nprogress files');
api.grades.set(0, 'got');
api.grades.set(1, 'again');
api.labDone.add(api.LAB_STEPS[0].key);
api.applyTheme('light');

const saved = api.serialize();
api.grades.clear();
api.labDone.clear();
api.applyTheme('dark');
api.deserialize(saved);

check(api.grades.size === 2, 'card grades survive a save and load');
check(api.labDone.size === 1, 'lab ticks survive a save and load');
check(api.theme === 'light', 'the theme survives a save and load');

const legacy = JSON.parse(saved);
delete legacy.lab;
api.labDone.clear();
api.labDone.add(api.LAB_STEPS[2].key);
api.deserialize(JSON.stringify(legacy));
check(api.labDone.size === 1, 'a file without lab data leaves lab ticks alone');

api.deserialize('not json at all');
api.deserialize(JSON.stringify({ app: 'something-else' }));
pass('malformed input is rejected without throwing');

/* ------------------------------------------------------------------- end */

console.log();
if (failures.length) {
  console.log(failures.length + ' failure(s):');
  failures.forEach(f => console.log('  - ' + f));
  console.log();
  process.exit(1);
}
console.log('all checks passed\n');
