/* =============================================================================
   drill.js — the engine.

   Reads three data files that index.html loads before it:
     references.js  REFERENCES   the two books and their sections
     cards.js       CARDS        the flashcards
     lab.js         LAB          the exercise

   Nothing here needs editing to add content: add cards to cards.js and steps
   to lab.js, and stages, counters and the progress graph follow by themselves.

   Sections
     B1  elements          B6  deck: cards
     B2  text rendering    B7  deck: details modal
     B3  helpers           B8  deck: summary
     B4  state             B9  lab
     B5  theme and views   B10 progress files
                           B11 validation, wiring and boot
   ============================================================================= */

/* == B1. elements ========================================================= */

const $ = id => document.getElementById(id);

const el = {
  // header
  blurb:$('blurb'), view:$('view'), chips:$('chips'), theme:$('theme'),
  filterbar:$('filterbar'), search:$('search'),
  searchClear:$('searchClear'), searchCount:$('searchCount'),
  // progress toolbar
  pLoad:$('pLoad'), pSave:$('pSave'), pSaveAs:$('pSaveAs'),
  pFile:$('pFile'), pStatus:$('pStatus'), pInput:$('pInput'),
  // cards view
  stage:$('stage'), summary:$('summary'), graph:$('graph'),
  pane:$('pane'), face:$('face'), eyebrow:$('eyebrow'), text:$('cardText'),
  path:$('cardPath'), count:$('cardCount'), hint:$('hint'), details:$('detailsBtn'),
  // details modal
  backdrop:$('backdrop'), mStage:$('mStage'), mTitle:$('mTitle'), mText:$('mText'),
  mFigure:$('mFigure'), mLink1:$('mLink1'), mLink2:$('mLink2'), mClose:$('mClose'),
  // lab view
  lab:$('lab')
};


/* == B2. text rendering ===================================================
   The data files are written in plain text with four marks, so that editing
   a card needs no HTML. This turns that text into the HTML the page shows.

       `text`      code, in the accent colour
       *text*      italic
       **text**    bold
       $ command   a line starting with "$" becomes a terminal block
       | drawing   a line starting with "|" becomes a small figure, kept
                   exactly as typed

   Runs of "$" or "|" lines each become one block, wherever they appear.
   Everything else is escaped, so a card can contain < or & safely.
   ========================================================================== */

const escapeHtml = text => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Apply the inline marks to one run of prose. Bold before italic, since
 *  ** would otherwise be read as two italic markers. */
const renderInline = text => escapeHtml(text)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>');

/**
 * Render an array of lines. Prose lines join into a paragraph; runs of "$" or
 * "|" lines each become one block, in the order they appear.
 */
function renderLines(lines){
  let html = '', prose = [], block = null, blockKind = null;

  const flushProse = () => {
    if(prose.length){ html += renderInline(prose.join(' ')); prose = []; }
  };
  const flushBlock = () => {
    if(!block) return;
    const cls = blockKind === '$' ? 'cmdline' : 'drawing';
    html += '<span class="' + cls + '">' + escapeHtml(block.join('\n')) + '</span>';
    block = null; blockKind = null;
  };
  const openBlock = (kind, text) => {
    flushProse();
    if(blockKind !== kind) flushBlock();
    blockKind = kind;
    (block ||= []).push(text);
  };

  for(const line of lines || []){
    // Strip the marker and one optional space after it.
    if(line[0] === '$' || line[0] === '|'){
      openBlock(line[0], line.slice(1).replace(/^ /, ''));
    } else {
      flushBlock();
      prose.push(line);
    }
  }
  flushProse();
  flushBlock();
  return html;
}

/* == B3. helpers ========================================================== */

/** FNV-1a — a short, stable key for any string. */
function hashKey(text){
  let h = 2166136261;
  for(let i = 0; i < text.length; i++){ h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'k' + (h >>> 0).toString(36);
}

/** Create an element in one call: tag, class, and text or child nodes. */
function make(tag, className, content){
  const node = document.createElement(tag);
  if(className) node.className = className;
  if(typeof content === 'string') node.textContent = content;
  else if(Array.isArray(content)) node.append(...content);
  return node;
}

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;


/* == B4. state ============================================================
   Cards and lab steps are identified by a hash of their own text, so saved
   progress survives the deck being edited or reordered.
   ========================================================================== */

/**
 * Turn each raw card from cards.js into the form the page uses: the text
 * rendered to HTML once, plus two derived values.
 *   key  identifies the card in a saved progress file. It is a hash of the
 *        card's own words, so reordering the deck never loses anyone's marks.
 *   hay  everything the keyword filter searches, lowercased once here rather
 *        than on every keystroke.
 */
const DECK = CARDS.map(card => ({
  stage:    card.stage,
  question: renderInline(card.question),
  answer:   renderLines(card.answer),
  detail:   renderLines(card.detail),
  figure:   (card.figure || []).join('\n'),
  proGit:   card.proGit,
  bottomUp: card.bottomUp || null,
  key:      hashKey('card|' + card.stage + '|' + card.question),
  hay:      [card.stage, card.question, ...(card.answer || []),
             ...(card.detail || []), ...(card.figure || [])]
              .join(' ').toLowerCase()
}));

const STAGES    = [...new Set(DECK.map(card => card.stage))];
const LAB_STEPS = LAB.filter(entry => !entry.act);

LAB_STEPS.forEach(step => { step.key = hashKey('lab|' + step.title); });

let view      = 'cards';   // 'cards' | 'lab'
let deckPanel = 'stage';   // which cards-view panel is current: 'stage' | 'summary'
let theme     = 'auto';    // 'auto' | 'light' | 'dark'

const grades  = new Map(); // deck index -> 'got' | 'again'
const labDone = new Set(); // keys of completed lab steps

let order      = DECK.map((_, i) => i); // deck indices, in presentation order
let filter     = 'all';                 // active stage, or 'all'
let terms      = [];                    // keyword filter, OR-ed together
let pos        = 0;                     // cursor within the visible list
let flipped    = false;                 // showing the answer?
let sequential = true;                  // order untouched -> draw stage gaps

/**
 * Does this card survive both filters? The stage must match (or be 'all'), and
 * at least one search term must appear somewhere in the card — terms are OR-ed,
 * so "rebase stash" shows cards about either.
 */
function keeps(deckIndex){
  const card = DECK[deckIndex];
  if(filter !== 'all' && card.stage !== filter) return false;
  if(terms.length && !terms.some(term => card.hay.includes(term))) return false;
  return true;
}

/** Deck indices currently on screen, after both filters. */
const visible = () => order.filter(keeps);
/** The card under the cursor, or undefined if the filter matched nothing. */
const current = () => DECK[visible()[pos]];


/* == B5. theme and views ==================================================
   The theme rides in the progress file rather than browser storage, so the
   page keeps no state of its own between sessions.
   ========================================================================== */

function applyTheme(next){
  theme = ['auto','light','dark'].includes(next) ? next : 'auto';
  document.documentElement.dataset.theme = theme;
  for(const b of el.theme.children) b.classList.toggle('on', b.dataset.theme === theme);
}

/** auto -> light -> dark -> auto, for the keyboard shortcut. */
const cycleTheme = () => applyTheme({ auto:'light', light:'dark', dark:'auto' }[theme]);

/** Choose which cards-view panel is current, and show it if that view is up. */
function showDeckPanel(which){
  deckPanel = which;
  if(view === 'cards') applyView('cards');
}

/** Switch between the deck and the lab, showing exactly one panel. */
function applyView(next){
  view = next === 'lab' ? 'lab' : 'cards';
  const onCards = view === 'cards';

  el.chips.hidden     = !onCards;
  el.filterbar.hidden = !onCards;
  el.stage.hidden   = !onCards || deckPanel !== 'stage';
  el.summary.hidden = !onCards || deckPanel !== 'summary';
  el.lab.hidden     =  onCards;

  for(const b of el.view.children) b.classList.toggle('on', b.dataset.view === view);
  window.scrollTo(0, 0);
}


/* == B6. deck: cards ======================================================
   Chips are built once and only re-styled. The graph is rebuilt only when
   its membership changes; otherwise node classes are updated in place.
   ========================================================================== */

/**
 * Apply a keyword filter. The query is split on whitespace and the terms are
 * OR-ed, so "reset revert" shows cards about either. Composes with the stage
 * chips: both must pass.
 */
function applySearch(text){
  terms = text.toLowerCase().split(/\s+/).filter(Boolean);
  el.searchClear.hidden = terms.length === 0;
  pos = 0;
  flipped = false;
  showDeckPanel('stage');   // a new filter means a new pass, not a stale summary
  render();
}

/** Wipe the keyword filter, including the text in the box. */
function clearSearch(){
  el.search.value = '';
  terms = [];
  el.searchClear.hidden = true;
}

function syncSearchCount(){
  if(!terms.length){
    el.searchCount.textContent = '';
    el.searchCount.className = 'fcount';
    return;
  }
  const n = visible().length;
  el.searchCount.textContent = n ? n + (n === 1 ? ' card' : ' cards') : 'no match';
  el.searchCount.className = 'fcount' + (n ? '' : ' none');
}

function buildChips(){
  for(const name of ['all', ...STAGES]){
    const b = make('button', 'chip', name);
    b.dataset.stage = name;
    b.onclick = () => { filter = name; pos = 0; flipped = false; showDeckPanel('stage'); render(); };
    el.chips.appendChild(b);
  }
}

function syncChips(){
  for(const b of el.chips.children) b.classList.toggle('on', b.dataset.stage === filter);
}

let graphKey = null;   // signature of the node set currently drawn

function drawGraph(){
  const list = visible();
  const key  = sequential + '|' + list.join(',');

  if(key !== graphKey){                       // membership changed — rebuild
    graphKey = key;
    el.graph.replaceChildren();
    list.forEach((deckIdx, slot) => {
      const newStage = slot > 0 && DECK[deckIdx].stage !== DECK[list[slot - 1]].stage;
      if(sequential && newStage) el.graph.appendChild(make('span', 'stage-gap'));

      const node = make('button', 'node');
      node.setAttribute('aria-label', 'Card ' + (slot + 1));
      node.onclick = () => { pos = slot; flipped = false; render(); };
      el.graph.appendChild(node);
    });
  }

  const nodes = el.graph.querySelectorAll('.node');   // spacers excluded
  list.forEach((deckIdx, slot) => {
    const grade = grades.get(deckIdx);
    nodes[slot].className = 'node'
      + (grade ? ' ' + grade : '')
      + (slot === pos ? ' cur' : '');
  });
}

function drawCard(){
  const card = current();
  if(!card){                                  // the filters matched nothing
    const why = terms.length && filter !== 'all'
      ? 'No cards match those keywords in ' + filter + '.'
      : terms.length ? 'No cards match those keywords.'
      : 'No cards in this stage.';
    el.text.className = 'prose q';
    el.text.textContent = why;
    el.path.textContent = '~/git-drill/';
    el.count.textContent = '0/0';
    el.details.hidden = true;
    return;
  }
  el.path.textContent    = '~/git-drill/' + card.stage.replace(/[· ]+/g, '-') + '.card';
  el.count.textContent   = (pos + 1) + '/' + visible().length;
  el.eyebrow.textContent = flipped ? 'ANSWER' : 'QUESTION';
  el.eyebrow.className   = 'eyebrow' + (flipped ? ' ans' : '');
  el.text.className      = 'prose ' + (flipped ? 'a' : 'q');
  el.text.innerHTML      = flipped ? card.answer : card.question;
  el.hint.textContent    = flipped ? 'space — back to question' : 'space — flip';
  el.details.hidden      = !flipped;
}

function render(){ syncChips(); syncSearchCount(); drawGraph(); drawCard(); }

function flip(){
  el.face.classList.add('swap');
  setTimeout(() => {
    flipped = !flipped;
    drawCard();
    el.face.classList.remove('swap');
  }, prefersReducedMotion ? 0 : 120);
}

function move(step){
  const total = visible().length;
  if(!total) return;
  pos = (pos + step + total) % total;
  flipped = false;
  render();
}

/** Record a grade, then jump to the next ungraded card — or finish. */
function grade(value){
  const list = visible();
  if(!list.length) return;
  grades.set(list[pos], value);

  const firstUngraded = list.findIndex(i => !grades.has(i));
  if(firstUngraded === -1){ showSummary(); return; }

  const nextUngraded = list.findIndex((i, slot) => slot > pos && !grades.has(i));
  pos = nextUngraded >= 0 ? nextUngraded : firstUngraded;
  flipped = false;
  render();
}

function shuffle(){
  for(let i = order.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  sequential = false;
  pos = 0; flipped = false;
  render();
}


/* == B7. deck: details modal ============================================== */

const modalOpen = () => !el.backdrop.hidden;

/** Build one reference link, or hide it when the card names no section. */
function setLink(anchor, href, label){
  if(!href){ anchor.hidden = true; return; }
  anchor.href = href;
  anchor.replaceChildren(make('span', null, label), make('span', 'arrow', '↗'));
  anchor.hidden = false;
}

function openDetails(){
  const card = current();
  if(!card) return;

  el.mStage.textContent = card.stage;
  el.mTitle.innerHTML   = card.question;
  el.mText.innerHTML    = card.detail;

  el.mFigure.textContent = card.figure;
  el.mFigure.hidden      = !card.figure;

  const proGit = REFERENCES.proGit;
  setLink(el.mLink1, proGit.base + card.proGit, 'Pro Git ' + proGit.sections[card.proGit]);

  const bottomUp = REFERENCES.bottomUp;
  const section  = card.bottomUp && bottomUp.sections[card.bottomUp];
  setLink(el.mLink2,
          section ? bottomUp.base + section.path : null,
          section ? 'Git from the Bottom Up — ' + section.title : null);

  el.backdrop.hidden = false;
  el.mClose.focus();
}

function closeDetails(){
  el.backdrop.hidden = true;
  el.pane.focus();
}


/* == B8. deck: summary ==================================================== */

function showSummary(){
  const list  = visible();
  const got   = list.filter(i => grades.get(i) === 'got').length;
  const again = list.length - got;
  const clean = again === 0;

  const status = make('div', 'status');
  status.innerHTML = clean
    ? '$ git status<br><b>nothing to commit, working tree clean</b>'
    : '$ git status<br><b>' + got + ' solid</b> · <b class="r">' + again + ' to revisit</b>';

  const heading = make('h2', null, clean
    ? 'All ' + list.length + ' cards solid.'
    : again + ' card' + (again > 1 ? 's' : '') + ' need a second pass.');

  const body = make('p', null, clean
    ? 'The concepts held. Come back in a week — spaced repetition beats one clean pass, and the deck keeps no grudges.'
    : 'Rebase your memory: run just the missed ones until the answer surfaces before the flip does.');

  const row = make('div', 'row');
  const button = (label, cls, fn) => {
    const b = make('button', cls, label);
    b.onclick = fn;
    row.appendChild(b);
  };
  if(!clean) button('review missed (' + again + ')', 'amber', reviewMissed);
  button('restart deck',      'ghost', () => restart(false));
  button('shuffle & restart', 'ghost', () => restart(true));

  el.summary.replaceChildren(status, heading, body, row);
  showDeckPanel('summary');
}

/** Narrow the deck to the cards graded "again" and clear those grades. */
function reviewMissed(){
  const missed = visible().filter(i => grades.get(i) === 'again');
  missed.forEach(i => grades.delete(i));
  order = missed;
  filter = 'all'; sequential = false;
  clearSearch();            // the review set is the missed cards, nothing less
  pos = 0; flipped = false;
  showDeckPanel('stage'); render();
}

function restart(withShuffle){
  grades.clear();
  order = DECK.map((_, i) => i);
  filter = 'all'; sequential = true;
  clearSearch();
  pos = 0; flipped = false;
  showDeckPanel('stage');
  if(withShuffle) shuffle(); else render();
}


/* == B9. lab ============================================================== */

/** How many steps sit under an act marked optional — counted, never hardcoded. */
function countOptionalSteps(){
  let optional = false, n = 0;
  for(const entry of LAB){
    if(entry.act) optional = !!entry.optional;
    else if(optional) n++;
  }
  return n;
}

function labProgressText(){
  return '<b>' + labDone.size + '</b> of ' + LAB_STEPS.length + ' steps done';
}

function buildIntro(){
  const intro = make('div', 'lab-intro prose');
  const localSteps = LAB_STEPS.length - countOptionalSteps();
  intro.innerHTML =
    '<h2>Lab — build a repository from nothing</h2>' +
    '<p>' + LAB_STEPS.length + ' steps in a real terminal, against a real directory on ' +
    'your machine. The first ' + localSteps + ' are entirely local: no remote, no clone, ' +
    'no push. Read the task, do it in your shell, and only then reveal the solution to ' +
    'check yourself.</p>' +
    '<p>The final act is optional and adds a remote — still on your own machine, using a ' +
    'bare repository as the “server”, so no account anywhere is needed. You need git and ' +
    'a shell: Terminal on macOS or Linux, Git Bash on Windows.</p>' +
    '<p>The whole exercise is disposable; the last step of each act tells you how to ' +
    'delete it. Tick steps off as you go and they are kept in your progress file.</p>' +
    '<div class="lab-count" id="labCount">' + labProgressText() + '</div>';
  return intro;
}

function buildStep(entry, number){
  const step = make('article', 'step');

  // head: number, title, done checkbox
  const box = make('input');
  box.type = 'checkbox';
  box.onchange = () => {
    box.checked ? labDone.add(entry.key) : labDone.delete(entry.key);
    step.classList.toggle('done', box.checked);
    syncLabCount();
  };
  entry.box = box;   // so a loaded progress file can tick it

  const head = make('div', 'step-head', [
    make('span', 'step-num', String(number).padStart(2, '0')),
    make('h3', null, entry.title),
    make('label', 'step-done', [box, document.createTextNode('done')])
  ]);

  const task = make('div', 'prose step-task');
  task.innerHTML = renderLines(entry.task);

  // solution: blurred until the step is opened
  const toggle   = make('button', 'tbtn', 'show solution');
  const solution = make('pre', 'solution', (entry.solution || []).join('\n'));
  solution.setAttribute('aria-hidden', 'true');

  const toggleSolution = () => {
    const open = step.classList.toggle('open');
    toggle.textContent = open ? 'hide solution' : 'show solution';
    solution.setAttribute('aria-hidden', String(!open));
  };
  toggle.onclick   = toggleSolution;
  solution.onclick = () => { if(!step.classList.contains('open')) toggleSolution(); };

  step.append(head, task, make('div', 'step-reveal', [toggle, solution]));
  return step;
}

function buildLab(){
  el.lab.replaceChildren(buildIntro());
  let number = 0;
  for(const entry of LAB){
    if(entry.act){
      const divider = make('div', 'act' + (entry.optional ? ' optional' : ''));
      divider.append(make('span', null, entry.act.toUpperCase()));
      if(entry.optional) divider.append(make('span', 'badge', 'OPTIONAL'));
      el.lab.appendChild(divider);
    } else {
      el.lab.appendChild(buildStep(entry, ++number));
    }
  }
}

function syncLabCount(){
  const counter = $('labCount');
  if(counter) counter.innerHTML = labProgressText();
}

/** Reflect `labDone` onto the checkboxes — used after loading a file. */
function syncLab(){
  for(const step of LAB_STEPS){
    if(!step.box) continue;
    const done = labDone.has(step.key);
    step.box.checked = done;
    step.box.closest('.step').classList.toggle('done', done);
  }
  syncLabCount();
}


/* == B10. progress files ==================================================
   One JSON file holds card grades, lab ticks and the theme. The File System
   Access API is what allows overwriting a file the reader picks; where it is
   missing (Firefox, sandboxed frames) this falls back to a download and a
   plain file input.
   ========================================================================== */

const PICKER_TYPES = [{ description:'git drill progress', accept:{ 'application/json':['.json'] } }];

let fileHandle  = null;   // bound file, once picked
let statusTimer = null;

function status(message, isError){
  el.pStatus.textContent = message;
  el.pStatus.className = 'tstatus show' + (isError ? ' err' : '');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { el.pStatus.className = 'tstatus'; }, 4000);
}

function bindFile(handle){
  fileHandle = handle;
  el.pFile.textContent = '· ' + handle.name;
  el.pFile.hidden = false;
  el.pSaveAs.hidden = false;
}

function serialize(){
  const marks = {};
  DECK.forEach((card, i) => { if(grades.has(i)) marks[card.key] = grades.get(i); });
  return JSON.stringify({
    app:'git-drill', version:1,
    saved:new Date().toISOString(),
    theme,
    deckSize:DECK.length, graded:Object.keys(marks).length,
    labSize:LAB_STEPS.length, labDone:labDone.size,
    marks,
    lab:[...labDone]
  }, null, 2);
}

function deserialize(text){
  let data;
  try { data = JSON.parse(text); }
  catch { return status('not valid JSON', true); }
  if(!data || data.app !== 'git-drill' || !data.marks) return status('not a drill progress file', true);

  if(data.theme) applyTheme(data.theme);

  // Lab ticks. Files written before the lab existed have no `lab` key, so
  // leave whatever is on screen rather than clearing it.
  if(Array.isArray(data.lab)){
    labDone.clear();
    data.lab.forEach(key => labDone.add(key));
    syncLab();
  }

  // Card grades, matched by key so reordering the deck is harmless.
  grades.clear();
  const byKey = new Map(DECK.map((card, i) => [card.key, i]));
  let restored = 0, unmatched = 0;
  for(const [key, value] of Object.entries(data.marks)){
    if(byKey.has(key) && (value === 'got' || value === 'again')){ grades.set(byKey.get(key), value); restored++; }
    else unmatched++;
  }

  order = DECK.map((_, i) => i);
  filter = 'all'; sequential = true; flipped = false;
  clearSearch();
  const firstUngraded = order.findIndex(i => !grades.has(i));
  pos = firstUngraded >= 0 ? firstUngraded : 0;

  deckPanel = 'stage';
  render();
  applyView(view);            // stay in whichever view the reader was using

  const parts = [restored + ' card' + (restored === 1 ? '' : 's')];
  if(labDone.size) parts.push(labDone.size + ' lab step' + (labDone.size === 1 ? '' : 's'));
  if(unmatched)    parts.push(unmatched + ' unmatched');
  status('restored ' + parts.join(' · '));
}

/** Offer the file as a download — the fallback when no picker is available. */
function downloadFile(text){
  const url = URL.createObjectURL(new Blob([text], { type:'application/json' }));
  const a = make('a');
  a.href = url;
  a.download = 'git-drill-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  status('picker unavailable — downloaded instead');
}

async function saveProgress(forcePicker){
  const text = serialize();
  try{
    if(window.showSaveFilePicker){
      const handle = (!forcePicker && fileHandle) ? fileHandle : await window.showSaveFilePicker({
        suggestedName: fileHandle ? fileHandle.name : 'git-drill-progress.json',
        types: PICKER_TYPES
      });
      const writable = await handle.createWritable();
      await writable.write(text);
      await writable.close();
      bindFile(handle);

      const saved = [grades.size + ' graded'];
      if(labDone.size) saved.push(labDone.size + '/' + LAB_STEPS.length + ' lab');
      return status('saved · ' + saved.join(' · '));
    }
  } catch(err){
    if(err?.name === 'AbortError')      return status('cancelled');
    if(err?.name === 'NotAllowedError') return status('permission denied', true);
  }
  downloadFile(text);
}

async function loadProgress(){
  try{
    if(window.showOpenFilePicker){
      const [handle] = await window.showOpenFilePicker({ types: PICKER_TYPES, multiple:false });
      deserialize(await (await handle.getFile()).text());
      return bindFile(handle);
    }
  } catch(err){
    if(err?.name === 'AbortError') return status('cancelled');
  }
  el.pInput.click();   // fallback picker
}


/* == B11. validation, wiring and boot =====================================
   The check below runs on every load and reports malformed content in the
   browser console. It is here so that someone adding a card gets told what is
   wrong instead of meeting a blank screen.
   ========================================================================== */

function validateData(){
  const problems = [];

  CARDS.forEach((card, i) => {
    const where = 'cards.js, card ' + (i + 1) + ' (' + (card.stage || 'no stage') + ')';

    for(const field of ['stage', 'question', 'proGit']){
      if(typeof card[field] !== 'string' || !card[field]){
        problems.push(where + ': "' + field + '" is missing, or is not text in quotes');
      }
    }
    for(const field of ['answer', 'detail', 'figure']){
      if(!Array.isArray(card[field]) || !card[field].length){
        problems.push(where + ': "' + field + '" should be a list of lines in [ ]');
      }
    }
    if(card.proGit && !REFERENCES.proGit.sections[card.proGit]){
      problems.push(where + ': "' + card.proGit + '" is not in references.js');
    }
    if(card.bottomUp && !REFERENCES.bottomUp.sections[card.bottomUp]){
      problems.push(where + ': "' + card.bottomUp + '" is not in references.js');
    }
  });

  let step = 0;
  LAB.forEach(entry => {
    if(entry.act) return;
    step++;
    const where = 'lab.js, step ' + step;
    if(typeof entry.title !== 'string' || !entry.title){
      problems.push(where + ': "title" is missing');
    }
    for(const field of ['task', 'solution']){
      if(!Array.isArray(entry[field]) || !entry[field].length){
        problems.push(where + ': "' + field + '" should be a list of lines in [ ]');
      }
    }
  });

  // Two cards with the same stage and question would share one slot in a
  // saved progress file, so grading one would silently grade the other.
  const seen = new Set();
  DECK.forEach((card, i) => {
    if(seen.has(card.key)){
      problems.push('cards.js, card ' + (i + 1) + ': another card has the same stage and question');
    }
    seen.add(card.key);
  });

  if(problems.length){
    console.warn('git drill found ' + problems.length + ' problem(s) in the data files:');
    problems.forEach(problem => console.warn('  ' + problem));
  }
  return problems;
}


/* == B12. wiring and boot ================================================= */

// card
el.pane.onclick    = flip;
el.pane.onkeydown  = e => { if(e.key === 'Enter'){ e.preventDefault(); flip(); } };
el.details.onclick = e => { e.stopPropagation(); openDetails(); };   // don't also flip
$('prev').onclick  = () => move(-1);
$('next').onclick  = () => move(1);
$('got').onclick   = () => grade('got');
$('again').onclick = () => grade('again');

// modal
el.mClose.onclick   = closeDetails;
el.backdrop.onclick = e => { if(e.target === el.backdrop) closeDetails(); };

// keyword filter
el.search.oninput      = () => applySearch(el.search.value);
el.searchClear.onclick = () => { clearSearch(); applySearch(''); el.search.focus(); };

// switches
for(const b of el.view.children)  b.onclick = () => applyView(b.dataset.view);
for(const b of el.theme.children) b.onclick = () => applyTheme(b.dataset.theme);

// progress files
el.pLoad.onclick   = () => loadProgress();
el.pSave.onclick   = () => saveProgress(false);
el.pSaveAs.onclick = () => saveProgress(true);
el.pInput.onchange = async () => {
  const file = el.pInput.files?.[0];
  if(file) deserialize(await file.text());
  el.pInput.value = '';
};

document.addEventListener('keydown', e => {
  // Save works everywhere, including with the modal open.
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
    e.preventDefault(); saveProgress(false); return;
  }
  if(modalOpen()){ if(e.key === 'Escape') closeDetails(); return; }

  // While typing in the search box, only Escape is ours: it clears and leaves.
  if(e.target === el.search){
    if(e.key === 'Escape'){ clearSearch(); applySearch(''); el.search.blur(); }
    return;
  }

  if(view !== 'cards' || deckPanel !== 'stage') return;      // lab and summary: no shortcuts
  if(e.target.tagName === 'BUTTON' && e.key === ' ') return;  // let space click the button

  switch(e.key){
    case ' ':           e.preventDefault(); flip(); break;
    case 'ArrowLeft':   move(-1); break;
    case 'ArrowRight':  move(1);  break;
    case 'g': case 'G': grade('got');   break;
    case 'a': case 'A': grade('again'); break;
    case 'd': case 'D': if(flipped) openDetails(); break;
    case 's': case 'S': shuffle(); break;
    case 't': case 'T': cycleTheme(); break;
    case '/':           e.preventDefault(); el.search.focus(); break;
  }
});

// Counts are read from the data, so adding a card or a step needs no edit here.
el.blurb.innerHTML =
  DECK.length + ' cards in ' + STAGES.length + ' stages, plus a ' + LAB_STEPS.length +
  '-step lab you run in a real terminal. Flip a card, then hit <b>details</b> for a figure, ' +
  'the fine print, and links into the exact section of <i>Pro Git</i> and Wiegley’s ' +
  '<i>Git from the Bottom Up</i>.';

validateData();
applyTheme('auto');
buildChips();
buildLab();
render();
applyView('cards');

