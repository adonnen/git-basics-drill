#!/usr/bin/env node
/*
 * check.js — verify the page without opening a browser.
 *
 *     node tools/check.js
 *
 * The whole thing runs on a stock node install. It boots the real engine
 * against a small stand-in for the browser, so a change can be checked from a
 * terminal or in CI. It reports:
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
const GITCONFIG = path.join(ROOT, 'examples', 'gitconfig');
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
   read them back. Nothing is rendered; this checks behaviour only. */

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
  body: makeElement('body'),
  createElement: makeElement,
  createTextNode: text => ({ textContent: text }),
  getElementById: id => (registry[id] ||= makeElement(id === 'pInput' ? 'input' : 'div')),
  addEventListener() {}
};
global.window = { scrollTo() {} };
global.matchMedia = () => ({ matches: false });

// Enough of localStorage for the session store: the engine probes it once at
// boot and falls back to files alone if it throws.
const cells = new Map();
global.localStorage = {
  getItem: key => (cells.has(key) ? cells.get(key) : null),
  setItem: (key, value) => cells.set(key, String(value)),
  removeItem: key => cells.delete(key)
};
global.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
global.Blob = class {};

// The overlays carry `hidden` in the markup; elements here start visible.
document.getElementById('gate').hidden = true;
document.getElementById('aliasPop').hidden = true;

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
  serialize, deserialize, applyTheme, renderLines, renderInline,
  remember, recall, forget, openGate, resumeSession, newSession, gateOpen, STORE_KEY,
  ALIASES, openAlias, closeAlias, aliasOpen,
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

/* --------------------------------------------------------------- aliases
   The pop-up quotes examples/gitconfig from a copy in references.js, because a
   page opened from disk cannot read the file itself. This is what stops the two
   from drifting: the definitions are parsed back out of the gitconfig and
   compared. Continuation lines are joined and runs of whitespace collapsed, so
   only the substance has to match, not the indentation. */

console.log('\naliases');

function parseGitconfigAliases(text) {
  const found = {};
  let inAliases = false, name = null, value = '';

  // git's own unquoting: a value wrapped in double quotes loses them, and the
  // backslashes that protected quotes inside it go with them.
  const commit = () => {
    if (name) {
      let text = value.replace(/\s+/g, ' ').trim();
      if (/^".*"$/.test(text)) text = text.slice(1, -1).replace(/\\(["\\])/g, '$1');
      found[name] = text;
    }
    name = null; value = '';
  };

  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (/^\s*\[/.test(line)) { commit(); inAliases = /^\s*\[alias\]/.test(line); continue; }
    if (!inAliases) continue;

    if (name) {                                   // still inside a continued value
      value += ' ' + line.replace(/\\$/, '').trim();
      if (!/\\$/.test(line)) commit();
      continue;
    }
    if (/^\s*#/.test(line) || !line.trim()) continue;

    const match = line.match(/^\s*([\w-]+)\s*=\s*(.*)$/);
    if (!match) continue;
    name = match[1];
    value = match[2].replace(/\\$/, '');
    if (!/\\$/.test(line)) commit();
  }
  commit();
  return found;
}

const configured = parseGitconfigAliases(fs.readFileSync(GITCONFIG, 'utf8'));
check(Object.keys(configured).length > 10,
      Object.keys(configured).length + ' aliases read from examples/gitconfig');

for (const [name, alias] of Object.entries(api.ALIASES)) {
  const theirs = configured[name];
  const mine   = alias.expands.replace(/\s+/g, ' ').trim();
  if (theirs === undefined) { fail('references.js knows "' + name + '", examples/gitconfig does not'); continue; }
  check(theirs === mine, '"' + name + '" matches examples/gitconfig' +
    (theirs === mine ? '' : '\n        gitconfig: ' + theirs + '\n        references: ' + mine));
  check(typeof alias.note === 'string' && alias.note.length > 20, '"' + name + '" says what it is for');
}

// The chip is what makes an alias mention clickable, and it must not fire on
// ordinary commands that happen to be written the same way.
check(api.renderInline('run `git lg` often').includes('data-alias="lg"'), 'a known alias becomes a chip');
check(api.renderInline('run `git status` often').includes('<code>git status</code>'),
      'an ordinary command stays plain code');
check(!api.renderInline('`lg` alone').includes('data-alias'), 'a bare name is not a chip');

const chips = api.DECK.filter(c => (c.question + c.answer + c.detail).includes('data-alias')).length;
pass(chips + ' cards carry at least one alias chip');

// The other direction: a card naming an alias that examples/gitconfig defines
// but references.js has never heard of would quietly render as plain code, and
// the reader would be left to guess what the name meant.
const missed = new Set();
const everyLine = [...api.CARDS, ...api.LAB].flatMap(entry => Object.values(entry).flat())
  .filter(value => typeof value === 'string');
for (const line of everyLine) {
  for (const [, name] of line.matchAll(/`git ([\w-]+)`/g)) {
    if (configured[name] && !api.ALIASES[name]) missed.add(name);
  }
}
check(missed.size === 0, missed.size
  ? 'named in a card but missing from ALIASES in references.js: ' + [...missed].join(', ')
  : 'every alias a card names is in ALIASES, so every mention is clickable');

api.openAlias('nuke');
check(api.aliasOpen() && api.el.aTitle.textContent === 'git nuke', 'a chip opens the pop-up');
check(api.el.aHow.innerHTML.includes('shell alias'), 'a "!" alias sends the reader to the file');
api.openAlias('s');
check(api.el.aHow.innerHTML.includes("git config --global alias.s 'status -sb'"),
      'a plain alias comes with the command that installs it');
api.closeAlias();
check(!api.aliasOpen(), 'the pop-up closes');

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

// A file whose keys belong to an older wording of the deck restores nothing.
// It must say so in the error colour rather than report a cheerful zero.
api.deserialize(JSON.stringify({
  app: 'git-drill', version: 1, marks: { kgonestale: 'got', kalsogone: 'again' }, lab: []
}));
check(api.el.pStatus.className.includes('err') &&
      api.el.pStatus.textContent.includes('older deck'),
      'a file from an older deck reports a failure, not "restored 0 cards"');

api.deserialize('not json at all');
api.deserialize(JSON.stringify({ app: 'something-else' }));
pass('malformed input is rejected without throwing');

/* ------------------------------------------------------- the session store */

console.log('\nthe browser session');

// Everything that changes the session writes it; nothing needs an explicit save.
api.grades.clear();
api.labDone.clear();
api.grades.set(3, 'got');
api.applyTheme('dark');
check(cells.has(api.STORE_KEY), 'a change writes the session to the browser');

const kept = api.recall();
check(kept && Object.keys(kept.marks).length === 1 && kept.theme === 'dark',
      'the stored session holds the marks and the theme');

// The gate stands between a stored session and the page behind it.
api.grades.clear();
api.applyTheme('auto');
api.openGate(kept);
check(api.gateOpen(), 'a stored session raises the gate');
check(api.el.gSummary.innerHTML.includes('1 card graded'), 'the gate says what it is holding');

api.resumeSession();
check(!api.gateOpen() && api.grades.size === 1 && api.theme === 'dark',
      'resume closes the gate and takes the session back');

api.newSession();
check(!api.gateOpen() && api.grades.size === 0 && api.recall() !== null,
      'a new session starts clean and replaces what was stored');

// A file that matches nothing must leave the live session where it is.
api.grades.set(5, 'again');
api.deserialize(JSON.stringify({ app: 'git-drill', version: 1, marks: { kgonestale: 'got' }, lab: [] }));
check(api.grades.size === 1 && api.el.pStatus.className.includes('err'),
      'a load that matches nothing leaves the session alone');

/* ------------------------------------------------------------------- end */

console.log();
if (failures.length) {
  console.log(failures.length + ' failure(s):');
  failures.forEach(f => console.log('  - ' + f));
  console.log();
  process.exit(1);
}
console.log('all checks passed\n');
