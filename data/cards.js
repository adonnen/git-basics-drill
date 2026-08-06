/* =============================================================================
   cards.js — the flashcards.

   You do not need to know any web development to edit this file. A card is a
   block of plain text between braces. Copy one, change the words, save, and
   reload the page in your browser.

   ---------------------------------------------------------------------------
   THE SHAPE OF A CARD
   ---------------------------------------------------------------------------
   {
     stage:    "02 branching",              which group the card belongs to
     question: "How do you rename a branch?",
     answer: [                              one line per line of text
       "Renames the branch you are standing on.",
       "$ git branch -m new-name"
     ],
     detail: [                              the longer note in the pop-up
       "This renames only your local label. A branch already pushed needs the",
       "remote told separately."
     ],
     figure: [                              a drawing for the pop-up, kept as-is
       "before:  old-name",
       "after :  new-name"
     ],
     proGit:   "Git-Branching-Branch-Management",   required
     bottomUp: "the-beauty-of-commits"              optional, may be left out
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
     03 stashing        07 rebasing        11 remotes & server
     04 merging         08 history edits   12 ssh & auth

   Cards appear in the order they are written here, and stages in the order
   they first appear.

   ---------------------------------------------------------------------------
   IF SOMETHING GOES WRONG
   ---------------------------------------------------------------------------
   A blank page almost always means a missing comma or quote. Open the browser
   console (F12) — it names the line. The console also lists any card with a
   missing field or an unknown reference key.
   ============================================================================= */

const CARDS = [

{
  stage:    "01 foundations",
  question: "Start a brand-new repository in the current folder, with the default branch named `main` from the start.",
  answer: [
    "Creates the `.git/` directory — that directory *is* the repository;",
    "everything around it is just a working copy.",
    "$ git init -b main"
  ],
  detail: [
    "Everything git knows lives inside `.git/`: the object database, the refs,",
    "HEAD, config, and hooks. Delete that one directory and your files remain",
    "untouched but the history is gone. The `-b` flag arrived in git 2.28; on",
    "older versions you run `git init` and then `git branch -m main`."
  ],
  figure: [
    "taskrunner/",
    "├── .git/            ← the repository itself",
    "│   ├── HEAD         → ref: refs/heads/main",
    "│   ├── config       ← local settings",
    "│   ├── objects/     ← every commit, tree, blob",
    "│   └── refs/heads/  ← branch pointers",
    "└── src/             ← your working copy"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository",
  bottomUp: "directory-content-tracking"
},

{
  stage:    "01 foundations",
  question: "Which two identity settings must git know before your first commit?",
  answer: [
    "Name and email — stamped into every commit you author. Add `--global` to set",
    "them machine-wide.",
    "$ git config user.name \"Your Name\"",
    "$ git config user.email \"you@example.com\""
  ],
  detail: [
    "The values are baked into each commit object at creation time, so changing",
    "them later does not rewrite past commits. Omitting `--global` writes to",
    "`.git/config` for this repository only — which is how you keep a work",
    "address on work repos and a personal one everywhere else."
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
  proGit:   "Getting-Started-First-Time-Git-Setup"
},

{
  stage:    "01 foundations",
  question: "Read the output of `git status` — what are the three states a file can be in?",
  answer: [
    "**Modified** in the working tree, **staged** in the index, or **committed**",
    "to the repository. Status shows you which files sit where."
  ],
  detail: [
    "The short form `git status -sb` compresses the same information into one",
    "line per file plus a branch header, which is what a `git s` alias would give",
    "you. Two columns: the left is the index, the right is the working tree."
  ],
  figure: [
    "$ git status -sb",
    "## feature/task-queue...origin/feature/task-queue [ahead 1]",
    "M  src/states.py      ← staged",
    " M src/queue.py  ← modified, not staged",
    "?? src/scratch.py      ← untracked"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "Put a file’s current changes into the next commit — without committing yet?",
  answer: [
    "$ git add src/runner.py",
    "$ git add .",
    "Staging is reversible: `git restore --staged` puts it back."
  ],
  detail: [
    "`git add` snapshots the file *as it is right now*. Edit it again afterwards",
    "and you have two versions in play — the staged one and the newer one on disk",
    "— which `git status` reports by listing the same file in both columns."
  ],
  figure: [
    "git add <file>     one file",
    "git add .          everything under the current directory",
    "git add -A         everything in the repo, including deletions"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "Record whatever is staged as a permanent commit?",
  answer: [
    "$ git commit -m \"Add task state enum\"",
    "Only staged content is recorded — anything merely modified stays behind."
  ],
  detail: [
    "Dropping `-m` opens your editor, which is the better habit for anything",
    "needing a body. `git commit -a` stages every tracked file automatically",
    "before committing — convenient, but it skips the deliberate choice the index",
    "exists to give you."
  ],
  figure: [
    "git commit -m \"subject\"     inline message",
    "git commit                  editor: subject, blank line, body",
    "git commit -a -m \"…\"        auto-stage tracked files (skips the index)"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "01 foundations",
  question: "What is the staging area (the index) actually *for*?",
  answer: [
    "It’s a draft of the next commit. You choose exactly what goes in — which is",
    "what lets one messy working tree produce several clean, single-purpose",
    "commits."
  ],
  detail: [
    "The payoff is `git add -p`, which walks a file hunk by hunk and asks whether",
    "each one belongs in this commit. An afternoon that touched one file in three",
    "unrelated ways becomes three reviewable commits instead of one that resists",
    "bisecting."
  ],
  figure: [
    "one dirty file, two unrelated ideas:",
    "",
    "  src/runner.py ┬─ overflow fix   ──▶ add -p ──▶ commit \"Fix overflow\"",
    "              └─ debug prints   ──▶ left unstaged, committed later"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "One file holds two unrelated changes. Stage only the first?",
  answer: [
    "$ git add -p src/runner.py",
    "Git walks the file hunk by hunk and asks about each one."
  ],
  detail: [
    "Answer `y` to stage a hunk, `n` to skip it, `s` to split a hunk that is",
    "still too coarse, `q` to stop. Once you have used it, an afternoon of",
    "tangled edits reliably becomes two or three clean commits instead of one",
    "that resists review."
  ],
  figure: [
    "Stage this hunk [y,n,q,a,d,s,e,?]?",
    "",
    "  y  stage it        n  skip it",
    "  s  split further   q  quit",
    "  e  edit the hunk by hand"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "`git add -p` offers you five hunks in one file. What is a hunk?",
  answer: [
    "A contiguous run of changed lines *plus* the unchanged lines around it,",
    "three on each side by default. One file can hold several."
  ],
  detail: [
    "The context is what decides where one hunk ends and the next begins. Change",
    "line 10 and line 14 and their context windows overlap, so git prints one",
    "hunk; change line 10 and line 40 and nothing joins them, so you get two. The",
    "header states the exact span on each side."
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
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "One hunk bundles two changes you want staged separately. Two ways to cut it finer?",
  answer: [
    "`s` splits it — but only at an unchanged line inside the hunk. When two",
    "changed lines sit adjacent there is no seam, and `e` opens the hunk as a",
    "patch you edit line by line."
  ],
  detail: [
    "In the editor the rules are narrow: delete a `+` line to leave that addition",
    "unstaged, and turn a `-` into a space to keep that line rather than staging",
    "its removal. Never delete a `-` or a context line — the patch stops",
    "describing a valid transformation and git rejects it."
  ],
  figure: [
    "s  split at an unchanged line — fails if there is no seam",
    "e  edit the patch by hand — true line-level control",
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
  question: "A hunk stubbornly refuses to split. Which setting makes git produce finer hunks in the first place?",
  answer: [
    "Shrink the context — fewer surrounding lines means fewer neighbourhoods",
    "merge into one hunk.",
    "$ git -c diff.context=1 add -p src/runner.py"
  ],
  detail: [
    "Worth trying before reaching for the editor, since it often turns one",
    "stubborn block into two you can simply accept and reject. And the same `-p`",
    "interface runs across the whole family, which is where it stops being a",
    "staging trick and becomes a way of working."
  ],
  figure: [
    "git add -p          stage selected hunks",
    "git restore -p      discard selected hunks",
    "git stash push -p   stash only part of your work",
    "git checkout -p     take selected hunks from another commit",
    "git reset -p        unstage selected hunks"
  ],
  proGit:   "Git-Tools-Interactive-Staging",
  bottomUp: "meet-the-middle-man"
},

{
  stage:    "01 foundations",
  question: "See what you have changed but not yet staged — and what you have staged but not yet committed?",
  answer: [
    "$ git diff",
    "$ git diff --staged",
    "Plain `diff` compares working tree against the index; `--staged` compares",
    "the index against HEAD."
  ],
  detail: [
    "They cover disjoint ground, which is why staging a file makes it vanish from",
    "plain `git diff`. Reading `git diff --staged` immediately before every",
    "commit is the single cheapest habit for keeping commits coherent."
  ],
  figure: [
    "working tree ──diff──▶ index ──diff --staged──▶ HEAD",
    "",
    "git diff            what you would still need to add",
    "git diff --staged   what you are about to commit",
    "git diff HEAD       both combined"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "01 foundations",
  question: "Show the commit history as one line per commit?",
  answer: [
    "$ git log --oneline"
  ],
  detail: [
    "The same command takes shape modifiers freely: `-5` caps the count, `--stat`",
    "adds a per-file summary, `-p` shows the full patch, `--graph` draws the",
    "branch structure. They compose, which is why one command covers most of what",
    "you ever need to read from history."
  ],
  figure: [
    "$ git log --oneline",
    "c7d8e9f Add task state enum",
    "b4e5f6g Add TaskRunner skeleton",
    "a1b2c3d Initial commit: project description"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "01 foundations",
  question: "Inspect one particular commit — its message, author, and full diff?",
  answer: [
    "$ git show a1b2c3d",
    "$ git show          (defaults to HEAD)"
  ],
  detail: [
    "The same object syntax works everywhere: `git show HEAD~2` for the commit",
    "two back, `git show main:src/runner.py` to print a file as it exists on",
    "another branch without switching to it."
  ],
  figure: [
    "git show HEAD              the last commit, with its diff",
    "git show HEAD~2            two commits back",
    "git show main:src/runner.py  that file, as main has it",
    "git log -p -3              the last three commits, with diffs"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History"
},

{
  stage:    "01 foundations",
  question: "Define a shortcut for a decorated graph of all branches — where does it live, and what does it expand to?",
  answer: [
    "An alias in your gitconfig — this one turns four flags into two characters:",
    "$ [alias]",
    "$     lg = log --all --oneline --graph --decorate",
    "Now `git lg` draws the shape of history."
  ],
  detail: [
    "Aliases live under `[alias]` in your gitconfig and simply expand to whatever",
    "follows, so any flag you would type on the command line works there too —",
    "and flags you add at the call site are appended to the expansion. An alias",
    "beginning with `!` runs a shell command instead of a git subcommand, which",
    "is how the guarded `git nuke` got its confirmation prompt."
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
  question: "What is `HEAD`?",
  answer: [
    "The pointer to *where you are*. Normally it points at the branch you’re on,",
    "which points at a commit. New commits move the branch; HEAD rides along."
  ],
  detail: [
    "`.git/HEAD` is a one-line file. Normally it holds a symbolic reference —",
    "`ref: refs/heads/main` — meaning “I am on main.” In a detached state it",
    "holds a raw SHA instead, which is why commits made there belong to no branch",
    "and survive only in the reflog."
  ],
  figure: [
    "attached:",
    "HEAD ──▶ refs/heads/main ──▶ c7d8e9f ──▶ b4e5f6g ──▶ a1b2c3d",
    "",
    "detached:",
    "HEAD ────────────────────▶ b4e5f6g",
    "        (no branch label — new commits have no home)"
  ],
  proGit:   "Git-Internals-Git-References",
  bottomUp: "introduction"
},

{
  stage:    "02 branching",
  question: "Create a new branch and switch to it — one command, modern syntax.",
  answer: [
    "$ git switch -c feature/task-queue",
    "Add a start point to branch from somewhere specific:",
    "`git switch -c feature/foo dev`."
  ],
  detail: [
    "The branch is created at HEAD unless you name a start point, and any",
    "uncommitted changes you are carrying come along untouched — which makes this",
    "the correct escape from a detached HEAD before you commit anything you would",
    "rather keep."
  ],
  figure: [
    "before:  main ──▶ C4                    (HEAD ▶ main)",
    "",
    "after :  main ──▶ C4 ◀── feature/task-queue   (HEAD ▶ feature)",
    "         both labels on the same commit — until you commit"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell",
  bottomUp: "the-beauty-of-commits"
},

{
  stage:    "02 branching",
  question: "List your local branches; list remote-tracking ones too?",
  answer: [
    "`git branch` for local, `-r` for remote-tracking, `-a` for both. The `*`",
    "marks where you are."
  ],
  detail: [
    "On a repository with hundreds of branches the raw list is unusable. Sorting",
    "by recency turns it into an answer to “what was I working on last week”,",
    "which is what `git recent` does."
  ],
  figure: [
    "git branch                              local",
    "git branch -r                           remote-tracking",
    "git branch -a                           both",
    "git branch --sort=-committerdate        most recent first"
  ],
  proGit:   "Git-Branching-Branch-Management",
  bottomUp: "the-beauty-of-commits"
},

{
  stage:    "02 branching",
  question: "Which flag shows each branch’s upstream and how far ahead or behind it is?",
  answer: [
    "$ git branch -vv",
    "`-v` alone shows the tip commit; the second `v` adds tracking information."
  ],
  detail: [
    "The ahead/behind numbers are measured against your *cached* view of the",
    "remote, so they are only as fresh as your last fetch. A branch reported as",
    "up to date may simply not have been fetched today."
  ],
  figure: [
    "$ git branch -vv",
    "* feature/task-queue 5e6f7g8 [origin/feature/task-queue: ahead 2] Add overflow counter",
    "  dev          f2g3h4i [origin/dev] Bump queue depth",
    "  scratch      1a2b3c4 Experiment                      ← no upstream"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "02 branching",
  question: "List only the branches whose work has already landed on `dev`?",
  answer: [
    "$ git branch --merged dev",
    "Its opposite, `--no-merged dev`, lists what still has work outstanding."
  ],
  detail: [
    "Without an argument both compare against your current HEAD, which quietly",
    "answers a different question than you meant. Naming the trunk explicitly is",
    "what makes the list safe to feed into a bulk delete."
  ],
  figure: [
    "git branch --merged dev      safe to delete",
    "git branch --no-merged dev   still holds unlanded work"
  ],
  proGit:   "Git-Branching-Branch-Management"
},

{
  stage:    "02 branching",
  question: "Rename the branch you’re currently on?",
  answer: [
    "$ git branch -m feature/better-name"
  ],
  detail: [
    "This renames only your local label. A branch already pushed needs the remote",
    "told separately — delete the old name and push the new one, then reset",
    "upstream tracking."
  ],
  figure: [
    "git branch -m feature/better-name",
    "git push origin --delete feature/old-name",
    "git push -u origin feature/better-name"
  ],
  proGit:   "Git-Branching-Branch-Management"
},

{
  stage:    "02 branching",
  question: "Delete a merged branch — and force-delete an unmerged one?",
  answer: [
    "`git branch -d` is the safe form: it refuses if the branch holds unmerged",
    "work. `-D` deletes regardless — for scrapped experiments."
  ],
  detail: [
    "“Merged” is judged relative to your current HEAD, so run the check against",
    "the trunk you care about — `git branch --merged dev` — before any bulk",
    "cleanup. Deleting a branch never deletes commits; it removes a label, and",
    "the commits stay reachable through the reflog for weeks."
  ],
  figure: [
    "$ git branch -d feature/scrapped",
    "error: the branch is not fully merged.",
    "",
    "$ git branch -D feature/scrapped",
    "Deleted branch feature/scrapped (was 5e6f7g8).",
    "                    ↑ still recoverable from the reflog"
  ],
  proGit:   "Git-Branching-Branch-Management"
},

{
  stage:    "02 branching",
  question: "What is a branch, mechanically?",
  answer: [
    "A ref: a tiny file under `.git/refs/heads/` containing one commit SHA.",
    "Branches are movable labels — creating one costs a 41-byte file, which is",
    "why they’re cheap."
  ],
  detail: [
    "Forty hex characters and a newline. Committing rewrites that file to point",
    "at the new commit; switching branches just changes which file HEAD refers",
    "to. Once you see branches as labels rather than copies, the cost of",
    "branch-per-task drops to nothing and the whole workflow reorganizes around",
    "it."
  ],
  figure: [
    "$ cat .git/refs/heads/main",
    "5e6f7g8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q",
    "",
    "$ ls .git/refs/heads/",
    "dev   feature/task-queue   main"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell",
  bottomUp: "the-beauty-of-commits"
},

{
  stage:    "02 branching",
  question: "Why prefer `switch` over `checkout` for branch work?",
  answer: [
    "`checkout` overloaded two jobs — switching branches and restoring files —",
    "and the file form silently destroys uncommitted work. Git 2.23 split the",
    "verb: **switch** branches, **restore** files."
  ],
  detail: [
    "The dangerous case was ambiguity: `git checkout name` had to guess whether",
    "you meant a branch or a path, and guessing wrong meant discarding edits with",
    "no undo. `switch` refuses paths outright, so the destructive interpretation",
    "is no longer reachable by accident. `checkout` still works and is not",
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
  question: "Jump back to the branch you were on before — the `cd -` of git?",
  answer: [
    "$ git switch -"
  ],
  detail: [
    "The dash is shorthand for `@{-1}`, “the branch I was on one switch ago,” and",
    "that syntax works anywhere a ref is accepted — `git merge @{-1}` and",
    "`git rebase @{-2}` are both legal. Handy when you bounce to a trunk to check",
    "something and want back without typing a long branch name."
  ],
  figure: [
    "$ git switch feature/task-queue     # ...work...",
    "$ git switch main             # check something on the trunk",
    "$ git switch -                # back to feature/task-queue"
  ],
  proGit:   "Git-Branching-Branches-in-a-Nutshell"
},

{
  stage:    "02 branching",
  question: "Refer to a commit by its position rather than its hash — the parent of HEAD, and five commits back?",
  answer: [
    "`HEAD^` is the parent, `HEAD~5` is five generations back. They compose:",
    "`HEAD~2^` is legal."
  ],
  detail: [
    "The two differ only at merge commits, which have several parents: `^1` and",
    "`^2` pick between them, while `~` always follows the first. This notation is",
    "what makes `rebase -i HEAD~5` and `reset --hard HEAD~1` readable."
  ],
  figure: [
    "HEAD      where you are",
    "HEAD^     its parent            (= HEAD~1)",
    "HEAD~3    three generations back",
    "HEAD^2    the SECOND parent — only merge commits have one"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "03 stashing",
  question: "Set aside all uncommitted work with a label you’ll recognize later?",
  answer: [
    "$ git stash push -m \"queue backpressure spike\"",
    "Working tree goes clean; the work waits in the stash list.",
    "| before          after",
    "|  M runner.py     (clean)      ← tree",
    "|  ?? scratch.py   ?? scratch.py",
    "|                  stash@{0}    ← your edits, parked"
  ],
  detail: [
    "By default the stash takes tracked files only — new untracked files stay",
    "behind and can break the clean switch you were aiming for. `-u` includes",
    "them; `-a` includes ignored files too. The message is worth the extra",
    "seconds: an unlabelled stash from three days ago is a mystery."
  ],
  figure: [
    "git stash push -m \"note\"      tracked files only",
    "git stash push -u -m \"note\"    + untracked",
    "git stash push -a -m \"note\"    + ignored"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "03 stashing",
  question: "You are mid-edit when you need to switch branches or pull. How do you park the work and get it back afterwards?",
  answer: [
    "Stash it, do the other thing, pop it back. Nothing gets committed, and the",
    "working tree is clean in between so the switch or pull cannot be blocked.",
    "$ git stash push -m \"half-finished parser\"",
    "$ git switch main          # or just: git pull",
    "$ git switch -             # back where you were",
    "$ git stash pop",
    "| working tree                    stash",
    "|      │                            │",
    "|      ├──── stash push ───────────▶│   tree goes clean",
    "|      │                            │   switch or pull freely",
    "|      ◀──── stash pop ─────────────┤   your edits come back"
  ],
  detail: [
    "This is the everyday reason the stash exists: git refuses to switch or merge",
    "when uncommitted changes would be overwritten, and committing half-finished",
    "work just to move branches leaves rubbish in the history. Note `git switch -`,",
    "which returns to the previous branch without typing its name."
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
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "03 stashing",
  question: "`stash pop` vs `stash apply`?",
  answer: [
    "`pop` applies the stash and removes it from the list. `apply` applies and",
    "keeps it — useful when the same stash should land on several branches.",
    "| pop    apply the stash, remove it from the list",
    "| apply  apply the stash, keep it for another branch"
  ],
  detail: [
    "A detail worth knowing: if `pop` hits a conflict, it applies what it can and",
    "*keeps* the stash rather than dropping it, so nothing is lost",
    "mid-resolution. You drop it yourself once the conflict is settled."
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
  question: "List your stashes, and preview one before applying it?",
  answer: [
    "$ git stash list",
    "$ git stash show -p stash@{1}"
  ],
  detail: [
    "The stash is a stack — `stash@{0}` is newest and every index shifts when you",
    "push or drop. Since a label written last week rarely means much today,",
    "previewing the diff is faster than applying and undoing."
  ],
  figure: [
    "$ git stash list",
    "stash@{0}: On feature/task-queue: queue backpressure spike",
    "stash@{1}: On dev: half-finished tests",
    "",
    "$ git stash show -p stash@{1}    full diff, applies nothing"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "03 stashing",
  question: "You stashed, but new untracked files are still cluttering the tree. Why — and the fix?",
  answer: [
    "The default stash takes tracked files only. Include the rest:",
    "$ git stash push -u -m \"note\""
  ],
  detail: [
    "This is the usual reason a “clean” switch still fails or a build still picks",
    "up scratch files. `-u` adds untracked files, `-a` adds ignored ones too —",
    "the latter rarely what you want, since it will sweep up your whole build",
    "directory."
  ],
  figure: [
    "(default)  tracked, modified files",
    "-u         + untracked files",
    "-a         + ignored files too   ← usually too much"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "03 stashing",
  question: "Delete a single stash — and why should you never reach for `git stash clear`?",
  answer: [
    "`git stash drop stash@{1}` removes one. `clear` removes every stash at once,",
    "and those entries are not recoverable through any normal route."
  ],
  detail: [
    "Wiegley’s alternative is to expire the stash reflog by age instead —",
    "`git reflog expire --expire=30.days refs/stash` — which prunes what is",
    "genuinely stale and leaves recent work alone. Same tidiness, no cliff edge."
  ],
  figure: [
    "git stash drop stash@{1}                      one entry",
    "git stash clear                               ALL of them — no undo",
    "git reflog expire --expire=30.days refs/stash  age them out instead"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "04 merging",
  question: "Merge `feature` into `main` — the two commands, in order?",
  answer: [
    "You merge *into* the branch you’re standing on:",
    "$ git switch main",
    "$ git merge feature"
  ],
  detail: [
    "Direction is the thing people get backwards. The merge modifies the branch",
    "you are currently on and leaves the other one untouched — so merging main",
    "into your feature branch updates the feature and does nothing to main, which",
    "is exactly what you want mid-development."
  ],
  figure: [
    "git switch main",
    "git merge feature      main gains the work; feature unchanged",
    "",
    "git switch feature",
    "git merge main         feature catches up; main unchanged"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "04 merging",
  question: "What is a fast-forward merge?",
  answer: [
    "If `main` hasn’t moved since you branched, there’s nothing to reconcile —",
    "git just slides the `main` pointer up to your branch tip. No merge commit,",
    "linear history.",
    "| before   A ── B ── C (main) ── D ── E (feature)",
    "| after    A ── B ── C ── D ── E",
    "|                              ↑ main, feature"
  ],
  detail: [
    "It works because main is an *ancestor* of the feature tip: every commit main",
    "has, feature already contains. There is no second line of development to",
    "combine, so git skips the three-way merge entirely and moves a label."
  ],
  figure: [
    "before:  A───B───C (main)───D───E (feature)",
    "",
    "after :  A───B───C───D───E",
    "                         ↑",
    "                    main, feature"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "04 merging",
  question: "The branches have both moved. What does git actually compare to build the merge?",
  answer: [
    "Three snapshots: the two branch tips and their **common ancestor**. Hence",
    "“three-way merge” — the ancestor is what tells git which side changed a",
    "given line."
  ],
  detail: [
    "Anywhere only one side moved away from the ancestor, git takes that side",
    "silently. A conflict arises only where both sides changed the same region,",
    "which is why most merges finish without asking you anything.",
    "`git merge-base` prints the ancestor it will use."
  ],
  figure: [
    "        ancestor",
    "       /           main          feature",
    "               /",
    "        merge M",
    "",
    "only one side changed  →  taken automatically",
    "both sides changed     →  conflict, your call"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "04 merging",
  question: "Force a real merge commit even when a fast-forward would work — which flag, and why bother?",
  answer: [
    "`--no-ff`. It preserves the fact that this work arrived as a branch — the",
    "fork-and-join stays visible in the graph as documentation.",
    "| default    A ── B ── C ── D ── E",
    "|",
    "| --no-ff    A ── B ── C ─────── M",
    "|                      \\       /",
    "|                       D ── E"
  ],
  detail: [
    "The trade is auditability against noise. On a release trunk where “when did",
    "this feature land” is a question people actually ask, the merge commit is",
    "the answer. On a fast-moving personal repo it is clutter, and a fast-forward",
    "reads better."
  ],
  figure: [
    "--ff (default when possible):",
    "  A───B───C───D───E        (main)",
    "",
    "--no-ff:",
    "  A───B───C───────M        (main)",
    "           \\     /",
    "            D───E          (feature)"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "04 merging",
  question: "Refuse the merge entirely unless it can fast-forward?",
  answer: [
    "`--ff-only`. A guard for updating a trunk: succeed cleanly or fail loudly,",
    "never create a surprise merge commit.",
    "$ git merge --ff-only feature"
  ],
  detail: [
    "The failure is the feature. If `--ff-only` refuses, the two branches have",
    "genuinely diverged and a merge commit is the only way forward — which you",
    "may well want, but as a decision rather than a side effect. The same flag",
    "applies to `pull` once remotes enter the picture."
  ],
  figure: [
    "$ git merge --ff-only feature",
    "fatal: Not possible to fast-forward, aborting.",
    "       ↑ the branches have diverged — a merge commit is required"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "04 merging",
  question: "What does a merge commit have that ordinary commits don’t?",
  answer: [
    "Two parents — the tips of both merged lines. That’s how the graph records",
    "when and where a branch came in.",
    "|            ┌── G   the branch you were on   (parent 1)",
    "|       M ───┤",
    "|            └── C   what you merged in       (parent 2)"
  ],
  detail: [
    "The parents are ordered, and the order matters: the first is the branch you",
    "were on, the second is what you merged in. That ordering is exactly what",
    "`--first-parent` walks when you want trunk history as a list of landings",
    "rather than the interior of every merged branch."
  ],
  figure: [
    "         ┌── parent 1 ── G   (main, where you stood)",
    "    M ────┤",
    "         └── parent 2 ── C   (feature, what you merged)",
    "",
    "git log --first-parent main   ← follows parent 1 only"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "the-beauty-of-commits"
},

{
  stage:    "04 merging",
  question: "The feature is merged. What do you do with the branch label?",
  answer: [
    "Delete it: `git branch -d feature/…`. The commits stay reachable through the",
    "merge — the label was scaffolding, not the work."
  ],
  detail: [
    "On a repo with hundreds of branches this is not tidiness for its own sake:",
    "stale labels make `--all` graph views unreadable and clutter every branch",
    "listing. `git branch --merged dev` lists exactly what is safe to remove."
  ],
  figure: [
    "git branch --merged dev        ← what has already landed",
    "git branch -d feature/task-queue     ← safe delete, refuses if unmerged",
    "git push origin --delete feature/task-queue   ← and on the remote"
  ],
  proGit:   "Git-Branching-Branch-Management"
},

{
  stage:    "04 merging",
  question: "When would you choose merge over rebase to bring trunk changes into your feature branch?",
  answer: [
    "When anyone else has pulled your branch. Merge adds a commit without",
    "touching existing SHAs; rebase rewrites them and breaks every downstream",
    "copy."
  ],
  detail: [
    "A second case is pragmatic rather than principled: a long-lived branch that",
    "has been rebased many times against a fast-moving trunk, replaying the same",
    "painful conflict every round. `rerere` absorbs most of that, but when it",
    "does not, eating one merge commit costs less than a fifth manual resolution."
  ],
  figure: [
    "branch is yours alone      ──▶ rebase (clean, linear)",
    "someone else has pulled it ──▶ merge  (safe, additive)"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "05 sync basics",
  question: "Get a working copy of a repository that already exists on a server?",
  answer: [
    "$ git clone git@server.local:repos/taskrunner.git",
    "One command: creates the directory, initializes the repo, wires up `origin`,",
    "downloads all history, and checks out a tracking branch."
  ],
  detail: [
    "This is the command `init` plus `remote add` plus `pull` was trying to",
    "approximate — and the reason that sequence fails is that `init` leaves the",
    "branch unborn, so there is nothing for `pull` to merge into. Use `clone` for",
    "anything that already exists, `init` only for something genuinely new."
  ],
  figure: [
    "git clone <url>   does all of this at once:",
    "",
    "  mkdir repo/                        the directory",
    "  git init                           the repository",
    "  git remote add origin <url>        the wiring",
    "  git fetch                          all history",
    "  git switch -c main --track …       a tracking branch"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository"
},

{
  stage:    "05 sync basics",
  question: "What is `origin`, and how do you see where it points?",
  answer: [
    "A nickname for a remote URL — the default one `clone` creates. Nothing is",
    "special about the name.",
    "$ git remote -v"
  ],
  detail: [
    "A repository can have several remotes: `origin` for your fork, `upstream`",
    "for the project you forked from, `pi` for a self-hosted backup. Each is just",
    "a label plus a URL, renameable with `git remote rename` and repointable with",
    "`set-url`."
  ],
  figure: [
    "$ git remote -v",
    "origin  git@github.com:yourname/taskrunner.git (fetch)",
    "origin  git@github.com:yourname/taskrunner.git (push)",
    "pi      git@server.local:repos/taskrunner.git (fetch)",
    "pi      git@server.local:repos/taskrunner.git (push)"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "What does `git pull` actually do?",
  answer: [
    "Two commands wearing one name: **fetch**, then **integrate**. Fetch updates",
    "`origin/main` from the server; integrate merges that into the branch you’re",
    "standing on — or rebases, with `pull.rebase=true`."
  ],
  detail: [
    "The two halves carry very different risk. Fetch touches nothing you can see",
    "and can never conflict, which is why it is safe to run at any moment. The",
    "integration is a genuine merge with everything that implies — it can",
    "fast-forward, build a merge commit, or stop dead on a conflict."
  ],
  figure: [
    "git pull  ≡  git fetch  +  git merge origin/main",
    "                            (or rebase, per pull.rebase)",
    "",
    "step 1  safe — updates origin/main only",
    "step 2  real integration — fast-forward, merge commit, or conflict"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "`fetch` vs `pull`?",
  answer: [
    "`fetch` downloads the remote’s state without touching your branch — look",
    "before integrating. `pull` = fetch *plus* merge (or rebase)."
  ],
  detail: [
    "The two-step is worth the extra command when the trunk has moved a lot:",
    "fetch, read `git log HEAD..origin/main` to see exactly what is arriving,",
    "then integrate deliberately. Nothing you fetch can surprise you until you",
    "choose to integrate it."
  ],
  figure: [
    "fetch:  remote ──▶ origin/main                (branch untouched)",
    "pull :  remote ──▶ origin/main ──▶ main       (merge or rebase)",
    "",
    "git fetch",
    "git log HEAD..origin/main --oneline    ← what is about to arrive"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "Send your local commits up to the remote?",
  answer: [
    "$ git push",
    "Uploads the commits on your current branch and moves the remote’s branch",
    "pointer to match yours."
  ],
  detail: [
    "Push sends the branch you are on and nothing else — other local branches",
    "stay local until pushed individually. It refuses when the remote holds",
    "commits you do not, because accepting would orphan them; the fix is to fetch",
    "and integrate first, then push."
  ],
  figure: [
    "before:  local main ──▶ C5      remote main ──▶ C3",
    "after :  local main ──▶ C5      remote main ──▶ C5",
    "",
    "$ git push",
    " ! [rejected]  main -> main (fetch first)",
    "   ↑ the remote has commits you don't — pull, then push"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "`git push` is rejected as non-fast-forward, and you have *not* rewritten anything. What now?",
  answer: [
    "The remote has commits you don’t. Integrate first, then push:",
    "$ git pull",
    "$ git push"
  ],
  detail: [
    "This is the ordinary case and it needs no force at all — a colleague pushed",
    "while you were working. Force-pushing here would delete their commits. Reach",
    "for `--force-with-lease` only when *you* deliberately rewrote history and",
    "the rejection is the expected consequence."
  ],
  figure: [
    "rejected, you did NOT rewrite  →  git pull, then push",
    "rejected, you DID rewrite      →  git push --force-with-lease",
    "",
    "$ git push",
    " ! [rejected]  main -> main (fetch first)"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "The first push of a new branch, setting up tracking so plain `push` and `pull` work afterwards?",
  answer: [
    "$ git push -u origin feature/task-queue",
    "`-u` (`--set-upstream`) links the local branch to its remote counterpart."
  ],
  detail: [
    "Tracking is what gives bare `push` and `pull` a destination, and what lets",
    "`git status` report “ahead 2, behind 1.” Without it every push needs both",
    "the remote and branch spelled out, and git will nag you about it each time."
  ],
  figure: [
    "git push -u origin feature/task-queue    first time",
    "git push                           every time after",
    "",
    "$ git status -sb",
    "## feature/task-queue...origin/feature/task-queue [ahead 2]"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  question: "You branched with `switch -c`, committed a quick fix, and `git push` refuses: “the current branch has no upstream branch”. What is missing — and how do you fix it without retyping a long branch name?",
  answer: [
    "The branch exists only locally, so push has no destination. Link it — and",
    "let `HEAD` stand in for the current branch name:",
    "$ git push -u origin HEAD"
  ],
  detail: [
    "`HEAD` expands to whatever branch you are on, which matters when names are",
    "long or namespaced like `Component/feature/new_branch` — nothing to retype,",
    "nothing to mistype. After this one push, plain `git push` and `git pull`",
    "know where to go."
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
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  question: "Stop that error happening at all — make a plain `git push` create the upstream by itself for any new branch?",
  answer: [
    "One setting, once:",
    "$ git config --global push.autoSetupRemote true",
    "Pushing a branch with no upstream now creates and links it instead of",
    "failing."
  ],
  detail: [
    "Available from git 2.37 onwards — check with `git --version`. On a",
    "branch-per-task workflow this removes the most frequent piece of friction",
    "there is; on older versions, `git push -u origin HEAD` remains the manual",
    "equivalent."
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
  question: "What is `origin/main` — and why can it be out of date?",
  answer: [
    "A remote-tracking ref: your local *cache* of where the remote’s `main` stood",
    "at your last fetch. It is not a live view of the server."
  ],
  detail: [
    "Every ahead/behind count you read is measured against that cache, so it is",
    "only as fresh as your last fetch — which is why `git status` can cheerfully",
    "report “up to date” while the server has moved. It is also the hole in",
    "`--force-with-lease`: a background fetch updates the cache without you ever",
    "seeing the commits."
  ],
  figure: [
    "remote main     the server — live, authoritative",
    "     │",
    "     │  updated ONLY by fetch / pull",
    "     ▼",
    "origin/main     your cached view",
    "main            your branch",
    "",
    "ahead/behind is measured against the cache, not the server"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "05 sync basics",
  question: "Make `pull` refuse rather than quietly build a merge commit?",
  answer: [
    "$ git pull --ff-only",
    "$ git config --global pull.ff only",
    "Either it updates your branch cleanly or it stops and tells you why."
  ],
  detail: [
    "The refusal is the point. If `--ff-only` fails, your local branch holds",
    "commits the remote does not — usually because you committed onto a trunk",
    "without meaning to. Better to see that as an error than to discover it later",
    "as a merge commit in shared history."
  ],
  figure: [
    "$ git pull --ff-only",
    "fatal: Not possible to fast-forward, aborting.",
    "       ↑ you have local commits on this branch — look before merging"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "05 sync basics",
  question: "Pull, but replay your local commits on top of the incoming ones instead of merging?",
  answer: [
    "$ git pull --rebase",
    "$ git config --global pull.rebase true"
  ],
  detail: [
    "On a shared trunk the default merge behaviour scatters “Merge branch 'dev'",
    "of origin/dev into dev” commits through history, which carry no information.",
    "Rebasing on pull keeps your local commits linear on top of whatever arrived",
    "— at the cost of replaying them, which can conflict per commit."
  ],
  figure: [
    "merge-pull:  … ── origin work ──┐",
    "             … ── your commits ──┴── M   (noise commit)",
    "",
    "rebase-pull: … ── origin work ── your commits'   (linear)"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "06 conflicts",
  question: "A merge stops with `CONFLICT (content)`. First command to see where you stand?",
  answer: [
    "$ git status",
    "It lists the unmerged paths — the exact files waiting for your decision."
  ],
  detail: [
    "Git auto-merges everything it can and stops only on the hunks where both",
    "sides changed the same region. Files not listed as unmerged are already",
    "staged and done. If one whole side is right, `git checkout --ours <file>` or",
    "`--theirs <file>` takes it wholesale instead of hand-editing."
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
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "06 conflicts",
  question: "The three markers git writes into a conflicted file?",
  answer: [
    "`<<<<<<<` opens your side, `=======` divides, `>>>>>>>` closes theirs. Edit",
    "the file to the text you actually want and delete all three lines."
  ],
  detail: [
    "The result does not have to be either side — you are writing the final text,",
    "and often it is a combination neither branch contains. Git never re-reads",
    "the file to check your work, so a stray marker will be committed happily."
  ],
  figure: [
    "<<<<<<< HEAD",
    "  QUEUE_DEPTH = 16",
    "=======",
    "  QUEUE_DEPTH = 8",
    ">>>>>>> feature/task-queue",
    "",
    "grep -rn \"<<<<<<<\" src/    ← cheap insurance before continuing"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "06 conflicts",
  question: "Which side is “ours” and which is “theirs” — and why does the answer flip during a rebase?",
  answer: [
    "In a **merge**, ours is the branch you’re standing on. In a **rebase** it",
    "inverts: ours is the branch you’re replaying *onto*, theirs is your own",
    "commit being replayed."
  ],
  detail: [
    "The inversion is logical once you see the mechanics — a rebase checks out",
    "the target branch and applies your commits on top, so from git’s position",
    "your work is the incoming side. It still catches almost everyone the first",
    "time, and it is the reason to read the marker labels rather than assume."
  ],
  figure: [
    "merge  feature into main:",
    "  <<<<<<< HEAD          ← main   (ours)",
    "  >>>>>>> feature       ← feature (theirs)",
    "",
    "rebase feature onto main:",
    "  <<<<<<< HEAD          ← main   (ours — the new base)",
    "  >>>>>>> your commit   ← YOUR work (theirs)"
  ],
  proGit:   "Git-Tools-Advanced-Merging"
},

{
  stage:    "06 conflicts",
  question: "One whole side of the conflict is correct. Take it without hand-editing?",
  answer: [
    "$ git checkout --ours src/runner.py",
    "$ git checkout --theirs src/runner.py",
    "Then `git add` the file as usual."
  ],
  detail: [
    "This takes the *entire file* from one side, not just the conflicted hunk —",
    "fine for a generated file or a lockfile, wrong when each side has legitimate",
    "changes elsewhere in the same file. Check with `git diff` before staging."
  ],
  figure: [
    "--ours    keep this side's whole file",
    "--theirs  keep the other side's whole file",
    "",
    "then: git add <file>  and  --continue"
  ],
  proGit:   "Git-Tools-Advanced-Merging"
},

{
  stage:    "06 conflicts",
  question: "You’ve fixed a conflicted file. The two steps that finish the merge?",
  answer: [
    "$ git add src/runner.py",
    "$ git merge --continue",
    "The `add` marks the conflict resolved; the continue completes the merge",
    "commit."
  ],
  detail: [
    "Staging is the only signal git accepts — it does not re-read the file to",
    "check whether you actually resolved anything. A stray `<<<<<<<` left behind",
    "will be committed happily and break the build later, so grep for markers",
    "before continuing."
  ],
  figure: [
    "git add src/runner.py",
    "git status                       ← confirm nothing unmerged remains",
    "grep -rn \"<<<<<<<\" src/          ← cheap insurance",
    "git merge --continue"
  ],
  proGit:   "Git-Branching-Basic-Branching-and-Merging"
},

{
  stage:    "06 conflicts",
  question: "Abandon a half-done merge and return to the pre-merge state?",
  answer: [
    "$ git merge --abort"
  ],
  detail: [
    "It restores the working tree and index to where they were before the merge",
    "started, which is why merging with uncommitted changes is risky — git may",
    "not be able to reconstruct that state cleanly. If `--abort` ever refuses,",
    "`ORIG_HEAD` still records the pre-merge commit and",
    "`git reset --hard ORIG_HEAD` is the fallback."
  ],
  figure: [
    "git merge --abort              ← the normal way out",
    "",
    "git reset --hard ORIG_HEAD     ← fallback: ORIG_HEAD is set by",
    "                                 merge, rebase, reset and pull"
  ],
  proGit:   "Git-Tools-Advanced-Merging"
},

{
  stage:    "06 conflicts",
  question: "A conflict during a *rebase* — what’s the rhythm, and which command do you never run mid-rebase?",
  answer: [
    "**Fix → `git add` → `git rebase --continue`**, repeated per conflicted",
    "commit. Never `git commit` mid-rebase — the continue does the committing."
  ],
  detail: [
    "A rebase replays commits one at a time, so the same file can conflict",
    "several times over — once per commit that touched it. That is the cost",
    "rebase pays for a linear result: a merge resolves everything in a single",
    "commit, a rebase resolves it per replayed step."
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
  stage:    "06 conflicts",
  question: "Besides `--continue`, the two other exits from a conflicted rebase?",
  answer: [
    "`git rebase --skip` drops the commit currently being replayed;",
    "`git rebase --abort` rewinds the entire rebase to where you started."
  ],
  detail: [
    "`--skip` is right when the commit has become genuinely redundant — its",
    "change already arrived on the trunk by another route, so replaying it is a",
    "conflict with no content. Reach for it deliberately: skipping a commit whose",
    "work you still need loses it from the branch silently."
  ],
  figure: [
    "--continue  resolve, keep the commit, move on",
    "--skip      discard this commit entirely, move on",
    "--abort     unwind everything, back to the pre-rebase branch"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "06 conflicts",
  question: "The same conflict keeps returning every time you rebase onto the moving trunk. Which setting makes git replay your past resolution automatically?",
  answer: [
    "$ git config --global rerere.enabled true",
    "“Reuse recorded resolution” — resolve once, git remembers, identical",
    "conflicts resolve themselves."
  ],
  detail: [
    "Git hashes the conflict itself and stores your resolution under",
    "`.git/rr-cache`, replaying it only on a byte-exact match — so it cannot",
    "silently apply a stale fix to a conflict that has drifted. The cache is",
    "local and never pushed, which makes this a pure personal win with no",
    "coordination cost."
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
  question: "Replay your feature branch’s commits on top of the latest `main`?",
  answer: [
    "$ git switch feature",
    "$ git rebase main",
    "Git sets your commits aside, moves the branch to main’s tip, replays them",
    "one by one.",
    "| before        C4 ── F1 ── F2 ── F3   (feature)",
    "|                 \\",
    "|                  C5                  (main)",
    "|",
    "| after   C4 ── C5 ── F1'── F2'── F3'  (feature)"
  ],
  detail: [
    "Fetch first when the target is a remote branch — `git fetch` then",
    "`git rebase origin/main` — or you will replay onto a stale local copy and",
    "have to do it again. The branch point disappears from history entirely;",
    "afterwards the graph reads as though you had branched today."
  ],
  figure: [
    "before:        C4 ── F1 ── F2 ── F3   (feature)",
    "                 \\",
    "                  C5                  (main)",
    "",
    "after :  C4 ── C5 ── F1' ── F2' ── F3'  (feature)",
    "               ↑",
    "             main"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  question: "What happens to the SHAs of rebased commits?",
  answer: [
    "All new. Rebase creates *copies* on the new base — same content, different",
    "parents, different hashes. The originals are orphaned into the reflog.",
    "| old   C4 ── F1 ── F2 ── F3     abandoned, reflog only",
    "| new   C5 ── F1'── F2'── F3'    new parents ⇒ new hashes",
    "|       same changes, different identity"
  ],
  detail: [
    "A commit’s SHA is a hash of its content, its parents, its message, its",
    "author and its timestamps. Change the parent and the hash necessarily",
    "changes, and every descendant’s hash changes with it. That cascade is the",
    "whole reason rewriting shared history is destructive: everyone else is",
    "holding the old chain."
  ],
  figure: [
    "old:  C4 ── F1 ── F2 ── F3      abandoned, reflog only",
    "new:  C5 ── F1'── F2'── F3'     different parents ⇒ different SHAs",
    "",
    "content identical · identity different"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  question: "A rebase finished cleanly. Do you need to stage or commit anything before pushing?",
  answer: [
    "No — the replay *is* the committing. The working tree is clean and the",
    "branch already points at the result. All that’s left:",
    "$ git push --force-with-lease"
  ],
  detail: [
    "If `git status` is dirty right after a rebase, that is not the rebase asking",
    "for a commit. Either `rebase.autoStash` popped changes you were carrying",
    "before it started, or an editor wrote stale buffers back to disk — check the",
    "diff before trusting it."
  ],
  figure: [
    "$ git status",
    "On branch feature/task-queue",
    "nothing to commit, working tree clean",
    "",
    "$ git push --force-with-lease"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "07 rebasing",
  question: "Rebase refuses to start because your working tree is dirty. Two ways past it?",
  answer: [
    "Stash manually, or let git do it every time:",
    "$ git config --global rebase.autoStash true"
  ],
  detail: [
    "With autoStash enabled git sets the changes aside, runs the rebase, and pops",
    "them back afterwards — one less interruption in a routine operation. It also",
    "explains a working tree that looks dirty the moment a rebase finishes: those",
    "are your own pre-rebase changes returning, not something the rebase",
    "produced."
  ],
  figure: [
    "manual:  git stash → git rebase origin/dev → git stash pop",
    "auto  :  git config --global rebase.autoStash true",
    "",
    "error: cannot rebase: You have unstaged changes."
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "07 rebasing",
  question: "The one-sentence rule for merge vs rebase on your feature branch?",
  answer: [
    "**Rebase if the branch is yours alone; merge if anyone else has pulled it.**"
  ],
  detail: [
    "The rule is about who is holding the old SHAs, not about repository size or",
    "team policy. A solo branch has exactly one holder, so rewriting costs",
    "nothing beyond a force-push. The moment a second copy exists, rewriting",
    "turns a clean history into a reconciliation problem for someone else."
  ],
  figure: [
    "fetch, rebase, force-push — the routine for a solo branch:",
    "",
    "  git fetch origin",
    "  git rebase origin/dev",
    "  git push --force-with-lease"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  question: "After rebasing a branch that was already pushed, plain `git push` is rejected. Why, and what’s the correct next command?",
  answer: [
    "Your local SHAs no longer match the remote’s — non-fast-forward. The fix:",
    "$ git push --force-with-lease",
    "Never plain `--force`."
  ],
  detail: [
    "The rejection is git protecting the remote from losing commits. Your new",
    "chain is not a descendant of what is there, so accepting the push would",
    "orphan the old commits — which is precisely what you intend, but git makes",
    "you say so explicitly."
  ],
  figure: [
    "remote: feature ──▶ F3    (old chain)",
    "local : feature ──▶ F3'   (new chain)",
    "",
    "           ✗ not a fast-forward — F3 is not an ancestor of F3'"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "07 rebasing",
  question: "The golden rule of rebase?",
  answer: [
    "**Never rewrite history that exists on a shared branch.** Feature branches",
    "you own: rewrite freely. Anything colleagues pull: append, don’t rewrite."
  ],
  detail: [
    "The failure mode is concrete: a colleague who pulled the old chain and then",
    "pulls again gets both versions of every commit, and their next merge drags",
    "the duplicates into shared history. Repairing it means everyone resetting",
    "their local branch by hand — an apology-email class of mistake."
  ],
  figure: [
    "safe to rewrite      : your unpushed work, your solo branches",
    "never rewrite        : main, dev, anything a colleague pulled",
    "undo on shared branch: git revert  (appends, never rewrites)"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "07 rebasing",
  question: "You rebased onto main, but main’s changes don’t appear as “your” commits in `git log`. Where are they?",
  answer: [
    "Beneath you — as ancestors. A branch’s content is the union of",
    "*all commits reachable from its tip*, not just the ones you authored. The",
    "files on disk already contain them."
  ],
  detail: [
    "The check that settles it is `git diff origin/main --stat`: if the only",
    "files listed are ones you changed, main’s work is fully present in your",
    "branch. When the editor still shows old content after that, the disk is",
    "right and the editor’s buffer cache is stale."
  ],
  figure: [
    "feature tip",
    "   │",
    "   F3'── F2'── F1'── C5 ── C4 ── C3 ── …",
    "                     └──────────────── main's work, as ancestors",
    "",
    "git log dev..HEAD   ← just your commits",
    "git log             ← everything your branch contains"
  ],
  proGit:   "Git-Branching-Rebasing"
},

{
  stage:    "08 history edits",
  question: "Fix the message of the last commit?",
  answer: [
    "$ git commit --amend -m \"Add configurable queue depth\""
  ],
  detail: [
    "Dropping `-m` opens your editor with the old message preloaded, which is",
    "easier for anything longer than a subject line. Either way the commit is",
    "replaced rather than edited, so a branch already pushed needs a force-push",
    "afterwards."
  ],
  figure: [
    "git commit --amend -m \"New subject\"    inline",
    "git commit --amend                     opens editor, old text loaded"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "08 history edits",
  question: "You forgot to stage one file for the last commit. Fold it in, keeping the message?",
  answer: [
    "$ git add src/queue.py",
    "$ git commit --amend --no-edit"
  ],
  detail: [
    "This is the highest-frequency use of amend and the one worth aliasing — call",
    "it `git fixit`. Ten seconds of work replaces the “fix typo” and “forgot a",
    "file” commits that otherwise accumulate through any long session."
  ],
  figure: [
    "[alias]",
    "    fixit = commit --amend --no-edit",
    "",
    "$ git add src/queue.py",
    "$ git fixit"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "08 history edits",
  question: "What does `--amend` do to the old commit?",
  answer: [
    "Replaces it — the “edited” commit is a new object with a new SHA. The old",
    "one is orphaned but survives in your reflog for ~30 days."
  ],
  detail: [
    "Nothing in git is edited in place; amend builds a fresh commit from the same",
    "parent and moves the branch to it. That is why an amend is really a",
    "one-commit rebase, and why it carries every consequence a rebase carries."
  ],
  figure: [
    "before:  … ── B ── C     (main)",
    "",
    "after :  … ── B ── C'    (main)",
    "              \\",
    "               C          orphaned — reachable via reflog only"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "08 history edits",
  question: "The last commit has the wrong author or a wrong date. Fix it without touching the content?",
  answer: [
    "$ git commit --amend --author=\"Your Name <you@example.com>\" --no-edit",
    "$ git commit --amend --date=now --no-edit"
  ],
  detail: [
    "Useful after committing on a machine whose git identity was never",
    "configured, or one set to the wrong address. Each commit carries two",
    "timestamps — author date, when the work was written, and committer date,",
    "when it entered the repository — and a rebase preserves the first while",
    "resetting the second."
  ],
  figure: [
    "author date     when the change was written   (survives rebase)",
    "committer date  when it entered the repo       (reset by rebase)",
    "",
    "git log --pretty=format:'%h %ad %cd %s' --date=short"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "08 history edits",
  question: "Open interactive rebase for everything since `main` diverged; for just the last five commits?",
  answer: [
    "$ git rebase -i main",
    "$ git rebase -i HEAD~5",
    "An editor opens with one `pick` line per commit — your todo list."
  ],
  detail: [
    "The list arrives oldest-first, the reverse of `git log`, because it is the",
    "replay order. Reordering lines reorders commits; deleting a line drops that",
    "commit entirely, exactly as `drop` does. Saving an empty list aborts the",
    "whole rebase."
  ],
  figure: [
    "pick 1a2b3c4 Add task queue skeleton    ← oldest first",
    "pick 4d5e6f7 wip",
    "pick 9c8b7a6 Add overlfow counter",
    "",
    "# p pick · r reword · s squash · f fixup · d drop · e edit"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "Fold a commit into the one above it, combining both messages?",
  answer: [
    "Mark it `squash`. Git pauses and opens an editor holding both messages so",
    "you can write the combined one."
  ],
  detail: [
    "Reach for it when both commits describe real work and the merged commit",
    "deserves a message of its own. Note the direction: `squash` always folds",
    "*upward*, so the commit you intend to keep has to sit above the ones being",
    "absorbed."
  ],
  figure: [
    "pick   F1  Add queue skeleton",
    "squash F2  Add write-enable logic     ← folds up into F1",
    "",
    "editor opens with BOTH messages, you write the final one"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "Fold a commit into the one above it and throw its message away?",
  answer: [
    "Mark it `fixup`. Same fold as squash, no editor, message discarded — the",
    "tool for erasing `wip` and `oops`."
  ],
  detail: [
    "This is what collapses a long session of small increments into the two or",
    "three commits a reviewer actually wants. On a branch where an AI assistant",
    "has been committing in a tight loop, marking every incremental commit",
    "`fixup` is usually the whole clean-up."
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
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "The interactive-rebase verb for changing only a commit’s *message*?",
  answer: [
    "`reword`. The diff is untouched; git stops just long enough to open the",
    "message in your editor."
  ],
  detail: [
    "It is the right tool for a commit whose content is fine but whose subject",
    "line says “wip” or misspells the signal it introduces. The commit is still",
    "replaced rather than edited, so everything from it onward gets new hashes."
  ],
  figure: [
    "reword 9c8b7a6 Add overlfow counter",
    "       ↓",
    "       Add overflow counter"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "Pause a rebase at one particular commit so you can change its content?",
  answer: [
    "Mark it `edit`. The replay stops with that commit checked out; amend, split",
    "it, or inspect the tree, then `git rebase --continue`."
  ],
  detail: [
    "This is how you split one oversized commit into two: stop at it,",
    "`git reset HEAD^` to unstage its changes while keeping them on disk, then",
    "stage and commit them in two passes before continuing the rebase."
  ],
  figure: [
    "edit 1a2b3c4 Add queue and rewrite the runner",
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
  question: "What does `drop` do — and where’s the sharp edge?",
  answer: [
    "Removes the commit *and its changes*. Any later commit that built on those",
    "lines will conflict during replay, because the code it references no longer",
    "exists. `fixup` keeps changes; `drop` removes them."
  ],
  detail: [
    "Use it when the commit should never have existed — a committed secret,",
    "scratch code, an entire wrong direction. When you want the change but not",
    "the separate commit, `fixup` is the verb. Reaching for the wrong one is how",
    "a clean-up session turns into a conflict cascade."
  ],
  figure: [
    "pick F1  add overflow_count",
    "drop F2  wire overflow_count to the log",
    "pick F3  assert overflow_count in tests",
    "                    ↑ conflicts — the signal no longer exists"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "Mark a fix for an *older* commit now, and fold it in later without editing any todo list?",
  answer: [
    "$ git commit --fixup=1a2b3c4",
    "$ …later…",
    "$ git rebase -i --autosquash dev"
  ],
  detail: [
    "The first command writes a commit whose subject is literally",
    "`fixup! <original subject>`. On the rebase, `--autosquash` recognizes the",
    "prefix, moves each marker next to its target, and pre-marks it `fixup` — you",
    "review the list and save. Add `rebase.autoSquash=true` to make it the",
    "default."
  ],
  figure: [
    "git commit --fixup=1a2b3c4     → \"fixup! Add queue skeleton\"",
    "",
    "git rebase -i --autosquash dev",
    "  pick  1a2b3c4 Add queue skeleton",
    "  fixup 7f8e9d0 fixup! Add queue skeleton   ← reordered for you",
    "  pick  9c8b7a6 Add overflow counter"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "interactive-rebasing"
},

{
  stage:    "08 history edits",
  question: "You branched off the wrong branch. Move your two commits onto `main`, leaving behind the branch you started from?",
  answer: [
    "$ git rebase --onto main refactor task-queue",
    "| before  base ─ refactor ─ skeleton ─ tests   ← task-queue",
    "|",
    "| after   base ─ refactor",
    "|            └── skeleton ─ tests              ← task-queue"
  ],
  detail: [
    "Read the three arguments as three answers: land them *on* `main`, stop",
    "counting at `refactor`, move `task-queue`. Git replays every commit that is",
    "in the branch but not in `refactor`, so the refactor work is cut away rather",
    "than carried along. Plain `git rebase main task-queue` counts from the",
    "common ancestor instead, and moves the refactor commit too."
  ],
  figure: [
    "git rebase --onto NEWBASE UPSTREAM BRANCH",
    "                     │        │       │",
    "                     │        │       └─ which commits to move",
    "                     │        └───────── where to stop counting, excluded",
    "                     └────────────────── where they land"
  ],
  proGit:   "Git-Branching-Rebasing",
  bottomUp: "branching-and-the-power-of-rebase"
},

{
  stage:    "08 history edits",
  question: "Your rebase came out in a straight line and the merge commits are gone. Keep the shape?",
  answer: [
    "Rebase replays *non-merge* commits one at a time, so a two-parent commit has",
    "nowhere to land and the topology is flattened.",
    "$ git rebase --rebase-merges --onto <new-base> <old-base> main"
  ],
  detail: [
    "Nothing is lost but the shape — the flattened history ends at exactly the",
    "same tree, file for file. Seven commits carrying two merges come out as",
    "five carrying none. `--rebase-merges` rebuilds the merges as it goes, and",
    "`rebase.rebaseMerges = true` makes it the default."
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
  bottomUp: "branching-and-the-power-of-rebase"
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
    "`--max-parents=0` picks the one commit with no parent. Amending it builds a",
    "new commit object rather than editing the old one, and since a commit's",
    "hash covers its parent's, everything after it is rebuilt too — expect every",
    "hash in the repository to change. If the branch is already published the",
    "follow-up is `git push --force-with-lease`, and anyone holding a clone has",
    "to reset onto the new history rather than pull."
  ],
  figure: [
    "before   7c1a4e0 ─ 2f9b83d ─ 4ad0c11     nothing licences the root",
    "",
    "after    e5b62af ─ 9d3c740 ─ 0bf1e28     a licence from commit one",
    "         └─ same changes, same messages, new identities"
  ],
  proGit:   "Git-Tools-Rewriting-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "09 cherry-picking",
  question: "Copy one specific commit from anywhere in the repo onto your current branch?",
  answer: [
    "$ git cherry-pick a1b2c3d",
    "A new commit with the same changes — and a new SHA, because the parent",
    "differs.",
    "| main     A ── B ── C ── D",
    "|                \\",
    "| release          C'          ← a copy: same change, new hash",
    "|                              C itself stays on main"
  ],
  detail: [
    "Cherry-pick copies rather than moves; the original stays where it was. That",
    "leaves the same change present twice in the repository under two identities,",
    "which is fine when deliberate and confusing when forgotten — a common source",
    "of “why did this conflict, I already fixed it.”"
  ],
  figure: [
    "main     A ── B ── C ── D",
    "                 \\",
    "release           C'        ← copy of C, new SHA, C stays on main"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "09 cherry-picking",
  question: "Cherry-pick a whole range of commits — and which end is excluded?",
  answer: [
    "$ git cherry-pick a1b2c3d..h7i8j9k",
    "Exclusive of the first, inclusive of the last — same two-dot semantics as",
    "log ranges.",
    "| A ── B ── C ── D ── E",
    "|      └───────────┘",
    "|      B..E  picks C, D, E     (B excluded)",
    "|      B^..E picks B, C, D, E  (B included)"
  ],
  detail: [
    "To include the first commit as well, use three dots on the left —",
    "`a1b2c3d^..h7i8j9k` — where `^` means “the parent of.” Ranges replay in",
    "order and can conflict partway; the same `--continue` / `--skip` / `--abort`",
    "trio applies."
  ],
  figure: [
    "A..B   everything reachable from B but not A   (A excluded)",
    "A^..B  same, plus A itself                     (A included)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "09 cherry-picking",
  question: "Apply a commit’s changes to your working tree *without* committing yet?",
  answer: [
    "$ git cherry-pick -n a1b2c3d",
    "`-n` (no-commit) stages the changes and stops — you decide how to commit."
  ],
  detail: [
    "Useful when you want part of a commit, or want to combine several picks into",
    "one commit of your own. Pick with `-n`, unstage what you do not want with",
    "`git restore --staged`, then commit the remainder with a message that fits",
    "your branch."
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
  question: "A cherry-pick stops on a conflict. The three ways out?",
  answer: [
    "Same trio as rebase: fix and `git cherry-pick --continue`, abandon this one",
    "with `--skip`, or unwind everything with `--abort`.",
    "| --continue  resolved, carry on with the range",
    "| --skip      drop this one commit, continue",
    "| --abort     unwind the whole operation"
  ],
  detail: [
    "Conflicts are common here because the commit was written against a different",
    "ancestor than the one you are applying it to. If a pick conflicts heavily,",
    "that is usually the signal the branches should be merged or rebased rather",
    "than picked from one by one."
  ],
  figure: [
    "git cherry-pick --continue   resolved, carry on",
    "git cherry-pick --skip       drop this one, continue the range",
    "git cherry-pick --abort      unwind the whole operation"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "09 cherry-picking",
  question: "Two classic cherry-pick use cases?",
  answer: [
    "Backporting a single fix from `main` to a release branch, and salvaging one",
    "good commit from an otherwise-abandoned experiment."
  ],
  detail: [
    "Both share a shape: you want one commit’s content without its branch’s",
    "history. When you find yourself picking more than a handful in sequence,",
    "that is the signal the branches should be merged or rebased instead —",
    "cherry-pick is a scalpel, not a transport."
  ],
  figure: [
    "hotfix on main ──▶ pick onto release/1.2   (backport)",
    "dead branch    ──▶ pick the one good commit  (salvage)"
  ],
  proGit:   "Distributed-Git-Maintaining-a-Project"
},

{
  stage:    "10 undo · reflog",
  question: "Unstage a file but keep your edits in the working tree?",
  answer: [
    "$ git restore --staged src/runner.py"
  ],
  detail: [
    "This is the reversible half of the staging area: the index goes back to",
    "matching HEAD while your edits stay on disk untouched. Nothing is lost,",
    "which is why over-staging is a harmless mistake and `git add .` is safe to",
    "use freely."
  ],
  figure: [
    "                    restore --staged",
    "index        ◀───────────────────────  back to HEAD",
    "working tree ─────── unchanged ──────▶  your edits survive"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "doing-a-mixed-reset"
},

{
  stage:    "10 undo · reflog",
  question: "Throw away your uncommitted edits to one file — back to the committed version?",
  answer: [
    "$ git restore src/runner.py",
    "Destructive: the edits are gone, no undo."
  ],
  detail: [
    "This is the one place git offers no safety net — uncommitted work was never",
    "in the object database, so the reflog has nothing to recover. When you want",
    "the tree clean but the work retrievable, `git stash -u` gives you the same",
    "clean tree with an escape hatch."
  ],
  figure: [
    "git restore src/runner.py    one file",
    "git restore .              every tracked file — no undo",
    "git stash -u               same clean tree, work recoverable"
  ],
  proGit:   "Git-Basics-Undoing-Things",
  bottomUp: "doing-a-hard-reset"
},

{
  stage:    "10 undo · reflog",
  question: "`restore` cleaned up the tracked files, but scratch files and build output are still there. Which command removes them — and how do you look first?",
  answer: [
    "$ git clean -nd     ← dry run: lists, deletes nothing",
    "$ git clean -fd     ← actually deletes"
  ],
  detail: [
    "`restore` and `reset` only ever touch files git tracks; untracked files are",
    "invisible to both. `-d` includes directories, `-f` is required because the",
    "operation is irreversible, and `-x` would sweep ignored files too. Run the",
    "dry form first, every time."
  ],
  figure: [
    "$ git clean -nd",
    "Would remove src/scratch.py",
    "Would remove build/",
    "",
    "-n  dry run      -d  include directories",
    "-f  do it        -x  ignored files too (usually too much)"
  ],
  proGit:   "Git-Tools-Stashing-and-Cleaning"
},

{
  stage:    "10 undo · reflog",
  question: "“Reset everything” in full — tracked *and* untracked — as two commands?",
  answer: [
    "$ git reset --hard HEAD",
    "$ git clean -fd",
    "Together: the working tree exactly as HEAD has it, nothing else present."
  ],
  detail: [
    "This pair is worth wrapping in an alias that asks first, since nothing it",
    "removes is recoverable — `git nuke` does the asking, and `git nuke-preview`",
    "shows what it would take. The non-destructive alternative when",
    "“discard” really means “get this out of my way” is `git stash -u` — same",
    "clean tree, work still retrievable."
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
  question: "`reset --soft` vs the default (`--mixed`) vs `--hard`?",
  answer: [
    "**soft**: move the branch pointer, keep index and working tree. **mixed**:",
    "move and unstage, keep the working tree. **hard**: move and discard",
    "everything. Same pointer move, escalating destruction.",
    "|                 HEAD   index   working tree",
    "| --soft            ✓       ·          ·",
    "| --mixed           ✓       ✓          ·     (default)",
    "| --hard            ✓       ✓          ✓",
    "| ✓ = reset to target   · = left alone"
  ],
  detail: [
    "`--soft HEAD~3` is the clean way to collapse three commits into one: the",
    "pointer rewinds, all the changes land staged, you commit once. Only `--hard`",
    "can lose work, and only work that was never committed — the commits it moves",
    "away from remain in the reflog."
  ],
  figure: [
    "                   HEAD   index   working tree",
    "reset --soft         ✓       ·          ·",
    "reset --mixed        ✓       ✓          ·      (default)",
    "reset --hard         ✓       ✓          ✓",
    "",
    "✓ = reset to target · · = left alone"
  ],
  proGit:   "Git-Tools-Reset-Demystified",
  bottomUp: "to-reset-or-not-to-reset"
},

{
  stage:    "10 undo · reflog",
  question: "Your last three commits should have been one. Collapse them without an interactive rebase?",
  answer: [
    "$ git reset --soft HEAD~3",
    "$ git commit -m \"Add task queue\""
  ],
  detail: [
    "The pointer rewinds three commits while the index and working tree stay",
    "exactly as they are, so all the changes land staged and ready. Only the",
    "branch label moved — the original three commits remain in the reflog if you",
    "want them back."
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
  bottomUp: "doing-a-soft-reset"
},

{
  stage:    "10 undo · reflog",
  question: "Undo a commit that colleagues have already pulled?",
  answer: [
    "$ git revert a1b2c3d",
    "Appends a new commit that inverts the old one. History grows instead of",
    "rewriting — safe on shared branches.",
    "| … ── A ── B ── C ── C⁻¹",
    "|                     ↑ a new commit that inverts C;",
    "|                       C stays visible in the history"
  ],
  detail: [
    "Because it only appends, everyone else’s history stays valid and a plain",
    "`git pull` picks the undo up. Reverting a merge commit needs `-m 1` to say",
    "which parent counts as the mainline — without it git cannot tell which side",
    "you want to keep."
  ],
  figure: [
    "… ── A ── B ── C ── C⁻¹",
    "                     revert of C, appended as a new commit",
    "",
    "git revert -m 1 <merge-sha>   ← reverting a merge"
  ],
  proGit:   "Git-Basics-Undoing-Things"
},

{
  stage:    "10 undo · reflog",
  question: "`revert` vs `reset` — the one-line distinction?",
  answer: [
    "**Revert appends history; reset rewrites it.** Revert for anything shared,",
    "reset for commits only you have."
  ],
  detail: [
    "It is the same fork the merge-versus-rebase question turns on, applied to",
    "undo: whether anyone else is holding the SHAs you are about to invalidate.",
    "Nothing pushed, nobody pulled — reset. Otherwise the honest record is a",
    "revert, which also leaves the original commit visible for anyone asking what",
    "happened."
  ],
  figure: [
    "unpushed, nobody has it  ──▶ reset  (rewrite)",
    "pushed, colleagues pulled ──▶ revert (append)"
  ],
  proGit:   "Git-Tools-Reset-Demystified"
},

{
  stage:    "10 undo · reflog",
  question: "What is the reflog?",
  answer: [
    "*ref* + *log*: a local journal of every pointer movement — commits,",
    "switches, rebases, resets. It sees orphaned commits that `git log` can’t.",
    "Never pushed; entries expire in 30–90 days.",
    "| git log     what is reachable from here, now",
    "| git reflog  everywhere HEAD has been, including",
    "|             commits a rebase or reset orphaned"
  ],
  detail: [
    "The distinction that makes it useful: `git log` walks the commit graph and",
    "can only show what is currently reachable, while the reflog is a",
    "chronological record of where HEAD has been — including commits that a",
    "rebase or reset orphaned. Bare repositories keep none by default, which is",
    "why a force-push to a server is harder to undo than a local mistake."
  ],
  figure: [
    "$ git reflog",
    "5e6f7g8 HEAD@{0}: rebase -i (finish): returning to feature/task-queue",
    "2b3c4d5 HEAD@{1}: rebase -i (fixup): Add queue skeleton",
    "9c8b7a6 HEAD@{2}: commit: Add overflow counter   ← target",
    "f2g3h4i HEAD@{3}: checkout: moving from main to feature"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  bottomUp: "stashing-and-the-reflog"
},

{
  stage:    "10 undo · reflog",
  question: "A hard reset landed in the wrong place. The recovery sequence?",
  answer: [
    "$ git reflog",
    "$ git reset --hard HEAD@{2}",
    "Find the entry from before the mistake, reset to it. `HEAD@{n}` means “where",
    "HEAD was *n* moves ago.”"
  ],
  detail: [
    "The same move recovers a botched rebase, a wrongly amended commit, or a",
    "branch deleted with `-D` — anything that moved a pointer rather than",
    "destroying an object. What it cannot recover is uncommitted work, which",
    "never entered the object database in the first place."
  ],
  figure: [
    "recoverable : bad reset · botched rebase · wrong amend",
    "              · branch deleted with -D",
    "not recoverable: uncommitted edits discarded by restore",
    "                 or reset --hard"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery",
  bottomUp: "doing-a-hard-reset"
},

{
  stage:    "10 undo · reflog",
  question: "You deleted a branch with `-D` and now want it back. Two steps?",
  answer: [
    "$ git reflog",
    "$ git branch feature/task-queue 5e6f7g8",
    "Find the tip commit in the reflog, then plant a fresh label on it."
  ],
  detail: [
    "Deleting a branch only removes a 41-byte file; the commits stay in the",
    "object database until garbage collection, which spares unreachable objects",
    "for about thirty days. `git branch <name> <sha>` creates a label at any",
    "commit without switching to it."
  ],
  figure: [
    "git reflog                       find the old tip",
    "git branch <name> <sha>          re-label it, stay put",
    "git switch -c <name> <sha>       re-label and switch"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery"
},

{
  stage:    "10 undo · reflog",
  question: "What is `ORIG_HEAD`, and when does it save you?",
  answer: [
    "A ref git sets to your previous position before any big move — merge,",
    "rebase, reset, pull. `git reset --hard ORIG_HEAD` undoes the last one."
  ],
  detail: [
    "It is a one-slot shortcut for the reflog: quicker to type when the very last",
    "operation was the mistake, useless once a second big operation has",
    "overwritten it. When `merge --abort` refuses because the pre-merge state",
    "cannot be reconstructed, this is the fallback."
  ],
  figure: [
    "git merge dev",
    "git reset --hard ORIG_HEAD     undo that merge",
    "",
    "set by: merge · rebase · reset · pull",
    "holds only ONE position — the reflog holds the rest"
  ],
  proGit:   "Git-Internals-Maintenance-and-Data-Recovery"
},

{
  stage:    "11 remotes & server",
  question: "Create a push-ready repository on the server — and why does it have to be this kind?",
  answer: [
    "$ git init --bare taskrunner.git",
    "Bare means the repository has no working tree. Git refuses a push to a",
    "branch that is checked out, and a bare repository has nothing checked out."
  ],
  detail: [
    "The command creates the directory itself, so no `mkdir` is needed — but run",
    "it from the parent, never inside an existing repo folder, or you convert",
    "that folder into a bare repo. The `.git` suffix is convention, not",
    "requirement, and it must match the path in your remote URL exactly."
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
  proGit:   "Git-on-the-Server-Getting-Git-on-a-Server"
},

{
  stage:    "11 remotes & server",
  question: "Connect your local repo to that remote, then verify the wiring?",
  answer: [
    "$ git remote add origin git@server.local:repos/taskrunner.git",
    "$ git remote -v"
  ],
  detail: [
    "The URL is `user@host:path`, where the colon separates host from path.",
    "Omitting the leading slash makes the path relative to that SSH user’s home",
    "directory — shorter to type and it survives a home-directory move. `origin`",
    "is only a conventional name; `git remote rename` changes it freely."
  ],
  figure: [
    "git@server.local:repos/repo.git   absolute",
    "git@server.local:repos/repo.git                 relative to ~",
    "",
    "with an ~/.ssh/config Host alias:",
    "server:repos/project.git"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "11 remotes & server",
  question: "See what refs the remote actually has, without fetching anything?",
  answer: [
    "$ git ls-remote origin",
    "The first diagnostic for any remote confusion: empty repo? branch named",
    "`master`? wrong repo entirely?"
  ],
  detail: [
    "It asks the server for its ref list and prints it — no objects downloaded,",
    "nothing in your repo changed. Three readings cover most failures: empty",
    "output means the remote has no commits, a `refs/heads/master` line means",
    "your `main` has no counterpart, and an SSH error means the problem is",
    "authentication rather than git."
  ],
  figure: [
    "$ git ls-remote origin",
    "a1b2c3d…    HEAD",
    "a1b2c3d…    refs/heads/main",
    "f4e5d6c…    refs/heads/dev",
    "",
    "empty output ⇒ remote has no commits yet"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "11 remotes & server",
  question: "You ran `init`, added the remote, and `pull` failed: “no commit on branch ’main’ yet.” Why — and the right tool?",
  answer: [
    "`init` creates the branch ref lazily; it’s *unborn* until the first commit,",
    "so there’s no local main to merge into. For an existing remote the right",
    "tool is `git clone` — or `fetch` + `switch -c main --track origin/main` if",
    "local files must survive."
  ],
  detail: [
    "`clone` does in one atomic step what `init` plus `remote add` plus `pull`",
    "was trying to approximate: creates the directory, initializes the repo, sets",
    "up `origin`, fetches everything, and checks out a tracking branch. `init` is",
    "for starting something new, never for connecting to something that already",
    "exists."
  ],
  figure: [
    "git clone <url>              ← existing remote",
    "",
    "git init  +  remote add  +  pull",
    "     ↑ for starting something new — not for connecting"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository"
},

{
  stage:    "11 remotes & server",
  question: "“fatal: refusing to merge unrelated histories” — what happened, and the two ways out?",
  answer: [
    "Local and remote share no common ancestor — two histories born from nothing,",
    "the classic `init`-then-`pull` result. Escape hatch:",
    "`--allow-unrelated-histories`. Usually better: scrap and `clone`."
  ],
  detail: [
    "Git refuses because the situation is nearly always a mistake — a merge with",
    "no shared base has nothing to three-way against, so every file that exists",
    "on both sides conflicts. Forcing it works but leaves a repository with two",
    "roots, which reads as noise in every graph view forever."
  ],
  figure: [
    "local :  L1 ── L2            two roots,",
    "remote:  R1 ── R2 ── R3      no common ancestor",
    "",
    "git pull --allow-unrelated-histories   forces it",
    "rm -rf . && git clone <url>            usually what you wanted"
  ],
  proGit:   "Git-Basics-Getting-a-Git-Repository"
},

{
  stage:    "11 remotes & server",
  question: "The Pi’s username or IP changed. Repoint the remote without re-cloning?",
  answer: [
    "$ git remote set-url origin git@newhost.local:repos/taskrunner.git"
  ],
  detail: [
    "The URL is just a config value — nothing about your history depends on it,",
    "so switching between HTTPS and SSH, or between hosts, is a one-line edit.",
    "Verify with `git remote -v`, since a typo surfaces only on the next push as",
    "a confusing authentication or path error."
  ],
  figure: [
    "git remote set-url origin git@github.com:yourname/taskrunner.git   HTTPS → SSH",
    "git remote -v                                                    verify",
    "git remote rename origin pi                                      rename"
  ],
  proGit:   "Git-Basics-Working-with-Remotes"
},

{
  stage:    "11 remotes & server",
  question: "The feature has landed. Delete the branch on the remote as well as locally?",
  answer: [
    "$ git branch -d feature/task-queue",
    "$ git push origin --delete feature/task-queue"
  ],
  detail: [
    "Deleting locally leaves the remote copy untouched and vice versa — they are",
    "separate refs. Everyone else keeps a stale `origin/feature/task-queue` until",
    "they fetch with pruning, which is what `fetch.prune=true` makes automatic."
  ],
  figure: [
    "git branch -d feature/task-queue             local label",
    "git push origin --delete feature/task-queue  remote label",
    "git fetch --prune                      drop stale origin/* refs",
    "",
    "git config --global fetch.prune true   make it automatic"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "12 ssh & auth",
  question: "Generate a new SSH key with a meaningful filename rather than the default?",
  answer: [
    "$ ssh-keygen -t ed25519 -C \"github-personal\" -f ~/.ssh/github_personal",
    "Two files appear: the private key, and `.pub` alongside it."
  ],
  detail: [
    "Ed25519 is the modern default — short, fast, secure — and worth preferring",
    "over RSA unless something ancient refuses it. Setting a passphrase is worth",
    "the one prompt: without it, the key file alone is enough for anyone who",
    "reaches your disk."
  ],
  figure: [
    "-t ed25519   algorithm",
    "-C \"label\"   comment — cosmetic only",
    "-f <path>    filename (this is the meaningful-name part)",
    "",
    "~/.ssh/github_personal       private — never leaves the machine",
    "~/.ssh/github_personal.pub   public  — paste anywhere"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  question: "Two machines, and you can’t tell whether they share a key. What actually identifies one?",
  answer: [
    "The **fingerprint**. The trailing comment (`you@old-laptop`) is a label set",
    "at keygen time and ignored during authentication.",
    "$ ssh-keygen -lf ~/.ssh/github_personal.pub"
  ],
  detail: [
    "A key copied forward through several laptop migrations still carries the",
    "hostname it was born with, which is why the comment so often names a machine",
    "you no longer own. Compare fingerprints on both ends — locally, and against",
    "the server’s `authorized_keys`."
  ],
  figure: [
    "ssh-keygen -lf ~/.ssh/id_ed25519.pub          your fingerprint",
    "ssh git@server.local 'ssh-keygen -lf ~/.ssh/authorized_keys'",
    "",
    "ssh -v git@github.com 2>&1 | grep -i 'offering\\|accepted'",
    "    ↑ which key file actually authenticated"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  question: "You made a key with a custom name and the server still refuses you. What’s missing?",
  answer: [
    "SSH only auto-tries default filenames. A custom name needs a `Host` block in",
    "`~/.ssh/config` naming it."
  ],
  detail: [
    "The file must not be world-readable — `chmod 600 ~/.ssh/config` — or SSH",
    "refuses to read it at all. Once the block exists, plain `ssh github.com` and",
    "every git operation against that host use the key you named."
  ],
  figure: [
    "Host github.com",
    "    HostName github.com",
    "    User git",
    "    IdentityFile ~/.ssh/github_personal",
    "    IdentitiesOnly yes",
    "",
    "chmod 600 ~/.ssh/config"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  question: "Why does `IdentitiesOnly yes` matter on a machine with several keys?",
  answer: [
    "Without it SSH offers every key it can find, in its own order — so a work",
    "key may be presented to a personal account, fail, and leave you confused."
  ],
  detail: [
    "Servers identify you by whichever key you successfully present, so offering",
    "the wrong one first is not a harmless retry — on a host with two accounts",
    "you end up authenticated as the wrong person. The flag restricts the offer",
    "to the `IdentityFile` in that block and nothing else."
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
  question: "Stop being asked for the key passphrase on every single push, on macOS?",
  answer: [
    "$ ssh-add --apple-use-keychain ~/.ssh/github_personal",
    "Loads the key into the agent and stores the passphrase in the macOS",
    "Keychain."
  ],
  detail: [
    "Add `UseKeychain yes` and `AddKeysToAgent yes` to the host block and the key",
    "loads itself on first use after every login. `ssh-add -l` lists what the",
    "agent currently holds, by fingerprint."
  ],
  figure: [
    "ssh-add --apple-use-keychain ~/.ssh/github_personal",
    "ssh-add -l          what the agent holds right now",
    "",
    "Host github.com",
    "    UseKeychain yes",
    "    AddKeysToAgent yes"
  ],
  proGit:   "Git-Tools-Credential-Storage"
},

{
  stage:    "12 ssh & auth",
  question: "Confirm SSH access to GitHub actually works, before touching any repository?",
  answer: [
    "$ ssh -T git@github.com",
    "A greeting naming your account means success — the “no shell access” line is",
    "expected, not an error."
  ],
  detail: [
    "Testing the transport separately is what tells you whether a failed push is",
    "an authentication problem or a git problem. Add `-v` and the output names",
    "each key file offered and which one the server accepted."
  ],
  figure: [
    "$ ssh -T git@github.com",
    "Hi yourname! You've successfully authenticated, but GitHub",
    "does not provide shell access.        ← this IS success",
    "",
    "$ ssh -T git@server.local exit   ← same test, your server"
  ],
  proGit:   "Git-on-the-Server-Generating-Your-SSH-Public-Key"
},

{
  stage:    "12 ssh & auth",
  question: "GitHub answers a pull with “Password authentication is not supported.” What broke, and the two fixes?",
  answer: [
    "GitHub removed password auth for git operations in 2021. Either switch the",
    "remote to SSH, or generate a Personal Access Token and use it in place of",
    "the password over HTTPS."
  ],
  detail: [
    "SSH is the lower-maintenance answer for personal repositories: one key",
    "setup that then lasts. Tokens make sense when a network policy",
    "forces HTTPS — and then they expire on whatever schedule you chose, which is",
    "the ritual SSH avoids."
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
  question: "`--force` vs `--force-with-lease`?",
  answer: [
    "The lease overwrites the remote branch *only if* it still matches your",
    "last-fetched view — if someone pushed meanwhile, it aborts with “stale",
    "info.” Plain `--force` overwrites blind, including work you’ve never seen."
  ],
  detail: [
    "It is a compare-and-swap: expected value, new value, abort on mismatch. The",
    "one hole is that a background fetch — an IDE polling in the corner — updates",
    "your tracking ref without you seeing the commits, so the check passes",
    "anyway; `push.useForceIfIncludes=true` closes it by also requiring the",
    "remote tip to be reachable from your branch."
  ],
  figure: [
    "--force            overwrite whatever is there",
    "--force-with-lease  overwrite only if remote == origin/feature",
    "                    else → ! [rejected] (stale info)",
    "",
    "git config --global push.useForceIfIncludes true"
  ],
  proGit:   "Git-Branching-Remote-Branches"
},

{
  stage:    "13 daily practice",
  question: "Ignore `.DS_Store` in every repository on this machine — the two-step?",
  answer: [
    "$ echo \".DS_Store\" >> ~/.gitignore_global",
    "$ git config --global core.excludesFile ~/.gitignore_global",
    "One global rule instead of a per-repo entry forever."
  ],
  detail: [
    "Global ignores are the right home for machine noise — OS metadata, editor",
    "swap files, IDE directories — because they are about your environment rather",
    "than the project. Project-specific artifacts like `build/` belong in the",
    "repo’s own `.gitignore`, where every contributor gets them."
  ],
  figure: [
    "~/.gitignore_global        your machine's noise",
    "    .DS_Store",
    "    ._*",
    "    *.swp",
    "",
    "<repo>/.gitignore          the project's artifacts",
    "    build/",
    "    *.o"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "13 daily practice",
  question: "Keep build output out of the repository for everyone who clones it?",
  answer: [
    "A `.gitignore` file committed at the repo root — patterns apply to that",
    "directory and everything beneath it."
  ],
  detail: [
    "Project artifacts belong here, where every contributor inherits them;",
    "machine noise like `.DS_Store` belongs in your global ignore file instead. A",
    "leading slash anchors a pattern to the repo root, a leading `!` re-includes",
    "something an earlier line excluded."
  ],
  figure: [
    "build/          any directory named build, at any depth",
    "/build/         only the one at the repo root",
    "*.o             by extension",
    "!keep.o         re-include one file",
    "doc/**/*.pdf    glob across directories"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "13 daily practice",
  question: "You added a file to `.gitignore` but git keeps tracking it. Why — and the fix?",
  answer: [
    "Ignore rules apply only to *untracked* files; this one was already",
    "committed. Untrack it without deleting from disk:",
    "$ git rm --cached .DS_Store",
    "then commit. The rule takes effect from there."
  ],
  detail: [
    "`--cached` is what keeps the file on disk — without it, `git rm` deletes it",
    "as well. Check whether you have the problem at all with",
    "`git ls-files | grep DS_Store`: if nothing comes back, the ignore rule is",
    "already doing its job."
  ],
  figure: [
    "git ls-files | grep DS_Store    ← is it actually tracked?",
    "git rm --cached .DS_Store       ← untrack, keep on disk",
    "git rm .DS_Store                ← untrack AND delete"
  ],
  proGit:   "Git-Basics-Recording-Changes-to-the-Repository"
},

{
  stage:    "13 daily practice",
  question: "Where does the global gitconfig live on Windows — and the command that always finds it, on any OS?",
  answer: [
    "`%USERPROFILE%\\.gitconfig`. But don’t hunt for it:",
    "$ git config --global --edit",
    "opens the right file wherever you are."
  ],
  detail: [
    "Four layers stack, each overriding the one before: system, global, local,",
    "worktree. When a setting refuses to behave,",
    "`git config --list --show-origin` prints every value with the file it came",
    "from — usually revealing a local override you forgot about."
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
  question: "A config setting refuses to behave. Which command shows where every value came from?",
  answer: [
    "$ git config --list --show-origin",
    "Four layers stack — system, global, local, worktree — and the later one",
    "always wins."
  ],
  detail: [
    "Nine times out of ten the culprit is a local `.git/config` override set",
    "months ago and forgotten. Add `--get` with a key name to check a single",
    "setting rather than reading the whole stack."
  ],
  figure: [
    "system    /etc/gitconfig          lowest",
    "global    ~/.gitconfig               ↓",
    "local     .git/config                ↓",
    "worktree  .git/config.worktree    highest",
    "",
    "git config --get --show-origin pull.rebase"
  ],
  proGit:   "Customizing-Git-Git-Configuration"
},

{
  stage:    "13 daily practice",
  question: "`git log --since=2 weeks ago` → “fatal: ambiguous argument ’weeks’”. What went wrong?",
  answer: [
    "The shell split the unquoted value into three arguments before git saw it.",
    "Quote it — `--since=\"2 weeks ago\"` — or use the space-free dot form:",
    "`--since=2.weeks`."
  ],
  detail: [
    "Git parses a generous range of date formats — relative phrases, named days,",
    "ISO dates — but every one of them has to arrive as a single argument.",
    "ISO-8601 (`2026-04-01`) is the unambiguous choice; slash-separated dates are",
    "locale-dependent and worth avoiding."
  ],
  figure: [
    "--since=\"2 weeks ago\"     quoted",
    "--since=2.weeks           dot form, no quoting needed",
    "--since=2026-04-01        ISO, unambiguous",
    "--since=04/01/2026        ambiguous — avoid"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  question: "Show the commits that are on `dev` but not yet on `main`?",
  answer: [
    "$ git log main..dev --oneline",
    "Two dots: “reachable from the second, not from the first” — the release",
    "queue in one line."
  ],
  detail: [
    "The same syntax answers the everyday questions: `dev..HEAD` is what your",
    "branch adds, `HEAD..origin/dev` is what is waiting to arrive. Three dots is",
    "the symmetric version, showing what is unique to *either* side — the “how",
    "far have we diverged” view."
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
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  question: "Hide merge commits from a log; show *only* the merges?",
  answer: [
    "`--no-merges` and `--merges`. The second is a quick “what landed this week”",
    "view on a busy trunk."
  ],
  detail: [
    "A third option beats both on a trunk where every feature arrives as a merge:",
    "`--first-parent` follows only the mainline parent, collapsing each merged",
    "branch to a single entry. Thousands of interior commits become a readable",
    "list of landings."
  ],
  figure: [
    "--no-merges              hide merge commits",
    "--merges                 only merge commits",
    "--first-parent dev       trunk landings, interiors collapsed"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  question: "Read a busy trunk as a list of what landed, without the interior of every merged branch?",
  answer: [
    "$ git log --first-parent dev --oneline",
    "Follows only each merge’s first parent — the mainline."
  ],
  detail: [
    "Because a merge commit’s first parent is the branch you were standing on,",
    "following it collapses each merged branch to a single entry. On a trunk with",
    "thousands of commits this is the difference between a wall of text and a",
    "readable week-in-review."
  ],
  figure: [
    "full log        every commit from every merged branch",
    "--first-parent  one entry per landing",
    "",
    "git log --first-parent dev --since=2.weeks --oneline"
  ],
  proGit:   "Git-Tools-Revision-Selection",
  bottomUp: "a-commit-by-any-other-name"
},

{
  stage:    "13 daily practice",
  question: "Limit a log to commits touching one directory?",
  answer: [
    "Everything after `--` is a pathspec:",
    "$ git log --oneline -- src/core/",
    "On a large repository, this is the difference between history and noise."
  ],
  detail: [
    "The `--` separator exists to disambiguate paths from refs, since a directory",
    "and a branch can share a name. Pathspecs also take globs and exclusions —",
    "`:(exclude)vendor/` drops a noisy directory — and the same syntax works on",
    "`diff`, `add`, and `status`."
  ],
  figure: [
    "git log -- src/core/                       one directory",
    "git log -- '*.py'                        by extension",
    "git log -- . ':(exclude)vendor/'          everything but vendor",
    "git log --follow -- src/core/runner.py      follow across renames"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History"
},

{
  stage:    "14 gotchas",
  question: "The rebase succeeded and `git diff` is clean, but your editor still shows the old file. What happened?",
  answer: [
    "The editor’s buffer cache is stale. Git swapped the working tree underneath",
    "it, and most editors only re-read a file when told to."
  ],
  detail: [
    "Treat every tree-changing operation — checkout, switch, rebase, merge,",
    "reset, pull — as invalidating open buffers until proven otherwise. Saving",
    "from a stale buffer writes the pre-operation content back over what git",
    "just produced."
  ],
  figure: [
    "confirm the disk is right:",
    "  git show origin/main:path/to/file > /tmp/a",
    "  diff /tmp/a path/to/file          ← empty ⇒ editor is lying",
    "",
    "reload:  VS Code \"Revert File\" · vim :e! · JetBrains Ctrl-Alt-Y"
  ],
  proGit:   "Appendix-A:-Git-in-Other-Environments-Graphical-Interfaces"
},

{
  stage:    "14 gotchas",
  question: "In Eclipse you pressed F5 and the sources are *still* stale. Why isn’t a refresh enough?",
  answer: [
    "F5 refreshes only the workspace’s filesystem model — one of four cache",
    "layers. Open editor buffers and build indexes are untouched."
  ],
  detail: [
    "Escalate in order: close and reopen the affected editors, then",
    "`Project → Clean`, then restart Eclipse. Running git from a terminal rather",
    "than through EGit removes one more caching layer from the stack."
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
  question: "`git status` says “HEAD detached at a1b2c3d”. What does that mean, and what should you do before committing?",
  answer: [
    "You’re pointing straight at a commit with no branch attached, so new commits",
    "would belong to nothing. Branch first — your uncommitted changes come along:",
    "$ git switch -c feature/whatever"
  ],
  detail: [
    "If you already committed while detached, nothing is lost yet: still",
    "detached, `git switch -c <name>` carries those commits onto the new branch,",
    "and if you have since switched away, `git reflog` plus",
    "`git branch <name> <sha>` rescues them before garbage collection."
  ],
  figure: [
    "On branch feature, behind by 3   ← harmless, just trailing",
    "HEAD detached at a1b2c3d         ← branch before committing",
    "",
    "already committed and switched away:",
    "  git reflog → git branch <name> <sha>"
  ],
  proGit:   "Git-Internals-Git-References"
},

{
  stage:    "14 gotchas",
  question: "You committed inside a submodule and the commits later vanished. Why?",
  answer: [
    "Submodules check out a *detached HEAD* by default — they track a commit, not",
    "a branch. Your commits belonged to no ref and were eventually collected."
  ],
  detail: [
    "Switch to a branch inside the submodule before committing, and remember that",
    "the parent repo pins a specific SHA: push the submodule’s commits to their",
    "own remote before pushing the parent, or CI will reference a commit that",
    "exists only on your machine."
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
  question: "`--since` combined with `--graph --all` returns a set that looks arbitrary. What is actually going on?",
  answer: [
    "`--since` is a traversal *cutoff*, not a filter applied afterwards. Git",
    "stops walking a line the moment it hits an older commit, and `--all` starts",
    "a walk from every branch tip — stale ones die immediately."
  ],
  detail: [
    "The results are correct, just counterintuitive, and `--graph` compounds it",
    "by rewriting parents to keep the picture connected. Debug by dropping to a",
    "bare `git log --since=…`, then adding the visual flags back one at a time."
  ],
  figure: [
    "git log --since=2.weeks                       clean, walks HEAD",
    "git log --since=2.weeks --all --graph         looks arbitrary",
    "",
    "tame it:  --simplify-by-decoration   or   --first-parent"
  ],
  proGit:   "Git-Basics-Viewing-the-Commit-History",
  bottomUp: "a-commit-by-any-other-name"
}

];
