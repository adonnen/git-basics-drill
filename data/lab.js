/* =============================================================================
   lab.js — the hands-on exercise.

   A list of steps the reader works through in a real terminal. Everything up
   to act VII stays on the reader's own machine with no remote. Two acts are
   optional: VI rewrites the repository's root commit, and VIII adds a remote,
   still locally, using a bare repository as the "server".

   ---------------------------------------------------------------------------
   THE SHAPE OF A STEP
   ---------------------------------------------------------------------------
   {
     title: "Delete the merged branch",
     task: [                                what the reader has to work out
       "Remove the branch label using the form that refuses to delete",
       "unmerged work. Confirm the commits survived it."
     ],
     solution: [                            shown blurred until they ask
       "git branch -d feature/queue",
       "git branch              # only main remains"
     ]
   },

   Write tasks as requirements, not as commands — the reader should have to
   know the tool to get there. In "task" you can use `code`, *italic* and
   **bold**, exactly as in cards.js. "solution" lines are shown exactly as
   written, so indentation and comments line up.

   ---------------------------------------------------------------------------
   ACTS
   ---------------------------------------------------------------------------
   A divider is a step with an "act" instead of a task:

     { act: "IV — divergence and a real conflict" },
     { act: "VIII — optional: working with a remote", optional: true },

   Steps are numbered automatically, so inserting one renumbers the rest.

   One thing to know: a reader's ticked steps are remembered by the step
   *title*, so reordering steps is free but renaming one loses its tick in
   progress files people have already saved.
   ============================================================================= */

const LAB = [

{ act: "I — a repository from nothing" },

{
  title: "Create the repository",
  task: [
    "Make a directory called `taskrunner`, move into it, and initialise a",
    "repository whose first branch is named `main`. Then confirm the repository",
    "exists."
  ],
  solution: [
    "mkdir taskrunner && cd taskrunner",
    "git init -b main",
    "",
    "ls -a          # a .git directory should now be there",
    "git status     # \"On branch main / No commits yet\""
  ]
},

{
  title: "Set an identity for this repository only",
  task: [
    "Every commit records a name and an email. Set both — but scoped to this",
    "repository, not to your whole machine. Then prove the setting landed locally",
    "rather than globally."
  ],
  solution: [
    "git config user.name \"Your Name\"",
    "git config user.email \"you@example.com\"",
    "",
    "git config --list --show-origin | grep user.",
    "# the path shown should end in taskrunner/.git/config"
  ]
},

{
  title: "Your first commit",
  task: [
    "Create a `README.md` containing a single heading line. Look at the status",
    "*before* staging and again *after*, so you see the file move between states.",
    "Then commit it."
  ],
  solution: [
    "echo \"# taskrunner\" > README.md",
    "",
    "git status -sb          # ?? README.md   (untracked)",
    "git add README.md",
    "git status -sb          # A  README.md   (staged)",
    "",
    "git commit -m \"Add README\""
  ]
},

{
  title: "Add the first real source file",
  task: [
    "Create `src/runner.py` with the content below, then stage and commit it in",
    "one step each. Keep this file — most later steps edit it. A file of your",
    "own works too, if it keeps the two anchors those steps rely on: a constant",
    "near the top, and an error raised a good way further down.",
    "| QUEUE_DEPTH = 8",
    "|",
    "|",
    "| class TaskRunner:",
    "|     \"\"\"Runs queued tasks one at a time.\"\"\"",
    "|",
    "|     def __init__(self, depth=QUEUE_DEPTH):",
    "|         self.depth = depth",
    "|         self.pending = []",
    "|",
    "|     def submit(self, task):",
    "|         if len(self.pending) >= self.depth:",
    "|             raise RuntimeError(\"queue full\")",
    "|         self.pending.append(task)",
    "|",
    "|     def run_all(self):",
    "|         results = []",
    "|         while self.pending:",
    "|             results.append(self.pending.pop(0)())",
    "|         return results"
  ],
  solution: [
    "mkdir src",
    "cat > src/runner.py <<'EOF'",
    "QUEUE_DEPTH = 8",
    "",
    "",
    "class TaskRunner:",
    "    \"\"\"Runs queued tasks one at a time.\"\"\"",
    "",
    "    def __init__(self, depth=QUEUE_DEPTH):",
    "        self.depth = depth",
    "        self.pending = []",
    "",
    "    def submit(self, task):",
    "        if len(self.pending) >= self.depth:",
    "            raise RuntimeError(\"queue full\")",
    "        self.pending.append(task)",
    "",
    "    def run_all(self):",
    "        results = []",
    "        while self.pending:",
    "            results.append(self.pending.pop(0)())",
    "        return results",
    "EOF",
    "",
    "git add src/runner.py",
    "git commit -m \"Add TaskRunner skeleton\"",
    "",
    "# the shape is deliberate: QUEUE_DEPTH and the \"queue full\" error are the",
    "# two lines act IV will put in conflict, and the distance between them is",
    "# what will make git report two conflicts rather than one"
  ]
},

{
  title: "Keep junk out of the repository",
  task: [
    "Create a `build/` directory and a `__pycache__/` directory, each with a",
    "throwaway file inside. Now make git ignore both, so that `git status`",
    "reports nothing but the ignore file itself. Commit that."
  ],
  solution: [
    "mkdir -p build __pycache__",
    "touch build/output.log __pycache__/runner.pyc",
    "",
    "git status -sb          # both directories show as untracked",
    "",
    "printf 'build/\\n__pycache__/\\n' > .gitignore",
    "",
    "git status -sb          # now only ?? .gitignore",
    "git add .gitignore",
    "git commit -m \"Ignore build output and bytecode\""
  ]
},

{
  title: "Read the history two ways",
  task: [
    "Print the history as one line per commit. Then print everything about the",
    "most recent commit — its message, author, and full diff."
  ],
  solution: [
    "git log --oneline",
    "# three commits: README, TaskRunner skeleton, .gitignore",
    "",
    "git show HEAD",
    "# or: git show          (HEAD is the default)"
  ]
},

{ act: "II — the index, precisely" },

{
  title: "Two edits, one file",
  task: [
    "Open `src/runner.py` and make two *unrelated* changes: add a line",
    "`self.retries = 3` just below `self.pending = []`, and append a `stop()`",
    "method at the end of the class. Whatever the file, keep at least a handful",
    "of unchanged lines between the two edits. Do not stage anything yet — just",
    "confirm git sees one modified file."
  ],
  solution: [
    "# edit src/runner.py so that __init__ ends with:",
    "#         self.pending = []",
    "#         self.retries = 3",
    "#",
    "# and the class ends with:",
    "#",
    "#     def stop(self):",
    "#         self.pending.clear()",
    "",
    "git status -sb          # \" M src/runner.py\"  — one file, two changes",
    "",
    "# the separation is the point: a hunk is a run of changed lines plus three",
    "# lines of context either side, and two edits whose context overlaps fuse",
    "# into one hunk — the next step needs git to offer them separately"
  ]
},

{
  title: "Stage only the first change",
  task: [
    "Stage the `retries` line and leave the `stop()` method unstaged — without",
    "editing the file or using a second file. Git should offer you the two",
    "changes separately."
  ],
  solution: [
    "git add -p src/runner.py",
    "",
    "# git shows the retries hunk first  → answer  y",
    "# then the stop() hunk             → answer  n",
    "#",
    "# if the two arrive as ONE hunk, press s to split,",
    "# or re-run with tighter context:",
    "#   git -c diff.context=1 add -p src/runner.py"
  ]
},

{
  title: "Prove the two diffs are different",
  task: [
    "Show what you are about to commit, then show what would still be left",
    "behind. They should contain different changes. Commit only the staged one."
  ],
  solution: [
    "git diff --staged      # the retries line",
    "git diff               # the stop() method",
    "",
    "git commit -m \"Add retry counter to TaskRunner\""
  ]
},

{
  title: "Commit the remainder, then fix its message",
  task: [
    "Stage and commit the `stop()` method with any message you like. Then change",
    "that message to `Add stop() method` — without creating a second commit. Note",
    "the commit hash before and after."
  ],
  solution: [
    "git add src/runner.py",
    "git commit -m \"add stop\"",
    "",
    "git log --oneline -1        # note the hash",
    "",
    "git commit --amend -m \"Add stop() method\"",
    "",
    "git log --oneline -1        # same message position, DIFFERENT hash",
    "# amend replaces the commit rather than editing it"
  ]
},

{
  title: "Stage a directory, then take one file back out",
  task: [
    "Write a second module `src/timer.py` with the content below, and append a",
    "`MAX_WAIT = 60` line to `src/runner.py`. Stage both with a single command",
    "that names neither file. Then change your mind about the runner edit and",
    "take it back out of the index without losing it, so that the commit you",
    "make contains the new module alone.",
    "| class Timer:",
    "|     \"\"\"Wall-clock timing for one run of the queue.\"\"\"",
    "|",
    "|     def __init__(self):",
    "|         self.started = None"
  ],
  solution: [
    "cat > src/timer.py <<'EOF'",
    "class Timer:",
    "    \"\"\"Wall-clock timing for one run of the queue.\"\"\"",
    "",
    "    def __init__(self):",
    "        self.started = None",
    "EOF",
    "",
    "echo \"MAX_WAIT = 60\" >> src/runner.py",
    "",
    "git add src/            # a directory means everything under it, new files too",
    "git status -sb",
    "# M  src/runner.py",
    "# A  src/timer.py",
    "",
    "git restore --staged src/runner.py",
    "git status -sb",
    "#  M src/runner.py     ← out of the index, edit still in the file",
    "# A  src/timer.py      ← still staged",
    "",
    "git diff                # the MAX_WAIT line, untouched by the unstaging",
    "git commit -m \"Add Timer skeleton\""
  ]
},

{
  title: "Stage the tracked changes only",
  task: [
    "Timing turns out to belong in the runner rather than in a module of its",
    "own, so delete `src/timer.py` from the working tree. Then create an",
    "untracked `src/scratch.py`, standing in for the debris a real afternoon",
    "leaves behind. With the `MAX_WAIT` edit still unstaged you now have three",
    "kinds of change at once — record the edit and the deletion with one command",
    "that cannot touch the scratch file, commit, and clear the scratch file away",
    "yourself."
  ],
  solution: [
    "rm src/timer.py",
    "echo \"print('debug')\" > src/scratch.py",
    "",
    "git status -sb",
    "#  M src/runner.py",
    "#  D src/timer.py",
    "# ?? src/scratch.py",
    "",
    "git add -u              # tracked files only: the edit and the deletion",
    "git status -sb",
    "# M  src/runner.py",
    "# D  src/timer.py      ← the removal is staged, not merely done on disk",
    "# ?? src/scratch.py    ← -u never stages a file git has not seen before",
    "",
    "git commit -m \"Add MAX_WAIT and drop the Timer skeleton\"",
    "",
    "rm src/scratch.py",
    "# rm + git add -u is what git rm does in one step",
    "# git add -A would have swept the scratch file in, and so would",
    "# git add . — but only from the directory you are standing in downwards"
  ]
},

{
  title: "Rename a file in a way git records",
  task: [
    "Add `src/util.py` with the helper below and commit it. Then decide the name",
    "should have been plural: rename the file with the command that stages the",
    "move, and commit that. Confirm afterwards that the file's history reaches",
    "back past the rename.",
    "| def clamp(value, lowest, highest):",
    "|     return max(lowest, min(value, highest))"
  ],
  solution: [
    "cat > src/util.py <<'EOF'",
    "def clamp(value, lowest, highest):",
    "    return max(lowest, min(value, highest))",
    "EOF",
    "git add src/util.py && git commit -m \"Add a clamp helper\"",
    "",
    "git mv src/util.py src/utils.py",
    "git status -sb",
    "# R  src/util.py -> src/utils.py     ← one line, both halves staged",
    "",
    "git commit -m \"Rename util to utils\"",
    "",
    "git log --follow --oneline -- src/utils.py",
    "# both commits: --follow is what carries a file's history across a rename",
    "#",
    "# mv src/util.py src/utils.py && git add -A does exactly the same thing:",
    "# git stores no rename, it infers one when the diff is displayed"
  ]
},

{
  title: "Untrack a file without deleting it",
  task: [
    "Commit a `debug.log` you should never have committed. Now take it out of",
    "git's hands while leaving it where it is on disk, and add a rule so that",
    "nothing like it comes back. Note which of the two `git rm` forms leaves the",
    "file alone."
  ],
  solution: [
    "echo \"started at 09:12\" > debug.log",
    "git add debug.log && git commit -m \"Add debug log\"    # the mistake",
    "",
    "git rm --cached debug.log",
    "git status -sb",
    "# D  debug.log      ← the removal from the repository, staged",
    "# ?? debug.log      ← the file itself, untouched and now untracked",
    "",
    "printf '*.log\\n' >> .gitignore",
    "git status -sb",
    "#  M .gitignore",
    "# D  debug.log      ← the ?? line is gone: the new rule covers it",
    "",
    "git commit -am \"Stop tracking debug.log and ignore log files\"",
    "",
    "ls debug.log        # still there, which was the whole point",
    "# git rm debug.log, without --cached, would have deleted it as well"
  ]
},

{
  title: "Stage whole files from a menu",
  task: [
    "Append a `RETRY_DELAY = 2` line to `src/runner.py`, a `noop()` helper to",
    "`src/utils.py`, and create an untracked `src/tmp.py`. Now stage the two",
    "tracked files by number rather than by path, without leaving the tool.",
    "Notice which of the three it never offers you, and why."
  ],
  solution: [
    "echo \"RETRY_DELAY = 2\" >> src/runner.py",
    "cat >> src/utils.py <<'EOF'",
    "",
    "",
    "def noop():",
    "    return None",
    "EOF",
    "echo \"print('temp')\" > src/tmp.py",
    "",
    "git add -i",
    "#            staged     unstaged path",
    "#   1:    unchanged        +1/-0 src/runner.py",
    "#   2:    unchanged        +4/-0 src/utils.py",
    "#",
    "# *** Commands ***",
    "#   1: [s]tatus   2: [u]pdate   3: [r]evert   4: [a]dd untracked",
    "#   5: [p]atch    6: [d]iff     7: [q]uit     8: [h]elp",
    "#",
    "# What now> u        ← update",
    "# Update>> 1-2       ← a range; 1,2 and single numbers work too",
    "# Update>>           ← blank line ends it: \"updated 2 paths\"",
    "# What now> q",
    "#",
    "# src/tmp.py was never in that list: update offers tracked files only,",
    "# and [a]dd untracked is the item that would have offered it",
    "",
    "git status -sb",
    "# M  src/runner.py",
    "# M  src/utils.py",
    "# ?? src/tmp.py",
    "",
    "git commit -m \"Add a retry delay and a noop helper\"",
    "rm src/tmp.py"
  ]
},

{ act: "III — branching, stashing and a fast-forward merge" },

{
  title: "Branch and switch in one command",
  task: [
    "Create a branch called `feature/queue` and move onto it with a single",
    "command. Confirm where you are."
  ],
  solution: [
    "git switch -c feature/queue",
    "",
    "git branch              # * marks feature/queue",
    "git status -sb          # \"## feature/queue\""
  ]
},

{
  title: "Two commits on the branch",
  task: [
    "Add a new file `src/queue.py` with a small `Queue` class and commit it. Then",
    "add a `push()` method to that same file and commit again — two separate",
    "commits."
  ],
  solution: [
    "cat > src/queue.py <<'EOF'",
    "class Queue:",
    "    def __init__(self):",
    "        self.items = []",
    "EOF",
    "git add src/queue.py",
    "git commit -m \"Add Queue skeleton\"",
    "",
    "cat >> src/queue.py <<'EOF'",
    "",
    "    def push(self, item):",
    "        self.items.append(item)",
    "EOF",
    "git add src/queue.py",
    "git commit -m \"Add Queue.push\"",
    "",
    "git log --oneline -3"
  ]
},

{
  title: "Park an edit, switch away, and bring it back",
  task: [
    "Start a third change in `src/queue.py` — add a `pop()` method — but do not",
    "commit it. Now you need to check something on `main`. Set the unfinished",
    "edit aside with a label, switch to `main`, switch straight back, and restore",
    "the edit. Then commit it properly."
  ],
  solution: [
    "cat >> src/queue.py <<'EOF'",
    "",
    "    def pop(self):",
    "        return self.items.pop(0)",
    "EOF",
    "",
    "git switch main                     # refused: the edit is in the way",
    "",
    "git stash push -m \"queue pop method\"",
    "git status -sb                      # clean, nothing to block the switch",
    "",
    "git switch main",
    "git log --oneline -1                # whatever you needed to check",
    "git switch -                        # back, without typing the branch name",
    "",
    "git stash list                      # stash@{0}: On feature/queue: queue pop method",
    "git stash pop                       # applied, and dropped from the list",
    "",
    "git add src/queue.py && git commit -m \"Add Queue.pop\""
  ]
},

{
  title: "Merge it back, then delete the branch",
  task: [
    "Return to `main` and merge the branch. Read the word git prints — is there a",
    "merge commit, or not, and why? Then remove the branch label using the form",
    "that refuses to delete unmerged work, and confirm the commits survived it."
  ],
  solution: [
    "git switch main",
    "git merge feature/queue",
    "# \"Fast-forward\"",
    "",
    "git log --oneline --graph -5",
    "# a straight line, no merge commit: main had not moved since",
    "# the branch was created, so git just slid the pointer forward",
    "",
    "git branch -d feature/queue     # -d refuses if work is unmerged",
    "git branch                      # only main remains",
    "git log --oneline -3            # the commits are still there",
    "# a branch is only a label; deleting it removes the label"
  ]
},

{ act: "IV — divergence and a real conflict" },

{
  title: "Change one line on a branch",
  task: [
    "Create and switch to a branch `feature/retry`. Make two changes to",
    "`src/runner.py`: `QUEUE_DEPTH = 8` becomes `16`, and the overflow error",
    "further down becomes `raise RuntimeError(\"queue full, try again\")`. With a",
    "file of your own, any two lines with ten-odd unchanged lines between them",
    "do the job — note which two, because the next step edits the same pair.",
    "Commit both — staging and committing tracked changes in a single command."
  ],
  solution: [
    "git switch -c feature/retry",
    "",
    "# edit src/runner.py, two places:",
    "#   QUEUE_DEPTH = 16",
    "#   raise RuntimeError(\"queue full, try again\")",
    "",
    "git commit -am \"Raise the queue depth and soften the overflow error\"",
    "# -a stages every tracked file that changed; new files still need git add"
  ]
},

{
  title: "Change the same line differently on main",
  task: [
    "Go back to `main` and change those same two places differently:",
    "`QUEUE_DEPTH = 32`, and the error message becomes the f-string `f\"queue",
    "full at {self.depth}\"`. Commit it. The branches now disagree in two spots,",
    "far enough apart in the file that git will report them as two separate",
    "conflicts."
  ],
  solution: [
    "git switch main",
    "",
    "# edit src/runner.py, the same two places:",
    "#   QUEUE_DEPTH = 32",
    "#   raise RuntimeError(f\"queue full at {self.depth}\")",
    "",
    "git commit -am \"Raise the queue depth and name the limit in the error\"",
    "",
    "git log --oneline --graph --all -6",
    "# two lines of development, diverged",
    "",
    "# \"far enough apart\" matters: conflicting regions, like hunks, carry",
    "# surrounding context, and two disagreements too close together fuse into",
    "# a single conflict block — the next step wants to count two"
  ]
},

{
  title: "Trigger the conflict and read it",
  task: [
    "Merge `feature/retry` into `main`. It will stop. Find out which file is",
    "unmerged, then open it and identify the conflict markers, how many separate",
    "conflicts there are, and which side each block belongs to."
  ],
  solution: [
    "git merge feature/retry",
    "# CONFLICT (content): Merge conflict in src/runner.py",
    "",
    "git status",
    "# \"Unmerged paths:  both modified:  src/runner.py\"",
    "",
    "grep -c '^<<<<<<<' src/runner.py    # 2 — two conflicts, one file",
    "",
    "cat src/runner.py",
    "# <<<<<<< HEAD              ← main's version   (32)",
    "# QUEUE_DEPTH = 32",
    "# =======",
    "# QUEUE_DEPTH = 16",
    "# >>>>>>> feature/retry     ← the branch's     (16)",
    "#   …",
    "# <<<<<<< HEAD",
    "#             raise RuntimeError(f\"queue full at {self.depth}\")",
    "# =======",
    "#             raise RuntimeError(\"queue full, try again\")",
    "# >>>>>>> feature/retry",
    "#",
    "# everything between the two conflicts merged cleanly and is already staged"
  ]
},

{
  title: "See what both sides started from",
  task: [
    "Two versions of a line do not tell you which side moved. Redraw the same",
    "conflict with the common ancestor included, read what it tells you about",
    "each of the two disagreements, and set that style for the rest of the lab."
  ],
  solution: [
    "git checkout --conflict=zdiff3 src/runner.py",
    "# the file is rebuilt from the three versions git is holding in the index,",
    "# so any editing you had already done to it is thrown away",
    "",
    "cat src/runner.py",
    "# <<<<<<< ours",
    "# QUEUE_DEPTH = 32",
    "# ||||||| base",
    "# QUEUE_DEPTH = 8          ← both sides raised it: a genuine choice",
    "# =======",
    "# QUEUE_DEPTH = 16",
    "# >>>>>>> theirs",
    "",
    "git config merge.conflictStyle zdiff3",
    "# the same mechanism as user.name in act I: a setting, written to this",
    "# repository's .git/config. From here on every conflict git writes in",
    "# this repository carries the base section by itself; --global would",
    "# set that for every repository on the machine"
  ]
},

{
  title: "Take one whole side, and see what it costs",
  task: [
    "Settle the second conflict — the error message — by taking `main`'s version",
    "of it wholesale, without opening the file. Then look at what that did to the",
    "first conflict, and put both conflicts back the way git wrote them."
  ],
  solution: [
    "git checkout --ours src/runner.py",
    "# an unmerged file exists three times in the index: base, ours, theirs.",
    "# ours is the side you stood on when you merged (main), theirs the branch",
    "# you named (feature/retry) — this command copies one of the three over",
    "# the working file",
    "",
    "grep -n QUEUE_DEPTH src/runner.py",
    "# QUEUE_DEPTH = 32 — the first conflict was decided too, silently:",
    "# --ours takes the whole FILE, never the one hunk you were looking at",
    "",
    "git diff",
    "# during a conflict this is a combined diff: only lines matching neither",
    "# side. Nothing but a header here — no line in the file is your own work",
    "",
    "git checkout --merge src/runner.py",
    "# both conflicts back, ancestor and all — the setting from the last step.",
    "# --merge rebuilds the marked-up file from the same three index copies,",
    "# so taking a side is never a dead end"
  ]
},

{
  title: "Take the other side of the same conflict",
  task: [
    "Now the mirror image: take the *branch's* version of the whole file,",
    "again without opening it. Check both disputed lines, then check `git",
    "status` — has picking a side settled the conflict in git's eyes? Put the",
    "markers back when you have your answer."
  ],
  solution: [
    "git checkout --theirs src/runner.py",
    "",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# QUEUE_DEPTH = 16 and \"queue full, try again\" — both lines are now the",
    "# branch's, including the depth you were not looking at",
    "",
    "git status",
    "# still \"both modified\": writing a version into the working tree is not",
    "# a resolution. Only git add marks the file settled, however the text",
    "# got there — which is also why you can keep changing your mind",
    "",
    "git checkout --merge src/runner.py    # markers back, next experiment"
  ]
},

{
  title: "Mix the two sides, then abandon the merge",
  task: [
    "Nothing forces one side to win everywhere. Resolve the two conflicts in",
    "opposite directions — keep `main`'s depth, keep the branch's error",
    "message — by editing the file. Then ask git which lines of the result",
    "are your own invention, read its answer, and throw the whole merge away."
  ],
  solution: [
    "# edit src/runner.py:",
    "#   keep  QUEUE_DEPTH = 32                                    ← ours",
    "#   keep  raise RuntimeError(\"queue full, try again\")         ← theirs",
    "#   and delete every marker line",
    "",
    "git diff",
    "# nothing but the header again: the combined diff lists only lines that",
    "# match neither side, and every line you kept came from one of them.",
    "# A mixed resolution is still a resolution made of picks",
    "",
    "git merge --abort",
    "git status -sb                       # clean — the merge never happened",
    "grep -n QUEUE_DEPTH src/runner.py    # 32: main exactly as before",
    "",
    "# two different sizes of undo: checkout --merge rebuilds ONE file and",
    "# the merge stays in progress; --abort unwinds the whole operation —",
    "# markers, your edits, the cleanly merged parts, all of it. The two",
    "# branches themselves are untouched either way"
  ]
},

{
  title: "Decide the winner before the merge starts",
  task: [
    "Merge the branch twice more without ever seeing a marker: once telling",
    "git in advance that `main` wins wherever the two sides collide, once",
    "that the branch wins. Inspect what each produced, and return to the",
    "pre-merge state after each try. Then say what these forms do that",
    "`checkout --ours` after a stop does not."
  ],
  solution: [
    "git merge -X ours feature/retry",
    "# no stop: both collisions were settled in main's favour on the spot,",
    "# and the merge commit was made in the same breath",
    "",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# 32 and f\"queue full at {self.depth}\" — main's pair",
    "",
    "git reset --hard ORIG_HEAD",
    "# merge stored where you stood in ORIG_HEAD; reset --hard moves the",
    "# branch back there (act VII takes reset apart properly)",
    "",
    "git merge -X theirs feature/retry",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# 16 and \"queue full, try again\" — the branch's pair",
    "",
    "git reset --hard ORIG_HEAD",
    "",
    "# -X ours / -X theirs decide hunk by hunk, and only where the sides",
    "# collide — everything that merges cleanly still comes from both.",
    "# checkout --ours takes a whole file, and only after the stop has shown",
    "# you there was a fight. -X never shows you: the losing hunks vanish",
    "# unseen, which suits lockfiles and generated files, not code you would",
    "# have wanted to read"
  ]
},

{
  title: "Resolve, finish, and inspect the merge commit",
  task: [
    "Start the merge one final time, and note what the markers look like now",
    "without you asking for anything. Then resolve both conflicts by hand and",
    "for good: keep the branch's `QUEUE_DEPTH = 16`, and write an error message",
    "neither side has — `f\"queue full at {self.depth}, try again\"`. Delete",
    "every marker line, check that what is left of your own is exactly that one",
    "message, then finish the merge and prove the commit you made has two",
    "parents."
  ],
  solution: [
    "git merge feature/retry",
    "# the same two conflicts, however many times you run it: a conflict is",
    "# computed fresh from the two branch tips and their common ancestor, and",
    "# none of the three has moved. The base section now appears by itself —",
    "# the config you set earlier in this act — and the labels are the real",
    "# names, HEAD and feature/retry, with the base labelled by its commit",
    "",
    "# edit src/runner.py: QUEUE_DEPTH = 16, the combined error message,",
    "# and not one marker line left in either conflict",
    "",
    "grep -rn \"<<<<<<<\\|>>>>>>>\" src/    # should print nothing",
    "",
    "git diff",
    "# the error message line, and nothing else: the depth line agrees with",
    "# one side, so the combined diff has nothing to report about it",
    "",
    "git add src/runner.py",
    "git merge --continue        # or: git commit",
    "",
    "git show -s --format='%h  parents: %p' HEAD",
    "# TWO hashes listed — only merge commits have more than one",
    "",
    "git log --oneline --graph -8",
    "# the branch splits and rejoins"
  ]
},

{ act: "V — rewriting a branch before it lands" },

{
  title: "Build a deliberately messy branch",
  task: [
    "Create a branch `feature/logging` and make three commits on it: a proper",
    "one, one whose message is just `wip`, and one whose message contains the",
    "typo `defualt`. You will clean these up shortly."
  ],
  solution: [
    "git switch -c feature/logging",
    "",
    "echo \"import logging\" > src/log.py",
    "git add src/log.py && git commit -m \"Add logging module\"",
    "",
    "echo \"LOG = logging.getLogger(__name__)\" >> src/log.py",
    "git add src/log.py && git commit -m \"wip\"",
    "",
    "echo \"LEVEL = 'INFO'\" >> src/log.py",
    "git add src/log.py && git commit -m \"Add defualt log level\"",
    "",
    "git log --oneline -3"
  ]
},

{
  title: "Let the trunk move underneath you",
  task: [
    "Switch to `main`, expand the README with a description line, and commit it",
    "— any edit works, provided it touches a file your branch does not. Then go",
    "back to your branch. The branch is now behind the trunk."
  ],
  solution: [
    "git switch main",
    "",
    "printf '# taskrunner\\n\\nA tiny task runner.\\n' > README.md",
    "git commit -am \"Expand README\"",
    "",
    "git switch feature/logging",
    "",
    "git log --oneline --graph --all -8",
    "# your branch hangs off an older point on main",
    "",
    "# a file the branch never edits, on purpose: this act is about the",
    "# mechanics of replay, and a conflict here would be act IV's lesson again"
  ]
},

{
  title: "Rebase onto the trunk and watch the hashes change",
  task: [
    "Note your three commit hashes. Replay them on top of the latest `main`. Then",
    "compare the hashes — and explain why the README change is now in your branch",
    "even though it is not one of your commits."
  ],
  solution: [
    "git log --oneline -3           # write these hashes down",
    "",
    "git rebase main",
    "",
    "git log --oneline -3           # same messages, DIFFERENT hashes",
    "git log --oneline -5           # \"Expand README\" now sits below your work",
    "",
    "# the replayed commits are copies with a new parent,",
    "# so their hashes necessarily changed; main's commit",
    "# is not yours — it is your branch's ancestor"
  ]
},

{
  title: "Clean up the branch with an interactive rebase",
  task: [
    "In one interactive rebase against `main`: fold the `wip` commit into the one",
    "before it and discard its message, and correct the `defualt` typo in the",
    "third commit’s message. You should end with two commits."
  ],
  solution: [
    "git rebase -i main",
    "",
    "# the editor opens with three lines. Change them to:",
    "#",
    "#   pick   xxxxxxx Add logging module",
    "#   fixup  xxxxxxx wip",
    "#   reword xxxxxxx Add defualt log level",
    "#",
    "# save and close; git then opens the message to reword:",
    "#   Add default log level",
    "",
    "git log --oneline -3",
    "# two commits on the branch, clean messages"
  ]
},

{
  title: "Land it with the branch shape preserved",
  task: [
    "Merge the branch into `main` in a way that creates a merge commit even",
    "though a fast-forward would be possible — so the graph records that this",
    "work arrived as a branch. Then delete the branch."
  ],
  solution: [
    "git switch main",
    "git merge --no-ff feature/logging -m \"Merge logging\"",
    "",
    "git log --oneline --graph -8",
    "# the branch visibly forks and rejoins",
    "",
    "git branch -d feature/logging"
  ]
},

{ act: "VI — optional: a file that should have been there from the start", optional: true },

{
  title: "Put a licence into the very first commit",
  task: [
    "A licence file belongs to this project, and it should have been part of it",
    "from the beginning rather than bolted on at the end. Write one, then get it",
    "into the *root* commit, so that every commit in the history contains it —",
    "without flattening the two merges you built in acts IV and V, and without",
    "changing any other file. Give yourself a way back before you start."
  ],
  solution: [
    "printf 'MIT License\\n\\nCopyright (c) 2026 Your Name\\n' > LICENSE",
    "git branch before-rewrite      # a label on the old history, just in case",
    "",
    "ROOT=$(git rev-list --max-parents=0 HEAD)   # the one commit with no parent",
    "git checkout --detach $ROOT",
    "git add LICENSE",
    "git commit --amend --no-edit   # a NEW root commit: same message, new hash",
    "",
    "# replay everything that came after the old root onto the new one",
    "git rebase --rebase-merges --onto HEAD $ROOT main",
    "",
    "# the rebase leaves you back on main",
    "# without --rebase-merges, both merges would be flattened away"
  ]
},

{
  title: "Confirm every commit carries it",
  task: [
    "Prove the rewrite did what you wanted and nothing more: every commit",
    "reachable from `main` contains the licence, the graph still shows both",
    "merges, the commit count is unchanged, and no other file moved. Then take",
    "your safety net down."
  ],
  solution: [
    "for c in $(git rev-list main); do",
    "  git cat-file -e $c:LICENSE 2>/dev/null || echo \"missing in $c\"",
    "done                           # silence means every one of them has it",
    "",
    "git log --oneline --graph main # both merges still there",
    "git rev-list --count main      # the same number of commits as before",
    "git diff before-rewrite main -- . ':!LICENSE'   # empty: nothing else moved",
    "",
    "git branch -D before-rewrite   # verified, so the safety net can go",
    "# every hash changed — the reflog still remembers the old ones"
  ]
},

{ act: "VII — undoing things" },

{
  title: "Stash again, this time with untracked files",
  task: [
    "Add a `TIMEOUT = 30` line to `src/runner.py` *and* create a new untracked",
    "file `src/probe.py`. Stash your work and check the tree: one of the two is",
    "still there. Find the flag that takes untracked files too, then preview the",
    "stash before bringing it back."
  ],
  solution: [
    "echo \"TIMEOUT = 30\" >> src/runner.py",
    "echo \"# scratch\" > src/probe.py",
    "",
    "git stash push -m \"timeout spike\"",
    "git status -sb          # ?? src/probe.py is STILL here",
    "",
    "git stash pop           # take it back and try again",
    "git stash push -u -m \"timeout spike\"",
    "git status -sb          # clean this time",
    "",
    "git stash list          # stash@{0}: On main: timeout spike",
    "git stash show -p       # the full diff, applying nothing",
    "",
    "git stash pop",
    "# -u adds untracked files, -a adds ignored ones too;",
    "# the plain form takes only files git already tracks"
  ]
},

{
  title: "Discard an uncommitted edit for real",
  task: [
    "You have decided the `TIMEOUT` line was a mistake. Throw the edit away and",
    "return the file to its committed state. Note what makes this different from",
    "the previous step."
  ],
  solution: [
    "git restore src/runner.py",
    "rm src/probe.py         # untracked: restore does not touch it",
    "",
    "git status -sb          # clean",
    "tail -3 src/runner.py   # TIMEOUT is gone",
    "",
    "# stash is reversible; restore is not — the edit was never",
    "# in the object database, so no reflog can bring it back"
  ]
},

{
  title: "Remove untracked clutter — carefully",
  task: [
    "Create two untracked files, `src/scratch.py` and `notes.txt`. Now list",
    "exactly what a cleanup would delete *without deleting anything*, and only",
    "then actually delete them."
  ],
  solution: [
    "touch src/scratch.py notes.txt",
    "",
    "git clean -nd           # DRY RUN — \"Would remove ...\"",
    "git clean -fd           # actually removes them",
    "",
    "git status -sb          # clean",
    "# restore and reset never touch untracked files; only clean does"
  ]
},

{
  title: "Collapse three commits into one",
  task: [
    "Make three trivial commits to a new `notes.md` file. Then combine all three",
    "into a single commit called `Add release notes` — without an interactive",
    "rebase, and without losing the file contents."
  ],
  solution: [
    "printf 'A\\n' >> notes.md && git add notes.md && git commit -m \"note A\"",
    "printf 'B\\n' >> notes.md && git add notes.md && git commit -m \"note B\"",
    "printf 'C\\n' >> notes.md && git add notes.md && git commit -m \"note C\"",
    "",
    "git reset --soft HEAD~3",
    "",
    "git status -sb          # all three changes are STAGED, nothing lost",
    "cat notes.md            # A B C all present",
    "",
    "git commit -m \"Add release notes\"",
    "git log --oneline -2"
  ]
},

{
  title: "Undo a commit by adding history, not removing it",
  task: [
    "Undo the release-notes commit using the method that is safe on a branch",
    "other people have pulled — the one that appends rather than rewrites.",
    "Confirm afterwards that both the original and the undo are visible in the",
    "log."
  ],
  solution: [
    "git revert HEAD --no-edit",
    "",
    "git log --oneline -3",
    "# \"Revert \\\"Add release notes\\\"\" sits on top of the original",
    "",
    "ls notes.md 2>/dev/null || echo \"notes.md is gone\"",
    "# the file is removed, but the history of it remains"
  ]
},

{
  title: "Rescue a commit from a deleted branch",
  task: [
    "Create a branch `spike`, commit a `src/version.py` file on it, then return",
    "to `main` and force-delete the branch. The commit is now unreferenced. Find",
    "it again and copy just that commit onto `main`."
  ],
  solution: [
    "git switch -c spike",
    "printf 'VERSION = \"0.1.0\"\\n' > src/version.py",
    "git add src/version.py && git commit -m \"Add version constant\"",
    "",
    "git switch main",
    "git branch -D spike            # label gone; commit now unreferenced",
    "",
    "git reflog                     # find the \"Add version constant\" hash",
    "git cherry-pick <that-hash>",
    "",
    "git log --oneline -2",
    "cat src/version.py             # the file is back, on main, new hash"
  ]
},

{
  title: "Break the branch, then recover it",
  task: [
    "Record the current commit hash. Now hard-reset three commits back, and",
    "confirm the damage in the log. Then put the branch back exactly where it",
    "was, using the local journal of every place HEAD has been."
  ],
  solution: [
    "git rev-parse HEAD             # write this down",
    "",
    "git reset --hard HEAD~3",
    "git log --oneline -3           # three commits gone from the branch",
    "",
    "git reflog                     # every HEAD move, most recent first",
    "git reset --hard HEAD@{1}      # or: git reset --hard <the hash above>",
    "",
    "git log --oneline -3           # restored",
    "# reset moved a pointer; the commits were never deleted"
  ]
},

{
  title: "Final review",
  task: [
    "Take stock. Print the full history as a graph across all branches, list",
    "every branch, and count how many commits the repository holds. You should",
    "see a linear stretch, one fast-forward stretch, and two visible merges."
  ],
  solution: [
    "git log --oneline --graph --all --decorate",
    "",
    "git branch -a                  # only main",
    "git rev-list --count HEAD      # total commits",
    "",
    "# when you are done, the whole exercise is disposable:",
    "#   cd .. && rm -rf taskrunner"
  ]
},

{ act: "VIII — optional: working with a remote", optional: true },

{
  title: "Make a \"server\" on your own machine",
  task: [
    "Everything so far has been local. To practise remotes without an account",
    "anywhere, create a *bare* repository next to your project — a repository",
    "with no working tree, which is the only kind that accepts pushes."
  ],
  solution: [
    "cd ..                                  # step out of taskrunner",
    "git init --bare taskrunner-origin.git",
    "ls taskrunner-origin.git                # HEAD, config, objects/, refs/ — no src/",
    "cd taskrunner"
  ]
},

{
  title: "Connect and make the first push",
  task: [
    "Register that bare repository under the conventional name `origin`, then",
    "push `main` to it — setting up tracking in the same command, so later pushes",
    "need no arguments. Confirm the server received it."
  ],
  solution: [
    "git remote add origin ../taskrunner-origin.git",
    "git remote -v",
    "",
    "git push -u origin main",
    "# -u links local main to origin/main",
    "",
    "git ls-remote origin           # asks the server what refs it holds",
    "git status -sb                 # \"## main...origin/main\""
  ]
},

{
  title: "Clone it as if you were someone else",
  task: [
    "Clone the bare repository into a second directory to stand in for a",
    "colleague. Note that one command does what `init` plus `remote add` plus",
    "`pull` was reaching for."
  ],
  solution: [
    "cd ..",
    "git clone taskrunner-origin.git colleague",
    "cd colleague",
    "",
    "git log --oneline -5           # the full history came with it",
    "git remote -v                  # origin already wired up",
    "git status -sb                 # already tracking origin/main"
  ]
},

{
  title: "Push a change from the clone",
  task: [
    "As the \"colleague\", add a line to the README and push it. Then look at what",
    "the server holds — it should now be ahead of your original working copy."
  ],
  solution: [
    "printf '\\nRun with: python -m taskrunner\\n' >> README.md",
    "git commit -am \"Document how to run it\"",
    "git push",
    "",
    "git log --oneline -2"
  ]
},

{
  title: "See what is incoming before you take it",
  task: [
    "Back in `taskrunner`, download the new state *without* changing your branch.",
    "Read exactly what is about to arrive, and only then integrate it."
  ],
  solution: [
    "cd ../taskrunner",
    "",
    "git fetch",
    "git status -sb                        # \"behind 1\"",
    "git log HEAD..origin/main --oneline   # exactly what is waiting",
    "",
    "git pull",
    "git log --oneline -2"
  ]
},

{
  title: "Push a new branch without retyping its name",
  task: [
    "Create a branch with a long, namespaced name, commit something on it, and",
    "try a plain `git push`. It will refuse. Fix it in a way that does not",
    "require typing the branch name again."
  ],
  solution: [
    "git switch -c Component/feature/queue-metrics",
    "printf 'METRICS = True\\n' >> src/runner.py",
    "git commit -am \"Add metrics flag\"",
    "",
    "git push",
    "# fatal: The current branch ... has no upstream branch.",
    "",
    "git push -u origin HEAD        # HEAD = the branch you are on",
    "git push                       # every time after"
  ]
},

{
  title: "Collide on the trunk, then recover",
  task: [
    "In the clone, commit to `main` and push. In `taskrunner`, commit to `main`",
    "too — without pulling first, and touching a different file than the clone",
    "did. Try to push. Read the rejection, then integrate and push properly."
  ],
  solution: [
    "cd ../colleague",
    "printf 'MIT licensed.\\n' > LICENSE.md",
    "git add LICENSE.md && git commit -m \"Add licence\"",
    "git push",
    "",
    "cd ../taskrunner",
    "git switch main",
    "printf '\\n## Status\\n\\nEarly days.\\n' >> README.md",
    "git commit -am \"Add status section\"",
    "",
    "git push",
    "# ! [rejected]  main -> main (fetch first)",
    "#   the remote has commits you do not",
    "",
    "git pull --rebase              # replay your commit on top of theirs",
    "git push",
    "",
    "# different files on the two sides, on purpose: the rejection is about",
    "# diverged history, not content — content conflicts were act IV's business"
  ]
},

{
  title: "Rebase a pushed branch and push it again",
  task: [
    "Return to your feature branch, rebase it onto the updated `main`, and push.",
    "The plain push will be refused because the hashes changed. Use the safe form",
    "of force — and say why the unsafe one is never worth it."
  ],
  solution: [
    "git switch Component/feature/queue-metrics",
    "git rebase main                # commits replayed, new hashes",
    "",
    "git push",
    "# ! [rejected] ... (non-fast-forward)",
    "",
    "git push --force-with-lease",
    "# overwrites ONLY if the remote still matches your last fetch;",
    "# aborts with \"stale info\" if someone pushed meanwhile.",
    "# plain --force skips that check and can delete their work."
  ]
},

{
  title: "Tidy up the server",
  task: [
    "Merge the feature branch into `main`, push it, then delete the branch in",
    "both places. Finally, make your clone forget remote branches that no longer",
    "exist."
  ],
  solution: [
    "git switch main",
    "git merge --no-ff Component/feature/queue-metrics -m \"Merge queue metrics\"",
    "git push",
    "",
    "git branch -d Component/feature/queue-metrics",
    "git push origin --delete Component/feature/queue-metrics",
    "",
    "cd ../colleague",
    "git fetch --prune              # drop stale origin/* refs",
    "git branch -r                  # only origin/main remains",
    "",
    "git config --global fetch.prune true   # make that automatic"
  ]
},

{
  title: "Cut a release the server knows about",
  task: [
    "Back in `taskrunner`, mark the current `main` as version 0.1.0 — in the",
    "form that records who cut it and when. Push, then check what the server",
    "holds, and read the result carefully before making the server hold the",
    "tag too. Finally add one small commit on top and ask git where you now",
    "stand relative to the release."
  ],
  solution: [
    "cd ../taskrunner",
    "",
    "git tag -a v0.1.0 -m \"First working cut\"",
    "git push",
    "# \"Everything up-to-date\" — and yet:",
    "git ls-remote origin           # no refs/tags/ line: push ignored the tag",
    "",
    "git push origin v0.1.0",
    "git ls-remote origin           # refs/tags/v0.1.0 — now the server has it",
    "",
    "printf '\\n## Ideas\\n' >> README.md",
    "git commit -am \"Start an ideas section\"",
    "git describe                   # v0.1.0-1-g… — one commit past the release",
    "",
    "# -a matters twice over: the annotation records who cut the release and",
    "# why, and bare git describe consults annotated tags only — a lightweight",
    "# v0.1.0 would need git describe --tags to be seen at all"
  ]
},

{
  title: "Clean up everything",
  task: [
    "The whole exercise is disposable — three directories and nothing else.",
    "Remove them."
  ],
  solution: [
    "cd ..",
    "rm -rf taskrunner colleague taskrunner-origin.git",
    "",
    "# nothing was installed and nothing lives outside these",
    "# directories, except any --global config you chose to set:",
    "#   git config --global --edit"
  ]
}

];
