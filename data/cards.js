/* =============================================================================
   cards.js: the flashcards.

   You do not need to know any web development to edit this file. A card is a
   block of plain text between braces. Copy one, change the words, save, and
   reload the page in your browser.

   ---------------------------------------------------------------------------
   THE SHAPE OF A CARD
   ---------------------------------------------------------------------------
   {
     stage:    "02 branching",              which group the card belongs to
     level:    "basics",                    optional, see LEVELS below
     question: "How do you rename a branch?",
     answer: [                              one line per line of text
       "Renames the branch you are on.",
       "$ git branch -m new-name"
     ],
     detail: [                              the longer note in the pop-up
       "This renames only your local branch. A copy on a server keeps the",
       "old name."
     ],
     figure: [                              a drawing for the pop-up, kept as-is
       "before:  old-name",
       "after :  new-name"
     ],
     proGit:   "Git-Branching-Branch-Management",   required
     bottomUp: "the-beauty-of-commits",             optional, may be left out
     lab:      "Delete the merged branch"           optional, see LAB FOOTNOTES
   },

   ---------------------------------------------------------------------------
   WRITING THE TEXT
   ---------------------------------------------------------------------------
   Every line goes in "double quotes" and lines are separated by commas.

     `like this`        shows as code, in orange
     *like this*        shows as italic
     **like this**      shows as bold
     $ git status       a line starting with a dollar becomes a terminal block
     | A ── B ── C      a line starting with a bar becomes a small drawing,
                        shown exactly as typed

   Several "$" or "|" lines in a row each become one block, so a two-command
   answer is just two lines and a four-line diagram is four. Everything else is
   plain text: write < and & normally, and do not worry about HTML.

   A drawing in "answer" is shown on the card itself; the bigger "figure" below
   is shown in the pop-up. Use the first for the shape, the second for detail.

   In "figure" the lines are shown exactly as written, so drawings line up. The
   dollar rule does not apply there.

   ---------------------------------------------------------------------------
   STAGES
   ---------------------------------------------------------------------------
   Reuse one of these to add a card to it, or invent a new one and a new stage
   appears by itself, with its own filter button:

     01 foundations     05 sync basics     09 cherry-picking     13 daily practice
     02 branching       06 conflicts       10 undo · reflog      14 gotchas
     03 stashing        07 rebasing        11 remotes & server   15 tags & releases
     04 merging         08 history edits   12 ssh & auth         16 release branches

   Cards appear in the order they are written here, and stages in the order
   they first appear.

   The order is the teaching order. A card may use only terms that an earlier
   card at its own level has explained, or that it explains itself, in a few
   words, where the term first appears. A reader who starts at the first card
   should never meet an unexplained term.

   ---------------------------------------------------------------------------
   LEVELS
   ---------------------------------------------------------------------------
   A card may carry `level: "basics"` or `level: "intermediate"`. The levels are
   cumulative: the basics filter shows the basics cards, intermediate shows
   basics *and* intermediate, and the full deck shows everything.

   Leaving the field off is a real choice: an untagged card appears only in the
   full deck. That errs on the safe side, since a card nobody classified stays
   out of a beginner's first pass.

   A card belongs in basics when someone in their first month would meet it and
   every idea it leans on is basics too. People most often miss the second
   condition.

   ---------------------------------------------------------------------------
   LAB FOOTNOTES
   ---------------------------------------------------------------------------
   A card the lab practises can name the step that does it, by the step's
   title copied exactly from lab.js. The answer side then ends in a footnote
   naming the act and the step, and clicking it opens the lab there.
   Progress files already know a step by its title, so the footnote uses it
   too and survives steps being renumbered or moved.

   The step may not sit above the card's own level: a reader at that level
   would be sent to a step the switch hides. The console reports both a title
   that matches nothing and a step that is out of reach.

   ---------------------------------------------------------------------------
   IF SOMETHING GOES WRONG
   ---------------------------------------------------------------------------
   A blank page almost always means a missing comma or quote. Open the browser
   console (F12), which names the line. The console also lists any card with a
   missing field or an unknown reference key.
   ============================================================================= */

const CARDS = [

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Start a brand-new repository in the current folder, with the default branch named `main` from the start.",
  answer: [
    "A *repository* is the store of a project's history, kept in a `.git/`",
    "directory. `git init` creates one in the current folder. The files around it",
    "are your *working tree*: the version you edit.",
    "$ git init -b main"
  ],
  detail: [
    "`-b main` names the first *branch*. A branch is a named line of work, and",
    "every repository starts with one. Delete `.git/` and your files stay, but",
    "the history is gone. The `-b` flag arrived in git 2.28. On older versions,",
    "run `git init` and then `git branch -m main`."
  ],
  figure: [
    "taskrunner/",
    "├── .git/    ← the repository: history and settings",
    "└── src/     ← your files: the working tree"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository",
  bottomUp: "directory-content-tracking",
  lab:      "Create the repository"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Which two identity settings must git know before your first commit?",
  answer: [
    "Your name and email. A *commit* is a saved version of the project, and git",
    "writes both into every commit you make. Add `--global` to set them for every",
    "repository on this machine.",
    "$ git config user.name \"Your Name\"",
    "$ git config user.email \"you@example.com\""
  ],
  detail: [
    "Changing them later does not change old commits, which keep the values they",
    "were made with. Without `--global`, the settings go into `.git/config` and",
    "apply to this repository only, so you can use a work address on work",
    "projects and a personal one elsewhere."
  ],
  figure: [
    "scope     file                        precedence",
    "──────────────────────────────────────────────",
    "system    /etc/gitconfig                 lowest",
    "global    ~/.gitconfig                      ↓",
    "local     .git/config                    highest",
    "",
    "git config --list --show-origin   ← who set what"
  ],
  proGit:   "Getting-Started-First-Time-Git-Setup",
  lab:      "Set an identity for this repository only"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "`git status` sorts your files into groups. What do the groups mean?",
  answer: [
    "**Untracked**: git has never recorded this file. **Modified**: a recorded",
    "(*tracked*) file has changed, and the change is only on disk. **Staged**:",
    "the change is in the *index*, also called the staging area, which holds what",
    "the next commit will contain. A file with no changes is not listed."
  ],
  detail: [
    "`git status -sb` prints the same information as one line per file, with the",
    "branch on top. The first column shows what is staged and the second what is",
    "modified but not staged, so `M ` and ` M` mean different things. `??` means",
    "untracked. Once you commit, a staged change is part of the history and",
    "leaves the list."
  ],
  figure: [
    "$ git status -sb",
    "## main",
    "M  src/states.py    ← staged",
    " M src/queue.py     ← modified, not staged",
    "?? src/scratch.py   ← untracked"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man",
  lab:      "Your first commit"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "What is the staging area (the index) for?",
  answer: [
    "It is a draft of your next commit. You choose what goes in, so one messy",
    "working tree can become several small commits that each do one thing."
  ],
  detail: [
    "A commit that does one thing is easier to review and easier to undo. You can",
    "even stage part of a file with `git add -p`, so one afternoon's edits to a",
    "single file can become separate commits."
  ],
  figure: [
    "one edited file, two unrelated changes:",
    "",
    "  src/runner.py ┬─ overflow fix   ──▶ add -p ──▶ commit \"Fix overflow\"",
    "                └─ debug prints   ──▶ left unstaged, committed later"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage a directory, then take one file back out"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Put a file's current changes into the next commit, without committing yet?",
  answer: [
    "$ git add src/runner.py",
    "$ git add .",
    "This is called *staging*, and you can take it back: `git restore --staged",
    "<file>` removes the file from the index and leaves your edits alone. The",
    "deck's stage 10, *undo*, has more on that command."
  ],
  detail: [
    "`git add` copies the file as it is at that moment. If you edit it again, you",
    "have two versions: the staged one and the newer one on disk. `git status`",
    "then lists the file in both columns."
  ],
  figure: [
    "git add <file>     one file",
    "git add <dir>/     that directory, everything under it",
    "git add .          the directory you are in",
    "git add -A         the whole repository, from any directory"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man",
  lab:      "Your first commit"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Stage every change under `src/` and leave everything else alone?",
  answer: [
    "$ git add src/",
    "A path can name a directory as well as a file. A directory means every file",
    "beneath it, at any depth."
  ],
  detail: [
    "`git add .` is the same rule applied to the directory you are in. Paths are",
    "relative to that directory too, so `src/` means the `src/` below you. Naming",
    "a directory keeps a commit to one area of the code. Adding a path stages new",
    "files and deletions as well as edits, so the only difference with `-A` is",
    "that `-A` covers the whole repository."
  ],
  figure: [
    "$ git add src/api/",
    "",
    "  src/api/routes.py      staged   ← edited",
    "  src/api/models/db.py   staged   ← nested deeper",
    "  src/api/queue.py       staged   ← untracked until now",
    "  src/api/legacy.py      staged   ← deleted, removal recorded",
    "",
    "  src/cli.py             left alone: outside the path",
    "  tests/test_api.py      left alone"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage a directory, then take one file back out"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Keep build output out of the repository, for everyone who works on the project?",
  answer: [
    "List it in a file called `.gitignore` at the top of the repository, and",
    "commit that file. Its patterns apply to that directory and everything",
    "beneath it. Git then leaves matching files out of `git status` and `git add",
    ".`."
  ],
  detail: [
    "Because the file is committed, everyone on the project gets the same rules.",
    "A leading slash ties a pattern to the top of the repository, and a leading",
    "`!` brings back something an earlier line excluded. The rules affect only",
    "untracked files."
  ],
  figure: [
    "build/          any directory named build, at any depth",
    "/build/         only the one at the top of the repository",
    "*.o             by extension",
    "!keep.o         bring one file back",
    "doc/**/*.pdf    any PDF under doc/, at any depth"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  lab:      "Keep junk out of the repository"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "You edited three tracked files and deleted a fourth, and there is scratch output lying about that you have not ignored yet. Stage the real work only?",
  answer: [
    "$ git add -u",
    "`-u` means update: it stages edits and deletions in every tracked file and",
    "leaves new files alone."
  ],
  detail: [
    "It skips new files, so it cannot stage a stray log or a credentials file you",
    "forgot to ignore. With no path it covers the whole repository wherever you",
    "run it, as `-A` does, while `.` means only the directory you are in. So `-A`",
    "is `-u` plus untracked files, and adding a path narrows either one."
  ],
  figure: [
    "                edits   deletions   new files   from a subdirectory",
    "git add -u        ✓         ✓           ·       still the whole repo",
    "git add -A        ✓         ✓           ✓       still the whole repo",
    "git add .         ✓         ✓           ✓       only below you"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage the tracked changes only"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "Ignore `.DS_Store` in every repository on this machine. What are the two steps?",
  answer: [
    "$ echo \".DS_Store\" >> ~/.gitignore_global",
    "$ git config --global core.excludesFile ~/.gitignore_global",
    "One global rule, so no project needs its own entry."
  ],
  detail: [
    "A global ignore file suits what comes from your machine: OS metadata, editor",
    "swap files and IDE directories. Project output such as `build/` belongs in",
    "the project's own `.gitignore`, where everyone on the project gets it."
  ],
  figure: [
    "~/.gitignore_global        your machine's noise",
    "    .DS_Store              macOS",
    "    ._*                    macOS",
    "    Thumbs.db              Windows",
    "    desktop.ini            Windows",
    "    *.swp                  editors",
    "",
    "<repo>/.gitignore          the project's artifacts",
    "    build/",
    "    *.o"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Record whatever is staged as a permanent commit?",
  answer: [
    "$ git commit -m \"Add task state enum\"",
    "Only staged content goes in. Edits you did not stage stay in your working",
    "tree, still uncommitted."
  ],
  detail: [
    "Git prints a short *hash* for the new commit: a unique ID, 40 characters in",
    "full, calculated from the commit's contents. You will also see it called a",
    "*SHA*. Each commit also records the commit made before it, its *parent*, and",
    "that chain of parents is the project's history. `-m` gives the commit its",
    "*message*, a note saying what changed. Without `-m`, git opens your editor,",
    "which suits a message that needs a body. `git commit -a` stages every",
    "changed tracked file before committing. That is convenient, but you can no",
    "longer choose what goes in."
  ],
  figure: [
    "$ git commit -m \"Add task state enum\"",
    "[main c7d8e9f] Add task state enum     ← c7d8e9f: the short hash",
    "",
    "git commit -m \"subject\"     inline message",
    "git commit                  editor: subject, blank line, body",
    "git commit -a -m \"…\"        stage changed tracked files first"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  lab:      "Your first commit"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "What is `HEAD`?",
  answer: [
    "Your current position. `HEAD` names the branch you are on, and a branch",
    "points at its newest commit. When you commit, the branch moves to the new",
    "commit and HEAD moves with it."
  ],
  detail: [
    "`.git/HEAD` is a one-line file that names the current branch. When you",
    "commit on `main`, the new commit gets `main`'s current commit as its parent",
    "and `main` moves to it. HEAD moves too, because it follows `main`:",
    "| before:  C1 ── C2          ← main (HEAD)",
    "| after:   C1 ── C2 ── C3    ← main (HEAD)",
    "In these drawings `C1` is a commit, `←` shows which commit a name points at,",
    "and `(HEAD)` marks the branch you are on. HEAD can also point straight at a",
    "commit, which stage 14 covers."
  ],
  figure: [
    "HEAD ──▶ main ──▶ c7d8e9f ──▶ b4e5f6a ──▶ a1b2c3d",
    "",
    "newest commit first; each one points back at its parent"
  ],
  proGit:   "Git-Internals-Git-References",
  bottomUp: "introduction"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "`git status` names the files. See the exact lines you changed, both outside the index and inside it?",
  answer: [
    "$ git diff",
    "$ git diff --staged",
    "A *diff* lists the lines that differ between two versions. Plain `git diff`",
    "compares your working tree with the index. `--staged` compares the index",
    "with HEAD, your last commit."
  ],
  detail: [
    "Each change appears in only one of the two, so staging a file makes it",
    "vanish from plain `git diff`. Reading `git diff --staged` before each commit",
    "is a quick way to keep a commit to what you meant."
  ],
  figure: [
    "working tree ──diff──▶ index ──diff --staged──▶ HEAD",
    "",
    "git diff            changes not staged yet",
    "git diff --staged   changes the next commit will contain",
    "git diff HEAD       both together"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "Show the commit history as one line per commit?",
  answer: [
    "$ git log --oneline"
  ],
  detail: [
    "Each line starts with the commit's short hash, newest first. `git log` takes",
    "options that change what it shows: `-5` limits the count, `--stat` adds a",
    "summary per file, `-p` shows each commit's diff, and `--graph` draws the",
    "branches. You can combine them."
  ],
  figure: [
    "$ git log --oneline",
    "c7d8e9f Add task state enum",
    "b4e5f6a Add TaskRunner skeleton",
    "a1b2c3d Initial commit: project description"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Read the history two ways"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "Inspect one commit: its message, author and full diff?",
  answer: [
    "$ git show a1b2c3d",
    "$ git show          (defaults to HEAD)"
  ],
  detail: [
    "You can name commits in other ways too. `git show HEAD~2` is the commit two",
    "back from HEAD; stage 04 explains the counting. `git show",
    "main:src/runner.py` prints a file as another branch has it, without",
    "switching to that branch."
  ],
  figure: [
    "git show HEAD              the last commit, with its diff",
    "git show HEAD~2            two commits back",
    "git show main:src/runner.py  that file, as main has it",
    "git log -p -3              the last three commits, with diffs"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  lab:      "Read the history two ways"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "Remove a file from the project, deleting it from disk and staging the deletion, in one command?",
  answer: [
    "$ git rm src/legacy.py",
    "The file goes, and the removal is staged. You still have to commit. Plain",
    "`rm` plus `git add -u` does the same in two steps."
  ],
  detail: [
    "`git rm` refuses while the file holds uncommitted changes, and `-f`",
    "overrides that. `--cached` takes the file out of git's tracking and leaves",
    "it on disk. A directory needs `-r`. Nothing is lost until you commit: `git",
    "restore --staged --worktree <file>` brings back a staged deletion, content",
    "included."
  ],
  figure: [
    "git rm src/legacy.py           remove, and stage the removal",
    "git rm -r src/experiments/     a whole directory",
    "git rm -f src/legacy.py        override the refusal on uncommitted edits",
    "git rm --cached secrets.env    untrack it, leave the file on disk",
    "",
    "git restore --staged --worktree src/legacy.py   ← undo, before the commit"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "You added a file to `.gitignore` but git keeps tracking it. Why, and how do you fix it?",
  answer: [
    "Ignore rules affect only untracked files, and this one was already",
    "committed. Untrack it and keep it on disk:",
    "$ git rm --cached .DS_Store",
    "Then commit. The rule applies from there on."
  ],
  detail: [
    "`--cached` is what keeps the file on disk; without it, `git rm` deletes the",
    "file too. To check whether git tracks the file at all, run `git ls-files",
    ".DS_Store`. No output means it is untracked and the ignore rule is already",
    "working."
  ],
  figure: [
    "git ls-files .DS_Store          ← is it tracked?",
    "git rm --cached .DS_Store       ← untrack, keep on disk",
    "git rm .DS_Store                ← untrack AND delete"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  lab:      "Untrack a file without deleting it"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "Rename a tracked file so that `git status` shows one rename?",
  answer: [
    "$ git mv src/util.py src/utils.py",
    "The file moves, and both the deletion and the addition are staged. `git",
    "status` reports one line, `renamed:`."
  ],
  detail: [
    "Git stores no record of a rename. `mv` followed by `git add -A` gives an",
    "identical result, and the `R` you see is worked out when the diff is",
    "displayed, by comparing file contents. So a rename with heavy edits shows up",
    "as a delete plus an add. On a case-insensitive filesystem, the default on",
    "macOS and Windows but not on Linux, `Readme.md` and `README.md` are one",
    "name. A plain `mv` leaves git nothing to see, so `git mv` is the only way to",
    "record a rename that changes only the case. On a case-sensitive filesystem a",
    "plain `mv` shows up by itself. The figure's log command has two new parts:",
    "`--` says everything after it is a path, because a branch and a file can",
    "share a name, and `--follow` tracks the file's history through the rename by",
    "the same content comparison. Stage 13 returns to both."
  ],
  figure: [
    "$ git mv src/util.py src/utils.py",
    "$ git status -sb",
    "R  src/util.py -> src/utils.py",
    "",
    "git log --follow -- src/utils.py    ← history across the rename",
    "git mv Readme.md README.md          ← case-only rename; the one a",
    "                                      case-insensitive filesystem hides"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  lab:      "Rename a file in a way git records"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "One file holds two unrelated changes. Stage only the first?",
  answer: [
    "$ git add -p src/runner.py",
    "Git goes through the file one *hunk* at a time, where a hunk is a block of",
    "changed lines, and asks whether to stage each one."
  ],
  detail: [
    "Answer `y` to stage a hunk, `n` to skip it, `s` to split one that is too",
    "big, and `q` to stop. An afternoon of mixed edits can then become two or",
    "three clean commits."
  ],
  figure: [
    "Stage this hunk [y,n,q,a,d,s,e,?]?",
    "",
    "  y  stage it        n  skip it",
    "  s  split further   q  quit",
    "  e  edit the hunk by hand"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage only the first change"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "`git add -p` offers you five hunks in one file. What is a hunk?",
  answer: [
    "A continuous run of changed lines *plus* the unchanged lines around it,",
    "three on each side by default. One file can hold several."
  ],
  detail: [
    "Those unchanged lines, the *context*, decide where one hunk ends and the",
    "next begins. Change line 10 and line 14 and their context overlaps, so git",
    "prints one hunk. Change line 10 and line 40 and you get two. The header",
    "gives the exact span on each side."
  ],
  figure: [
    "@@ -18,7 +18,9 @@ class TaskQueue:",
    "     old file: from line 18, 7 lines",
    "     new file: from line 18, 9 lines",
    "",
    " context line      unchanged, shown for orientation",
    "-removed line",
    "+added line"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage only the first change"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "One hunk bundles two changes you want staged separately. Two ways to cut it finer?",
  answer: [
    "`s` splits it, but only at an unchanged line inside the hunk. When two",
    "changed lines sit next to each other there is nowhere to split, and `e`",
    "opens the hunk as a *patch*, a text description of the change, for you to",
    "edit line by line."
  ],
  detail: [
    "In the editor, delete a `+` line to leave that addition unstaged. Turn a `-`",
    "into a space to keep that line and leave its removal unstaged. Never delete",
    "a `-` line or a context line: the patch then no longer matches the file, and",
    "git rejects it."
  ],
  figure: [
    "s  split at an unchanged line; fails if there is none",
    "e  edit the patch by hand, line by line",
    "",
    "     self.depth = depth          ← context: leave alone",
    "+    self.overflow = 0           ← delete to skip staging it",
    "-    self.legacy_mode = False    ← '-' to ' ' keeps the line"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "`s` will not split a hunk. Which setting makes git produce finer hunks in the first place?",
  answer: [
    "Shrink the context. With fewer surrounding lines, fewer changes join into",
    "one hunk.",
    "$ git -c diff.context=1 add -p src/runner.py"
  ],
  detail: [
    "`-c key=value` sets a config value for that one command and saves nothing.",
    "Here it narrows the context git uses to build hunks. Try this before the",
    "editor, since it often turns one block into two you can accept and reject",
    "separately. `-p` also works on the other commands in the figure, which later",
    "stages cover."
  ],
  figure: [
    "git add -p          stage selected hunks",
    "git restore -p      discard selected hunks",
    "git stash push -p   stash only part of your work",
    "git checkout -p     take selected hunks from another commit",
    "git reset -p        unstage selected hunks",
    "",
    "(stash, restore and reset come in later stages)"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "Eight files changed and five belong in this commit. Pick them from a numbered list instead of typing paths?",
  answer: [
    "$ git add -i",
    "`u` for update, then the numbers: `1-3` for a range, `1,4` for a selection,",
    "and a blank line to finish."
  ],
  detail: [
    "`-p` is item 5 of this menu. The list is faster when you choose whole files:",
    "`r` unstages the same way, `d` shows the diff of what you have picked so",
    "far, and `a` is the only item that offers untracked files, since `u` lists",
    "only what git already tracks. All of this can be done with paths on the",
    "command line; the menu saves typing, and you do not have to remember file",
    "names."
  ],
  figure: [
    "           staged     unstaged path",
    "  1:    unchanged        +1/-0 src/runner.py",
    "  2:    unchanged        +4/-0 src/utils.py",
    "",
    "*** Commands ***",
    "  1: [s]tatus   2: [u]pdate   3: [r]evert   4: [a]dd untracked",
    "  5: [p]atch    6: [d]iff     7: [q]uit     8: [h]elp",
    "What now> u",
    "Update>> 1-2       ← then a blank line: “updated 2 paths”"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man",
  lab:      "Stage whole files from a menu"
},

{
  stage:    "01 foundations",
  level:    "intermediate",
  question: "Define a shortcut that draws a graph of all branches. Where does it live, and what does it expand to?",
  answer: [
    "An *alias* in your gitconfig turns the four flags into two characters:",
    "| [alias]",
    "|     lg = log --all --oneline --graph --decorate",
    "Now `git lg` draws the history as a graph."
  ],
  detail: [
    "Aliases live under `[alias]` in your gitconfig. Each one expands to what",
    "follows it, so any flag you would type works there too, and flags you add",
    "when you run it go on the end. An alias that starts with `!` runs a shell",
    "command, which is how `git nuke`, an alias in this project's example config",
    "that discards all uncommitted work, gets its confirmation prompt.",
    "`--decorate` writes branch names beside their commits. `--all` starts from",
    "every branch and every tag (a fixed name on a commit, in stage 15), and also",
    "from names other programs keep in the repository, so their commits appear",
    "too. Stage 14 shows how to leave them out."
  ],
  figure: [
    "[alias]",
    "    lg = log --all --oneline --graph --decorate",
    "    s  = status -sb",
    "",
    "$ git lg --author=you     ← extra flags append to the expansion"
  ],
  proGit:   "Git-Basics-Git-Aliases"
},

{
  stage:    "01 foundations",
  level:    "basics",
  question: "You need a flag and you do not know its name. Ask git two ways, and say which one leaves options out.",
  answer: [
    "$ git log -h        the one-screen summary",
    "$ git help log      the full manual page",
    "The short form leaves things out on purpose: it lists the options `log`",
    "defines and omits the ones it shares with other commands."
  ],
  detail: [
    "`git log -h` never mentions `--stat`, because `--stat` is a diff option that",
    "`log`, `show` (which prints one commit) and `diff` all share; `git help log`",
    "documents it. So use `-h` to recall a spelling you already know, and `help`",
    "to find one you do not. `git help -g` lists guides on concepts, such as the",
    "glossary. The guide that defines all the ways of naming a commit, such as",
    "`HEAD~2` for two commits before HEAD, is `git help revisions`, and it is on a",
    "second list, `git help --user-interfaces`."
  ],
  figure: [
    "git log -h         options log defines",
    "git help log       those, plus every shared diff option",
    "",
    "git help -a        every command there is",
    "git help -g        the concept guides",
    "git help glossary  the vocabulary",
    "",
    "git help --user-interfaces   guides on how you talk to git",
    "git help revisions           how commits are named"
  ],
  proGit:   "Getting-Started-Getting-Help"
},

{
  stage:    "02 branching",
  level:    "basics",
  question: "Create a new branch and switch to it in one command?",
  answer: [
    "$ git switch -c feature/task-queue",
    "Add a *start point* to begin somewhere other than where you are: `git switch",
    "-c feature/foo main`."
  ],
  detail: [
    "A new branch starts at HEAD unless you name a start point, and uncommitted",
    "changes come with you. Switching to a branch rewrites your files to match",
    "that branch's newest commit. Right after `switch -c`, both branches point at",
    "the same commit, and HEAD is on the new one:",
    "| C1 ── C2      ← main, feature/task-queue (HEAD)",
    "Your next commit moves only the branch HEAD is on. `F1` is a commit on the",
    "feature branch:",
    "| C1 ── C2      ← main",
    "|         \\",
    "|          F1   ← feature/task-queue (HEAD)",
    "The commit a branch points at is its *tip*. The long-lived branch that a",
    "team's work ends up on, usually `main`, is often called the *trunk*."
  ],
  figure: [
    "git switch -c feature/x           from where you are",
    "git switch -c feature/x main      from main's tip",
    "git branch feature/x              create it, stay where you are"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell",
  bottomUp: "the-beauty-of-commits",
  lab:      "Branch and switch in one command"
},

{
  stage:    "02 branching",
  level:    "basics",
  question: "List your branches, and see which one you are on?",
  answer: [
    "$ git branch",
    "The `*` marks the branch you are on."
  ],
  detail: [
    "With many branches, a plain list is hard to use. Sorted by date, it answers",
    "“what was I working on last week”."
  ],
  figure: [
    "git branch                              all your branches",
    "git branch --sort=-committerdate        most recent first"
  ],
  proGit:   "Git-Branching-Branch-Management",
  bottomUp: "the-beauty-of-commits",
  lab:      "Branch and switch in one command"
},

{
  stage:    "02 branching",
  level:    "intermediate",
  question: "Jump back to the branch you were on before, like `cd -` in a shell?",
  answer: [
    "$ git switch -"
  ],
  detail: [
    "The dash is short for `@{-1}`, “the branch I was on one switch ago”, and",
    "`git switch @{-2}` goes back two. This helps when you visit another branch",
    "to check something and want to return without typing a long name."
  ],
  figure: [
    "$ git switch feature/task-queue     # ...work...",
    "$ git switch main             # check something on the trunk",
    "$ git switch -                # back to feature/task-queue"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell",
  lab:      "Park an edit, switch away, and bring it back"
},

{
  stage:    "02 branching",
  level:    "intermediate",
  question: "Why prefer `switch` over `checkout` for branch work?",
  answer: [
    "`checkout` did two jobs, switching branches and restoring files, and the",
    "file form discards uncommitted work without asking. Git 2.23 split them:",
    "**switch** for branches, **restore** for files."
  ],
  detail: [
    "`git checkout name` had to guess whether you meant a branch or a file, and a",
    "wrong guess could discard edits with no undo. `switch` refuses file paths,",
    "so that accident cannot happen. `checkout` still works and is not",
    "deprecated."
  ],
  figure: [
    "git checkout ──┬── branches ──▶ git switch",
    "               └── files    ──▶ git restore",
    "",
    "one verb, two unrelated jobs  →  two verbs, one job each"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "introduction"
},

{
  stage:    "02 branching",
  level:    "intermediate",
  question: "Rename the branch you’re currently on?",
  answer: [
    "$ git branch -m feature/better-name"
  ],
  detail: [
    "This renames only your local branch. If the branch also exists on a server",
    "(a shared copy of the repository, stage 05), that copy keeps the old name;",
    "stage 11 shows how to delete a branch there."
  ],
  figure: [
    "git branch -m new-name             rename the branch you are on",
    "git branch -m old-name new-name    rename another branch"
  ],
  proGit:   "Git-Branching-Branch-Management",
  lab:      "The fetch that fails over an unrelated branch"
},

{
  stage:    "02 branching",
  level:    "intermediate",
  question: "What is a branch, mechanically?",
  answer: [
    "A *ref*: a small file under `.git/refs/heads/` that holds one commit hash.",
    "Branches are movable names. Creating one costs a 41-byte file, which is why",
    "they are cheap."
  ],
  detail: [
    "The file holds forty hex characters and a newline. Committing rewrites it to",
    "point at the new commit, and switching branches changes which file HEAD",
    "names. Because a branch is only a name, one branch per task costs almost",
    "nothing."
  ],
  figure: [
    "$ cat .git/refs/heads/main",
    "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    "",
    "$ ls .git/refs/heads/",
    "dev   feature   main       ← feature/ is a folder: feature/task-queue"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell",
  bottomUp: "the-beauty-of-commits",
  lab:      "Read a branch straight off the disk"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "Set aside all uncommitted work with a label you’ll recognize later?",
  answer: [
    "$ git stash push -m \"queue backpressure spike\"",
    "Your working tree goes back to the last commit, and the edits wait in the",
    "*stash*, a list of changes you have set aside.",
    "| before          after",
    "|  M runner.py     (clean)      ← working tree",
    "|  ?? scratch.py   ?? scratch.py",
    "|                  stash@{0}    ← your edits, set aside"
  ],
  detail: [
    "By default a stash takes tracked files only. New untracked files stay",
    "behind, and git refuses a switch that would overwrite one. `-u` includes",
    "them, and `-a` also includes ignored files. Write the message, because an",
    "unlabelled stash from three days ago is hard to identify."
  ],
  figure: [
    "git stash push -m \"note\"      tracked files only",
    "git stash push -u -m \"note\"    + untracked",
    "git stash push -a -m \"note\"    + ignored"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog",
  lab:      "Park an edit, switch away, and bring it back"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "You are mid-edit and need to switch branches. How do you set the work aside and get it back afterwards?",
  answer: [
    "Stash it, switch away and back, then pop it. Nothing gets committed, and",
    "your working tree stays clean in between, so the switch cannot be blocked.",
    "$ git stash push -m \"half-finished parser\"",
    "$ git switch main",
    "$ git switch -             # back where you were",
    "$ git stash pop",
    "| working tree                    stash",
    "|      │                            │",
    "|      ├──── stash push ───────────▶│   working tree goes clean",
    "|      │                            │   switch freely",
    "|      ◀──── stash pop ─────────────┤   your edits come back"
  ],
  detail: [
    "Git refuses to switch when uncommitted changes would be overwritten, and",
    "committing half-finished work just to change branches leaves junk in the",
    "history. The stash avoids both problems, and this is its everyday use. `git",
    "stash pop` puts the edits back and removes them from the list."
  ],
  figure: [
    "$ git switch main",
    "error: Your local changes would be overwritten by checkout.",
    "",
    "$ git stash push -m \"half-finished parser\"",
    "Saved working directory and index state On feature: half-finished parser",
    "",
    "$ git switch main          # now permitted",
    "$ git switch -",
    "$ git stash pop            # applied, and dropped from the list"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog",
  lab:      "Park an edit, switch away, and bring it back"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "List your stashes, and preview one before applying it?",
  answer: [
    "$ git stash list",
    "$ git stash show -p stash@{1}"
  ],
  detail: [
    "The stash works as a stack: `stash@{0}` is the newest, and the numbers shift",
    "when you add or remove one. Previewing the diff is faster than applying a",
    "stash and undoing it, especially when its label no longer tells you much."
  ],
  figure: [
    "$ git stash list",
    "stash@{0}: On feature/task-queue: queue backpressure spike",
    "stash@{1}: On dev: half-finished tests",
    "",
    "$ git stash show -p stash@{1}    full diff, applies nothing"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog",
  lab:      "Stash again, this time with untracked files"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "`stash pop` vs `stash apply`?",
  answer: [
    "`pop` applies the stash and removes it from the list. `apply` applies it and",
    "keeps it, which helps when the same stash should go onto several branches."
  ],
  detail: [
    "If `pop` runs into a *conflict*, where your stashed edit and the branch",
    "changed the same lines, it applies what it can and keeps the stash, so",
    "nothing is lost. Drop it yourself once the conflict is settled. Stage 06",
    "covers conflicts."
  ],
  figure: [
    "git stash pop            apply + drop",
    "git stash apply          apply, keep in list",
    "git stash apply stash@{2}  a specific one"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "You stashed, but new untracked files are still in your working tree. Why, and how do you include them?",
  answer: [
    "A plain stash leaves untracked files where they are. Ask for them:",
    "$ git stash push -u -m \"note\""
  ],
  detail: [
    "This is the usual reason a switch still fails after stashing, or a build",
    "still picks up scratch files. `-u` adds untracked files. `-a` adds ignored",
    "ones too, which is rarely what you want, since it takes your whole build",
    "directory."
  ],
  figure: [
    "(default)  tracked, modified files",
    "-u         + untracked files",
    "-a         + ignored files too   ← usually too much"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog",
  lab:      "Stash again, this time with untracked files"
},

{
  stage:    "03 stashing",
  level:    "intermediate",
  question: "Delete a single stash, and why avoid `git stash clear`?",
  answer: [
    "`git stash drop stash@{1}` removes one. `clear` removes every stash at once,",
    "and there is no normal way to get them back."
  ],
  detail: [
    "*Git from the Bottom Up* suggests expiring old stashes by age: `git reflog",
    "expire --expire=30.days refs/stash`. The stash list is stored as a *reflog*,",
    "a log git keeps of where a name has pointed, which stage 10 explains. This",
    "command removes entries older than 30 days and leaves recent work alone."
  ],
  figure: [
    "git stash drop stash@{1}                      one entry",
    "git stash clear                               ALL of them, no undo",
    "git reflog expire --expire=30.days refs/stash  remove them by age"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "04 merging",
  level:    "basics",
  question: "Merge `feature` into `main`. What are the two commands, in order?",
  answer: [
    "A *merge* brings another branch's work into the branch you are on:",
    "$ git switch main",
    "$ git merge feature"
  ],
  detail: [
    "A merge changes only the branch you are on. Merging `main` into your feature",
    "branch updates the feature branch and leaves `main` alone, which is how you",
    "pick up `main`'s new work while the feature is still in progress. When both",
    "branches have new commits, the merge makes a *merge commit*, a commit with",
    "two parents. If you are on `main`, the merge commit goes on `main` and",
    "`feature` does not move:",
    "| C1 ── C2 ── C3 ── M     ← main (HEAD)",
    "|         \\         │",
    "|          F1 ── F2─┘     ← feature",
    "If you are on `feature`, the opposite happens:",
    "| C1 ── C2 ── C3 ──────┐   ← main",
    "|         \\            │",
    "|          F1 ── F2 ── M   ← feature (HEAD)"
  ],
  figure: [
    "git switch main",
    "git merge feature      main gains the work; feature unchanged",
    "",
    "git switch feature",
    "git merge main         feature catches up; main unchanged"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Merge it back, then delete the branch"
},

{
  stage:    "04 merging",
  level:    "basics",
  question: "What is a fast-forward merge?",
  answer: [
    "If `main` has not moved since you branched, there is nothing to combine, so",
    "git moves `main` up to your branch's tip. You get no merge commit and a",
    "straight history.",
    "| before   A ── B ── C (main) ── D ── E (feature)",
    "| after    A ── B ── C ── D ── E",
    "|                              ↑ main, feature"
  ],
  detail: [
    "It works because `main` is an *ancestor* of the feature tip, meaning a",
    "commit further back in its history. The feature branch already contains",
    "everything `main` has, so git only has to move a name."
  ],
  figure: [
    "$ git merge feature",
    "Updating 62deec0..e7cb1b5",
    "Fast-forward",
    " src/queue.py | 7 +++++++",
    " 1 file changed, 7 insertions(+)"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  lab:      "Merge it back, then delete the branch"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "What does a merge commit have that ordinary commits don’t?",
  answer: [
    "Two parents: the tips of both merged branches. That is how the history",
    "records when a branch came in.",
    "|            ┌── G   the branch you were on   (parent 1)",
    "|       M ───┤",
    "|            └── C   what you merged in       (parent 2)"
  ],
  detail: [
    "The parents are ordered. The first is the branch you were on and the second",
    "is what you merged in. `git log --first-parent` follows only the first, so a",
    "busy branch reads as a list of merges, without the commits inside each",
    "merged branch."
  ],
  figure: [
    "         ┌── parent 1 ── G   (main, the branch you were on)",
    "    M ───┤",
    "         └── parent 2 ── C   (feature, what you merged)",
    "",
    "git log --first-parent main   ← follows parent 1 only"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "the-beauty-of-commits",
  lab:      "Resolve, finish, and inspect the merge commit"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "The branches have both moved. What does git compare to build the merge?",
  answer: [
    "Three versions of each file: your branch's, the other branch's, and the one",
    "in their **common ancestor**, the newest commit both branches contain. That",
    "commit is also called the *merge base*, and this is why the result is called",
    "a *three-way merge*. The ancestor tells git which side changed a given line."
  ],
  detail: [
    "If only one side changed a line since the ancestor, git takes that side",
    "without asking. A *conflict* happens only where both sides changed the same",
    "lines to different text. If both made the identical change, git takes it",
    "once. So most merges finish without asking you anything. `git merge-base",
    "main feature` prints the ancestor git will use."
  ],
  figure: [
    "           C4 ── C5    (main) ──┐",
    "          /                     M   ← the merge commit",
    "A ── B ── C                     │",
    "          \\                    │",
    "           F1 ── F2 (feature) ──┘",
    "",
    "C = the ancestor; git merge-base main feature prints it",
    "",
    "only one side changed a line   →  taken automatically",
    "both made the identical change →  taken once, no conflict",
    "both changed it, differently   →  conflict, your call"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  lab:      "Promote again, and watch the copy meet its original"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "Make a merge commit even when a fast-forward would work. Which flag, and why?",
  answer: [
    "`--no-ff`. The history then shows that this work arrived as a branch: the",
    "split and the rejoin stay visible in the graph.",
    "| default    A ── B ── C ── D ── E",
    "|",
    "| --no-ff    A ── B ── C ─────── M",
    "|                      \\       /",
    "|                       D ── E"
  ],
  detail: [
    "You get a record in exchange for an extra commit. On a long-lived branch",
    "where people ask “when did this feature arrive?”, the merge commit answers",
    "that. On a personal repository it is clutter, and a fast-forward reads",
    "better."
  ],
  figure: [
    "$ git merge --no-ff feature -m \"Merge feature\"",
    "$ git log --oneline --graph",
    "*   7c1a4e0 Merge feature",
    "|\\",
    "| * 9c8b7a6 Add overflow counter",
    "| * 4d5e6f7 Add queue skeleton",
    "|/",
    "* 1a2b3c4 Add README"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Merge it with the branch shape preserved"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "Refuse the merge entirely unless it can fast-forward?",
  answer: [
    "`--ff-only`. It either fast-forwards or fails with an error, so it never",
    "makes a merge commit.",
    "$ git merge --ff-only feature"
  ],
  detail: [
    "If `--ff-only` refuses, the two branches have *diverged*: each has commits",
    "the other lacks. A merge commit can then combine them, or a rebase (stage",
    "07), and you can decide which you want. Stage 05 uses the same flag when",
    "downloading from a server."
  ],
  figure: [
    "$ git merge --ff-only feature",
    "fatal: Not possible to fast-forward, aborting.",
    "       ↑ the branches have diverged, so no fast-forward is possible"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "Name a commit by its position: the parent of HEAD, and five commits back?",
  answer: [
    "`HEAD^` is the parent and `HEAD~5` is five generations back. You can combine",
    "them: `HEAD~2^` is legal."
  ],
  detail: [
    "The two differ only at merge commits, which have two parents. `^1` and `^2`",
    "pick one of them, while `~` always follows the first. On a merge commit they",
    "lead to different commits:",
    "| C1 ── C2 ── C3 ── M     ← main (HEAD)",
    "|         \\         │",
    "|          F1 ── F2─┘",
    "|",
    "| HEAD^  = HEAD~1 = C3    HEAD~2   = C2",
    "| HEAD^2 = F2             HEAD^2~1 = F1"
  ],
  figure: [
    "HEAD      where you are",
    "HEAD^     its parent            (= HEAD~1)",
    "HEAD~3    three generations back",
    "HEAD^2    the second parent; only merge commits have one"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Collapse three commits into one"
},

{
  stage:    "04 merging",
  level:    "basics",
  question: "The feature is merged. What do you do with the branch label?",
  answer: [
    "Delete it: `git branch -d feature/…`. The merge keeps the commits in",
    "`main`'s history, so the branch name has done its job."
  ],
  detail: [
    "With hundreds of branches, old names make every branch listing hard to read.",
    "`git branch --merged main` lists the branches already merged into `main`,",
    "which are safe to remove."
  ],
  figure: [
    "git branch --merged main          ← what is already merged",
    "git branch -d feature/task-queue  ← safe delete, refuses if unmerged"
  ],
  proGit:   "Git-Branching-Branch-Management",
  lab:      "Merge it back, then delete the branch"
},

{
  stage:    "04 merging",
  level:    "basics",
  question: "Delete a merged branch, and force-delete an unmerged one?",
  answer: [
    "`git branch -d` is the safe form: it refuses if the branch holds unmerged",
    "work. `-D` deletes anyway, for work you are abandoning."
  ],
  detail: [
    "“Merged” means merged into the branch's upstream, if it is paired with a",
    "branch on a server (stage 05), and otherwise into your current branch. So",
    "check against the branch you care about first: `git branch --merged main`.",
    "Deleting a branch deletes only the name. The commits remain for weeks,",
    "because git's *reflog*, a private log of where HEAD and your branches have",
    "pointed, still refers to them. Run `git reflog` to list those positions. In",
    "this example `feature/done` is already part of `main`, and X1 and X2 are",
    "only on `feature/scrapped`:",
    "| C1 ── C2 ── C3      ← main (HEAD), feature/done",
    "|         \\",
    "|          X1 ── X2   ← feature/scrapped",
    "`git branch -d feature/done` works, because `main` contains C3. `git branch",
    "-D feature/scrapped` leaves X1 and X2 with no branch. Git prints the old",
    "tip's hash, so you can create the branch again if you need it."
  ],
  figure: [
    "$ git branch -d feature/scrapped",
    "error: the branch 'feature/scrapped' is not fully merged",
    "",
    "$ git branch -D feature/scrapped",
    "Deleted branch feature/scrapped (was 5e6f7a8).",
    "                    ↑ still recoverable from the reflog"
  ],
  proGit:   "Git-Branching-Branch-Management",
  lab:      "Merge it back, then delete the branch"
},

{
  stage:    "04 merging",
  level:    "intermediate",
  question: "List only the branches already merged into `main`?",
  answer: [
    "$ git branch --merged main",
    "The opposite, `--no-merged main`, lists branches that still hold unmerged",
    "work."
  ],
  detail: [
    "With no argument, both compare against your current HEAD, which may not be",
    "what you meant. Naming the branch makes the list safe to feed into a bulk",
    "delete."
  ],
  figure: [
    "git branch --merged main      safe to delete",
    "git branch --no-merged main   still holds unmerged work"
  ],
  proGit:   "Git-Branching-Branch-Management"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "What is a remote?",
  answer: [
    "Another copy of the repository, usually on a server, that yours knows by",
    "name. The name stands for a URL in your config. Everything in this stage",
    "moves commits between the two copies."
  ],
  detail: [
    "The copies are equals: each holds commits and branches, and a server's copy",
    "is special only because a team agreed to treat it so. *Fetching* copies its",
    "new commits to you. *Pushing* copies yours to it and moves its branch. Your",
    "repository also remembers where the other side's branches stood, under names",
    "like `origin/main` (`origin` is the usual name for the server's copy), and",
    "updates them when you fetch. Neither side changes the other until you run",
    "one of these commands."
  ],
  figure: [
    "your repository                their repository (“origin”)",
    "  commits + branches ── push ──▶ commits + branches",
    "                     ◀─ fetch ──",
    "  origin/*  ← where their branches stood at your last fetch",
    "",
    "git remote -v      the names and URLs yours knows"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Connect and make the first push"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "Get your own copy of a repository that already exists on a server?",
  answer: [
    "$ git clone git@example.com:repos/taskrunner.git",
    "One command creates the directory, sets up the repository, records the",
    "server as the remote `origin`, downloads all the history, and puts the files",
    "of the default branch, the one the server names for new clones, usually",
    "`main`, in your working tree. The result is called a *clone*."
  ],
  detail: [
    "Use `clone` when the project already exists, and `init` only to start a new",
    "one. The `git@host:path` address uses *SSH*, a secure way to log in to a",
    "server, which stage 12 covers. Every branch on the server becomes a",
    "*remote-tracking branch* in your clone, such as `origin/dev`. It records",
    "where the server's branch stood, and you do not commit on it. Only the",
    "default branch gets a local branch. Cloning a server that has `main` and",
    "`dev` gives you:",
    "| C1 ── C2 ── C3      ← main (HEAD), origin/main",
    "|         \\",
    "|          D1         ← origin/dev",
    "plus `origin/HEAD`, which records the server's default branch. Run `git",
    "switch dev` when you want a local `dev` as well."
  ],
  figure: [
    "git clone <url>   does all of this at once:",
    "",
    "  mkdir repo/                        the directory",
    "  git init                           the repository",
    "  git remote add origin <url>        the link to the server",
    "  git fetch                          all history",
    "  git switch -c main --track …       a local branch paired with origin/main"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository",
  lab:      "Clone it as if you were someone else"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "What is `origin`, and how do you see where it points?",
  answer: [
    "A short name for a remote's URL. It is the name `clone` gives by default,",
    "and nothing else about it is special.",
    "$ git remote -v"
  ],
  detail: [
    "A repository can have several remotes, such as `origin` for your copy on a",
    "server and `backup` for a second place you push to. Each is a name plus a",
    "URL. `git remote rename` changes the name and `git remote set-url` changes",
    "the URL. GitHub, a website that hosts git repositories, is a common place",
    "for `origin`."
  ],
  figure: [
    "$ git remote -v",
    "origin  git@github.com:yourname/taskrunner.git (fetch)",
    "origin  git@github.com:yourname/taskrunner.git (push)",
    "backup  git@example.com:repos/taskrunner.git (fetch)",
    "backup  git@example.com:repos/taskrunner.git (push)"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Connect and make the first push"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "You started with `git init`. Connect your repository to a server, then check the connection?",
  answer: [
    "$ git remote add origin git@example.com:repos/taskrunner.git",
    "$ git remote -v"
  ],
  detail: [
    "The URL reads `user@host:path`, where the colon separates the host from the",
    "path. With no leading slash, the path is relative to that user's home",
    "directory, which is shorter to type and survives a move of the home",
    "directory. `origin` is only a conventional name; `git remote rename` changes",
    "it."
  ],
  figure: [
    "git@example.com:/srv/repos/repo.git   absolute",
    "git@example.com:repos/repo.git        relative to ~"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Connect and make the first push"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "What is `origin/main`, and why can it be out of date?",
  answer: [
    "A *remote-tracking branch*: your local record of where the server's `main`",
    "stood at your last fetch. It does not show the server's current state."
  ],
  detail: [
    "Git compares your branch with this record whenever it counts how far ahead",
    "or behind you are, so that count is only as fresh as your last fetch. `git",
    "status` can report “up to date” while the server has moved. Here the server",
    "got two new commits after your last fetch:",
    "| server:  C1 ── C2 ── C3 ── C4   ← main",
    "| yours:   C1 ── C2               ← main (HEAD), origin/main",
    "`git status` compares `main` with `origin/main`. Both point at C2, so it",
    "says up to date. Once `git fetch` has updated `origin/main`, the same",
    "command says behind 2:",
    "| yours:   C1 ── C2 ── C3 ── C4   ← origin/main",
    "|                ↑",
    "|                main (HEAD)",
    "`git branch -r` lists your remote-tracking branches, and `git branch -a`",
    "lists them with your local ones."
  ],
  figure: [
    "main on the server     the real thing",
    "     │",
    "     │  copied ONLY by a fetch",
    "     ▼",
    "origin/main            your record of it",
    "main                   your branch",
    "",
    "ahead/behind compares main with origin/main and never asks the server"
  ],
  proGit:   "Git-Branching-Remote-Branches",
  lab:      "See what is incoming before you take it"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "`fetch` vs `pull`?",
  answer: [
    "`fetch` downloads new commits and updates `origin/main` without changing",
    "your branch, so you can look first. `pull` runs a fetch and then merges."
  ],
  detail: [
    "The two-step version helps when `main` has moved a lot: fetch, read `git log",
    "HEAD..origin/main` to see what is arriving, then merge. The two dots make a",
    "*range*: the commits `origin/main` has that `HEAD` does not. Nothing you",
    "fetch changes your files until you merge it."
  ],
  figure: [
    "fetch:  server ──▶ origin/main                (branch unchanged)",
    "pull :  server ──▶ origin/main ──▶ main       (merged)",
    "",
    "git fetch",
    "git log HEAD..origin/main --oneline    ← what is about to arrive"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "See what is incoming before you take it"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "What does `git pull` do?",
  answer: [
    "Two commands in one: **fetch**, then **merge**. The fetch updates",
    "`origin/main` from the server, and the merge brings that into the branch you",
    "are on."
  ],
  detail: [
    "A fetch changes nothing in your working tree, so you can run it at any time.",
    "The merge can fast-forward, make a merge commit, or stop on a *conflict*,",
    "where both sides changed the same lines (stage 06). When only the server has",
    "new commits, plain `git pull` fast-forwards. When both sides have new",
    "commits, it stops and asks you to choose how to combine them, and `git pull",
    "--no-rebase` chooses a merge. (The other choice, a rebase, replays your",
    "commits on top of theirs; see stage 07.) Say you committed L1 while a",
    "colleague pushed S1. The fetch moves only `origin/main`:",
    "| C1 ── C2 ── L1          ← main (HEAD)",
    "|         \\",
    "|          S1             ← origin/main",
    "Then the merge step merges `origin/main` into your branch:",
    "| C1 ── C2 ── L1 ── M     ← main (HEAD)",
    "|         \\         │",
    "|          S1 ──────┘     ← origin/main",
    "If you had no local commit L1, there would be nothing to merge, and the",
    "second step would just move `main` forward to S1."
  ],
  figure: [
    "git pull  ≡  git fetch  +  git merge origin/main",
    "",
    "step 1  safe: updates origin/main only",
    "step 2  a real merge: fast-forward, merge commit or conflict"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "See what is incoming before you take it"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "Send your local commits up to the remote?",
  answer: [
    "$ git push",
    "This uploads the commits on your current branch and moves the server's",
    "branch to match yours."
  ],
  detail: [
    "A push sends the branch you are on and nothing else, so other branches stay",
    "local until you push them. Plain `git push` also needs your branch paired",
    "with one on the server. A clone's default branch already is, and a later",
    "card in this stage covers a new branch. It refuses when the server holds",
    "commits you lack, because accepting would throw those commits away. The fix",
    "is to bring them in first, then push. A successful push also updates",
    "`origin/main`, since git now knows where the server's branch is:",
    "| before:  C3 ── C4 ── C5   ← main (HEAD)",
    "|          ↑",
    "|          origin/main",
    "| after:   C3 ── C4 ── C5   ← main (HEAD), origin/main"
  ],
  figure: [
    "before:  local main ──▶ C5      server main ──▶ C3",
    "after :  local main ──▶ C5      server main ──▶ C5",
    "",
    "$ git push",
    " ! [rejected]  main -> main (fetch first)",
    "   ↑ the server has commits you lack: bring them in, then push"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Push a change from the clone"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "`git push` is rejected with `fetch first`. What now?",
  answer: [
    "The server has commits you lack. Bring them in with a merge, then push:",
    "$ git pull --no-rebase",
    "$ git push"
  ],
  detail: [
    "This is the normal case: a colleague pushed while you were working. Plain",
    "`git pull` stops here, because both sides have new commits and it wants to",
    "know how to combine them; `--no-rebase` says to merge. `git push` also has a",
    "force option that overwrites the server's branch, and here it would delete",
    "their commits. Stage 07 covers when force is right. Here you committed L1",
    "while a colleague pushed S1:",
    "| server:  C1 ── C2 ── S1     ← main",
    "| yours:   C1 ── C2 ── L1     ← main (HEAD)",
    "The pull fetches S1 and merges it into your branch. Your branch now contains",
    "the server's commit, so the push is a normal fast-forward:",
    "| yours:   C1 ── C2 ── L1 ── M     ← main (HEAD)",
    "|                  \\         │",
    "|                   S1 ──────┘     ← origin/main"
  ],
  figure: [
    "$ git push",
    " ! [rejected]  main -> main (fetch first)",
    "",
    "$ git pull",
    "fatal: Need to specify how to reconcile divergent branches.",
    "",
    "$ git pull --no-rebase",
    "$ git push"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Collide on the trunk, then recover"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "Push a new branch for the first time and set up tracking, so plain `push` and `pull` work afterwards?",
  answer: [
    "$ git push -u origin feature/task-queue",
    "`-u` (`--set-upstream`) pairs your branch with the server's branch of the",
    "same name. That server branch is now your branch's *upstream*."
  ],
  detail: [
    "The pairing gives plain `push` and `pull` a destination, and lets `git",
    "status` report “ahead 2, behind 1”. Without it, every push needs the remote",
    "and the branch spelled out. A branch with an upstream is called a *tracking",
    "branch*."
  ],
  figure: [
    "git push -u origin feature/task-queue    first time",
    "git push                                 every time after",
    "",
    "$ git status -sb",
    "## feature/task-queue...origin/feature/task-queue [ahead 2]"
  ],
  proGit:   "Git-Branching-Remote-Branches",
  lab:      "Connect and make the first push"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "Which flag shows each branch’s upstream and how far ahead or behind it is?",
  answer: [
    "$ git branch -vv",
    "`-v` alone shows each branch's newest commit, and the second `v` adds the",
    "upstream."
  ],
  detail: [
    "The ahead and behind numbers compare your branch with `origin/…`, which only",
    "a fetch refreshes, so a branch can show as up to date only because you have",
    "not fetched today."
  ],
  figure: [
    "$ git branch -vv",
    "* feature/task-queue 5e6f7a8 [origin/feature/task-queue: ahead 2] Add overflow counter",
    "  dev          f2a3b4c [origin/dev] Bump queue depth",
    "  scratch      1a2b3c4 Experiment                      ← no upstream"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "`git push` says the branch has no upstream. Pair it with its remote counterpart without pushing anything.",
  answer: [
    "$ git branch -u origin/feature/task-queue",
    "This records the pairing in your local config. `git push` and `git pull` now",
    "know where to go, and status counts ahead and behind again."
  ],
  detail: [
    "The long spelling is `--set-upstream-to`. It acts on your current branch",
    "unless you name another as a second argument. A branch you have not pushed",
    "yet has no upstream. A renamed branch has the opposite problem: `git branch",
    "-m old new` keeps the upstream pointing at `origin/old`, which is now wrong,",
    "until you re-point it or push with `-u`. `git branch --unset-upstream`",
    "removes the pairing, which you want before deleting the remote branch."
  ],
  figure: [
    "main         ## main...origin/main [ahead 2]      paired",
    "feature/x    ## feature/x                         no upstream",
    "",
    "git branch -u origin/feature/x     pair it, push nothing",
    "git push -u origin feature/x       pair it by pushing",
    "git branch --unset-upstream        break the pairing"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "You branched with `switch -c`, committed a quick fix, and `git push` refuses: “the current branch has no upstream branch”. What is missing, and how do you fix it without retyping a long branch name?",
  answer: [
    "The branch exists only locally, so push has no destination. Pair it, and let",
    "`HEAD` stand in for the current branch name:",
    "$ git push -u origin HEAD"
  ],
  detail: [
    "`HEAD` expands to the branch you are on, which saves typing when names are",
    "long or grouped like `Component/feature/new_branch`. After this one push,",
    "plain `git push` and `git pull` know where to go."
  ],
  figure: [
    "$ git switch -c Component/feature/new_branch",
    "$ git commit -am \"Fix off-by-one in retry count\"",
    "$ git push",
    "fatal: The current branch Component/feature/new_branch has no",
    "       upstream branch.",
    "",
    "$ git push -u origin HEAD      ← HEAD = the branch you are on",
    "$ git push                     ← every time after"
  ],
  proGit:   "Git-Branching-Remote-Branches",
  lab:      "Push a new branch without retyping its name"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "Make a plain `git push` create the upstream by itself for any new branch?",
  answer: [
    "One setting, once:",
    "$ git config --global push.autoSetupRemote true",
    "Pushing a branch with no upstream now creates the branch on the server and",
    "pairs yours with it, so the push no longer fails."
  ],
  detail: [
    "Available from git 2.37; check with `git --version`. If you create a branch",
    "per task, this removes a frequent interruption. On older versions, `git push",
    "-u origin HEAD` does the same by hand."
  ],
  figure: [
    "git config --global push.autoSetupRemote true",
    "",
    "$ git switch -c fix/retry-count",
    "$ git commit -am \"Fix off-by-one\"",
    "$ git push                     ← just works, upstream created",
    "",
    "git --version                  ← needs 2.37 or newer"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "You cut `fix/queue-full` from `origin/main`, committed, and `git push` refuses: the upstream branch “does not match the name of your current branch”. Which of the two pushes it suggests do you not want?",
  answer: [
    "The first suggestion, `git push origin HEAD:main`, puts your commit straight",
    "onto `main`. Take the second, and add `-u` so later plain pushes go there",
    "too:",
    "$ git push -u origin HEAD",
    "Starting from `origin/main` made it the branch's upstream, and a plain push",
    "refuses to send a branch to an upstream with another name."
  ],
  detail: [
    "A remote-tracking branch used as a start point becomes the new branch's",
    "upstream automatically. `git status` then reports your branch as ahead of",
    "`origin/main`, which is true but makes it look as if your work is headed for",
    "`main`. On a shared branch the first suggestion skips any review by",
    "colleagues, unless the server refuses direct pushes to that branch. `-u`",
    "replaces the upstream, and a plain push then goes where you meant.",
    "`push.autoSetupRemote` does not help: it acts only when a branch has no",
    "upstream, and this branch has the wrong upstream. `git switch --no-track -c",
    "fix/queue-full origin/main` avoids the pairing from the start."
  ],
  figure: [
    "$ git switch -c fix/queue-full origin/main",
    "branch 'fix/queue-full' set up to track 'origin/main'.",
    "$ git push",
    "fatal: The upstream branch of your current branch does not match",
    "the name of your current branch.  To push to the upstream branch",
    "on the remote, use",
    "",
    "    git push origin HEAD:main      ← straight onto main",
    "",
    "To push to the branch of the same name on the remote, use",
    "",
    "    git push origin HEAD           ← what you meant"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "Make `pull` refuse whenever it would need a merge commit?",
  answer: [
    "$ git pull --ff-only",
    "$ git config --global pull.ff only",
    "Either your branch moves forward cleanly or git stops and tells you why."
  ],
  detail: [
    "If `--ff-only` fails, your branch holds commits the server lacks, usually",
    "because you committed on `main` by mistake. You learn about it now, as an",
    "error, and no merge commit goes into shared history."
  ],
  figure: [
    "$ git pull --ff-only",
    "fatal: Not possible to fast-forward, aborting.",
    "       ↑ you have local commits on this branch: look before merging"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  level:    "basics",
  question: "A colleague pushed `feature/parser` and you have fetched it. Get a local branch tracking it, in one command with no flags.",
  answer: [
    "$ git switch feature/parser",
    "Git finds no local branch by that name, sees that exactly one remote has it,",
    "and creates the local branch with that upstream."
  ],
  detail: [
    "This works only when the name is unambiguous. If a second remote has the",
    "same branch, git refuses and shows two ways out: name the remote with `git",
    "switch --track origin/feature/parser`, or settle it once with `git config",
    "checkout.defaultRemote origin`. It also needs the remote-tracking branch to",
    "exist already, so run `git fetch` first. Git looks only at what you have",
    "fetched and does not ask the server."
  ],
  figure: [
    "origin/feature/parser     fetched, exists",
    "feature/parser            no local branch yet",
    "",
    "git switch feature/parser",
    "  → creates the local branch feature/parser",
    "  → sets its upstream to origin/feature/parser",
    "",
    "two remotes have the name → git refuses and names both ways out"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  level:    "intermediate",
  question: "Which of your commits has the server not got yet, and which of its commits have you not merged?",
  answer: [
    "$ git log @{u}.. --oneline      yours, not yet pushed",
    "$ git log ..@{u} --oneline      theirs, not yet merged",
    "`@{u}` means *this branch's upstream*, so neither line names a branch and",
    "both keep working when you switch."
  ],
  detail: [
    "This is a range with one end left off, and git fills that end with `HEAD`.",
    "`@{u}..` runs from the upstream to where you are, and `..@{u}` the other",
    "way. They list the commits behind the `[ahead 2, behind 3]` that `git status",
    "-sb` prints. Because no branch is named, both make good aliases. `@{push}`",
    "is related: if you pull from one remote and push to another, it names where",
    "your work goes."
  ],
  figure: [
    "        ┌── C1 ── C2            (HEAD)",
    "A ── B ─┤",
    "        └── S1 ── S2 ── S3      (@{u}, here origin/main)",
    "",
    "git log @{u}..   →  C1 C2       ahead 2",
    "git log ..@{u}   →  S1 S2 S3    behind 3",
    "git status -sb   →  [ahead 2, behind 3]"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "06 conflicts",
  level:    "basics",
  question: "A merge stops with `CONFLICT (content)`. First command to see where you stand?",
  answer: [
    "$ git status",
    "A *conflict* means both branches changed the same lines differently, so git",
    "cannot choose for you. Status lists the *unmerged paths*: the files waiting",
    "for your decision."
  ],
  detail: [
    "Git merges everything it can and stops only where both sides changed the",
    "same lines. Files not listed as unmerged are already staged and finished."
  ],
  figure: [
    "$ git status",
    "You have unmerged paths.",
    "",
    "Changes to be committed:      ← git resolved these itself",
    "        modified:   src/states.py",
    "",
    "Unmerged paths:",
    "        both modified:   src/runner.py"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  lab:      "Trigger the conflict and read it"
},

{
  stage:    "06 conflicts",
  level:    "basics",
  question: "The three markers git writes into a conflicted file?",
  answer: [
    "`<<<<<<<` opens your side, `=======` divides, `>>>>>>>` closes the other",
    "side. Edit the file to the text you want and delete all three marker lines."
  ],
  detail: [
    "Git calls your side *ours* and the branch you are merging in *theirs*. The",
    "result does not have to match either side: you are writing the final text.",
    "Plain `git add` does not check the file, so a leftover marker gets committed",
    "without complaint. `git add --resolved`, new in git 2.56, does check."
  ],
  figure: [
    "<<<<<<< HEAD",
    "  QUEUE_DEPTH = 16",
    "=======",
    "  QUEUE_DEPTH = 8",
    ">>>>>>> feature/task-queue",
    "",
    "grep -rn \"<<<<<<<\" src/    ← a quick check before continuing"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Trigger the conflict and read it"
},

{
  stage:    "06 conflicts",
  level:    "basics",
  question: "You’ve fixed a conflicted file. The two steps that finish the merge?",
  answer: [
    "$ git add src/runner.py",
    "$ git merge --continue",
    "`git add` tells git this file is settled, and `--continue` makes the merge",
    "commit."
  ],
  detail: [
    "Git counts a file as settled once you stage it, and `git add` does not check",
    "whether you resolved anything, so a stray `<<<<<<<` gets committed and",
    "breaks the build later. Search for markers before continuing, or from git",
    "2.56 use `git add --resolved`. It stages only the files that were in",
    "conflict, and refuses while any of them still holds a marker. Markers are",
    "all it checks. A conflict where one side deleted the file, or a conflict in",
    "a binary file, never had markers, so `--resolved` stages it as git left it,",
    "decided or not. For the delete conflict, `git rm <file>` is the other way to",
    "settle it. `--resolved` also refuses on a line that only looks like a",
    "marker, such as seven `=` under a Markdown heading. Stage that file with",
    "plain `git add`."
  ],
  figure: [
    "                     a stray marker     your other edits",
    "git add <file>       staged anyway      left alone",
    "git add -A           staged anyway      swept into the merge,",
    "                                        and gone if you --abort",
    "git add --resolved   refused, and       left alone",
    "  (git 2.56+)        nothing staged",
    "",
    "git status             ← confirm nothing unmerged remains",
    "git merge --continue"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  lab:      "Resolve, finish, and inspect the merge commit"
},

{
  stage:    "06 conflicts",
  level:    "basics",
  question: "Abandon a half-done merge and return to the pre-merge state?",
  answer: [
    "$ git merge --abort"
  ],
  detail: [
    "It puts your working tree and index back as they were before the merge",
    "started. If you had uncommitted changes when you started, git may not be",
    "able to restore them exactly, so start merges with a clean working tree."
  ],
  figure: [
    "git merge --abort     undo the whole merge",
    "git status            clean: as if the merge never started"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Mix the two sides, then abandon the merge"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "Both sides of a conflict look plausible and you cannot tell which one moved. Show the text they started from?",
  answer: [
    "$ git config --global merge.conflictStyle zdiff3",
    "Conflicts then have a third section, opened by `|||||||`, holding the common",
    "ancestor's version."
  ],
  detail: [
    "With only two versions of a line, you cannot tell whether two people raised",
    "the same number or one raised it while the other kept an old value. The",
    "ancestor tells those apart, and without it you may undo someone's fix",
    "without noticing. `zdiff3` also removes lines both sides changed identically",
    "from the conflict, leaving only the real disagreement between the markers.",
    "Without `--global`, the setting covers only the current repository. To",
    "redraw a conflict already on disk in that style, run `git checkout",
    "--conflict=zdiff3 <file>`."
  ],
  figure: [
    "<<<<<<< HEAD",
    "QUEUE_DEPTH = 32          ← ours",
    "||||||| 21a8961",
    "QUEUE_DEPTH = 8           ← what both sides started from",
    "=======",
    "QUEUE_DEPTH = 16          ← theirs",
    ">>>>>>> feature/retry",
    "",
    "both raised it from 8, so you have to decide",
    "without the middle section, either one could look like an undo"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "See what both sides started from"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "One whole side of the conflict is correct. Take it without hand-editing?",
  answer: [
    "$ git checkout --ours src/runner.py",
    "$ git checkout --theirs src/runner.py",
    "Then `git add` the file. Picking a side only writes the text; git treats the",
    "conflict as settled once you stage the file."
  ],
  detail: [
    "*Ours* is the branch you were on and *theirs* is the branch you named. (A",
    "rebase swaps them; see stage 07.) Either form takes the *entire file* from",
    "one side, including parts that had no conflict. That suits a generated file",
    "or a dependency lockfile, and it is wrong when each side has useful changes",
    "elsewhere in the file. Check with `git diff` before staging. A wrong pick is",
    "not final: `git checkout --merge <file>` writes the conflict back."
  ],
  figure: [
    "--ours    keep this side's whole file",
    "--theirs  keep the other side's whole file",
    "",
    "then: git add <file>  and  --continue"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Take one whole side, and see what it costs"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "You hand-edited a conflicted file into a mess. Get the conflict back exactly as git wrote it?",
  answer: [
    "$ git checkout --merge src/runner.py",
    "Or `git restore --merge src/runner.py`. Git redoes the merge for that one",
    "file and writes fresh markers over your edits."
  ],
  detail: [
    "During a conflict the index holds each side of the file under a number: 1",
    "for the common ancestor, 2 for ours, 3 for theirs. So the copy in your",
    "working tree is disposable and the markers can always be rebuilt. If one",
    "side deleted the file, its number is missing. Add `--conflict=zdiff3` to",
    "include the ancestor in the new markers. This affects one file; `git merge",
    "--abort` undoes the whole merge."
  ],
  figure: [
    "$ git ls-files -u src/runner.py",
    "100644 bc94f0e 1  src/runner.py    ← base",
    "100644 54916db 2  src/runner.py    ← ours",
    "100644 73ba2c8 3  src/runner.py    ← theirs",
    "",
    "git checkout --merge src/runner.py                ← markers, as before",
    "git checkout --conflict=zdiff3 src/runner.py      ← with the base too"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Take one whole side, and see what it costs"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "While resolving a conflict, which lines in the file match neither side?",
  answer: [
    "$ git diff",
    "During a conflict `git diff` shows a *combined diff*: only the lines that",
    "match neither side, which is the text you wrote yourself."
  ],
  detail: [
    "If you took one side whole, only the diff's header appears, which confirms",
    "you made a straight choice. Anything else that appears is your own text,",
    "including a leftover `<<<<<<<`. `git diff --ours` and `--theirs` compare",
    "against one side at a time. `git log --merge -p <file>` prints the commits",
    "from either branch that touched the file, which often explains why they",
    "disagree."
  ],
  figure: [
    "$ git diff",
    "diff --cc src/runner.py",
    "@@@ -1,2 -1,2 +1,2 @@@",
    "- QUEUE_DEPTH = 32     ← ours, dropped",
    " -QUEUE_DEPTH = 16     ← theirs, dropped",
    "++QUEUE_DEPTH = 24     ← neither: yours",
    "  RETRIES = 1          ← agreed, so unmarked"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Mix the two sides, then abandon the merge"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "One branch should win wherever the two collide, across every file, without you opening any of them?",
  answer: [
    "$ git merge -X theirs feature/retry",
    "Only the parts that conflict are decided that way. Everything else merges as",
    "usual."
  ],
  detail: [
    "`-X theirs` settles each conflicting hunk in favour of the other side and",
    "keeps the rest of both. `git checkout --theirs <file>` takes one whole file",
    "after the merge has already stopped. `-s ours` is a different tool: it",
    "records a merge commit whose content is entirely your side, so the other",
    "branch counts as merged while none of its changes are kept. `-X` still",
    "throws away the losing hunks without showing them, so it suits lockfiles and",
    "generated output, and it is a poor choice for code you would want to read."
  ],
  figure: [
    "-X theirs        per hunk, only where they conflict",
    "checkout --theirs <file>   the whole file, after the stop",
    "-s ours          the whole merge: their branch marked merged, nothing kept",
    "",
    "one conflicting hunk, one clean hunk from each side:",
    "  -X theirs  →  their hunk, plus both clean changes",
    "  -s ours    →  your file exactly as it was"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Decide the winner before the merge starts"
},

{
  stage:    "06 conflicts",
  level:    "intermediate",
  question: "Resolve a conflicted file in a three-pane editor instead of by hand?",
  answer: [
    "$ git mergetool",
    "It opens each unmerged file in the tool you configured, showing your side,",
    "their side and the merged result you are writing."
  ],
  detail: [
    "`git mergetool --tool-help` prints two lists: the tools it can run here, and",
    "the ones it knows of but cannot find. Which tool falls in which list depends",
    "on your platform: `vimdiff` needs Vim, `winmerge` is Windows, `opendiff` is",
    "Xcode on macOS. So read your own output. `merge.tool` then saves your",
    "choice. When you save and exit, git stages that file for you. Since staging",
    "settles a conflict, a half-finished pass through the tool still counts as",
    "done. Set `mergetool.keepBackup false` unless you want a `.orig` copy of",
    "every file left behind."
  ],
  figure: [
    "git mergetool --tool-help          what this machine can run",
    "git config --global merge.tool <a name from that list>",
    "git config --global mergetool.keepBackup false",
    "",
    "  LOCAL ── ours      BASE ── ancestor      REMOTE ── theirs",
    "                  MERGED ── what you save"
  ],
  proGit:   "Git-Tools-Advanced-Merging"
},

{
  stage:    "06 conflicts",
  question: "Ask what a merge *would* do, conflicts included, without touching your working tree?",
  answer: [
    "`merge-tree` runs the same three-way comparison without touching your files",
    "or the index, and reports the result. Exit code 0 means it would merge",
    "cleanly, and 1 means it would conflict.",
    "$ git merge-tree --write-tree HEAD feature"
  ],
  detail: [
    "This is a true dry run, in git since 2.38. It prints the ID of the *tree*",
    "the merge would produce (a tree is git's record of a directory's contents),",
    "then any conflicted paths, and changes nothing. It was built for servers",
    "that check whether a branch can merge, and that have no working tree. `git",
    "merge --no-commit` looks similar, but it is a real merge paused before the",
    "commit: your index and files have already changed, and only `git merge",
    "--abort` gets you out."
  ],
  figure: [
    "$ git merge-tree --write-tree HEAD feature/retry",
    "3a5f01c…                        ← the tree the merge would produce",
    "100644 … 1  src/runner.py      ← the common ancestor's version",
    "100644 … 2  src/runner.py      ← ours",
    "100644 … 3  src/runner.py      ← theirs",
    "Auto-merging src/runner.py",
    "CONFLICT (content): Merge conflict in src/runner.py",
    "",
    "$ echo $?          # 1: the real merge would stop and ask",
    "$ git status -sb   # clean: nothing on disk changed"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Ask git what the merge would do, before running it"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "Replay your feature branch’s commits on top of the latest `main`?",
  answer: [
    "$ git switch feature",
    "$ git rebase main",
    "A *rebase* sets your commits aside, moves the branch to `main`'s tip, and",
    "replays them one by one: git makes each change again as a new commit.",
    "| before        C4 ── F1 ── F2 ── F3   (feature)",
    "|                 \\",
    "|                  C5                  (main)",
    "|",
    "| after   C4 ── C5 ── F1'── F2'── F3'  (feature)"
  ],
  detail: [
    "A prime marks a copy: F1' is the copy of F1. If the target is a branch on a",
    "server, run `git fetch` first and rebase onto `origin/main`. Otherwise you",
    "may replay onto an out-of-date local branch and have to do it again. After",
    "the fetch, `origin/main` points at the server's new C6, but `main` still",
    "points at C5:",
    "| C4 ── F1 ── F2 ── F3      ← feature (HEAD)",
    "|   \\",
    "|    C5 ── C6               ← origin/main",
    "|    ↑",
    "|    main",
    "`git rebase main` puts your commits on C5, one commit behind the server.",
    "`git rebase origin/main` puts them on C6:",
    "| C4 ── C5 ── C6 ── F1'── F2'── F3'   ← feature (HEAD)",
    "The old split point is gone from the branch's history. Afterwards the graph",
    "reads as though you had branched today."
  ],
  figure: [
    "$ git rebase main",
    "Successfully rebased and updated refs/heads/feature."
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Rebase onto the trunk and watch the hashes change"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "What happens to the hashes of rebased commits?",
  answer: [
    "They all change. A rebase makes *copies* on the new base, the commit the",
    "branch now starts from: the same changes, with different parents and",
    "different hashes. No branch leads to the originals any more, so only the",
    "reflog still reaches them.",
    "| old   C4 ── F1 ── F2 ── F3     abandoned, reflog only",
    "| new   C5 ── F1'── F2'── F3'    new parents ⇒ new hashes",
    "|       same changes, different hashes"
  ],
  detail: [
    "A commit's hash is calculated from its content, its parents, its message,",
    "its author and its timestamps. Change the parent and the hash must change,",
    "and so does the hash of every commit after it. Replacing commits with new",
    "copies is called *rewriting history*. It causes trouble on a shared branch",
    "because everyone else still has the old commits."
  ],
  figure: [
    "before:  9c8b7a6 Add overflow counter",
    "         4d5e6f7 Add queue skeleton",
    "",
    "after :  e5b62af Add overflow counter",
    "         0bf1e28 Add queue skeleton",
    "",
    "same messages, new hashes"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Rebase onto the trunk and watch the hashes change"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "A rebase stops on a conflict. What steps do you repeat, and which command do you avoid until it finishes?",
  answer: [
    "**Fix → `git add` → `git rebase --continue`**, repeated for each commit that",
    "conflicts. Do not run `git commit` during a rebase: `--continue` makes the",
    "commit for you."
  ],
  detail: [
    "A rebase replays commits one at a time, so the same file can conflict",
    "several times, once for each commit that touched it. A merge resolves",
    "everything in one commit. A rebase gives you a straight history and asks you",
    "to resolve per commit."
  ],
  figure: [
    "replaying three commits onto the new base:",
    "",
    "  F1 ✓ ─▶ F2 ✗ conflict ─▶ fix ─▶ add ─▶ --continue ─▶ F3 ✓",
    "",
    "each ✗ is its own resolution round"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "Besides `--continue`, the two other exits from a conflicted rebase?",
  answer: [
    "`git rebase --skip` drops the commit being replayed. `git rebase --abort`",
    "puts everything back as it was before the rebase."
  ],
  detail: [
    "`--skip` is right when the commit is no longer needed, because its change",
    "already reached `main` another way and replaying it adds nothing. Use it on",
    "purpose: skipping a commit whose work you still need removes that work from",
    "the branch with no warning."
  ],
  figure: [
    "--continue  resolve, keep the commit, move on",
    "--skip      discard this commit entirely, move on",
    "--abort     unwind everything, back to the pre-rebase branch"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Which side is “ours” and which is “theirs”, and why does the answer flip during a rebase?",
  answer: [
    "In a **merge**, ours is the branch you are on. In a **rebase** they swap:",
    "ours is the branch you are replaying *onto*, and theirs is your own commit",
    "being replayed."
  ],
  detail: [
    "A rebase starts from the target branch and applies your commits to it, so",
    "from git's position your work is the incoming side. This surprises nearly",
    "everyone at first, so read the marker labels and do not assume. Here the",
    "rebase of `feature` onto `main` has replayed F1 and stopped on F2:",
    "| C1 ── C2 ── C3 ── F1'     ← HEAD",
    "|         \\",
    "|          F1 ── F2         ← feature",
    "During a rebase HEAD points straight at a commit and no branch moves, which",
    "is called a *detached HEAD*. That commit is the new base, so its side is",
    "“ours”. F2, the commit being applied, is “theirs”. The `feature` branch",
    "moves only once the rebase has finished."
  ],
  figure: [
    "merge  feature into main:",
    "  <<<<<<< HEAD          ← main   (ours)",
    "  >>>>>>> feature       ← feature (theirs)",
    "",
    "rebase feature onto main:",
    "  <<<<<<< HEAD          ← main   (ours: the new base)",
    "  >>>>>>> your commit   ← your work (theirs)"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "The replay that stops"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "The same conflict keeps returning every time you rebase onto the moving trunk. Which setting makes git replay your past resolution automatically?",
  answer: [
    "$ git config --global rerere.enabled true",
    "*rerere* stands for “reuse recorded resolution”. After you fix a conflict by",
    "hand, git stores the fix and uses it when that exact conflict appears again."
  ],
  detail: [
    "Git stores the fix under `.git/rr-cache`, keyed by a hash of the conflict's",
    "text, and applies it only when that text matches, so it cannot apply an old",
    "fix to a conflict that has changed. The cache stays on your machine and is",
    "never pushed, so nobody else has to do anything."
  ],
  figure: [
    "first rebase :  conflict ─▶ you resolve ─▶ recorded in rr-cache",
    "later rebase :  same conflict ─▶ resolved automatically",
    "                you still git add + --continue"
  ],
  proGit:   "Git-Tools-Rerere"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "You rebased onto main, but main’s changes don’t appear as “your” commits in `git log`. Where are they?",
  answer: [
    "Below yours, as ancestors. A branch contains *every commit you can reach",
    "from its tip* by following parents, including ones you did not write. The",
    "files on disk already include them."
  ],
  detail: [
    "To check, run `git diff origin/main --stat`. If the only files listed are",
    "ones you changed, `main`'s work is fully in your branch. If your editor",
    "still shows old content after that, the disk is right and the editor has an",
    "old copy in memory."
  ],
  figure: [
    "feature tip",
    "   │",
    "   F3'── F2'── F1'── C5 ── C4 ── C3 ── …",
    "                     └──────────────── main's work, as ancestors",
    "",
    "git log main..HEAD  ← just your commits",
    "git log             ← everything your branch contains"
  ],
  proGit:   "Git-Branching-Rebasing",
  lab:      "Rebase onto the trunk and watch the hashes change"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Rebase refuses to start because you have uncommitted changes. What are the two ways past it?",
  answer: [
    "Stash them yourself, or have git do it every time:",
    "$ git config --global rebase.autoStash true"
  ],
  detail: [
    "With autoStash on, git stashes your changes, runs the rebase and puts them",
    "back. This is also why a working tree can show changes the moment a rebase",
    "finishes: `rebase.autoStash` has put your own changes back."
  ],
  figure: [
    "manual:  git stash → git rebase origin/main → git stash pop",
    "auto  :  git config --global rebase.autoStash true",
    "",
    "error: cannot rebase: You have unstaged changes."
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Can you try a rebase without running it?",
  answer: [
    "`git rebase` has no dry run. It replays commits one at a time, and each",
    "step's conflicts depend on how you resolved the step before. What you can",
    "preview is the list of commits it will replay:",
    "$ git log --oneline main..HEAD"
  ],
  detail: [
    "The list in an interactive rebase (`git rebase -i`, stage 08) is the same",
    "list in a form you can edit. `git merge-tree --write-tree main HEAD`, which",
    "works out a merge without touching your files, gives a first approximation:",
    "it says whether the branch's final content conflicts with `main`. A rebase",
    "applies one commit at a time, so it can still stop on a conflict when this",
    "check is clean. If something goes wrong, `git rebase --abort` restores",
    "everything during the rebase. `git reset --hard ORIG_HEAD` undoes a finished",
    "one, where `ORIG_HEAD` is the name git gives the branch's previous position.",
    "`git replay --ref-action=print --onto main main..HEAD` works out a whole",
    "replay and moves nothing, but git's manual still marks it experimental."
  ],
  figure: [
    "the list   :  git log --oneline main..HEAD          what gets replayed",
    "the check  :  git merge-tree --write-tree main HEAD  a dry-run merge",
    "the undo   :  git rebase --abort                     during the rebase",
    "              git reset --hard ORIG_HEAD             after it"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Preview the rebase before you run it"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "After rebasing a branch that was already pushed, plain `git push` is rejected. Why, and what’s the correct next command?",
  answer: [
    "Your local commits are new copies, so the server's tip is no longer an",
    "ancestor of yours: a non-fast-forward. You have to overwrite the server's",
    "branch, which is called a *force-push*:",
    "$ git push --force-with-lease",
    "Never plain `--force`."
  ],
  detail: [
    "The rejection protects the server from losing commits. Your new commits do",
    "not descend from what is there, so accepting the push would discard the old",
    "ones. That is what you intend here, so you have to say so explicitly. Your",
    "clone now has both versions of the branch:",
    "| C4 ── F1 ── F2          ← origin/feature",
    "|   \\",
    "|    C5 ── F1'── F2'      ← feature (HEAD)"
  ],
  figure: [
    "server: feature ──▶ F3    (old commits)",
    "local : feature ──▶ F3'   (new copies)",
    "",
    "           ✗ not a fast-forward: F3 is not an ancestor of F3'"
  ],
  proGit:   "Git-Branching-Rebasing",
  lab:      "Rebase a pushed branch and push it again"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "`--force` vs `--force-with-lease`?",
  answer: [
    "`--force-with-lease` overwrites the server's branch *only if* it still",
    "matches your `origin/…` record, a check called the *lease*. If someone",
    "pushed since your last fetch, it stops with “stale info”. Plain `--force`",
    "overwrites whatever is there, including anyone else's new commits."
  ],
  detail: [
    "Git compares the server's branch with an expected value, your",
    "`origin/feature`, and refuses if they differ. In this example a colleague",
    "pushed T1 after your last fetch, and you rebased onto the updated trunk (`T`",
    "marks a teammate's commit):",
    "| server:  C1 ── F1 ── T1    ← feature",
    "| yours:   C1 ── F1          ← origin/feature",
    "|            \\",
    "|             C2 ── F1'      ← feature (HEAD)",
    "Plain `--force` replaces the server's branch with yours, and T1 is lost. The",
    "lease compares the server's `feature` (T1) with your `origin/feature` (F1),",
    "sees that they differ, and refuses with “stale info”. There is one gap: a",
    "fetch that runs in the background, for example in your editor, moves",
    "`origin/feature` to T1, and the check then passes even though T1 is not in",
    "your branch. `push.useForceIfIncludes=true` closes that gap: the push then",
    "also needs T1 to have been part of your branch at some point, as the reflog",
    "records."
  ],
  figure: [
    "--force            overwrite whatever is there",
    "--force-with-lease  overwrite only if server == origin/feature",
    "                    else → ! [rejected] (stale info)",
    "",
    "git config --global push.useForceIfIncludes true"
  ],
  proGit:   "Git-Branching-Rebasing",
  manual:   "git-push#Documentation/git-push.txt---force-with-lease",
  lab:      "Rebase a pushed branch and push it again"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "A rebase finished cleanly. Do you need to stage or commit anything before pushing?",
  answer: [
    "No. The replay already made the commits: your working tree is clean and the",
    "branch points at the result. All that is left is to push:",
    "$ git push --force-with-lease"
  ],
  detail: [
    "If `git status` shows changes right after a rebase, the rebase did not leave",
    "them for you to commit. Either `rebase.autoStash` brought back changes you",
    "had before it started, or an editor wrote old content back to disk, so check",
    "the diff before trusting it."
  ],
  figure: [
    "$ git status",
    "On branch feature/task-queue",
    "nothing to commit, working tree clean",
    "",
    "$ git push --force-with-lease"
  ],
  proGit:   "Git-Branching-Rebasing",
  lab:      "Rebase a pushed branch and push it again"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "The one-sentence rule for merge vs rebase on your feature branch?",
  answer: [
    "**Rebase if the branch is yours alone; merge if anyone else has pulled it.**"
  ],
  detail: [
    "The rule depends on who has the old commits. If only you have them,",
    "rewriting costs only a force-push. Once anyone else has a copy, rewriting",
    "creates repair work for them."
  ],
  figure: [
    "the routine for a solo branch:",
    "",
    "  git fetch origin",
    "  git rebase origin/main",
    "  git push --force-with-lease"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  level:    "basics",
  question: "The golden rule of rebase?",
  answer: [
    "**Never rewrite history another clone has already pulled.** A branch only",
    "you hold can be rewritten freely. Once commits are in another clone, fix",
    "things by adding new commits."
  ],
  detail: [
    "Say you rebased `feature` onto C5 and force-pushed. A colleague's clone",
    "still has the old F1 and F2, and their next pull with a merge joins the old",
    "commits with the new ones:",
    "| C4 ── F1 ── F2 ── M      ← feature (HEAD)",
    "|   \\               │",
    "|    C5 ── F1'── F2'┘      ← origin/feature",
    "Now each of your commits exists twice, and their next push sends both copies",
    "to the server. The repair is to move the branch back by hand in every clone.",
    "The rule also covers you: your second computer, or an automated build",
    "machine holding a copy, breaks in the same way. So the test is whether any",
    "other copy holds the commits."
  ],
  figure: [
    "safe to rewrite      : your unpushed work, your solo branches",
    "never rewrite        : main, anything already pulled elsewhere",
    "undo on a shared branch: git revert  (a new commit that reverses the old one)"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "When would you choose merge over rebase to bring trunk changes into your feature branch?",
  answer: [
    "When anyone else has pulled your branch. The rebased commits are copies with",
    "new hashes, so every copy a colleague holds goes out of date. A merge only",
    "adds a commit and changes nothing that exists."
  ],
  detail: [
    "The second case is a long-lived branch rebased many times onto a busy trunk,",
    "where you resolve the same conflict on each rebase. `rerere` handles most of",
    "that. When it does not, one merge commit is less work than resolving the",
    "conflict by hand a fifth time."
  ],
  figure: [
    "branch is yours alone      ──▶ rebase (clean, linear)",
    "someone else has pulled it ──▶ merge  (safe, additive)"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Pull, but replay your local commits on top of the incoming ones instead of merging?",
  answer: [
    "$ git pull --rebase",
    "$ git config --global pull.rebase true"
  ],
  detail: [
    "On a shared branch, each pull that merges leaves a commit such as “Merge",
    "branch 'main' of origin into main” in the history, and those commits say",
    "nothing useful. Rebasing on pull keeps your commits in a line on top of what",
    "arrived, at the cost of replaying them, which can conflict once per commit.",
    "With no setting, a pull where both sides have new commits stops and asks you",
    "to choose."
  ],
  figure: [
    "merge-pull:  … ── origin work ──┐",
    "             … ── your commits ──┴── M   (an extra commit)",
    "",
    "rebase-pull: … ── origin work ── your commits'   (a straight line)"
  ],
  proGit:   "Git-Branching-Rebasing",
  lab:      "Collide on the trunk, then recover"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Your `--force-with-lease` went through, and a colleague’s commit is now gone from the server. How did the lease allow that, and which option would have stopped it?",
  answer: [
    "A fetch ran in the background, for example in your editor, and moved",
    "`origin/feature` to their commit. The lease only compares the server with",
    "`origin/feature`, and the two matched. `--force-if-includes` adds the",
    "missing check: the server’s commit must have been in your branch at some",
    "point.",
    "$ git push --force-with-lease --force-if-includes",
    "$ git config --global push.useForceIfIncludes true"
  ],
  detail: [
    "The lease checks against `origin/feature`, and every fetch updates it,",
    "whether you run the fetch or your editor does. Before the fetch, the server",
    "has T1 and your clone does not:",
    "| server:  C1 ── F1 ── T1    ← feature",
    "| yours:   C1 ── F1          ← origin/feature",
    "|            \\",
    "|             C2 ── F1'      ← feature (HEAD)",
    "After the fetch your branch is the same, but the lease check now passes:",
    "| yours:   C1 ── F1 ── T1    ← origin/feature",
    "|            \\",
    "|             C2 ── F1'      ← feature (HEAD)",
    "A push with only `--force-with-lease` would now replace F1 and T1 on the",
    "server with F1'. `--force-if-includes` also looks at the reflog of",
    "`feature`, the list of every commit the branch has pointed at: here C1, F1",
    "and F1'. T1 cannot be reached from any of them, so git refuses the push with",
    "`remote ref updated since checkout`. If you reset your branch to",
    "`origin/feature` (move it there; stage 10 covers reset) and redo the rebase,",
    "the same push works, because the reset added T1 to the reflog:",
    "| yours:   C1 ── F1 ── T1       ← origin/feature",
    "|            \\",
    "|             C2 ── F1'── T1'   ← feature (HEAD)",
    "The check asks only whether T1 was ever in your branch. If you merge T1 and",
    "then reset it away again, the push still passes and deletes T1.",
    "`--force-if-includes` has no effect without the lease, or with",
    "`--force-with-lease=<ref>:<expect>`, where you give the expected commit",
    "yourself. Plain `-f` turns off both checks. The option was added in git",
    "2.30."
  ],
  figure: [
    "                             lease alone   + --force-if-includes",
    "nobody else pushed           passes        passes",
    "pushed, not fetched          stale info    stale info",
    "pushed, fetched, not merged  passes  ✗     refused",
    "pushed, merged or rebased    passes        passes",
    "merged, then reset away      passes  ✗     passes  ✗",
    "",
    "✗  the server loses a commit someone else pushed"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "stashing-and-the-reflog",
  manual:   "git-push#Documentation/git-push.txt---force-if-includes",
  lab:      "Force-push after a background fetch"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Nobody else works on your branch, so a plain `--force` can’t hurt anyone. What is wrong with that reasoning?",
  answer: [
    "Working alone protects you from one problem: nobody else has the old",
    "commits, so rewriting them cannot break anyone else's clone. The server can",
    "still get new commits while you work. Only the lease checks for those, at",
    "the moment you push:",
    "$ git push --force-with-lease --force-if-includes"
  ],
  detail: [
    "The first problem is the one the golden rule covers: a clone that still has",
    "the old commits merges them back in. The second can happen even when you",
    "work alone. New commits can come from a hosting site's *Update branch*",
    "button, a suggestion committed from a review, a formatting bot, or your",
    "other computer. Here a bot pushed B1 while you were rebasing:",
    "| server:  C1 ── F1 ── B1    ← feature",
    "| yours:   C1 ── F1          ← origin/feature",
    "|            \\",
    "|             C2 ── F1'      ← feature (HEAD)",
    "Plain `--force` deletes B1 without any warning. The lease refuses, unless a",
    "background fetch has already moved `origin/feature` to B1, and",
    "`--force-if-includes` refuses in that case too. So the golden rule tells you",
    "whether you may rewrite at all, and the two push checks make sure the",
    "server's latest commit has been in your branch before you overwrite it."
  ],
  figure: [
    "problem                        what protects you",
    "a clone with the old commits   the golden rule: never rewrite",
    "                               what another clone has pulled",
    "new commits on the server      --force-with-lease,",
    "                               with --force-if-includes",
    "",
    "working alone removes only the first problem"
  ],
  proGit:   "Git-Branching-Rebasing",
  manual:   "git-push#Documentation/git-push.txt---force-with-lease",
  lab:      "Force-push after a background fetch"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "You rebased a pushed branch, the push was rejected, and the hint claims your branch is *behind* and suggests `git pull`. What happens if you follow it?",
  answer: [
    "The hint is written for the usual cause of rejection, new commits on the",
    "server, and git cannot tell the two causes apart. The pull brings the *old*",
    "copies of your commits back into the branch, and the push after it succeeds,",
    "so the server gets them too."
  ],
  detail: [
    "With no pull mode set, nothing happens: the pull stops with `fatal: Need to",
    "specify how to reconcile divergent branches.` and prints the three settings",
    "you can choose from. The pull goes ahead only with `pull.rebase` already",
    "set, or with `--rebase` or `--no-rebase` on the command line. Which one you",
    "have decides the result. Both start from this state after your rebase:",
    "| C4 ── F1 ── F2            ← origin/feature",
    "|   \\",
    "|    C5 ── F1'── F2'        ← feature (HEAD)",
    "A merge-pull keeps both versions, so each of your commits exists twice,",
    "joined by a merge commit:",
    "| C4 ── F1 ── F2 ──────┐    ← origin/feature",
    "|   \\                  │",
    "|    C5 ── F1'── F2'── M    ← feature (HEAD)",
    "The commits that return are the originals, with their original hashes. The",
    "new hashes belong to the copies your rebase made. A rebase-pull replays your",
    "branch onto the old remote tip, F2. It skips F1' and F2', because their",
    "changes are already there, and replays only C5, a commit from `main`. So a",
    "copy of someone else's work ends up on your branch with a new hash:",
    "| C4 ── F1 ── F2 ── C5'     ← feature (HEAD)",
    "The right response to the rejection was `--force-with-lease`. It replaces",
    "the server's branch with yours, but only if that branch still points where",
    "your last fetch saw it. If anyone pushed in between, it refuses (“stale",
    "info”). The old copies of your commits are then deleted from the server, as",
    "intended, because your rebase replaced them."
  ],
  figure: [
    "merge-pull :  … ── F1 ── F2 ──────┐",
    "              … ── F1'── F2'──────┴── M    everything twice, plus a merge",
    "",
    "rebase-pull:  … ── F1 ── F2 ── C5'         C5' = a commit from main, copied",
    "",
    "git push --force-with-lease",
    "   server holds F2, as fetched  →  replaced by F2', old copies deleted",
    "   server changed meanwhile     →  ! [rejected] (stale info)"
  ],
  proGit:   "Git-Branching-Rebasing",
  lab:      "Follow the bad hint, and watch what it builds"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Before pushing a rebased branch, list the commits it would add to `main`?",
  answer: [
    "$ git log --oneline origin/main..HEAD",
    "You should see your own commits, once each. Anything more means the branch",
    "picked up commits that should only sit beneath it."
  ],
  detail: [
    "Look for two things in the list. A commit by someone else is `main`'s work,",
    "copied onto your branch under a new hash. If one of your own commits appears",
    "twice, the old and the rebased commits have been merged together. Both come",
    "from pulling a branch you had just rebased, and this one line shows them",
    "before a reviewer does."
  ],
  figure: [
    "correct:  F2' F1'                your commits, once each",
    "wrong:    C5' F2  F1             a commit from main, copied in",
    "wrong:    M   F2' F1' F2 F1      everything twice, plus a merge",
    "",
    "stage 13 covers the two-dot range"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Take the stray commit back out"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "The pull already happened: the branch holds copies of trunk commits, or your own commits twice. Clean it without picking commits apart by hand?",
  answer: [
    "The fix depends on which of the two you have. For copies of `main`'s",
    "commits, replay onto `origin/main` and force-push:",
    "$ git rebase origin/main",
    "$ git push --force-with-lease",
    "For your own commits twice, go back to the earlier tip:",
    "$ git reset --hard <the tip your rebase produced, from the reflog>"
  ],
  detail: [
    "A rebase compares changes as well as hashes, so it leaves out any commit",
    "whose change is already on the target, and git names each one it drops. That",
    "fixes a branch with copies of `main`'s commits. C5' is dropped because C5",
    "already has its change, and F1 and F2 are replayed onto the trunk:",
    "| before:  C4 ── F1 ── F2 ── C5'   ← feature (HEAD)",
    "|            \\",
    "|             C5                   ← origin/main",
    "|",
    "| after:   C4 ── C5 ── F1'── F2'   ← feature (HEAD)",
    "The same rebase will not fix a merge-pull. There the duplicates are not on",
    "the target: both sets sit on your own branch, so both get replayed and the",
    "second copy of a commit conflicts with the first. Expect `CONFLICT",
    "(content)` where your commits edited a file and `CONFLICT (add/add)` where",
    "they created one, all to be resolved by hand, which is what you wanted to",
    "avoid. For that case, use the reflog: the tip from right after your rebase",
    "is still in it. `git reset --hard` with that hash moves the branch there and",
    "makes your files match (stage 10 covers reset), which puts the branch back",
    "at the point where you should have force-pushed:",
    "| before:  C4 ── F1 ── F2 ──────┐",
    "|            \\                  │",
    "|             C5 ── F1'── F2'── M   ← feature (HEAD)",
    "|",
    "| after:   C4 ── C5 ── F1'── F2'    ← feature (HEAD)",
    "Either way, read `git log origin/main..HEAD` before pushing."
  ],
  figure: [
    "copies of commits from main, cleared by the replay:",
    "  $ git rebase origin/main",
    "  dropping c5c0f3e Add licence -- patch contents already upstream",
    "",
    "your own commits twice, where the replay stops:",
    "  $ git rebase origin/main",
    "  CONFLICT (content): Merge conflict in src/runner.py",
    "  $ git reset --hard 4ad0c11        ← the tip your rebase produced",
    "",
    "$ git log --oneline origin/main..HEAD    ← only your commits remain",
    "$ git push --force-with-lease"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "stashing-and-the-reflog",
  lab:      "Take the stray commit back out"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "Your fetch prints `+ ae653d0...58f7c2b topic -> origin/topic  (forced update)`, on a branch you did not change. What is git telling you?",
  answer: [
    "Someone rewrote that branch and force-pushed it. The `+` marks an update",
    "that was not a fast-forward: your `origin/topic` left the old commits and",
    "jumped to the rewritten ones. Nothing on your side caused this; fetch is",
    "reporting what the server now holds."
  ],
  detail: [
    "Remote-tracking branches follow the server, so the jump has already happened",
    "when you read the line, and the line is the only notice you get. If you also",
    "have a local `topic`, it still sits on the old commits, and `git status` now",
    "says “have diverged, and have 1 and 1 different commits each” on a branch",
    "where you committed nothing. Its hint suggests `git pull`, which would join",
    "the old commits to the new ones and give the duplicates back to the person",
    "who just removed them. Say the last commit was reworded. Before the fetch,",
    "`topic` and `origin/topic` both pointed at B. After it, only `origin/topic`",
    "has moved:",
    "| C1 ── A ── B       ← topic",
    "|        \\",
    "|         B'         ← origin/topic"
  ],
  figure: [
    "$ git fetch",
    " + ae653d0...58f7c2b topic -> origin/topic  (forced update)",
    "",
    "old commits:  … ── A ── B     where origin/topic and topic were",
    "new commits:  … ── A'── B'    where the server points now"
  ],
  proGit:   "Git-Branching-Remote-Branches",
  lab:      "Watch the force-push arrive"
},

{
  stage:    "07 rebasing",
  level:    "intermediate",
  question: "A branch you track was force-pushed. Update your local copy, first when nothing on it is yours, then when some commits are.",
  answer: [
    "`git cherry -v origin/topic` marks every commit that is only on your copy:",
    "`-` means its change is already on the new version of the branch, and `+`",
    "means it is yours alone. If all are minus, take the new version:",
    "$ git reset --hard origin/topic",
    "If any are plus, replay only yours onto it:",
    "$ git rebase origin/topic"
  ],
  detail: [
    "`reset --hard` moves your branch to where `origin/topic` now points and",
    "makes your files match, so anything that existed only here is gone. That is",
    "why you ask `cherry` first. The rebase needs no sorting by hand: the `-`",
    "commits hold changes the new version already has, so the replay drops them",
    "(“skipped previously applied commit”) and keeps the `+` ones. Either way you",
    "end up on the rewritten branch and keep your own work. Say you added a",
    "commit of your own, N, on top of the old version. `cherry` marks B with a",
    "minus and N with a plus:",
    "| C1 ── A ── B ── N    ← topic (HEAD)",
    "|        \\",
    "|         B'           ← origin/topic",
    "The rebase drops B and puts N on top of the new version:",
    "| C1 ── A ── B'── N'   ← topic (HEAD)"
  ],
  figure: [
    "$ git cherry -v origin/topic",
    "- ae653d0… Add metrics    change already on the new version: an old copy",
    "+ a8e569d… Add a note     only here: this one is yours",
    "",
    "all -  →  git reset --hard origin/topic",
    "any +  →  git rebase origin/topic    (the - lines drop out by themselves)"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Sort your copy, then follow the rewrite"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Fix the message of the last commit?",
  answer: [
    "$ git commit --amend -m \"Add configurable queue depth\""
  ],
  detail: [
    "Without `-m`, git opens your editor with the old message loaded, which is",
    "easier for anything longer than one line. Either way git replaces the",
    "commit, so a branch already pushed needs a force-push afterwards."
  ],
  figure: [
    "git commit --amend -m \"New subject\"    inline",
    "git commit --amend                     opens editor, old text loaded"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset",
  lab:      "Commit the remainder, then fix its message"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "You forgot to stage one file for the last commit. Fold it in, keeping the message?",
  answer: [
    "$ git add src/queue.py",
    "$ git commit --amend --no-edit"
  ],
  detail: [
    "This is the most common use of amend, and the deck's alias for it is `git",
    "fixit`. It saves the “fix typo” and “forgot a file” commits that otherwise",
    "pile up in a long session."
  ],
  figure: [
    "[alias]",
    "    fixit = commit --amend --no-edit",
    "",
    "$ git add src/queue.py",
    "$ git fixit"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset",
  lab:      "Repair the last commit, keep the rest"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "The last commit has one broken line. Its fix sits in your working tree, tangled with unfinished work. Repair the commit without losing the rest?",
  answer: [
    "Stage the fix alone, then fold it in:",
    "$ git add -p src/runner.py",
    "$ git commit --amend --no-edit",
    "Amend builds the new commit from the last commit's parent plus the index, so",
    "unstaged work stays out. You do not need a stash."
  ],
  detail: [
    "Uncommitted changes do not block an amend. Only what is staged goes in, and",
    "the rest stays where it was, ready to become its own commit. When the fix",
    "and the new work share a hunk, `s` and `e` separate them. If you already",
    "staged everything by habit, `git restore --staged -p` takes the unrelated",
    "parts back out; its `y` means *unstage*, the reverse of `add -p`. If the",
    "commit is unpushed, that removes the broken line from history. A pushed",
    "branch needs `--force-with-lease` afterwards."
  ],
  figure: [
    "working tree    the fix  +  unfinished start()",
    "",
    "git add -p               index: the fix alone",
    "git commit --amend       commit': same message, line repaired",
    "",
    "working tree after   start(), unchanged: commit it separately"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset",
  lab:      "Repair the last commit, keep the rest"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "What does `--amend` do to the old commit?",
  answer: [
    "It replaces it. The “edited” commit is a new commit with a new hash. No",
    "branch leads to the old one, which stays in your reflog for about 30 days."
  ],
  detail: [
    "Git never edits a commit in place. Amend builds a new commit with the same",
    "parent and moves the branch to it. So an amend is a one-commit rebase, with",
    "the same consequences."
  ],
  figure: [
    "before:  … ── B ── C     (main)",
    "",
    "after :  … ── B ── C'    (main)",
    "              \\",
    "               C          no branch leads here; only the reflog reaches it"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset",
  lab:      "Commit the remainder, then fix its message"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "The last commit has the wrong author or a wrong date. Fix it without touching the content?",
  answer: [
    "$ git commit --amend --author=\"Your Name <you@example.com>\" --no-edit",
    "$ git commit --amend --date=now --no-edit"
  ],
  detail: [
    "This helps after committing on a machine with no git identity set, or with",
    "the wrong address. Each commit holds two timestamps: the *author date*, when",
    "the change was first written, and the *committer date*, when this copy of",
    "the commit was made. A rebase keeps the first and resets the second."
  ],
  figure: [
    "author date     when the change was written    (survives a rebase)",
    "committer date  when this commit was made      (reset by a rebase)",
    "",
    "git log --pretty=format:'%h %ad %cd %s' --date=short"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Open interactive rebase for everything since `main` diverged; for just the last five commits?",
  answer: [
    "$ git rebase -i main",
    "$ git rebase -i HEAD~5",
    "An *interactive rebase* lets you edit the replay before it runs. An editor",
    "opens with one `pick` line per commit: your *todo list*."
  ],
  detail: [
    "The list starts with the oldest commit, the reverse of `git log`, because",
    "that is the replay order. Reordering lines reorders commits, and deleting a",
    "line drops that commit, as `drop` does. Saving an empty list cancels the",
    "whole rebase."
  ],
  figure: [
    "pick 1a2b3c4 # Add task queue skeleton    ← oldest first",
    "pick 4d5e6f7 # wip",
    "pick 9c8b7a6 # Add overlfow counter",
    "",
    "# p pick · r reword · s squash · f fixup · d drop · e edit"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing",
  lab:      "Clean up the branch with an interactive rebase"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Fold a commit into the one above it, combining both messages?",
  answer: [
    "Mark it `squash`. Git pauses and opens an editor holding both messages, so",
    "you can write the combined one."
  ],
  detail: [
    "Use it when both commits describe real work and the combined commit deserves",
    "its own message. `squash` always folds *upward* in the list, so the commit",
    "you want to keep has to sit above the ones being absorbed. After the squash,",
    "F1 and F2 are one commit, and F3 is rebuilt on top of it with a new hash:",
    "| before:  C1 ── F1 ── F2 ── F3   ← feature (HEAD)",
    "| after:   C1 ── F1+2 ── F3'      ← feature (HEAD)"
  ],
  figure: [
    "pick   F1  Add queue skeleton",
    "squash F2  Add overflow guard         ← folds up into F1",
    "",
    "editor opens with BOTH messages, you write the final one"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Fold a commit into the one above it and throw its message away?",
  answer: [
    "Mark it `fixup`. It folds like squash, with no editor, and discards the",
    "message. Use it to clear out commits named `wip` (work in progress) and",
    "`oops`."
  ],
  detail: [
    "It collapses a long session of small commits into the two or three a",
    "reviewer wants. If a branch is mostly checkpoint commits, made only to keep",
    "a day's work safe, marking them all `fixup` is usually all the clean-up it",
    "needs."
  ],
  figure: [
    "pick  F1  Add queue skeleton",
    "fixup F2  wip                    ← changes kept, message gone",
    "fixup F3  fix typo               ← same",
    "pick  F4  Add overflow counter",
    "",
    "result:  (F1+F2+F3) ── F4"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing",
  lab:      "Clean up the branch with an interactive rebase"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "The interactive-rebase verb for changing only a commit’s *message*?",
  answer: [
    "`reword`. The changes stay the same, and git stops just long enough to open",
    "the message in your editor."
  ],
  detail: [
    "Use it for a commit whose content is right but whose subject says “wip” or",
    "misspells a name. Git still replaces the commit, so it and everything after",
    "it get new hashes."
  ],
  figure: [
    "reword 9c8b7a6 # Add overlfow counter",
    "       ↓",
    "       Add overflow counter"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing",
  lab:      "Clean up the branch with an interactive rebase"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Pause a rebase at one particular commit so you can change its content?",
  answer: [
    "Mark it `edit`. The replay stops at that commit. Amend it, split it or",
    "inspect it, then run `git rebase --continue`."
  ],
  detail: [
    "This is how you split one oversized commit in two. Stop at it, run `git",
    "reset HEAD^` to undo the commit and keep its changes unstaged on disk (stage",
    "10 covers reset), then stage and commit them in two passes before",
    "continuing."
  ],
  figure: [
    "edit 1a2b3c4 # Add queue and rewrite the runner",
    "",
    "  git reset HEAD^          unstage, keep the changes",
    "  git add -p ; git commit  first half",
    "  git add . ; git commit   second half",
    "  git rebase --continue"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "What does `drop` do, and what can go wrong?",
  answer: [
    "It removes the commit *and its changes*. A later commit that built on those",
    "lines will conflict during the replay, because the lines it edits are gone.",
    "`fixup` keeps the changes and `drop` removes them."
  ],
  detail: [
    "Use it when the commit should never have existed, such as a committed secret",
    "or scratch code. When you want the change without the separate commit, use",
    "`fixup`. Choosing the wrong one turns a clean-up into a series of conflicts."
  ],
  figure: [
    "pick F1  add overflow_count",
    "drop F2  wire overflow_count to the log",
    "pick F3  assert overflow_count in tests",
    "                    ↑ conflicts: the code F3 edits no longer exists"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Mark a fix for an *older* commit now, and fold it in later without editing any todo list?",
  answer: [
    "$ git commit --fixup=1a2b3c4",
    "$ …later…",
    "$ git rebase -i --autosquash main"
  ],
  detail: [
    "The first command writes a commit whose subject is literally `fixup!",
    "<original subject>`. In the rebase, `--autosquash` recognises the prefix,",
    "moves each such commit next to its target and marks it `fixup`. You check",
    "the list and save. Set `rebase.autoSquash=true` to make it the default."
  ],
  figure: [
    "git commit --fixup=1a2b3c4     → \"fixup! Add queue skeleton\"",
    "",
    "git rebase -i --autosquash main",
    "  pick  1a2b3c4 # Add queue skeleton",
    "  fixup 7f8e9d0 # fixup! Add queue skeleton   ← moved here",
    "  pick  9c8b7a6 # Add overflow counter"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "You wrote two commits on `task-queue`, and `git log --oneline main..HEAD` lists three. Where did the third come from?",
  answer: [
    "You created the branch while on `refactor`, so `refactor`'s commit sits",
    "beneath yours and the range counts it too.",
    "$ git log --oneline refactor..HEAD    # your own two, and nothing else",
    "| main ── refactor ── skeleton ── tests    ← task-queue",
    "|            └── not yours, and main..HEAD counts it"
  ],
  detail: [
    "Git gives no warning at the time, and the two obvious checks do not show the",
    "problem. `git merge-base main HEAD` prints `main`'s own tip here, just as it",
    "does for a correctly started branch, because `main` is an ancestor either",
    "way. The branch's own reflog records the slip as `branch: Created from HEAD`,",
    "and it names a start point only when you passed one explicitly, in which case",
    "you would not have made this mistake. HEAD's reflog does name the branch,",
    "because it logged the switch. That entry expires after about 90 days. `git branch",
    "--contains` on the third commit also answers: it lists every branch holding",
    "that commit, and the branch you started from is among them."
  ],
  figure: [
    "$ git log --oneline main..HEAD",
    "9c8b7a6 Report queue depth        ← yours",
    "7f8e9d0 Drain the queue           ← yours",
    "1a2b3c4 Extract the retry loop    ← refactor's",
    "",
    "$ git reflog show task-queue | tail -1",
    "1a2b3c4 task-queue@{2}: branch: Created from HEAD",
    "",
    "$ git reflog | grep 'to task-queue' | tail -1",
    "1a2b3c4 HEAD@{5}: checkout: moving from refactor to task-queue"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Count what the branch would add"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "Your branch sits on the wrong base, so you run `git rebase main`. It answers `Current branch task-queue is up to date.` What happened?",
  answer: [
    "Nothing happened, and git behaved correctly. `main` is already an ancestor",
    "of the branch, so rebase has nothing to replay and stops. `refactor`'s",
    "commit is still underneath you.",
    "$ git log --oneline main..HEAD    # unchanged, still three"
  ],
  detail: [
    "The reflog confirms it: there is no rebase entry, and the tip is still the",
    "commit you made last. Once `main` moves, the same command moves too many",
    "commits. Here `main` has gained C3:",
    "| C1 ── C2 ── C3              ← main",
    "|         \\",
    "|          R1 ── S ── T       ← task-queue (HEAD)",
    "|          ↑",
    "|          refactor",
    "Now there is something to replay, so it replays `refactor`'s commit too. It",
    "arrives on your branch as a copy with a new hash, while `refactor` keeps the",
    "original:",
    "| C1 ── C2 ── C3 ── R1'── S'── T'  ← task-queue (HEAD)",
    "|         \\",
    "|          R1                      ← refactor",
    "So the same command gives two different wrong results, depending on whether",
    "`main` happened to move. `--onto`, on the next card, lets you name where the",
    "commits go and where the count stops, as two separate arguments."
  ],
  figure: [
    "main has not moved:",
    "  $ git rebase main",
    "  Current branch task-queue is up to date.",
    "  → exit 0, no reflog entry, nothing fixed",
    "",
    "main has moved:",
    "  $ git rebase main",
    "  Successfully rebased and updated refs/heads/task-queue.",
    "  → refactor's commit replayed too, now a copy on your branch"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Count what the branch would add"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "You branched off the wrong branch. Move your two commits onto `main`, leaving behind the branch you started from?",
  answer: [
    "$ git rebase --onto main refactor task-queue",
    "If you are on the branch and know how many commits are yours, you can give",
    "the number:",
    "$ git rebase --onto main HEAD~2",
    "| before  base ─ refactor ─ skeleton ─ tests   ← task-queue",
    "|",
    "| after   base ─ refactor",
    "|            └── skeleton ─ tests              ← task-queue"
  ],
  detail: [
    "The three arguments say: put the commits *on* `main`, stop counting at",
    "`refactor`, move `task-queue`. Git replays every commit that is in the",
    "branch and not in `refactor`, so the refactor work stays behind. Plain `git",
    "rebase main task-queue` counts from the common ancestor, and moves the",
    "refactor commit too. UPSTREAM is only git's name for this argument, where",
    "counting stops, and has nothing to do with a branch's upstream. Do not name",
    "the same branch as both UPSTREAM and BRANCH. No commit is in a branch and",
    "not in itself, so git replays nothing, reports `Successfully rebased`, and",
    "the branch has lost your commits. The reflog holds the old tip."
  ],
  figure: [
    "git rebase --onto NEWBASE UPSTREAM BRANCH",
    "                     │        │       │",
    "                     │        │       └─ which commits to move",
    "                     │        └───────── where to stop counting, excluded",
    "                     └────────────────── where they go"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Move the independent branch onto the trunk"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "The `--onto` replay finished without a single conflict, because your commits and the wrong base touched different files. What changed under you anyway?",
  answer: [
    "The base branch's work is gone from your files. It was never in your",
    "commits: your branch sat on top of it, and the replay moved you off it.",
    "$ git diff ORIG_HEAD --stat"
  ],
  detail: [
    "A clean replay tells you the changes applied. It does not tell you the",
    "result still works. Your code that called into the base branch's work is",
    "still valid text, but what it calls is gone, so check this by hand: read the",
    "files the base branch changed, or run the tests. Sharing a file with the",
    "base does not change this: two commits that edit distant parts of one file",
    "also replay with no conflict. Only a commit that edited the base's own lines",
    "stops the replay. If your work depends on the base branch, keep your branch",
    "on top of it until the base branch is merged."
  ],
  figure: [
    "$ git rebase --onto main refactor task-queue",
    "Successfully rebased and updated refs/heads/task-queue.",
    "",
    "$ git diff ORIG_HEAD --stat",
    " src/retry.py | 1 -",
    " 1 file changed, 1 deletion(-)",
    "",
    "neither of your two commits changed src/retry.py"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Move the independent branch onto the trunk"
},

{
  stage:    "08 history edits",
  level:    "intermediate",
  question: "The same `--onto` stops on a conflict, and the `HEAD` side of the marker is empty. What is it telling you?",
  answer: [
    "The commit being replayed was written against lines only `refactor` added.",
    "`HEAD` during a rebase is the new base, so the empty side is `main`'s: it",
    "has nothing there to set against your version.",
    "| <<<<<<< HEAD",
    "| ||||||| parent of 30ee10f (Keep a week of retries)",
    "| RETRY_AT = 3          ← the context the commit was written against",
    "| =======",
    "| RETRY_AT = 3",
    "| RETRY_KEEP = 7        ← what the commit made of it",
    "| >>>>>>> 30ee10f (Keep a week of retries)"
  ],
  detail: [
    "An empty side means a missing base: those lines never existed on `main`, so",
    "nobody edited them there. During a rebase `ours` is the branch you are",
    "replaying onto and `theirs` is your own commit (stage 07). The middle",
    "section shows the lines the commit was written against and appears only with",
    "`merge.conflictStyle` set to `diff3` or `zdiff3`. `git show main:<file>`",
    "confirms `main` never had those lines. Resolving by hand would mean pasting",
    "the base branch's work into your own commit, so someone else's change goes",
    "in under your name. You have two clean options: run `--abort` and leave the",
    "branch based where it belongs, or merge the base branch first and then run a",
    "plain rebase, which drops the shared commit by itself."
  ],
  figure: [
    "$ git rebase --onto main refactor task-queue",
    "Auto-merging src/retry.py",
    "CONFLICT (content): Merge conflict in src/retry.py",
    "error: could not apply 30ee10f... Keep a week of retries",
    "",
    "$ git status --short",
    "UU src/retry.py"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "The replay that stops"
},

{
  stage:    "08 history edits",
  question: "Your rebase came out in a straight line and the merge commits are gone. Keep the shape?",
  answer: [
    "A rebase replays *non-merge* commits one at a time, so a two-parent commit",
    "has no place in the replay, and the branch comes out as a straight line.",
    "$ git rebase --rebase-merges --onto <new-base> <old-base> main"
  ],
  detail: [
    "Usually only the shape is lost: the flattened history ends with the same",
    "files, unless a merge commit held changes of its own. Seven commits with two",
    "merges come out as five with none. `--rebase-merges` rebuilds the merges as",
    "it goes, and `rebase.rebaseMerges = true` makes it the default. Rebuilding",
    "means running each merge again: a merge you resolved by hand stops on the",
    "same conflict, and `rerere` (stage 07) can replay your fix."
  ],
  figure: [
    "plain rebase                --rebase-merges",
    "",
    "  * second work               *   Merge second",
    "  * feature work              |\\",
    "  * main moves                | * second work",
    "  * Second                    |/",
    "  * First commit              *   Merge feature",
    "                              |\\",
    "  5 commits, 0 merges         7 commits, 2 merges"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "branching-and-the-power-of-rebase",
  lab:      "Put a licence into the very first commit"
},

{
  stage:    "08 history edits",
  question: "A licence should have been in the repository from the very first commit. Put it there?",
  answer: [
    "$ ROOT=$(git rev-list --max-parents=0 HEAD)",
    "$ git checkout --detach $ROOT",
    "$ git add LICENSE && git commit --amend --no-edit",
    "$ git rebase --rebase-merges --onto HEAD $ROOT main"
  ],
  detail: [
    "`--max-parents=0` picks the commit with no parent, the *root commit*, and",
    "`--detach` puts HEAD directly on it. Amending builds a new commit, and since",
    "a commit's hash depends on its parent's, everything after it is rebuilt too.",
    "Expect every hash in the repository to change. If the branch is already",
    "pushed, follow up with `git push --force-with-lease`. Anyone with a clone",
    "then has to reset onto the new history, because a pull would join the old",
    "history to the new one."
  ],
  figure: [
    "before   7c1a4e0 ─ 2f9b83d ─ 4ad0c11     no licence in the root",
    "",
    "after    e5b62af ─ 9d3c740 ─ 0bf1e28     a licence from commit one",
    "         └─ same changes, same messages, new hashes"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Put a licence into the very first commit"
},

{
  stage:    "09 cherry-picking",
  level:    "intermediate",
  question: "Copy one specific commit from anywhere in the repo onto your current branch?",
  answer: [
    "$ git cherry-pick a1b2c3d",
    "This makes a new commit with the same changes and a new hash, because the",
    "parent differs.",
    "| main     A ── B ── C ── D",
    "|                \\",
    "| release          C'          ← a copy: same change, new hash",
    "|                              C itself stays on main"
  ],
  detail: [
    "A cherry-pick copies and leaves the original in place. The same change then",
    "exists twice in the repository under two hashes. That is fine when you meant",
    "it, and a common cause of “why did this conflict, I already fixed it” when",
    "you forgot."
  ],
  figure: [
    "$ git switch release",
    "$ git cherry-pick a1b2c3d",
    "[release d4103d8] Fix the overflow check",
    " 1 file changed, 1 insertion(+), 1 deletion(-)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project",
  lab:      "Copy one fix to the release, alone"
},

{
  stage:    "09 cherry-picking",
  level:    "intermediate",
  question: "Two classic cherry-pick use cases?",
  answer: [
    "Copying a single fix from `main` to a release branch, which holds a shipped",
    "version and takes only fixes (a *backport*), and saving one good commit from",
    "an experiment you are abandoning."
  ],
  detail: [
    "In both you want one commit's change without the rest of its branch. If you",
    "find yourself picking more than a handful in a row, merge or rebase the",
    "branches."
  ],
  figure: [
    "fix on main    ──▶ pick onto release/1.2     (backport)",
    "dead branch    ──▶ pick the one good commit  (salvage)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project",
  lab:      "Copy one fix to the release, alone"
},

{
  stage:    "09 cherry-picking",
  level:    "intermediate",
  question: "Cherry-pick a whole range of commits. Which end is excluded?",
  answer: [
    "$ git cherry-pick a1b2c3d..b7c8d9e",
    "The first is excluded and the last included, as in any two-dot range.",
    "| A ── B ── C ── D ── E",
    "|      └───────────┘",
    "|      B..E  picks C, D, E     (B excluded)",
    "|      B^..E picks B, C, D, E  (B included)"
  ],
  detail: [
    "To include the first commit too, start the range one commit earlier with",
    "`^`, which means “the parent of”: `a1b2c3d^..b7c8d9e`. The commits replay in",
    "order and can conflict partway, and `--continue`, `--skip` and `--abort`",
    "work as they do in a rebase."
  ],
  figure: [
    "A..B   everything reachable from B but not A   (A excluded)",
    "A^..B  same, plus A itself                     (A included)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "09 cherry-picking",
  level:    "intermediate",
  question: "Apply a commit’s changes to your working tree *without* committing yet?",
  answer: [
    "$ git cherry-pick -n a1b2c3d",
    "`-n` (no-commit) stages the changes and stops, so you decide how to commit."
  ],
  detail: [
    "This helps when you want part of a commit, or want to combine several picks",
    "into one commit. Pick with `-n`, unstage what you do not want with `git",
    "restore --staged`, then commit the rest with a message that fits your",
    "branch."
  ],
  figure: [
    "git cherry-pick -n a1b2c3d      changes staged, no commit",
    "git restore --staged unwanted.py  drop part of it",
    "git commit -m \"Backport overflow guard\""
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "09 cherry-picking",
  level:    "intermediate",
  question: "A cherry-pick stops on a conflict. The three ways out?",
  answer: [
    "The same three as rebase: fix and run `git cherry-pick --continue`, drop",
    "this one with `--skip`, or undo everything with `--abort`."
  ],
  detail: [
    "Conflicts are common here because the commit was written on top of different",
    "code than you are applying it to. If a pick conflicts heavily, the branches",
    "should probably be merged or rebased."
  ],
  figure: [
    "git cherry-pick --continue   resolved, go on",
    "git cherry-pick --skip       drop this one, continue the range",
    "git cherry-pick --abort      undo the whole operation"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "10 undo · reflog",
  level:    "basics",
  question: "Unstage a file but keep your edits in the working tree?",
  answer: [
    "$ git restore --staged src/runner.py"
  ],
  detail: [
    "The index goes back to matching HEAD and your edits stay on disk. Nothing is",
    "lost, so staging too much is a harmless mistake and you can use `git add .`",
    "freely."
  ],
  figure: [
    "                    restore --staged",
    "index        ◀───────────────────────  back to HEAD",
    "working tree ─────── unchanged ──────▶  your edits survive"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "doing-a-mixed-reset",
  lab:      "Stage a directory, then take one file back out"
},

{
  stage:    "10 undo · reflog",
  level:    "basics",
  question: "Throw away your uncommitted edits to one file, back to the committed version?",
  answer: [
    "$ git restore src/runner.py",
    "This destroys the edits, and you cannot undo it."
  ],
  detail: [
    "Git did not store those edits, so nothing can recover them. If you want a",
    "clean working tree and might want the work back, use `git stash -u`, and",
    "`git stash pop` brings it back."
  ],
  figure: [
    "git restore src/runner.py    one file",
    "git restore .                every tracked file, no undo",
    "git stash -u                 same clean working tree, work recoverable"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "doing-a-hard-reset"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "`restore` cleaned up the tracked files, but scratch files and build output are still there. Which command removes them, and how do you look first?",
  answer: [
    "$ git clean -nd     ← dry run: lists, deletes nothing",
    "$ git clean -fd     ← deletes"
  ],
  detail: [
    "`restore` touches only files git tracks. `-d` includes directories, `-f` is",
    "required because you cannot undo this, and `-x` also removes ignored files.",
    "Run the dry form first every time."
  ],
  figure: [
    "$ git clean -nd",
    "Would remove src/scratch.py",
    "Would remove build/",
    "",
    "-n  dry run      -d  include directories",
    "-f  do it        -x  ignored files too (usually too much)"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  lab:      "Remove untracked clutter, carefully"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "You want *one file* back as it stood three commits ago, with everything else left as it is.",
  answer: [
    "$ git restore --source=HEAD~3 src/core/runner.py",
    "This writes that one file into the working tree from the named commit. HEAD,",
    "the branch and every other file stay where they were."
  ],
  detail: [
    "Without `--source`, `git restore` takes the file from the index, which is",
    "the everyday discard. With it, any commit will do: a hash, or a form like",
    "`HEAD~3`. The default writes the working tree only, leaving the change",
    "*unstaged*, so `git diff` shows it before anything is committed. `--staged`",
    "writes the index, and `-SW` writes both. The older form is `git checkout",
    "HEAD~3 -- src/core/runner.py`, which you will see in other people's answers.",
    "The `--` there separates paths from commits, so a file named like a branch",
    "cannot confuse git."
  ],
  figure: [
    "                    --source=HEAD~3",
    "                          │",
    "  HEAD~3 ── HEAD~2 ── HEAD~1 ── HEAD      (main, unmoved)",
    "     │",
    "     └──→ one path ──→ working tree",
    "",
    "git restore --source=X file           worktree only, unstaged",
    "git restore --source=X --staged file  index only",
    "git restore --source=X -SW file       both at once"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "to-reset-or-not-to-reset",
  lab:      "Take one file back to an older commit"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "`reset --soft` vs the default (`--mixed`) vs `--hard`?",
  answer: [
    "All three move the current branch to the commit you name. **soft** stops",
    "there: the index and working tree stay as they are. **mixed** also resets",
    "the index, which unstages everything, and leaves your files alone. **hard**",
    "also rewrites your files, discarding uncommitted edits."
  ],
  detail: [
    "`--soft HEAD~3` gives a clean way to collapse three commits into one: the",
    "branch moves back, all the changes are staged, and you commit once. Only",
    "`--hard` can lose work, and only uncommitted work. The commits it moves away",
    "from stay in the reflog. All three move the branch the same way. Starting",
    "from C3, `git reset HEAD~2` in any mode gives:",
    "| C1               ← main (HEAD)",
    "|   \\",
    "|    C2 ── C3      no branch now, still in the reflog"
  ],
  figure: [
    "                 branch    index     working tree",
    "reset --soft     moves     kept      kept",
    "reset --mixed    moves     reset     kept            (default)",
    "reset --hard     moves     reset     reset"
  ],
  proGit:   "Git-Tools-Reset-Demystified",
  bottomUp: "to-reset-or-not-to-reset"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "Reset everything, tracked *and* untracked, in two commands?",
  answer: [
    "$ git reset --hard HEAD",
    "$ git clean -fd",
    "Together they leave the working tree as HEAD has it, plus any ignored files."
  ],
  detail: [
    "Nothing this pair removes can be recovered, so use an alias that asks first:",
    "the example config's `git nuke` asks before it runs, and `git nuke-preview`",
    "shows what it would delete. If you only want the work out of your way, `git",
    "stash -u` gives the same clean tree and keeps the work."
  ],
  figure: [
    "git reset --hard HEAD   tracked files back to HEAD",
    "git clean -fd           untracked files and dirs removed",
    "",
    "reversible alternative:  git stash -u"
  ],
  proGit:   "Git-Tools-Reset-Demystified",
  bottomUp: "doing-a-hard-reset"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "Your last three commits should have been one. Collapse them without an interactive rebase?",
  answer: [
    "$ git reset --soft HEAD~3",
    "$ git commit -m \"Add task queue\""
  ],
  detail: [
    "The branch moves back three commits while the index and working tree stay as",
    "they are, so all the changes are staged and ready. Only the branch name",
    "moved, and the three original commits stay in the reflog if you want them",
    "back."
  ],
  figure: [
    "before:  … ── A ── B ── C   (HEAD)",
    "",
    "reset --soft HEAD~3",
    "         … ──             (HEAD)   + all changes staged",
    "",
    "commit",
    "         … ── ABC         (HEAD)"
  ],
  proGit:   "Git-Tools-Reset-Demystified",
  bottomUp: "doing-a-soft-reset",
  lab:      "Collapse three commits into one"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "Undo a commit that colleagues have already pulled?",
  answer: [
    "$ git revert a1b2c3d",
    "This adds a new commit that reverses the old one. Existing commits stay as",
    "they are, so it is safe on shared branches.",
    "| … ── A ── B ── C ── C⁻¹",
    "|                     ↑ a new commit that reverses C;",
    "|                       C stays visible in the history"
  ],
  detail: [
    "Because it only adds, everyone else's history stays valid and a plain `git",
    "pull` brings in the undo. Reverting a merge commit needs `-m 1` to say which",
    "parent counts as the main line. Without it git cannot tell which side you",
    "want to keep."
  ],
  figure: [
    "git revert a1b2c3d            undo one commit",
    "git revert --no-edit HEAD     keep the generated message",
    "git revert -m 1 <merge-hash>  undo a merge"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  lab:      "Undo a commit by adding history, not removing it"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "`revert` vs `reset`: what is the one-line distinction?",
  answer: [
    "**Revert adds a commit. Reset moves the branch back and drops commits from",
    "it.** Use revert for anything shared and reset for commits only you have."
  ],
  detail: [
    "This is the same question as merge against rebase: does anyone else hold the",
    "hashes you are about to replace? If nothing is pushed and nobody has pulled,",
    "reset. Otherwise revert, which also leaves the original commit visible for",
    "anyone asking what happened. Here is C3 undone each way:",
    "| reset:   C1 ── C2                 ← main (HEAD)",
    "| revert:  C1 ── C2 ── C3 ── C3⁻¹   ← main (HEAD)",
    "After a reset, anyone whose clone already has C3 keeps it, and their next",
    "push puts C3 back on the server."
  ],
  figure: [
    "unpushed, nobody has it   ──▶ reset  (replaces commits)",
    "pushed, colleagues pulled ──▶ revert (adds a commit)"
  ],
  proGit:   "Git-Tools-Reset-Demystified",
  lab:      "Undo a commit by adding history, not removing it"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "What is the reflog?",
  answer: [
    "*ref* + *log*: a local record of every move of HEAD and your branches,",
    "including commits, switches, rebases and resets. It can show commits `git",
    "log` cannot. It is never pushed, and entries expire after 30 to 90 days.",
    "| git log     what you can reach from here, now",
    "| git reflog  everywhere HEAD has been, including",
    "|             commits a rebase or reset left with no branch"
  ],
  detail: [
    "`git log` follows parents, so it shows only what you can reach from where",
    "you are now. The reflog lists where HEAD has been, in order. A server's",
    "repository usually keeps no reflog, so a force-push there is harder to undo",
    "than a local mistake."
  ],
  figure: [
    "$ git reflog",
    "5e6f7a8 HEAD@{0}: rebase -i (finish): returning to feature/task-queue",
    "2b3c4d5 HEAD@{1}: rebase -i (fixup): Add queue skeleton",
    "9c8b7a6 HEAD@{2}: commit: Add overflow counter   ← the one you want",
    "f2a3b4c HEAD@{3}: checkout: moving from main to feature"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "A hard reset went to the wrong place. The recovery sequence?",
  answer: [
    "$ git reflog",
    "$ git reset --hard HEAD@{2}",
    "Find the entry from before the mistake and reset to it. `HEAD@{n}` means",
    "where HEAD was *n* moves ago."
  ],
  detail: [
    "The same steps recover a bad rebase or a wrong amend: anything that moved",
    "your current branch and left the commits in place. For a branch deleted with",
    "`-D`, use the next card, because a reset would move the branch you are on.",
    "These steps cannot recover uncommitted work: the reflog records only",
    "commits."
  ],
  figure: [
    "recoverable    : bad reset · bad rebase · wrong amend",
    "deleted branch : git branch <name> <hash>, on the next card",
    "not recoverable: uncommitted edits discarded by restore",
    "                 or reset --hard"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  bottomUp: "doing-a-hard-reset"
},

{
  stage:    "10 undo · reflog",
  level:    "intermediate",
  question: "You deleted a branch with `-D` and now want it back. Two steps?",
  answer: [
    "$ git reflog",
    "$ git branch feature/task-queue 5e6f7a8",
    "Find the tip commit in the reflog, then create a new branch on it."
  ],
  detail: [
    "Deleting a branch removes only a small file. The commits stay until *garbage",
    "collection*, git's periodic clean-up of commits nothing refers to, which",
    "spares them for about thirty days. `git branch <name> <hash>` creates a",
    "branch at any commit without switching to it."
  ],
  figure: [
    "git reflog                       find the old tip",
    "git branch <name> <hash>         create the branch, stay where you are",
    "git switch -c <name> <hash>      create it and switch to it"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery"
},

{
  stage:    "10 undo · reflog",
  question: "What is `ORIG_HEAD`, and when does it save you?",
  answer: [
    "A name git sets to your previous position before any big change: merge,",
    "rebase, reset, pull. `git reset --hard ORIG_HEAD` undoes the last one."
  ],
  detail: [
    "It is a one-slot shortcut for the reflog: quicker to type when the very last",
    "operation was the mistake, and useless once a second one has overwritten it.",
    "It is also the fallback when `git merge --abort` refuses because git cannot",
    "rebuild the earlier state. After `git merge dev`, `ORIG_HEAD` points at C3,",
    "where `main` was before the merge:",
    "| C1 ── C2 ── C3 ── M     ← main (HEAD)",
    "|         \\         │",
    "|          D1 ──────┘     ← dev",
    "`git reset --hard ORIG_HEAD` moves `main` back to C3. The reset sets",
    "`ORIG_HEAD` too, to M, so running the same command again brings the merge",
    "back."
  ],
  figure: [
    "git merge dev",
    "git reset --hard ORIG_HEAD     undo that merge",
    "",
    "set by: merge · rebase · reset · pull",
    "holds only ONE position; the reflog holds the rest"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  lab:      "Decide the winner before the merge starts"
},

{
  stage:    "11 remotes & server",
  level:    "intermediate",
  question: "You ran `init`, added the remote, and `git branch -u origin/main` failed: “no commit on branch 'main' yet.” Why, and what is the right tool?",
  answer: [
    "`init` does not create the branch until the first commit. Until then it is",
    "*unborn*, so there is nothing to give an upstream. For a project that",
    "already exists on a server, use `git clone`. If local files must survive,",
    "run `git fetch` and then `git switch -c main --track origin/main`."
  ],
  detail: [
    "A plain `git pull` in the same state fails too: it fetches, then says “There",
    "is no tracking information for the current branch.” `clone` does in one step",
    "what `init`, `remote add` and `pull` were trying to do. `init` is for",
    "starting something new."
  ],
  figure: [
    "git clone <url>              ← the project already exists",
    "",
    "git init  +  remote add  +  fetch  +  switch -c main --track origin/main",
    "     ↑ the same result, and your local files stay"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository",
  lab:      "Clone it as if you were someone else"
},

{
  stage:    "11 remotes & server",
  level:    "intermediate",
  question: "“fatal: refusing to merge unrelated histories”: what happened, and what are the two ways out?",
  answer: [
    "Your branch and the remote's share no common ancestor. They are two",
    "histories that began separately, the usual result of committing after `init`",
    "and then pulling. You can force it with `--allow-unrelated-histories`.",
    "Usually it is better to start again with `clone`."
  ],
  detail: [
    "Git refuses because this is nearly always a mistake. A merge with no shared",
    "ancestor has nothing to compare against, so every file that differs between",
    "the two sides conflicts. Forcing it leaves a repository with two root",
    "commits (commits with no parent), which stays visible in every graph:",
    "| L1 ── L2 ──────── M    ← main (HEAD)",
    "|                   │",
    "| R1 ── R2 ── R3 ───┘    ← origin/main"
  ],
  figure: [
    "local :  L1 ── L2            two roots,",
    "remote:  R1 ── R2 ── R3      no common ancestor",
    "",
    "git pull --no-rebase --allow-unrelated-histories origin main   forces it",
    "cd .. && rm -rf <dir> && git clone <url>                       usually better"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository"
},

{
  stage:    "11 remotes & server",
  question: "Create a repository on the server that accepts pushes. Why does it have to be this kind?",
  answer: [
    "$ git init --bare -b main taskrunner.git",
    "*Bare* means the repository has no working tree. Git refuses a push to a",
    "branch that is checked out, and a bare repository has nothing checked out."
  ],
  detail: [
    "The command creates the directory itself, so skip `mkdir`, and run it from",
    "the folder that should hold it: inside another repository it nests a new",
    "repository there. The `.git` suffix is a convention, and it must match the",
    "path in your remote URL. `-b main` sets the branch the repository's HEAD",
    "names, and a later `clone` checks out that branch. If it is left unset, a",
    "clone can end up on a default branch nobody ever pushed."
  ],
  figure: [
    "taskrunner.git/",
    "├── HEAD",
    "├── config",
    "├── objects/",
    "└── refs/          ← no working tree",
    "",
    "normal repo = working tree + .git/",
    "bare repo   = the contents of .git/, and nothing else"
  ],
  proGit:   "Git-on-the-Server-Getting-Git-on-a-Server",
  lab:      "Make a \"server\" on your own machine"
},

{
  stage:    "11 remotes & server",
  level:    "intermediate",
  question: "See which refs the remote has, without fetching anything?",
  answer: [
    "$ git ls-remote origin",
    "Use it first for any confusion about a remote: is it empty? Is the branch",
    "named `master`, the older common name for a first branch? Is it the wrong",
    "repository?"
  ],
  detail: [
    "It asks the server for its list of refs and prints it. Nothing is downloaded",
    "and nothing in your repository changes. Empty output means the remote has no",
    "commits, a `refs/heads/master` line means your `main` has no counterpart",
    "there, and an SSH error means the problem is logging in and has nothing to",
    "do with git."
  ],
  figure: [
    "$ git ls-remote origin",
    "a1b2c3d…    HEAD",
    "a1b2c3d…    refs/heads/main",
    "f4e5d6c…    refs/heads/dev",
    "",
    "empty output ⇒ remote has no commits yet"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Connect and make the first push"
},

{
  stage:    "11 remotes & server",
  level:    "basics",
  question: "The host you push to has moved, or the login name on it changed. Repoint the remote without re-cloning?",
  answer: [
    "$ git remote set-url origin git@newhost.example.com:repos/taskrunner.git"
  ],
  detail: [
    "The URL is a config value and your history does not depend on it, so",
    "switching between HTTPS (an `https://…` address) and SSH (`git@host:path`),",
    "or between servers, is a one-line change. Check with `git remote -v`: a typo",
    "shows up only at the next push, as a confusing login or path error."
  ],
  figure: [
    "git remote set-url origin git@github.com:yourname/taskrunner.git   HTTPS → SSH",
    "git remote -v                                                    verify",
    "git remote rename origin backup                                  rename"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "11 remotes & server",
  level:    "intermediate",
  question: "The feature is merged. Delete the branch on the remote as well as locally?",
  answer: [
    "$ git branch -d feature/task-queue",
    "$ git push origin --delete feature/task-queue"
  ],
  detail: [
    "Each deletion affects one side only, because they are separate refs.",
    "Everyone else keeps an old `origin/feature/task-queue` until they fetch with",
    "pruning, which `fetch.prune=true` makes automatic."
  ],
  figure: [
    "git branch -d feature/task-queue             local branch",
    "git push origin --delete feature/task-queue  branch on the server",
    "git fetch --prune                      drop origin/* names for deleted branches",
    "",
    "git config --global fetch.prune true   make it automatic"
  ],
  proGit:   "Git-Branching-Remote-Branches",
  lab:      "Tidy up the server"
},

{
  stage:    "11 remotes & server",
  level:    "basics",
  question: "Update your record of every remote in one command, dropping branches their servers have deleted?",
  answer: [
    "$ git fetch --all --prune",
    "This asks every configured remote and deletes remote-tracking branches whose",
    "server branch is gone."
  ],
  detail: [
    "`--all` covers every remote in your config, while a plain `fetch` asks only",
    "the current branch's remote. A plain `fetch` does not delete those names, so",
    "without `--prune` the list only grows. Your local branches are not touched",
    "and nothing is merged, so this is always safe to run."
  ],
  figure: [
    "git fetch                  the current branch's remote (usually origin)",
    "git fetch --all            every remote in .git/config",
    "git fetch --all --prune    and drop branches deleted on the server",
    "",
    "changes origin/* and backup/*, never your local branches"
  ],
  proGit:   "Git-Basics-Working-with-Remotes",
  lab:      "Tidy up the server"
},

{
  stage:    "12 ssh & auth",
  level:    "intermediate",
  question: "Generate a new SSH key with a meaningful filename rather than the default?",
  answer: [
    "$ ssh-keygen -t ed25519 -C \"github-personal\" -f ~/.ssh/github_personal",
    "Two files appear: the private key, which stays on your machine, and the",
    "public key, with `.pub` added, which you give to the server. SSH logs you in",
    "using the pair."
  ],
  detail: [
    "Ed25519 is the modern default: its keys are short and secure. Prefer it over",
    "RSA unless an old server refuses it. Set a passphrase: without one, anyone",
    "who can read your disk can use the key file."
  ],
  figure: [
    "-t ed25519   algorithm",
    "-C \"label\"   comment, cosmetic only",
    "-f <path>    filename",
    "",
    "~/.ssh/github_personal       private: never leaves the machine",
    "~/.ssh/github_personal.pub   public: safe to share"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  level:    "intermediate",
  question: "Two machines, and you can't tell whether they share a key. What identifies a key?",
  answer: [
    "The **fingerprint**. The comment at the end of the key (`you@old-laptop`) is",
    "a label set when the key was made, and SSH ignores it when you log in.",
    "$ ssh-keygen -lf ~/.ssh/github_personal.pub"
  ],
  detail: [
    "A key copied through several laptop migrations still has the hostname it",
    "started with, so the comment often names a machine you no longer own.",
    "Compare fingerprints on both ends, locally and against the server's",
    "`authorized_keys`, its list of allowed public keys."
  ],
  figure: [
    "ssh-keygen -lf ~/.ssh/id_ed25519.pub          your fingerprint",
    "ssh git@example.com 'ssh-keygen -lf ~/.ssh/authorized_keys'",
    "",
    "ssh -v git@github.com 2>&1 | grep -i 'offering\\|accepted'",
    "    ↑ which key file the server accepted"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  level:    "intermediate",
  question: "You made a key with a custom name and the server still refuses you. What’s missing?",
  answer: [
    "By itself SSH only tries default filenames. A custom name needs a `Host`",
    "block in `~/.ssh/config` that names it."
  ],
  detail: [
    "Once the block exists, plain `ssh github.com` and every git operation",
    "against that host use the key you named. SSH refuses to read a config that",
    "other accounts can write, and says so with `Bad owner or permissions`.",
    "Others reading it is fine. How you remove that write access depends on the",
    "system: Unix uses permission bits and Windows uses the file's ACL (access",
    "control list)."
  ],
  figure: [
    "Host github.com",
    "    HostName github.com",
    "    User git",
    "    IdentityFile ~/.ssh/github_personal",
    "    IdentitiesOnly yes",
    "",
    "~/.ssh/config must be yours, and not writable by anyone else"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  level:    "intermediate",
  question: "What does `IdentitiesOnly yes` do on a machine with several keys?",
  answer: [
    "It limits SSH to the key named in that block. Without it SSH offers every",
    "key it can find, in its own order, so a work key may reach a personal",
    "account first."
  ],
  detail: [
    "A server identifies you by the first key it accepts. On a host with two",
    "accounts, offering the wrong key first can log you in as the wrong person,",
    "with no error to explain why."
  ],
  figure: [
    "Host github.com          → personal key only",
    "    IdentityFile ~/.ssh/github_personal",
    "    IdentitiesOnly yes",
    "",
    "Host github-work         → work key only, same real host",
    "    HostName github.com",
    "    IdentityFile ~/.ssh/github_work",
    "    IdentitiesOnly yes",
    "",
    "clone with: git@github-work:org/repo.git"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  level:    "intermediate",
  question: "Stop being asked for the key passphrase on every single push?",
  answer: [
    "Give the decrypted key to an **agent**, a background program that holds it.",
    "`AddKeysToAgent yes` in `~/.ssh/config` adds it on first use, so you type",
    "the passphrase once each time the agent starts and not once per push.",
    "$ ssh-add -l      what the agent is holding right now"
  ],
  detail: [
    "The option is ignored without warning when no agent is running: an unset",
    "`SSH_AUTH_SOCK` brings back the prompt with nothing on screen to explain it,",
    "so check `ssh-add -l` first. The systems differ in how long the agent lasts.",
    "macOS can keep the passphrase in the login Keychain. The flag for that",
    "exists only in Apple's build: a Homebrew or Nix OpenSSH earlier in `PATH`",
    "rejects it, and spelling out `/usr/bin/ssh-add` gets around that. Linux",
    "leaves the agent to the desktop session, where GNOME Keyring or KWallet asks",
    "once per login. Windows ships the agent as a service that stays disabled",
    "until you turn it on. After that it holds keys in your account and survives",
    "a reboot. `AddKeysToAgent 8h` is a middle setting, if you do not want a key",
    "held indefinitely."
  ],
  figure: [
    "~/.ssh/config: same on every system",
    "Host *",
    "    AddKeysToAgent yes",
    "",
    "macOS    ssh-add --apple-use-keychain ~/.ssh/github_personal",
    "         Apple's build only; otherwise /usr/bin/ssh-add",
    "Linux    the desktop session supplies the agent; the keyring",
    "         asks once per login",
    "Windows  in PowerShell as administrator, once:",
    "         Get-Service ssh-agent | Set-Service -StartupType Automatic",
    "         Start-Service ssh-agent"
  ],
  proGit:   "Git-Tools-Credential-Storage"
},

{
  stage:    "12 ssh & auth",
  level:    "basics",
  question: "Confirm SSH access to GitHub works, before touching any repository?",
  answer: [
    "$ ssh -T git@github.com",
    "*SSH* is how git logs in to a server, using a key file on your machine.",
    "First make a key with `ssh-keygen` and add its public half, the `.pub` file,",
    "to your GitHub account. A greeting with your account name means success, and",
    "the “no shell access” line is expected."
  ],
  detail: [
    "Testing SSH alone tells you whether a failed push is a login problem or a",
    "git problem. Add `-v` and the output names each key file offered and which",
    "one the server accepted."
  ],
  figure: [
    "$ ssh -T git@github.com",
    "Hi yourname! You've successfully authenticated, but GitHub",
    "does not provide shell access.        ← this IS success",
    "",
    "$ ssh -T git@example.com exit   ← same test, your server"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  level:    "basics",
  question: "GitHub answers a pull with “Password authentication is not supported.” What broke, and the two fixes?",
  answer: [
    "GitHub removed passwords for git operations in 2021. Either switch the",
    "remote to SSH, or create a Personal Access Token on GitHub and use it in",
    "place of the password over HTTPS."
  ],
  detail: [
    "SSH needs less upkeep for personal repositories, since you set up a key",
    "once. Tokens make sense when a network policy forces HTTPS, and they expire",
    "on whatever schedule you chose."
  ],
  figure: [
    "SSH  (recommended)",
    "  git remote set-url origin git@github.com:yourname/taskrunner.git",
    "",
    "HTTPS + token",
    "  Username: yourname",
    "  Password: <the PAT, not your account password>"
  ],
  proGit:   "Git-Tools-Credential-Storage"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Where does the global gitconfig live on Windows, and what command finds it on any OS?",
  answer: [
    "`%USERPROFILE%\\.gitconfig`, and `~/.gitconfig` on macOS and Linux. You do",
    "not have to look for it:",
    "$ git config --global --edit",
    "This opens the right file wherever you are."
  ],
  detail: [
    "Four layers stack, each overriding the one before: system, global, local,",
    "worktree. The last holds settings for one extra working tree attached to the",
    "repository, and is rarely used. When a setting misbehaves, `git config",
    "--list --show-origin` prints every value with the file it came from, which",
    "usually shows a local override you forgot."
  ],
  figure: [
    "git config --global --edit        open the right file, any OS",
    "git config --list --show-origin   which file set each value",
    "",
    "system → global → local → worktree      (later wins)"
  ],
  proGit:   "Customizing-Git-Git-Configuration"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "A config setting has a value you did not expect. Which command shows where every value came from?",
  answer: [
    "$ git config --list --show-origin",
    "Four layers stack (system, global, local, worktree), and the later one wins."
  ],
  detail: [
    "The cause is usually a local `.git/config` override set months ago and",
    "forgotten. Add `--get` with a key name to check a single setting."
  ],
  figure: [
    "system    /etc/gitconfig          lowest",
    "global    ~/.gitconfig               ↓",
    "local     .git/config                ↓",
    "worktree  .git/config.worktree    highest",
    "",
    "git config --get --show-origin pull.rebase"
  ],
  proGit:   "Customizing-Git-Git-Configuration",
  lab:      "Set an identity for this repository only"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "`git log --since=2 weeks ago` → “fatal: ambiguous argument 'weeks'”. What went wrong?",
  answer: [
    "The shell split the unquoted value into three arguments before git saw it.",
    "Quote it, `--since=\"2 weeks ago\"`, or use the form with dots and no spaces:",
    "`--since=2.weeks`."
  ],
  detail: [
    "Git accepts many date formats, such as relative phrases, named days and ISO",
    "dates, but each has to arrive as one argument. ISO-8601 (`2026-04-01`) is",
    "unambiguous. Dates with slashes depend on locale, so avoid them."
  ],
  figure: [
    "--since=\"2 weeks ago\"     quoted",
    "--since=2.weeks           dot form, no quoting needed",
    "--since=2026-04-01        ISO, unambiguous",
    "--since=04/01/2026        ambiguous: avoid"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Show the commits that are on `dev` but not yet on `main`?",
  answer: [
    "$ git log main..dev --oneline",
    "Two dots: “reachable from the second, not from the first”."
  ],
  detail: [
    "The same syntax answers everyday questions: `main..HEAD` is what your branch",
    "adds, and `HEAD..origin/main` is what is waiting to arrive. Three dots give",
    "the symmetric form: commits on *either* side but not both, which shows how",
    "far two branches have diverged."
  ],
  figure: [
    "        ┌── D1 ── D2 ── D3      (dev)",
    "A ── B ─┤",
    "        └──                     (main)",
    "",
    "git log main..dev   →  D1 D2 D3",
    "git log main...dev  →  both sides' unique commits"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Let main run ahead of the release"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Find the commit where `feature/task-queue` split off from `main`?",
  answer: [
    "$ git merge-base main feature/task-queue",
    "It prints the newest commit the two histories share: the merge base, which",
    "is usually where the branch split off."
  ],
  detail: [
    "History does not record where a branch was created, because a branch is a",
    "name and commits do not record names. So git answers a question it can",
    "compute: the newest commit reachable from both sides. That matches the",
    "starting point until a merge or a rebase moves it. The creation itself is",
    "recorded only locally: the oldest entry of `git reflog show",
    "feature/task-queue` reads “branch: Created from …”, and it expires with the",
    "rest of the reflog after about 90 days."
  ],
  figure: [
    "              E ── F   (feature/task-queue)",
    "             /",
    "A ── B ── C ── D      (main)",
    "          ↑",
    "          git merge-base main feature/task-queue",
    "",
    "git log main..feature/task-queue --oneline | tail -1   its first own commit",
    "git reflog show feature/task-queue                     the creation, recorded"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Count what the branch would add"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "`git log main...dev` and `git diff main...dev` both take three dots. Do they ask the same question?",
  answer: [
    "No. `log` lists the commits unique to either side. `diff` shows what `dev`",
    "changed since it left `main`, measured from their merge base, and ignores",
    "whatever `main` did meanwhile.",
    "| log   main...dev   commits on either side, not on both",
    "| diff  main...dev   merge base → dev: dev's own work"
  ],
  detail: [
    "A *pull request*, a hosting site's request to merge a branch after review,",
    "shows this three-dot diff, so the review covers the branch's own work. It",
    "has one blind spot: a change both branches already hold, such as a fix",
    "copied with `cherry-pick`. The merge base predates the copy, so the",
    "three-dot diff still lists the change. `git diff main dev`, with a space or",
    "two dots, compares the two tips as they stand: `dev`'s work, plus whatever",
    "`main` did meanwhile shown as undone. A change both sides hold does not",
    "appear in this diff, while the three-dot form still lists it."
  ],
  figure: [
    "        ┌── D1 ── D2      (dev)",
    "A ── B ─┤",
    "        └── M1            (main)",
    "",
    "git log  main...dev    D1 D2 M1    unique to either side",
    "git diff main...dev    B → D2      what dev changed",
    "git diff main dev      M1 → D2     dev's work, and M1 undone"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  lab:      "Ask what the next promotion really brings"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Hide merge commits from a log; show *only* the merges?",
  answer: [
    "`--no-merges` and `--merges`. The second is a quick “what came in this week”",
    "on a busy branch."
  ],
  detail: [
    "A third option often beats both when every feature arrives as a merge:",
    "`--first-parent` follows only the branch the merges went into, so each",
    "merged branch appears as one entry. Thousands of commits become a readable",
    "list."
  ],
  figure: [
    "--no-merges              hide merge commits",
    "--merges                 only merge commits",
    "--first-parent main      one entry per merge, inner commits hidden"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Read a busy trunk as a list of merges, hiding the commits inside each merged branch?",
  answer: [
    "$ git log --first-parent main --oneline",
    "This follows only each merge's first parent."
  ],
  detail: [
    "A merge commit's first parent is the branch you were on, so following it",
    "reduces each merged branch to a single entry. On a trunk with thousands of",
    "commits, that gives you a readable weekly summary. Here two branches were",
    "merged into `main`:",
    "| C1 ── M1 ──────── M2    ← main",
    "|   \\   │ \\         │",
    "|    A1─┘  B1 ── B2─┘",
    "`--first-parent` lists M2, M1 and C1, so each merged branch shows up once,",
    "as its merge commit, and A1, B1 and B2 are left out."
  ],
  figure: [
    "full log        every commit from every merged branch",
    "--first-parent  one entry per merge",
    "",
    "git log --first-parent main --since=2.weeks --oneline"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Limit a log to commits touching one directory?",
  answer: [
    "Everything after `--` is a *pathspec*, a pattern that selects files:",
    "$ git log --oneline -- src/core/",
    "On a large repository this cuts the log down to what you care about."
  ],
  detail: [
    "The `--` separates paths from branch names, since a directory and a branch",
    "can share a name. Pathspecs also take wildcards and exclusions:",
    "`:(exclude)vendor/` drops a noisy directory. The same syntax works with",
    "`diff`, `add` and `status`."
  ],
  figure: [
    "git log -- src/core/                       one directory",
    "git log -- '*.py'                        by extension",
    "git log -- . ':(exclude)vendor/'          everything but vendor",
    "git log --follow -- src/core/runner.py      follow across renames"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  lab:      "Take one file back to an older commit"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "One line in a file makes no sense to you. Who wrote it, when, and in which commit?",
  answer: [
    "$ git blame -L 40,60 src/core/runner.py",
    "Each line is prefixed with the commit that last touched it, its author and",
    "its date. `-L` limits the range, since you rarely need the whole file."
  ],
  detail: [
    "*Blame* names the *last* commit to touch the line, which is often a reformat",
    "and not the decision you are looking for. To step past it, blame the parent,",
    "`git blame <hash>^ -- <file>`, and read the same range again. A repository",
    "that ran a formatter over everything can list those commits in a file and",
    "have blame skip them: `git config blame.ignoreRevsFile",
    ".git-blame-ignore-revs`. GitHub and GitLab use the same file in their blame",
    "views."
  ],
  figure: [
    "git blame -L 40,60 file       just that range",
    "git blame <hash>^ -- file     the file before that commit touched it",
    "git blame -w file             ignore whitespace-only changes",
    "git blame -C file             follow lines moved in from other files",
    "",
    ".git-blame-ignore-revs        the formatting commits to skip"
  ],
  proGit:   "Git-Tools-Debugging-with-Git",
  lab:      "Trace one line back, and one value that vanished"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "A constant named `QUEUE_DEPTH` is gone from the codebase. Which commit deleted it?",
  answer: [
    "$ git log -S QUEUE_DEPTH --oneline",
    "It lists each commit that changed how many times that text appears: the one",
    "that added it and the one that removed it."
  ],
  detail: [
    "Blame cannot answer this: it reports lines the file still has, and this line",
    "is gone. `-S`, nicknamed the *pickaxe*, searches the diffs, across every",
    "file and the whole history, so it needs no path. `-S` counts occurrences, so",
    "an edit that keeps the count the same does not match. `-G` takes a regular",
    "expression and matches any commit whose diff adds or removes a line that",
    "fits it, which catches that edit. Add `-p` to either to see the diffs. Two",
    "cases return nothing, and neither is an error. Adding a path turns on",
    "*history simplification*, which can hide the side branch the string was on,",
    "and `--full-history` brings it back. Merge commits are not diffed by",
    "default, so a value deleted *while resolving a merge* needs `-m`."
  ],
  figure: [
    "git log -S QUEUE_DEPTH          count of the text changed",
    "git log -G 'QUEUE_.*'           regular expression, any line touched",
    "git log -S QUEUE_DEPTH -p       and show the diffs",
    "",
    "blame    → lines that are still there",
    "pickaxe  → lines that are gone",
    "",
    "-S 'X' -- path                  can find NOTHING: the branch was simplified",
    "-S 'X' --full-history -- path   the branch is back",
    "-S 'X' -m                       and merge diffs are searched too"
  ],
  proGit:   "Git-Tools-Searching",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Trace one line back, and one value that vanished"
},

{
  stage:    "13 daily practice",
  level:    "intermediate",
  question: "Monday morning, and you have to say what you did last week. Ask git.",
  answer: [
    "$ git log --since=1.week --author=you --oneline",
    "The command combines two filters: a time window and a person. Both narrow",
    "the list a bare `git log` would print."
  ],
  detail: [
    "`--since` and `--until` take the same date formats, such as `2.weeks`,",
    "`\"last monday\"` and `2026-04-01`, and bound the window from either end, so",
    "`--since=2.weeks --until=1.week` is the week before last. They filter on the",
    "committer date, and a rebase resets the committer date. So work written a",
    "month ago and rebased yesterday counts as yesterday's here. To compare,",
    "`--pretty=format:\"%h %ad %cd %s\" --date=short` prints both dates side by",
    "side."
  ],
  figure: [
    "--since=1.week                  the last seven days",
    "--until=2026-04-01              up to a fixed date",
    "--since=2.weeks --until=1.week  the week before last",
    "",
    "--author=name     who wrote it          (author date)",
    "--committer=name  who made the commit   (committer date, what --since reads)"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "14 gotchas",
  level:    "intermediate",
  question: "The rebase succeeded and `git diff` is clean, but your editor still shows the old file. What happened?",
  answer: [
    "Your editor still has the old version in memory. Git changed the file on",
    "disk, and your editor has not reloaded it."
  ],
  detail: [
    "After any command that changes files (switch, rebase, merge, reset, pull),",
    "assume open editor tabs are out of date. Saving from one writes the old",
    "content back over what git just produced."
  ],
  figure: [
    "confirm the disk is right:",
    "  git status --porcelain -- path/to/file",
    "  no output ⇒ disk matches git, so the editor is out of date",
    "",
    "reload:  VS Code \"Revert File\" · vim :e!",
    "         JetBrains \"Reload from Disk\""
  ],
  proGit:   "Appendix-A:-Git-in-Other-Environments-Graphical-Interfaces"
},

{
  stage:    "14 gotchas",
  level:    "intermediate",
  question: "In Eclipse you pressed F5 and the sources are *still* stale. Why isn’t a refresh enough?",
  answer: [
    "F5 refreshes only the workspace's filesystem model, one of four cache",
    "layers. Open editor buffers and build indexes are not updated."
  ],
  detail: [
    "Work through them in order: close and reopen the affected editors, then",
    "`Project → Clean`, then restart Eclipse. Running git from a terminal,",
    "outside EGit, leaves one less cache to clear."
  ],
  figure: [
    "1  filesystem          ← correct after the git command",
    "2  workspace model      ← F5 refreshes this",
    "3  open editor buffers  ← close & reopen",
    "4  build index / model  ← Project > Clean"
  ],
  proGit:   "Appendix-A:-Git-in-Other-Environments-Graphical-Interfaces"
},

{
  stage:    "14 gotchas",
  level:    "basics",
  question: "`git status` says “HEAD detached at a1b2c3d”. What does that mean, and what should you do before committing?",
  answer: [
    "HEAD points straight at a commit with no branch, so new commits would belong",
    "to no branch. Create one first, and your uncommitted changes come along:",
    "$ git switch -c feature/whatever"
  ],
  detail: [
    "You get here by moving onto a commit in place of a branch, as `git switch",
    "--detach a1b2c3d` does. If you already committed while detached, the commits",
    "are safe for now. While still detached, `git switch -c <name>` puts those",
    "commits on the new branch. If you have since switched away, `git reflog`",
    "plus `git branch <name> <hash>` rescues them before git's automatic clean-up",
    "removes them. With HEAD detached at C2, it points at a commit and at no",
    "branch:",
    "| C1 ── C2 ── C3     ← main",
    "|       ↑",
    "|       HEAD",
    "A new commit then moves only HEAD:",
    "| C1 ── C2 ── C3     ← main",
    "|         \\",
    "|          X1        ← HEAD",
    "If you switch away before running `switch -c`, no branch points at X1, and",
    "the reflog is the only way back to it."
  ],
  figure: [
    "On branch feature, behind by 3   ← harmless: just out of date",
    "HEAD detached at a1b2c3d         ← create a branch before committing",
    "",
    "already committed and switched away:",
    "  git reflog → git branch <name> <hash>"
  ],
  proGit:   "Git-Internals-Git-References"
},

{
  stage:    "14 gotchas",
  level:    "intermediate",
  question: "You committed inside a submodule and the commits later vanished. Why?",
  answer: [
    "A *submodule* is a repository nested inside another, pinned to one commit.",
    "It checks out that commit with a *detached HEAD* by default, so your commits",
    "belonged to no branch and were eventually cleaned up."
  ],
  detail: [
    "Switch to a branch inside the submodule before committing. The parent",
    "repository records one specific hash, so push the submodule's commits to",
    "their own remote before pushing the parent. Otherwise anyone pulling the",
    "parent gets a hash that exists only on your machine."
  ],
  figure: [
    "cd submodules/foo",
    "git switch main          ← attach before committing",
    "git commit … && git push  ← push the submodule FIRST",
    "cd ../..",
    "git add submodules/foo && git commit && git push",
    "",
    "git config --global push.recurseSubmodules check"
  ],
  proGit:   "Git-Tools-Submodules"
},

{
  stage:    "14 gotchas",
  level:    "intermediate",
  question: "`--since` combined with `--graph --all` returns a set that looks arbitrary. What is going on?",
  answer: [
    "`--since` cuts the walk short: git follows parents from each starting point",
    "and stops on a line when it reaches an older commit. `--all` starts from",
    "every ref, and old branches stop immediately."
  ],
  detail: [
    "The results are correct but look wrong. `--graph` adds to the confusion by",
    "connecting each commit to its nearest shown ancestor, so its lines do not",
    "always match real parents. Nothing in the repository changes. To debug,",
    "start from a bare `git log --since=…` and add the display flags back one at",
    "a time."
  ],
  figure: [
    "git log --since=2.weeks                       clean, walks HEAD",
    "git log --since=2.weeks --all --graph         looks arbitrary",
    "",
    "tame it:  --simplify-by-decoration   or   --first-parent"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "14 gotchas",
  question: "A branch is a ref under `refs/heads/`. What else can live under `refs/`, and what does git do with a folder it has no command for?",
  answer: [
    "Any folder name is allowed, and the folder decides which commands see a ref:",
    "`heads/` for `git branch`, `tags/` for `git tag` (stage 15), `remotes/` for",
    "`git branch -r`. A ref in any other folder still keeps its commits alive,",
    "but no everyday command shows it. To see it, ask git for every ref:",
    "$ git for-each-ref --format='%(refname)'",
    "$ git log --oneline --graph --all"
  ],
  detail: [
    "Git itself keeps refs outside those folders too: `refs/stash` points at your",
    "newest stash, and `refs/notes/commits` holds your notes, which are text",
    "attached to commits. Other programs add folders of their own. GitHub keeps",
    "every pull request as `refs/pull/<n>/head`, and some AI agents in editors",
    "keep one checkpoint commit per chat turn under refs such as",
    "`refs/agents/<session>/checkpoints/turn/<n>`. A program keeps its commits",
    "under refs because garbage collection deletes commits that nothing reaches.",
    "Neither push nor clone copies these refs by default, though `git push",
    "--mirror` does."
  ],
  figure: [
    "$ git for-each-ref --format='%(refname)'",
    "refs/agents/demo/checkpoints/turn/0   ← no everyday command shows it",
    "refs/heads/main                       ← git branch",
    "refs/heads/release",
    "refs/notes/commits                    ← git notes list",
    "refs/remotes/origin/main              ← git branch -r",
    "refs/stash                            ← git stash list",
    "refs/tags/v0.1.0                      ← git tag"
  ],
  proGit:   "Git-Internals-Git-References",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Leave commits where no branch command looks"
},

{
  stage:    "14 gotchas",
  level:    "intermediate",
  question: "`git lg` suddenly draws dozens of commits that sit on no branch, and `git branch` lists nothing new. Where do they come from?",
  answer: [
    "From refs in a folder of their own. `--all` starts at every ref under",
    "`refs/`, including ones that are not branches, and some program has started",
    "keeping commits there. Count the refs per folder, then leave the new folder",
    "out, with the exclusion written before `--all`:",
    "$ git for-each-ref --format='%(refname)' | cut -d/ -f1-2 | sort | uniq -c",
    "$ git log --oneline --graph --exclude='refs/agents/*' --all"
  ],
  detail: [
    "A common source is an AI agent in the editor that keeps one checkpoint",
    "commit per chat turn, under refs such as",
    "`refs/agents/<session>/checkpoints/turn/<n>`. The graph draws them with",
    "no label because `--decorate` names only HEAD, branches, remote branches,",
    "tags and the stash; add `--clear-decorations` to see every name. Three",
    "mistakes break the filter: an `--exclude` written after `--all` excludes",
    "nothing, `refs/agents` without the `/*` matches nothing, and zsh stops",
    "at an unquoted `*` with `no matches found`. Quote it at the prompt; an",
    "alias needs no quotes. To keep out folders that do not exist yet, name",
    "what to show instead: `--branches --remotes --tags HEAD`."
  ],
  figure: [
    "git log --exclude='refs/agents/*' --all     one folder out",
    "git log --branches --remotes --tags HEAD    only these in",
    "",
    "git log --all --exclude='refs/agents/*'     excludes nothing",
    "git log --exclude=refs/agents --all         excludes nothing"
  ],
  proGit:   "Git-Internals-Git-References"
},

{
  stage:    "14 gotchas",
  question: "Delete every ref under `refs/agents/` in one command. When are the commits they held gone?",
  answer: [
    "Have `for-each-ref` print one delete instruction per ref, and let",
    "`update-ref` apply them all together:",
    "$ git for-each-ref --format='delete %(refname)' refs/agents | git update-ref --stdin",
    "The commits stay stored until a garbage collection finds them unreachable",
    "and older than its grace period, two weeks by default."
  ],
  detail: [
    "A deleted branch's commits usually remain in the HEAD reflog for thirty",
    "days, because you made them while on the branch. A program's checkpoints did",
    "not move HEAD, and a ref in a program's own folder gets no reflog by",
    "default. So the delete leaves them unreachable at once, protected only by",
    "the grace period. `git gc --prune=now` skips it. Close the program that",
    "wrote the refs first: it may be writing objects at that moment, and anything",
    "it meant to restore from those refs goes with them."
  ],
  figure: [
    "$ git cat-file -t 5f7e4d2     ← a checkpoint whose ref is gone",
    "commit",
    "$ git gc --prune=now",
    "$ git cat-file -t 5f7e4d2",
    "fatal: Not a valid object name 5f7e4d2"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  lab:      "Delete the folder, and watch the commits outlive it"
},

{
  stage:    "14 gotchas",
  question: "`git fetch` suddenly fails with “some local refs could not be updated”, and names a branch you have not used. What broke?",
  answer: [
    "A branch name was reused with a slash in it: `hotfix` was deleted on the",
    "server and `hotfix/typo` pushed in its place. Your old `origin/hotfix`",
    "blocks the new name, and one blocked ref fails the whole fetch. Delete the",
    "old ref, then fetch again:",
    "$ git update-ref -d refs/remotes/origin/hotfix",
    "$ git fetch"
  ],
  detail: [
    "Refs are stored like file paths, and a file named `hotfix` cannot sit beside",
    "a folder named `hotfix/`, so `origin/hotfix` and `origin/hotfix/typo` cannot",
    "both exist. The server dropped one and offers the other, and your clone",
    "still holds the old name. This can fail on a branch you do not use, because",
    "a fetch updates every branch's ref. `git fetch --prune` removes old names",
    "and writes the new ones in one command, and with `fetch.prune` set to `true`",
    "(stage 11) this collision does not happen. Your own branches collide the",
    "same way: a local branch called `hotfix` blocks creating `hotfix/typo` until",
    "you delete or rename it."
  ],
  figure: [
    "$ git fetch",
    "error: some local refs could not be updated; try running",
    " 'git remote prune origin' to remove any old, conflicting branches",
    " ! [new branch]  hotfix/typo -> origin/hotfix/typo  (unable to update local ref)",
    "",
    "origin/hotfix       ← you hold it; deleted on the server",
    "origin/hotfix/typo  ← the server offers it; blocked by the line above"
  ],
  proGit:   "Git-Internals-Git-References",
  lab:      "The fetch that fails over an unrelated branch"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "Mark the commit you are on as release `v0.1.0`, in the form that records who cut it and when?",
  answer: [
    "$ git tag -a v0.1.0 -m \"First usable cut\"",
    "A *tag* is a name fixed to one commit. `-a` makes it *annotated*: git stores",
    "a separate object saying who made the tag, when, and a message. Plain `git",
    "tag v0.1.0` makes a *lightweight* tag, which is only a name on the commit."
  ],
  detail: [
    "Use annotated tags for releases: `git show v0.1.0` prints who made it, when,",
    "and the message, above the commit itself. A lightweight tag has only the",
    "commit to show. Keep lightweight tags for private bookmarks, and note that",
    "some tools ignore them; `git describe`, later in this stage, is one. `git",
    "tag` lists the tags, and `-n` adds each tag's message line."
  ],
  figure: [
    "git tag -a v0.1.0 -m \"msg\"   annotated: who, when, message",
    "git tag v0.1.0               lightweight: only a name",
    "",
    "git tag -n                   list tags with their messages",
    "git show v0.1.0              the tag's details, then the commit"
  ],
  proGit:   "Git-Basics-Tagging",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Cut a release the server knows about"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "A tag and a branch are both refs. What is the difference, mechanically?",
  answer: [
    "A branch moves forward with every commit made on it. A tag is placed once",
    "and stays, so a release name always means the same commit."
  ],
  detail: [
    "Both are refs, `refs/heads/` against `refs/tags/`, and a lightweight tag's",
    "file looks just like a branch's: forty hex characters naming a commit. An",
    "annotated tag's file names a *tag object*, which holds the message and",
    "points on to the commit. Git enforces little of this: it only refuses to",
    "overwrite a tag without `-f`. The rest is a convention that every release",
    "process assumes. Make one commit on `main` after tagging, and you can see",
    "the difference:",
    "| before:  C1 ── C2         ← main (HEAD), v0.1.0",
    "| after:   C1 ── C2 ── C3   ← main (HEAD)",
    "|                ↑",
    "|                v0.1.0"
  ],
  figure: [
    "$ cat .git/refs/heads/main .git/refs/tags/v0.1.0",
    "5e6f7a8…     ← moves with every commit",
    "9d3c740…     ← stays where it was placed",
    "",
    "branch: a name that follows    tag: a name that stays"
  ],
  proGit:   "Git-Internals-Git-References",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "You tagged a release and pushed, yet `git ls-remote` shows no tag on the server. What happened?",
  answer: [
    "`git push` sends branches only. A tag stays local until you push it by name.",
    "$ git push origin v0.1.0"
  ],
  detail: [
    "`--tags` sends every tag at once, which may be more than you meant to",
    "publish. `push.followTags = true` is a better default: annotated tags on the",
    "commits you are pushing go too, and lightweight ones stay behind. Deleting",
    "one from the server works as for a branch: `git push origin --delete",
    "v0.1.0`."
  ],
  figure: [
    "git push                         commits and branch, no tags",
    "git push origin v0.1.0           this one tag",
    "git push --tags                  every tag, lightweight included",
    "git config --global push.followTags true    annotated tags go too",
    "",
    "git ls-remote origin             a refs/tags/ line ⇒ the server has it"
  ],
  proGit:   "Git-Basics-Tagging",
  lab:      "Cut a release the server knows about"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "Name where you are relative to the last release, as a string a build can use for its version?",
  answer: [
    "$ git describe",
    "On the tag it prints the tag. Past it, `v0.1.0-3-g4680cd7`: the last tag,",
    "the commits since, and the current hash."
  ],
  detail: [
    "Read it as a sentence: built from v0.1.0, three commits later, at 4680cd7.",
    "The `g` only marks the hash as git's. Bare `git describe` looks only at",
    "annotated tags, one more reason releases use `-a`. `--tags` includes",
    "lightweight ones. A deployed page or binary can report this string, so it",
    "can say what it was built from without anyone maintaining a version number."
  ],
  figure: [
    "on the tag      :  v0.1.0",
    "3 commits later :  v0.1.0-3-g4680cd7",
    "                   │      │    └─ the commit you are on",
    "                   │      └─ commits since the tag",
    "                   └─ the last release reachable from here"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project",
  bottomUp: "a-commit-by-any-other-name",
  lab:      "Cut a release the server knows about"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "Read the code as `v0.1.0` shipped. What state does that put you in?",
  answer: [
    "$ git switch --detach v0.1.0",
    "A detached HEAD, on purpose: a tag is not a branch, so a new commit would",
    "belong to no branch. Look around freely, and create a branch before changing",
    "anything."
  ],
  detail: [
    "This is the state from stage 14, entered deliberately: HEAD names the commit",
    "directly. To fix something in that release, create a branch where the tag",
    "is: `git switch -c hotfix/0.1.1 v0.1.0`. Plain `git checkout v0.1.0` gets",
    "you to the same place, with a longer warning."
  ],
  figure: [
    "git switch --detach v0.1.0          look, build, measure",
    "git switch -                        back to where you were",
    "git switch -c hotfix/0.1.1 v0.1.0   fix on a branch from the tag"
  ],
  proGit:   "Git-Basics-Tagging"
},

{
  stage:    "15 tags & releases",
  level:    "intermediate",
  question: "The release tag sits on the wrong commit. What does moving it cost, and when is it still the right thing to do?",
  answer: [
    "$ git tag -fa v0.1.0 <right-commit> && git push -f origin v0.1.0",
    "It is cheap before anyone has fetched the tag. After that, a plain fetch",
    "does not update a tag a clone already holds, so those clones keep the old",
    "commit under the same name."
  ],
  detail: [
    "This is the golden rule of rebase applied to tags, and it is harder to",
    "notice: a rewritten branch at least shows up as a non-fast-forward, while a",
    "moved tag gives no sign at all. Minutes after making it, moving a tag is",
    "routine. Once it may have been fetched, use the next version number. `git",
    "tag -d` deletes locally, and `git push origin --delete` deletes on the",
    "server."
  ],
  figure: [
    "git tag -d v0.1.0                    delete locally",
    "git push origin --delete v0.1.0      delete on the server",
    "",
    "already fetched by someone?  their v0.1.0 ≠ yours, with no warning",
    "the fix is v0.1.1"
  ],
  proGit:   "Git-Basics-Tagging"
},

{
  stage:    "16 release branches",
  level:    "intermediate",
  question: "A fix sits on `main` above two commits that must not ship yet. Why can't merging `main` into `release` take the fix alone?",
  answer: [
    "A merge takes a commit together with everything behind it, and the fix's",
    "parent is one of the unready commits, so all three come along. To move",
    "the change alone, copy it onto `release`:",
    "$ git cherry-pick -x <fix>",
    "| main      … ── D1 ── D2 ── F",
    "| release   … ── M ── F'          ← F's change, without D1 and D2"
  ],
  detail: [
    "Some teams keep a long-lived `release` branch that takes in `main` only by",
    "merge; each such merge is a *promotion*. A commit's parent is part of the",
    "commit: its hash depends on the parent's hash, so any branch that contains F",
    "contains D1 and D2 as well. A pull request is a merge too and has the same",
    "limit, so a fix meant for a release goes on a branch of its own, started",
    "from `release`. The copy gets a new hash, and the next cards show what that",
    "costs. Starting the fix at the newest commit both branches contain avoids",
    "the copy altogether."
  ],
  figure: [
    "main      A ── B ── D1 ── D2 ── F      F's parent is D2",
    "release   A ── B ── M                  M: the last promotion",
    "",
    "git merge main          →  D1, D2 and F",
    "git cherry-pick -x F    →  F' alone: F's change under a new hash"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project",
  bottomUp: "the-beauty-of-commits",
  lab:      "Copy one fix to the release, alone"
},

{
  stage:    "16 release branches",
  level:    "intermediate",
  question: "Copy a fix onto `release` so that the copy says where it came from?",
  answer: [
    "$ git cherry-pick -x <fix>",
    "`-x` ends the copy's message with a line naming the original:",
    "| (cherry picked from commit 9550b19eba7071db57499681339db7eb6fcef120)"
  ],
  detail: [
    "The copy is a new commit with a new hash, and that line is the only link",
    "between the two. In the graph the original and the copy are on different",
    "branches, and only the original has D1 below it, a commit that must not",
    "ship:",
    "| C1 ── C2 ── D1 ── F      ← main",
    "|         \\",
    "|          R1 ── F'        ← release (HEAD)",
    "`git log --grep` finds the line, and it explains the fix to anyone who sees",
    "it on both branches. Use `-x` between branches other people see. If the",
    "original is on a private branch, its hash points at a commit only you have,",
    "which is why git's documentation advises against `-x` there. The",
    "documentation also says the line is added only when the pick applies",
    "cleanly, but git 2.56 adds it after a conflicted pick and `git cherry-pick",
    "--continue` as well."
  ],
  figure: [
    "$ git cherry-pick -x 9550b19",
    "$ git log -1 --format=%B",
    "Guard success_rate against an empty run",
    "",
    "(cherry picked from commit 9550b19eba7071db57499681339db7eb6fcef120)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project",
  lab:      "Copy one fix to the release, alone"
},

{
  stage:    "16 release branches",
  level:    "intermediate",
  question: "The next promotion brings the original fix into a `release` that already holds a copy of it. Does that merge conflict?",
  answer: [
    "No, as long as neither branch has changed those lines again. Since the merge",
    "base, both sides made the same change, and git takes an identical change",
    "once. `git cherry` shows the overlap beforehand:",
    "$ git cherry -v release main"
  ],
  detail: [
    "`git log release..main` still lists the original, because a range compares",
    "commits and the copy is a different commit. `git cherry` compares the",
    "changes, and marks the original with a minus. Here is the promotion:",
    "| C1 ── C2 ── D1 ── F ── D2 ─┐   ← main",
    "|         \\                  │",
    "|          R1 ── F' ──────── M   ← release (HEAD)",
    "Since the merge base C2, both sides made the same change as F, so M contains",
    "it once. If either branch edits those lines again before the promotion, the",
    "two sides no longer agree, and the merge stops with a conflict over a fix",
    "that is already on both."
  ],
  figure: [
    "$ git cherry -v release main",
    "+ a8fd19a… Add a CSV export",
    "+ de3cc06… Announce the CSV export",
    "- 9550b19… Guard success_rate against an empty run",
    "",
    "+  new to release",
    "-  release already has this change, as a copy"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  lab:      "Promote again, and watch the copy meet its original"
},

{
  stage:    "16 release branches",
  question: "`main` reverted a fix that `release` holds as a copy. After the next promotion, which branch still has the fix?",
  answer: [
    "`release`, with no warning. Since the merge base, `main`'s fix and its",
    "revert cancel out, so `main` changed nothing there, and the merge keeps the",
    "one side that changed, which is the copy. Revert the copy too:",
    "$ git revert <copy>"
  ],
  detail: [
    "The merge reports no conflict and gives no warning. The promotion arrives as",
    "a merge commit that leaves the copy in place:",
    "| C1 ── C2 ── F ── F⁻¹ ──┐   ← main",
    "|         \\              │",
    "|          F' ────────── M   ← release (HEAD)",
    "Since the merge base C2, F and F⁻¹ on `main` cancel each other out. Only the",
    "copy changed those lines, so M keeps F'. Every later change to a copied fix",
    "has to be made on both branches, for as long as the copy exists. To find the",
    "copies, list what `release` holds that `main` does not, leaving out merges:",
    "`git log --no-merges main..release`."
  ],
  figure: [
    "since the merge base:",
    "  main      the fix, then its revert   →  no change",
    "  release   the copy                   →  the fix",
    "",
    "a three-way merge keeps the side that changed:",
    "release keeps the fix, and nothing conflicts"
  ],
  proGit:   "Git-Tools-Advanced-Merging",
  lab:      "Watch a revert stay behind"
},

{
  stage:    "16 release branches",
  question: "Make one fix that `main` and `release` both take as the same commit?",
  answer: [
    "Start it at the newest commit both branches already contain, then merge",
    "it into each:",
    "$ git switch -c fix/precision $(git merge-base main release)",
    "Both merges bring the fix and nothing else, and the merge base moves up",
    "to the fix."
  ],
  detail: [
    "Everything up to the merge base is already on both branches, so a branch",
    "started there brings only its own commits, and neither merge pulls in",
    "unready work. Afterwards the next promotion does not list the fix, a revert",
    "of it merges like any other change, and there is no copy to keep in step.",
    "The cost is planning: you must choose this before writing the fix, and you",
    "write it against the older code at the merge base, which for a release fix",
    "is the code that ships. Both merges have to be real merge commits, because",
    "squashing either one makes a copy after all."
  ],
  figure: [
    "release      ─────────── M ──────────────── P2",
    "                         ↑                  ↑",
    "fix/precision            ├── F ─────────────┤",
    "                         │                  ↓",
    "main         ── A ── B ──┴── D1 ── D2 ────── P1",
    "",
    "B   the merge base: main's last promotion",
    "P1  the fix merged into main",
    "P2  the same F merged into release"
  ],
  proGit:   "Git-Branching-Branching-Workflows",
  lab:      "Fix once, and merge the fix into both"
},

{
  stage:    "16 release branches",
  question: "A shared fix branch was squashed into `main` and merged into `release`. What did the squash undo?",
  answer: [
    "It stopped the two branches sharing one commit. `git merge --squash` stages",
    "the branch's changes for one new commit of your own, so `main` holds a copy,",
    "and the next promotion lists the fix again, just as after a cherry-pick."
  ],
  detail: [
    "A squash commit has one parent and no link to the branch, so history records",
    "no merge and the merge base stays where it was. Hosting services offer",
    "squash and rebase as ways to merge a pull request, and for a shared fix both",
    "write new commits. When one fix has to reach two branches as the same",
    "commit, both of its pull requests need a merge commit."
  ],
  figure: [
    "git merge --no-ff fix    →  F itself, under a merge commit",
    "git merge --squash fix   →  a new commit holding F's change: a copy",
    "",
    "squashed into main, merged into release:",
    "git log release..main    →  the squash commit, the fix all over again"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "16 release branches",
  question: "The fix went into `release` first. Bring it to `main` without making a copy?",
  answer: [
    "Merge `release` into `main`. The fix arrives as the same commit, along with",
    "anything else `release` holds that `main` does not:",
    "$ git switch main",
    "$ git merge release"
  ],
  detail: [
    "The other cards in this stage avoid this direction, but some branching",
    "models are built on it: git-flow, a well-known model, starts a hotfix from",
    "its production branch and merges the hotfix into that branch and its",
    "development branch. The cost here is what comes along: the merge commits",
    "`release` collected come back into `main`'s history, and anything made only",
    "for the release, such as a version bump, arrives too unless you revert it on",
    "`main`. Fixing `main` first avoids that, at the price of a copy or of a fix",
    "started at the merge base."
  ],
  figure: [
    "main first     →  cherry-pick: a copy on release",
    "               →  a branch from the merge base: one commit, two merges",
    "release first  →  merge release into main: one commit, and release's",
    "                  own history with it"
  ],
  proGit:   "Git-Branching-Branching-Workflows"
}

];
