/* =============================================================================
   lab.js: the hands-on exercise.

   A list of steps the reader works through in a real terminal. Everything up
   to act IX stays on the reader's own machine with no remote. Three acts are
   optional: VI rewrites the repository's root commit, IX looks at the refs
   behind the branch names, and X adds a remote, still locally, using a bare
   repository as the "server".

   ---------------------------------------------------------------------------
   THE SHAPE OF A STEP
   ---------------------------------------------------------------------------
   {
     title: "Delete the merged branch",
     level: "basics",                       optional, see LEVELS below
     task: [                                what the reader has to work out
       "Remove the branch label using the form that refuses to delete",
       "unmerged work. Confirm the commits survived it."
     ],
     solution: [                            shown blurred until they ask
       "git branch -d feature/queue",
       "git branch              # only main remains"
     ]
   },

   Write each task as a requirement, so the reader has to know the tool to find
   the command. In "task" all five marks from cards.js work: `code`, *italic*,
   **bold**, "$" terminal lines and "|" drawing lines. When a step needs
   specific file content, put it in the task as a "|" block, so the reader never
   needs the solution just to know what to type into a file. "solution" lines
   are shown exactly as written, so indentation and comments line up.

   The lab is read in order too. When a step is the first at its level to use a
   term, say what the term means in a few words, in the task or the comment
   where it appears.

   ---------------------------------------------------------------------------
   ACTS
   ---------------------------------------------------------------------------
   A divider is a step with an "act" instead of a task:

     { act: "IV — divergence and a real conflict" },
     { act: "X — optional: working with a remote", optional: true },

   Steps are numbered automatically, so inserting one renumbers the rest.

   A reader's ticked steps are remembered by the step *title*, so reordering
   steps is free but renaming one loses its tick in progress files people have
   already saved.

   ---------------------------------------------------------------------------
   LEVELS
   ---------------------------------------------------------------------------
   A step may carry `level: "basics"` or `level: "intermediate"`, cumulative in
   the same way as the deck, and an untagged step belongs to the full lab only.

   The lab has a constraint the deck does not. A level's steps are run *in
   order, in one repository*, so the surviving steps must still form a working
   sequence: every step's required state has to be produced by an earlier step
   at the same level, and no step may destroy state a later one needs.

   That is why some steps are tagged basics while teaching nothing a beginner
   asked for. "Add the first real source file" is there because it writes the
   two lines act IV puts in conflict, far enough apart that git reports two
   conflicts. "Mix the two sides, then abandon the merge" is there because its
   `git merge --abort` is the only one in act IV, and the step after it opens a
   fresh merge, which git refuses while MERGE_HEAD exists.

   So before moving a step down a level, check what its solution *produces* as
   well as what it teaches. The acts that end up empty at a level are hidden,
   and the numerals keep their gaps: at basics the reader sees I, II, III, IV, V,
   X, which shows that the lab is larger than this pass through it.
   ============================================================================= */

const LAB = [

{ act: "I — a repository from nothing" },

{
  title: "Create the repository",
  level: "basics",
  task: [
    "Make a directory called `taskrunner`, move into it, and initialise a",
    "*repository* (the store of a project's history) whose first *branch* (a",
    "named line of work) is named `main`. Then confirm the repository exists."
  ],
  solution: [
    "mkdir taskrunner && cd taskrunner",
    "git init -b main",
    "",
    "ls -a          # -a shows hidden files too: a .git directory should now be there",
    "git status     # \"On branch main / No commits yet\". A commit is a saved version",
    "",
    "# .git holds the repository. The files you edit around it are the working tree"
  ]
},

{
  title: "Set an identity for this repository only",
  level: "basics",
  task: [
    "A *commit* is a saved version of your project, and every commit records a",
    "name and an email. Set both for this repository only, leaving your",
    "machine-wide settings alone. Then prove the setting went into this",
    "repository's own config."
  ],
  solution: [
    "git config user.name \"Your Name\"",
    "git config user.email \"you@example.com\"",
    "",
    "git config --list --show-origin | grep user.",
    "# --list prints your settings and --show-origin says which file each came from.",
    "# | passes that to grep, which keeps only the lines containing \"user.\"",
    "# The last pair reads file:.git/config, this repository's own file. A",
    "# machine-wide pair above it would name .gitconfig in your home"
  ]
},

{
  title: "Your first commit",
  level: "basics",
  task: [
    "Create a `README.md` containing the single line `# taskrunner`. Look at the",
    "status before you *stage* the file (mark it for the next commit) and again",
    "after, so you see it change state. Then commit it."
  ],
  solution: [
    "echo \"# taskrunner\" > README.md    # > writes the text into the file",
    "",
    "git status -sb          # ?? README.md   (untracked: git has not recorded it yet)",
    "git add README.md",
    "git status -sb          # A  README.md   (staged)",
    "",
    "git commit -m \"Add README\"",
    "",
    "# -sb is the short form of status. The first column shows what is staged and the",
    "# second what is changed but not staged: M modified, A added, D deleted.",
    "# -m gives the commit its message, a note saying what changed"
  ]
},

{
  title: "Add the first real source file",
  level: "basics",
  task: [
    "Create `src/runner.py` with the content below, then stage it and commit it.",
    "Keep this file, because most later steps edit it. A file of your own works",
    "too, if it has the two things those steps rely on: a constant near the top,",
    "and an error raised a good way further down.",
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
    "# cat with <<'EOF' writes every line up to EOF into the file, which saves you",
    "# opening an editor. Later steps change QUEUE_DEPTH and the \"queue full\" error,",
    "# and they rely on the distance between those two lines"
  ]
},

{
  title: "Keep junk out of the repository",
  level: "basics",
  task: [
    "Create a `build/` directory and a `__pycache__/` directory, each with a",
    "throwaway file inside. Now make git ignore both with an ignore file",
    "(`.gitignore`, at the top of the repository), so that `git status` reports",
    "nothing but that file. Commit it."
  ],
  solution: [
    "mkdir build __pycache__",
    "touch build/output.log __pycache__/runner.pyc    # touch creates empty files",
    "",
    "git status -sb          # both directories show as untracked",
    "",
    "printf 'build/\\n__pycache__/\\n' > .gitignore   # printf writes text; \\n ends a line",
    "",
    "git status -sb          # now only ?? .gitignore",
    "git add .gitignore",
    "git commit -m \"Ignore build output and bytecode\""
  ]
},

{
  title: "Read the history two ways",
  level: "basics",
  task: [
    "Print the history as one line per commit. Then print everything about the",
    "most recent commit: its message, author and full diff, meaning the lines it",
    "changed."
  ],
  solution: [
    "git log --oneline",
    "# three commits: README, TaskRunner skeleton, .gitignore",
    "# each line starts with the commit's short hash, its ID",
    "",
    "git show HEAD",
    "# or: git show          (the default. HEAD names the branch you are on, and",
    "#                       through it that branch's newest commit)"
  ]
},

{
  title: "Ask git about a flag you do not know",
  level: "intermediate",
  task: [
    "You want that same history, but with a count of how many lines each commit",
    "changed, and you do not know the flag (a setting you add to a command, such",
    "as `--oneline`). Ask git for the *short* option list first, with `git log -h`,",
    "and look for it. It will not be there. Then ask for the full manual page with",
    "`git help log`, find it, and run the log again with it. That page opens in a",
    "terminal pager (a scrolling viewer) on macOS and Linux, where `/` searches",
    "and `q` quits, and in your browser on Windows.",
    "Then find where the syntax for naming commits is written down, such as",
    "`HEAD~2` for two commits back. It is in one of git's guides, and `git help -h`",
    "shows the ways to list the guides. Finding the right list takes two tries."
  ],
  solution: [
    "git log -h",
    "# the one-screen summary. No --stat anywhere in it: -h lists the options",
    "# log defines, and leaves out the diff options it shares with show and diff",
    "",
    "git help log            # the full page: a pager, or a browser on Windows",
    "# --stat is documented here",
    "",
    "git log --stat",
    "# the same three commits, each with its files and a +/- count",
    "",
    "git help -h             # the ways to list things: -a, -g, --user-interfaces",
    "git help -g             # the concept guides, and this one is not among them",
    "git help --user-interfaces   # the guides on how you talk to git: revisions",
    "git help revisions      # where HEAD~2 and the other forms are defined"
  ]
},

{ act: "II — the index, precisely" },

{
  title: "Two edits, one file",
  level: "intermediate",
  task: [
    "Open `src/runner.py` and make two *unrelated* changes: add a line",
    "`self.retries = 3` just below `self.pending = []`, and append this method at",
    "the end of the class, exactly as written:",
    "|     def stop(self):",
    "|         self.pending.clear",
    "In any file, keep at least a handful of unchanged lines between the",
    "two edits. Do not stage anything yet. Just confirm git sees one modified",
    "file."
  ],
  solution: [
    "# edit src/runner.py so that __init__ ends with:",
    "#         self.pending = []",
    "#         self.retries = 3",
    "#",
    "# and the class ends with:",
    "#",
    "#     def stop(self):",
    "#         self.pending.clear",
    "",
    "git status -sb          # \" M src/runner.py\": one file, two changes",
    "",
    "# keep them apart: a hunk is a block of changed lines plus three lines of",
    "# context on each side, and two edits whose context overlaps become one",
    "# hunk. The next step needs git to offer them separately. Staging copies a",
    "# change into the index (the staging area), which is what the next commit",
    "# will contain"
  ]
},

{
  title: "Stage only the first change",
  level: "intermediate",
  task: [
    "Stage the `retries` line and leave the `stop()` method unstaged, without",
    "editing the file or using a second file. Git should offer you the two",
    "changes separately."
  ],
  solution: [
    "git add -p src/runner.py",
    "",
    "# -p (for patch) offers each change in turn and asks whether to stage it.",
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
  level: "intermediate",
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
  level: "intermediate",
  task: [
    "Stage and commit the `stop()` method with any message you like. Then change",
    "that message to `Add stop() method`, without creating a second commit. Note",
    "the commit hash before and after."
  ],
  solution: [
    "git add src/runner.py",
    "git commit -m \"add stop\"",
    "",
    "git log --oneline -1        # -1: the newest commit only. Note the hash",
    "",
    "git commit --amend -m \"Add stop() method\"",
    "",
    "git log --oneline -1        # the corrected message, and a DIFFERENT hash",
    "# amend makes a new commit and drops the old one from the branch"
  ]
},

{
  title: "Repair the last commit, keep the rest",
  level: "intermediate",
  task: [
    "Look again at the `stop()` you committed: `self.pending.clear` has no",
    "parentheses, so Python looks the method up and throws the result away. The",
    "flaw was planted back in *Two edits, one file*. If you caught it while",
    "typing, break the committed line again now, because this step needs a flawed",
    "last commit. Fix the line in your editor, and while you are in the file add",
    "an unrelated method below `submit()`:",
    "|     def start(self):",
    "|         self.started = True",
    "Now repair the last commit so the broken line is gone from the history,",
    "keeping its message, without committing `start()` and without losing it.",
    "Then give `start()` its own commit, and prove both ended up where they",
    "belong."
  ],
  solution: [
    "# edit src/runner.py: parentheses onto self.pending.clear(), and the",
    "# start() method inserted below submit()",
    "",
    "git add -p src/runner.py",
    "# the start() hunk comes first in file order  → answer n",
    "# the parenthesis fix comes second            → answer y",
    "",
    "git commit --amend --no-edit",
    "# amend builds the new commit from the last commit's parent (the commit",
    "# before it) plus the index, so only what you staged goes in. Unstaged edits",
    "# do not block an amend",
    "",
    "git show HEAD | grep clear      # shows: +        self.pending.clear()",
    "git status -sb                  #  M src/runner.py: start() survived",
    "",
    "git add src/runner.py",
    "git commit -m \"Add start() method\"",
    "git show --stat HEAD            # start(), as its own commit",
    "",
    "# if the fix and the new work had shared a hunk, s splits it. When no unchanged",
    "# line separates them, e opens the hunk in your editor to cut by hand. The broken",
    "# line leaves history only because no other copy of this repository exists yet.",
    "# Act X covers what changes once one does"
  ]
},

{
  title: "Stage a directory, then take one file back out",
  level: "basics",
  task: [
    "Write a second file, `src/timer.py`, with the content below, and append a",
    "`MAX_WAIT = 60` line to `src/runner.py`. Stage both with a single command",
    "that names neither file. Then change your mind about the runner edit and",
    "take it back out of the index (the staging area) without losing it, so that",
    "the commit you make contains the new file alone.",
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
    "echo \"MAX_WAIT = 60\" >> src/runner.py    # >> adds to the end of a file",
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
    "git diff                # what you changed and have not staged: the MAX_WAIT line",
    "git commit -m \"Add Timer skeleton\""
  ]
},

{
  title: "Stage the tracked changes only",
  level: "basics",
  task: [
    "Timing turns out to belong in the runner, so delete `src/timer.py` from your",
    "files. Then create an untracked `src/scratch.py`, meaning a file git has not",
    "recorded yet, standing in for the temporary files you collect during real",
    "work. With the `MAX_WAIT` edit still unstaged you now have three kinds of",
    "change at once. Stage the edit and the deletion with one command that",
    "cannot touch the scratch file, commit, and clear the scratch file away",
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
    "# D  src/timer.py      ← the removal is staged as well as done on disk",
    "# ?? src/scratch.py    ← untracked, so -u leaves it out",
    "",
    "git commit -m \"Add MAX_WAIT and drop the Timer skeleton\"",
    "",
    "rm src/scratch.py",
    "# rm + git add -u is what git rm does in one step",
    "# git add -A would have staged the scratch file too, and so would git add .",
    "# from this directory, since it covers the current directory and below"
  ]
},

{
  title: "Rename a file in a way git records",
  level: "intermediate",
  task: [
    "Add `src/util.py` with the helper below and commit it. Then decide the name",
    "should have been plural: rename the file with the command that stages the",
    "rename, and commit that. Confirm afterwards that the file's history reaches",
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
    "git log --follow --oneline -- src/utils.py      # -- says what follows is a path",
    "# both commits: --follow tracks a file's history across a rename",
    "#",
    "# mv src/util.py src/utils.py && git add -A does exactly the same thing:",
    "# git stores no rename, it infers one when the diff is displayed"
  ]
},

{
  title: "Untrack a file without deleting it",
  level: "intermediate",
  task: [
    "Create a `debug.log` and commit it by mistake. Now stop git tracking it",
    "while leaving it on disk, add a rule so that nothing like it comes back, and",
    "commit that. Note which of the two `git rm` forms leaves the file alone."
  ],
  solution: [
    "echo \"started at 09:12\" > debug.log",
    "git add debug.log && git commit -m \"Add debug log\"    # the mistake",
    "",
    "git rm --cached debug.log    # --cached: from the index only",
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
    "# -a stages every tracked file that changed",
    "",
    "ls debug.log        # still there",
    "# git rm debug.log, without --cached, would have deleted it as well"
  ]
},

{
  title: "Stage whole files from a menu",
  level: "intermediate",
  task: [
    "Append a `RETRY_DELAY = 2` line to `src/runner.py`, this helper to",
    "`src/utils.py`:",
    "| def noop():",
    "|     return None",
    "and create an untracked `src/tmp.py`. Now stage the two tracked files by",
    "number rather than by path, all from inside git's menu, `git add -i`. Notice",
    "which of the three its update command does not offer you, and why. Then commit,",
    "and delete `src/tmp.py`."
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

{ act: "III — branches and a fast-forward merge" },

{
  title: "Branch and switch in one command",
  level: "basics",
  task: [
    "Create a branch called `feature/queue` and move onto it with a single",
    "command. Confirm where you are."
  ],
  solution: [
    "git switch -c feature/queue",
    "",
    "git branch              # * marks feature/queue",
    "git status -sb          # \"## feature/queue\"",
    "",
    "# a branch is a label on its newest commit, and it moves forward as you commit.",
    "# Switching to a branch rewrites your files to match that commit"
  ]
},

{
  title: "Two commits on the branch",
  level: "basics",
  task: [
    "Add a new file `src/queue.py` and commit it:",
    "| class Queue:",
    "|     def __init__(self):",
    "|         self.items = []",
    "Then add this method and commit again, making two separate commits:",
    "|     def push(self, item):",
    "|         self.items.append(item)"
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
    "git log --oneline -3     # -3: the newest three"
  ]
},

{
  title: "Park an edit, switch away, and bring it back",
  level: "intermediate",
  task: [
    "Start a third change in `src/queue.py`, but do not commit it:",
    "|     def pop(self):",
    "|         return self.items.pop(0)",
    "Now you need to check something on `main`. Set the unfinished edit aside",
    "with a label, switch to `main`, switch straight back, and restore the edit.",
    "Then commit it properly."
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
    "git stash push -m \"queue pop method\"   # the stash: git's list of changes set aside",
    "git status -sb                      # clean, nothing to block the switch",
    "",
    "git switch main",
    "git log --oneline -1                # whatever you needed to check",
    "git switch -                        # back, without typing the branch name",
    "",
    "git stash list                      # stash@{0}: On feature/queue: queue pop method",
    "# stash@{0} is the newest entry",
    "git stash pop                       # applied, and dropped from the list",
    "",
    "git add src/queue.py && git commit -m \"Add Queue.pop\""
  ]
},

{
  title: "Merge it back, then delete the branch",
  level: "basics",
  task: [
    "Return to `main` and merge the branch, which brings its work into the branch",
    "you are on. Read the word git prints. Is there a merge commit (a commit with",
    "two *parents*, a parent being the commit before it), and why or why not?",
    "Then remove the branch label using the form that refuses to delete unmerged",
    "work, and confirm the commits survived it."
  ],
  solution: [
    "git switch main",
    "git merge feature/queue",
    "# \"Fast-forward\"",
    "",
    "git log --oneline --graph -5",
    "# --graph draws the history as a diagram. Here it is a straight line, with no",
    "# merge commit: main had not moved since the branch was created, so git just",
    "# moved main forward",
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
  level: "basics",
  task: [
    "Create and switch to a branch `feature/retry`. Make two changes to",
    "`src/runner.py`: `QUEUE_DEPTH = 8` becomes `16`, and the overflow error",
    "further down becomes `raise RuntimeError(\"queue full, try again\")`. With a",
    "file of your own, any two lines with about ten unchanged lines between them do",
    "the job. Note which two, because the next step edits the same pair. Commit",
    "both, staging and committing tracked changes in a single command."
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
  level: "basics",
  task: [
    "Go back to `main` and change those same two places differently:",
    "`QUEUE_DEPTH = 32`, and the error message becomes",
    "`f\"queue full at {self.depth}\"`. Commit it. The branches now disagree in two",
    "spots, far enough apart in the file that git will report them as two separate",
    "*conflicts*: places where both branches changed the same lines."
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
    "# --all includes every branch: two lines of development, diverged",
    "",
    "# apart on purpose: two disagreements that sit too close together become",
    "# one conflict block. You will count them when you merge"
  ]
},

{
  title: "Ask git what the merge would do, before running it",
  level: "intermediate",
  task: [
    "You know the branches disagree, because you wrote both sides. Ask git as well,",
    "with a dry run (a trial that changes nothing): `git merge-tree --write-tree`",
    "works out a merge without touching your files or the index, and reports what",
    "*would* happen. Then use that command's exit code (the number a command leaves",
    "behind when it ends, which `echo $?` prints) to prove that a conflict is",
    "coming, and `status` to prove that your files did not change."
  ],
  solution: [
    "git merge-tree --write-tree HEAD feature/retry",
    "# the ID of the tree the merge would produce (a tree is git's record of a",
    "# set of files), then the unmerged file, then",
    "# CONFLICT (content): Merge conflict in src/runner.py",
    "",
    "echo $?          # 1: the real merge would stop and ask (0 = clean)",
    "",
    "git status -sb   # clean: working tree and index unchanged",
    "",
    "# needs git 2.38+. git merge --no-commit is different: it is a real merge",
    "# paused before the commit"
  ]
},

{
  title: "Trigger the conflict and read it",
  level: "basics",
  task: [
    "Merge `feature/retry` into `main`. It stops at the conflicts you set up.",
    "Find out which file is in conflict, which git calls unmerged, then open it.",
    "Git has written *conflict markers* into it: lines of `<`, `=` and `>` around",
    "each conflict. Count the conflicts, and say which side each version between",
    "the markers belongs to."
  ],
  solution: [
    "git merge feature/retry",
    "# CONFLICT (content): Merge conflict in src/runner.py",
    "",
    "git status",
    "# \"Unmerged paths:  both modified:  src/runner.py\"",
    "",
    "grep -c '^<<<<<<<' src/runner.py  # -c counts the lines that match: 2 conflicts",
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
    "# everything between the two conflicts merged cleanly"
  ]
},

{
  title: "See what both sides started from",
  level: "basics",
  task: [
    "Two versions of a line do not tell you which side changed. `git checkout",
    "--conflict=zdiff3 <file>` redraws the conflict in a style that includes the",
    "*common ancestor*, meaning the version both branches started from. Do that,",
    "read what it tells you about each of the two disagreements, and set that style",
    "for the rest of the lab with `git config`."
  ],
  solution: [
    "git checkout --conflict=zdiff3 src/runner.py",
    "# git checkout is an older command that can also rewrite a file, and zdiff3 is",
    "# the conflict layout with a base section. A file in conflict has three copies",
    "# in the index: base (the common ancestor's version), ours (the branch you are",
    "# on) and theirs (the branch you named). The file is rebuilt from them, so any",
    "# editing you had already done to it is thrown away",
    "",
    "cat src/runner.py",
    "# <<<<<<< ours",
    "# QUEUE_DEPTH = 32",
    "# ||||||| base",
    "# QUEUE_DEPTH = 8          ← both sides raised it: a real choice",
    "# =======",
    "# QUEUE_DEPTH = 16",
    "# >>>>>>> theirs",
    "",
    "git config merge.conflictStyle zdiff3",
    "# a setting, written to this repository's .git/config, the same way as",
    "# user.name in act I. From here on every conflict git writes in this",
    "# repository includes the base section; --global would set that for every",
    "# repository on the machine"
  ]
},

{
  title: "Take one whole side, and see what it costs",
  level: "intermediate",
  task: [
    "Resolve the second conflict, the error message, by taking `main`'s version of",
    "it, without opening the file. Then look at what that did to the first",
    "conflict, and put both conflict blocks back into the file."
  ],
  solution: [
    "git checkout --ours src/runner.py",
    "# a file in conflict exists three times in the index: base, ours, theirs.",
    "# ours is the branch you were on when you merged (main), theirs the branch",
    "# you named (feature/retry). This command copies one of the three over",
    "# the working file",
    "",
    "grep -n QUEUE_DEPTH src/runner.py",
    "# QUEUE_DEPTH = 32: the first conflict was decided too, with no warning.",
    "# --ours takes the whole FILE, so it decides every conflict in it at once",
    "",
    "git diff",
    "# during a conflict this is a combined diff: only lines matching neither",
    "# side. Only a header here, because no line in the file is your own work",
    "",
    "git checkout --merge src/runner.py",
    "# both conflicts back, ancestor included, thanks to the setting from the",
    "# last step. --merge rebuilds the marked-up file from the same three index",
    "# copies, so taking a side is never final"
  ]
},

{
  title: "Take the other side of the same conflict",
  level: "intermediate",
  task: [
    "Now do the opposite: take the *branch's* version of the whole file, again",
    "without opening it. Check both disputed lines, then check `git status`. Has",
    "picking a side resolved the conflict? Put the markers back when you have your",
    "answer."
  ],
  solution: [
    "git checkout --theirs src/runner.py",
    "",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# QUEUE_DEPTH = 16 and \"queue full, try again\": both lines are now the",
    "# branch's, the depth line as well",
    "",
    "git status",
    "# still \"both modified\": writing a version into the working tree does not",
    "# resolve a conflict. Only git add does, however the text got there, so you",
    "# can keep changing your mind",
    "",
    "git checkout --merge src/runner.py    # markers back, next experiment"
  ]
},

{
  title: "Mix the two sides, then abandon the merge",
  level: "basics",
  task: [
    "One side does not have to win everywhere. Resolve the two conflicts in",
    "opposite directions by editing the file: keep `main`'s depth and the",
    "branch's error message. Then run `git diff` to see which lines of the result",
    "are your own, and throw the whole merge away."
  ],
  solution: [
    "# edit src/runner.py:",
    "#   keep  QUEUE_DEPTH = 32                                    ← ours",
    "#   keep  raise RuntimeError(\"queue full, try again\")         ← theirs",
    "#   and delete every marker line",
    "",
    "git diff",
    "# only a header: during a conflict git diff lists just the lines that match",
    "# neither side, and every line you kept came from one of them",
    "",
    "git merge --abort",
    "git status -sb                       # clean: the merge never happened",
    "grep -n QUEUE_DEPTH src/runner.py    # 32: main as it was before",
    "",
    "# --abort undoes the whole merge: markers, your edits and the cleanly",
    "# merged parts. git checkout --merge is smaller: it rebuilds one file and",
    "# leaves the merge in progress. The two branches do not change either way"
  ]
},

{
  title: "Decide the winner before the merge starts",
  level: "intermediate",
  task: [
    "Merge the branch twice more without ever seeing a marker: once telling git in",
    "advance that `main` wins wherever the two sides conflict, once that the branch",
    "wins. Check what each merge produced, and undo it with `git reset --hard",
    "ORIG_HEAD` before going on. Then say how these forms differ from running",
    "`checkout --ours` after a merge has stopped at a conflict."
  ],
  solution: [
    "git merge -X ours feature/retry",
    "# the merge does not stop: git resolved both conflicts in main's favour and",
    "# made the merge commit. It opens an editor for the message first: save and",
    "# close it. On a fresh install that is often Vim, where you type :wq and press",
    "# Enter",
    "",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# 32 and f\"queue full at {self.depth}\": main's pair",
    "",
    "git reset --hard ORIG_HEAD",
    "# merge saved the commit you were on in ORIG_HEAD, and reset --hard moves the",
    "# branch back to it. It also overwrites your files, so any uncommitted edit is",
    "# lost (act VII covers reset)",
    "",
    "git merge -X theirs feature/retry",
    "grep -n 'QUEUE_DEPTH\\|queue full' src/runner.py",
    "# 16 and \"queue full, try again\": the branch's pair",
    "",
    "git reset --hard ORIG_HEAD",
    "",
    "# -X ours and -X theirs decide hunk by hunk, only where the sides conflict.",
    "# The rest of the file still comes from both sides. checkout --ours takes a",
    "# whole file, after the merge has stopped and shown you the conflict. With -X",
    "# you never see the conflict: git drops the losing hunks without a word. That",
    "# suits files a tool generates and is a poor choice for code you would want",
    "# to read"
  ]
},

{
  title: "Let git refuse a half-finished resolution",
  level: "intermediate",
  task: [
    "Git 2.56 gave `git add` a form that checks your work: it stages only the",
    "files that were in conflict, and refuses while any of them still holds a",
    "marker. Try it before this act's last merge. First leave an unrelated edit",
    "uncommitted, a second line in `README.md`:",
    "| Runs queued tasks, one at a time.",
    "Then start the merge, resolve only the depth conflict (keep 16), and stage the",
    "file with that form of `add`. Read the refusal, and check what got staged.",
    "Resolve the error-message conflict too, any way you like, stage again, and see",
    "where each of your two edits ended up. Then abandon the merge and drop the",
    "README line, so the next step starts clean. Older git has no such option; read",
    "the solution instead."
  ],
  solution: [
    "echo \"Runs queued tasks, one at a time.\" >> README.md",
    "git merge feature/retry",
    "# the uncommitted line does not block it: it is unstaged, and the merge",
    "# never touches README.md",
    "",
    "# edit src/runner.py: QUEUE_DEPTH = 16, with that conflict's marker lines",
    "# gone. Leave the error-message conflict exactly as git wrote it",
    "",
    "git add --resolved",
    "# fatal: the following paths still have conflict markers:",
    "#         src/runner.py",
    "git ls-files -u              # lists each copy of a file in conflict: still three",
    "# (base, ours, theirs). git add read the whole file, found the second conflict,",
    "# and staged nothing. A leftover ||||||| line trips it too. That is the fourth",
    "# marker, which zdiff3 adds and which is easy to miss if you are used to deleting",
    "# three",
    "",
    "# edit src/runner.py: resolve the error-message conflict and delete its markers",
    "",
    "git add --resolved           # silent this time: staged",
    "git status -sb",
    "#  M README.md               ← unstaged: it stays out of the merge",
    "# M  src/runner.py           ← staged: the resolution alone",
    "",
    "git merge --abort",
    "git status -sb               # \" M README.md\": the abort left it alone",
    "git restore README.md",
    "",
    "# git add -A would have staged the README line into the merge, and the",
    "# abort would then have wiped it: --abort rewinds everything staged and",
    "# keeps only edits that were not staged. On git 2.55 and older this step stops",
    "# at \"error: unknown option `resolved'\" with nothing staged, and the",
    "# grep in the next step is the check by hand"
  ]
},

{
  title: "Resolve, finish, and inspect the merge commit",
  level: "basics",
  task: [
    "Start the merge one final time and compare the markers with those of your",
    "first conflict. You passed no option either time. Then resolve both conflicts",
    "by hand and for good: keep the branch's `QUEUE_DEPTH = 16`, and write a new",
    "error message that combines both sides, `f\"queue full at {self.depth}, try",
    "again\"`. Delete every marker line, check that this message is the only line",
    "matching neither side, then finish the merge and prove the commit you made has",
    "two parents. Then delete the branch, as in act III."
  ],
  solution: [
    "git merge feature/retry",
    "# the same two conflicts, however many times you run it: a conflict is",
    "# computed fresh from each branch's newest commit and their common ancestor,",
    "# and none of the three has moved. The base section now appears by itself,",
    "# from the setting you made earlier in this act, and the labels are HEAD and",
    "# feature/retry again, with the base labelled by its short hash",
    "",
    "# edit src/runner.py: QUEUE_DEPTH = 16, the combined error message,",
    "# and no marker lines left in either conflict",
    "",
    "grep -rn '^<<<<<<<\\|^|||||||\\|^=======\\|^>>>>>>>' src/    # should print nothing",
    "# all four markers: \\| means or, ^ the start of a line, -r the whole folder",
    "",
    "git diff",
    "# the error message line, and nothing else: the depth line agrees with",
    "# one side, so git diff has nothing to report about it",
    "",
    "git add src/runner.py",
    "# staging a file tells git its conflict is resolved. Plain git add does not look",
    "# inside the file, which is why the grep came first. From git 2.56, git add",
    "# --resolved refuses while a marker remains",
    "git merge --continue        # or: git commit",
    "# git opens an editor with the merge message already written: save and close",
    "# it to finish. On a fresh install that is often Vim, where you type :wq and",
    "# press Enter",
    "",
    "git show -s --format='%h  parents: %p' HEAD",
    "# -s hides the diff, and the format asks for the short hash and the parents.",
    "# TWO hashes listed: only merge commits have more than one",
    "",
    "git log --oneline --graph -8",
    "# the branch splits and rejoins",
    "",
    "git branch -d feature/retry",
    "# merged, so the safe delete works"
  ]
},

{
  title: "Trace one line back, and one value that vanished",
  level: "intermediate",
  task: [
    "Answer two questions about the file you just merged, with a different tool for",
    "each. First: for the `QUEUE_DEPTH` line as it now stands, find the commit,",
    "author and date that last touched it, without printing the rest of the file.",
    "Second: `QUEUE_DEPTH = 32` was on `main` before the merge and is nowhere in",
    "the file now. Find the commit that introduced it. Finally, `git log` does not",
    "look at what a merge changed unless you ask. Find the option in `git help log`,",
    "and make the merge commit itself show where the 32 was dropped."
  ],
  solution: [
    "grep -n QUEUE_DEPTH src/runner.py       # note the line number",
    "git blame -L 1,1 src/runner.py          # -L 1,1: only line 1, the number you noted",
    "# one line: the commit that last set it, its author, its date",
    "",
    "git log -S 'QUEUE_DEPTH = 32' --oneline",
    "# one line: the commit on main that introduced it. The merge dropped the",
    "# value, but merge commits are not diffed at all without -m",
    "",
    "git log -S 'QUEUE_DEPTH = 32' --oneline -m",
    "# now two lines: the merge, marked (from <its first parent>), and the",
    "# commit that introduced it. A merge's first parent is the branch you were on",
    "# when you merged",
    "",
    "# blame reads the file as it stands, so it cannot see a line that no longer",
    "# exists. log -S, the pickaxe, reads the diffs, so it can find a value that",
    "# was later deleted"
  ]
},

{ act: "V — rewriting a branch before you merge it" },

{
  title: "Build a deliberately messy branch",
  level: "basics",
  task: [
    "Create a branch `feature/logging` and grow a new `src/log.py` one line per",
    "commit, three commits in all:",
    "| import logging",
    "| LOG = logging.getLogger(__name__)",
    "| LEVEL = 'INFO'",
    "Give the first a proper message, make the second just `wip` (work in",
    "progress), and put the typo `defualt` into the third's."
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
    "git log --oneline -3",
    "# an interactive rebase cleans this up at the intermediate level. At basics the",
    "# mess stays, and it does no harm"
  ]
},

{
  title: "Let the trunk move underneath you",
  level: "basics",
  task: [
    "Switch to `main`, the *trunk* (the branch the work ends up on), expand the",
    "README with a description line, and commit it. Any edit works if your branch",
    "leaves that file alone. Then go back to your branch. The branch is now",
    "behind the trunk."
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
    "# your branch starts from an older commit on main",
    "",
    "# the branch leaves the README alone, because a conflict here would repeat",
    "# act IV"
  ]
},

{
  title: "Preview the rebase before you run it",
  level: "intermediate",
  task: [
    "A *rebase* replays your branch's commits on top of another branch, and",
    "`git rebase` has no dry run: each commit's conflicts depend on how you resolved",
    "the commit before it. Preview what you can: list the commits that would be",
    "replayed, then reuse act IV's dry-run merge to check whether their content",
    "conflicts with what the trunk gained."
  ],
  solution: [
    "git log --oneline main..HEAD     # the replay list: your three commits",
    "# A..B, a range, lists the commits B has that A lacks",
    "",
    "git merge-tree --write-tree main HEAD",
    "# a tree ID and nothing else: no CONFLICT lines this time",
    "echo $?      # 0: no conflict, because the two sides changed different files",
    "",
    "# and if a clean prediction still goes wrong during the rebase:",
    "#   git rebase --abort            # the same escape merge --abort gave you",
    "#   git reset --hard ORIG_HEAD    # even after it finished: act VII's tools",
    "#",
    "# git replay works out a whole replay and moves nothing, but git's manual still",
    "# marks it experimental: git replay --ref-action=print --onto main main..HEAD"
  ]
},

{
  title: "Rebase onto the trunk and watch the hashes change",
  level: "basics",
  task: [
    "Note your three commit hashes. *Rebase* the branch: replay its commits on",
    "top of the latest `main`. Then compare the hashes, and explain why the",
    "README change is now in your branch even though it is not one of your",
    "commits."
  ],
  solution: [
    "git log --oneline -3           # write these hashes down",
    "",
    "git rebase main",
    "",
    "git log --oneline -3           # same messages, DIFFERENT hashes",
    "git log --oneline -5           # \"Expand README\" now sits below your work",
    "",
    "# the replayed commits are copies with a new parent (the commit before them).",
    "# A commit's hash is computed from everything in it, its parent included, so",
    "# their hashes had to change. main's commit is not yours: it is an ancestor of",
    "# your branch, meaning a commit further back in its history"
  ]
},

{
  title: "Clean up the branch with an interactive rebase",
  level: "intermediate",
  task: [
    "In one *interactive rebase* against `main`, where git opens the list of",
    "commits so you can edit the replay first: fold the `wip` commit into the one",
    "before it and discard its message, and correct the `defualt` typo in the",
    "third commit's message. You should end with two commits."
  ],
  solution: [
    "git rebase -i main",
    "",
    "# git opens whatever core.editor names, which on a fresh install is often",
    "# Vim: press i to start typing, then Esc and :wq to save and quit.",
    "# git config --global core.editor sets it to something else.",
    "# It opens with three pick lines above a block of comments. Change them to:",
    "#",
    "#   pick   xxxxxxx # Add logging module",
    "#   fixup  xxxxxxx # wip",
    "#   reword xxxxxxx # Add defualt log level",
    "#",
    "# save and close; git then opens the message to reword:",
    "#   Add default log level",
    "",
    "git log --oneline -3",
    "# two commits on the branch, clean messages"
  ]
},

{
  title: "Merge it with the branch shape preserved",
  level: "basics",
  task: [
    "`main` could fast-forward, but merge the branch into it with a merge commit",
    "anyway, so the graph records that this work arrived as a branch.",
    "Then delete the branch."
  ],
  solution: [
    "git switch main",
    "git merge --no-ff feature/logging -m \"Merge logging\"",
    "# --no-ff forbids the fast-forward, and -m gives the merge commit its message",
    "",
    "git log --oneline --graph -8",
    "# the branch visibly forks and rejoins",
    "",
    "git branch -d feature/logging"
  ]
},

{
  title: "Branch twice from the wrong place",
  level: "intermediate",
  task: [
    "You are about to start three pieces of work, two of them from the wrong place.",
    "First create `logging/rotation` from `main` and commit one line into",
    "`src/log.py`:",
    "| ROTATE_AT = 1_000_000",
    "Now stay exactly where you are. Without going back to `main`, create",
    "`queue/drain` and give it two commits, one per method, appended to",
    "`src/queue.py`:",
    "|     def drain(self):",
    "|         while self.items:",
    "|             yield self.items.pop(0)",
    "|",
    "|     def is_empty(self):",
    "|         return not self.items",
    "Then return to `logging/rotation` and make the same slip a second time:",
    "create `logging/retention` from where you are, and commit one line into",
    "`src/log.py`:",
    "| ROTATE_KEEP = 7",
    "Both of those branches started from another branch, where they should have",
    "started from the trunk. The first shares no file with the branch it started",
    "from. The second adds a line directly beneath the one that branch just added."
  ],
  solution: [
    "git switch -c logging/rotation",
    "echo \"ROTATE_AT = 1_000_000\" >> src/log.py",
    "git commit -am \"Rotate the log at a million lines\"",
    "",
    "git switch -c queue/drain",
    "# the slip: -c takes its start point from HEAD, and HEAD is not main",
    "# append drain() to src/queue.py, then:",
    "git commit -am \"Add Queue.drain\"",
    "# append is_empty() to src/queue.py, then:",
    "git commit -am \"Add Queue.is_empty\"",
    "",
    "git switch logging/rotation",
    "git switch -c logging/retention",
    "echo \"ROTATE_KEEP = 7\" >> src/log.py",
    "git commit -am \"Keep a week of rotated logs\"",
    "",
    "git branch",
    "# logging/retention, logging/rotation, main, queue/drain",
    "# three branches at once, one per piece of work. Until now this lab has",
    "# had one at a time, so it did not matter which branch you started",
    "# from"
  ]
},

{
  title: "Count what the branch would add",
  level: "intermediate",
  task: [
    "Switch to `queue/drain`. Before running anything, say from memory how many",
    "commits you wrote on it. Now list what it would add to `main`, and compare",
    "the two numbers. Then try the obvious repair, replaying the branch onto",
    "`main`, and read the answer closely before believing it. Finish by finding",
    "where the stray commit came from. Two likely tools cannot tell you: `git",
    "merge-base` (the newest commit two branches share, act IV's common ancestor)",
    "and the branch's own reflog (git's private log of where a branch has pointed).",
    "Run them anyway and read what they say. Then ask HEAD's reflog, which logs",
    "every switch, and `git branch --contains`, which lists the branches holding a",
    "commit."
  ],
  solution: [
    "git switch queue/drain",
    "",
    "git log --oneline main..HEAD      # three of them, and you wrote two",
    "git rev-list --count main..HEAD   # 3",
    "",
    "git rebase main",
    "# Current branch queue/drain is up to date.",
    "#   main is already an ancestor, so there is nothing to replay: exit 0,",
    "#   no reflog entry, and the stray commit exactly where it was",
    "",
    "git merge-base main HEAD          # main's own tip (its newest commit) ...",
    "git rev-parse main                # ... the very same hash. No help:",
    "#   main is the ancestor either way, started correctly or not",
    "",
    "git reflog show queue/drain | tail -1",
    "# ... queue/drain@{2}: branch: Created from HEAD",
    "#   tail -1 keeps the last line, here the oldest entry. \"from HEAD\": the",
    "#   branch's own reflog names a start point only when you passed one yourself,",
    "#   and then you would not have made this mistake",
    "",
    "git reflog | grep 'to queue/drain' | tail -1",
    "# ... checkout: moving from logging/rotation to queue/drain",
    "#   HEAD's reflog logged the switch, and it names the branch. Reflogs stay on",
    "#   your machine, and their entries expire after about 90 days",
    "",
    "git log --oneline logging/rotation..HEAD   # your own two, and nothing else",
    "git branch --contains $(git rev-list main..HEAD | tail -1)",
    "# logging/retention, logging/rotation, queue/drain",
    "#   git rev-list prints the hashes of main..HEAD, newest first, so tail -1 finds",
    "#   the oldest, your stray commit. $( ) puts that hash into the command.",
    "#   --contains lists the branches that hold it, logging/rotation among them"
  ]
},

{
  title: "Move the independent branch onto the trunk",
  level: "intermediate",
  task: [
    "`queue/drain` shares no file with the branch it started from, so its two",
    "commits can go onto `main` without a conflict. Replay them there and leave",
    "`logging/rotation`'s commit behind. One command does it, and it has to be",
    "told three separate things. Confirm the branch now adds exactly two commits,",
    "and that `logging/rotation` still holds its own. Then read `src/log.py` and",
    "explain what is missing."
  ],
  solution: [
    "git rebase --onto main logging/rotation queue/drain",
    "#   put them ON main, stop counting AT logging/rotation, move queue/drain",
    "",
    "git log --oneline main..HEAD              # two commits, new hashes",
    "git log --oneline main..logging/rotation  # its own commit, untouched",
    "",
    "cat src/log.py                            # ROTATE_AT is no longer there",
    "git diff ORIG_HEAD --stat    # ORIG_HEAD: where the branch stood before the rebase",
    "#  src/log.py | 1 -",
    "#   neither of your two commits touched src/log.py. The line was only there",
    "#   because queue/drain started from the branch that added it, and the",
    "#   rebase moved queue/drain off that branch. A clean rebase reports",
    "#   that the changes applied and reports nothing about whether the",
    "#   result still runs. That part is yours to check"
  ]
},

{
  title: "The replay that stops",
  level: "intermediate",
  task: [
    "Now the other one. `logging/retention` edits `src/log.py` directly beneath",
    "the line its base added, so the same command will not go through cleanly.",
    "Run it anyway. Read the conflict instead of resolving it: say what the empty",
    "side of the marker means, and prove it against the trunk's own copy of the",
    "file. Then back out and leave the branch where it was."
  ],
  solution: [
    "git switch logging/retention",
    "git rebase --onto main logging/rotation logging/retention",
    "# CONFLICT (content): Merge conflict in src/log.py",
    "# error: could not apply 582d87e... Keep a week of rotated logs",
    "",
    "git status --short             # UU src/log.py: both sides changed it, unmerged",
    "",
    "cat src/log.py",
    "# <<<<<<< HEAD",
    "# ||||||| parent of 582d87e (Keep a week of rotated logs)",
    "# ROTATE_AT = 1_000_000",
    "# =======",
    "# ROTATE_AT = 1_000_000",
    "# ROTATE_KEEP = 7",
    "# >>>>>>> 582d87e (Keep a week of rotated logs)",
    "#   (your hash will differ)",
    "#   HEAD during a rebase is the branch you are replaying ONTO, so the",
    "#   empty side is main's: main never had these lines. The middle section",
    "#   comes from the zdiff3 setting you made in act IV, and it shows the",
    "#   context the commit was written against",
    "",
    "git show main:src/log.py   # that file on that branch: three lines, no ROTATE_AT",
    "",
    "git rebase --abort",
    "#   do not resolve this conflict. This branch depends on logging/rotation,",
    "#   so it stays there until that branch is merged. Resolving by",
    "#   hand would have meant pasting logging/rotation's work into your own",
    "#   commit, under your name"
  ]
},

{
  title: "Merge all three, and leave main alone",
  level: "intermediate",
  task: [
    "Merge the branches in the order the last two steps showed. `queue/drain` is",
    "ready now. `logging/rotation` goes next, after a rebase onto the new `main`.",
    "Only then can `logging/retention`, which depends on it, take a plain rebase.",
    "Watch what git does with `logging/rotation`'s commit, which",
    "`logging/retention` still contains. Every merge here should fast-forward, and",
    "when you are finished `main` should be the only branch left."
  ],
  solution: [
    "git switch main",
    "git merge queue/drain          # Fast-forward",
    "git branch -d queue/drain",
    "",
    "git switch logging/rotation",
    "git rebase main",
    "git switch main",
    "git merge logging/rotation     # Fast-forward",
    "git branch -d logging/rotation",
    "",
    "git switch logging/retention",
    "git rebase main",
    "# warning: skipped previously applied commit ...",
    "#   logging/rotation's commit is on main now, so the replay drops it and only",
    "#   the branch's own work survives",
    "git log --oneline main..HEAD   # one commit: yours",
    "",
    "git switch main",
    "git merge logging/retention    # Fast-forward",
    "git branch -d logging/retention",
    "",
    "git branch                     # only main",
    "git rev-list --merges --count main   # still 2 merges: nothing here needed one"
  ]
},

{ act: "VI — optional: a file that should have been there from the start", optional: true },

{
  title: "Put a licence into the very first commit",
  task: [
    "A licence file belongs to this project, and it should have been part of it",
    "from the beginning. Write one, called `LICENSE`, then get it into the *root*",
    "commit, the one with no parent, so that every commit in the history contains",
    "it, without changing any other file. A plain rebase would flatten the two",
    "merges you built in acts IV and V into a straight line, and `git help rebase`",
    "names the option that keeps them. Give yourself a way back before you start.",
    "The replay stops twice on the way. Read git's message at each stop before",
    "reaching for the solution."
  ],
  solution: [
    "printf 'MIT License\\n\\nCopyright (c) 2026 Your Name\\n' > LICENSE",
    "git branch before-rewrite      # a label on the old history, just in case",
    "",
    "ROOT=$(git rev-list --max-parents=0 HEAD)   # the one commit with no parent",
    "# git rev-list prints commit hashes. $( ) puts a command's output here, ROOT=",
    "# keeps it in a shell variable, and $ROOT reads it",
    "git checkout --detach $ROOT",
    "# --detach puts HEAD on that commit with no branch: a \"detached HEAD\"",
    "git add LICENSE",
    "git commit --amend --no-edit   # a NEW root commit: same message, new hash",
    "",
    "# replay everything that came after the old root onto the new one",
    "git rebase --rebase-merges --onto HEAD $ROOT main",
    "",
    "# stop one: \"untracked working tree files would be overwritten\". The",
    "# debug.log kept on disk since act II blocks the replay of the commit",
    "# that first added it, because at that point in history nothing ignored it",
    "# yet. You no longer need it:",
    "rm debug.log",
    "git rebase --continue",
    "",
    "# stop two: act IV's conflict again. --rebase-merges runs each merge again",
    "# and does not copy its result, so a conflict you resolved by hand is yours",
    "# to resolve again. git's rerere setting, off by default, records a resolution",
    "# and replays it. Resolve as before (depth 16, the combined message), since the",
    "# next step checks nothing drifted. Then:",
    "git add src/runner.py",
    "git rebase --continue",
    "",
    "# the rebase leaves you back on main",
    "# without --rebase-merges, both merges would be flattened away"
  ]
},

{
  title: "Confirm every commit contains it",
  task: [
    "Prove the rewrite did what you wanted and nothing more: every commit",
    "in `main`'s history contains the licence, the graph still shows both",
    "merges, the commit count is unchanged, and no other file changed. Then",
    "delete your backup branch."
  ],
  solution: [
    "for c in $(git rev-list main); do",
    "  git cat-file -e $c:LICENSE 2>/dev/null || echo \"missing in $c\"",
    "done                           # silence means every one of them has it",
    "# for runs the middle line once per commit, with $c holding the hash. cat-file -e",
    "# checks that a thing exists, and commit:path names a file in a commit. 2>/dev/null",
    "# hides the error message, and || runs echo only if the check fails",
    "",
    "git log --oneline --graph main # both merges still there",
    "git rev-list --count before-rewrite   # the commits before the rewrite",
    "git rev-list --count main             # the same number now",
    "git diff before-rewrite main -- . ':!LICENSE'   # empty: nothing else moved",
    "# :! leaves that path out of the diff",
    "",
    "git branch -D before-rewrite   # verified, so the backup can go",
    "# -D deletes even unmerged work, and -d would refuse here, since no other branch",
    "# holds the old history. Every hash changed, and the reflog still remembers the",
    "# old ones"
  ]
},

{ act: "VII — undoing things" },

{
  title: "Stash again, this time with untracked files",
  level: "intermediate",
  task: [
    "Add a `TIMEOUT = 30` line to `src/runner.py` *and* create a new untracked",
    "file `src/probe.py`. Stash your work and check your files: one of the two is",
    "still there. Bring the stash back, find the flag that takes untracked files",
    "too, and stash again. Preview that stash before bringing it back."
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
  level: "intermediate",
  task: [
    "You have decided the `TIMEOUT` line was a mistake. Throw the edit away, return",
    "the file to its committed state, and delete `src/probe.py`. Note what makes this",
    "different from the previous step."
  ],
  solution: [
    "git restore src/runner.py",
    "rm src/probe.py         # untracked: restore does not touch it",
    "",
    "git status -sb          # clean",
    "tail -3 src/runner.py   # TIMEOUT is gone",
    "",
    "# a stash can be undone and restore cannot: restore keeps no copy of the",
    "# edit, so nothing can bring it back"
  ]
},

{
  title: "Take one file back to an older commit",
  level: "intermediate",
  task: [
    "You want to read `src/runner.py` as it stood when it was first committed, but",
    "only that file, with nothing else in the working tree touched. Find that",
    "commit by reading the history: you want the oldest one that touched the file.",
    "Bring its version of the file into your working tree with `git restore`. Then",
    "confirm three things before you undo it: that neither the branch nor HEAD",
    "moved, that the change arrived *unstaged*, and that the old value is really",
    "there. Finish with a clean working tree."
  ],
  solution: [
    "git log --oneline -- src/runner.py | tail -1",
    "# the oldest commit that touched the file: note its hash",
    "",
    "git restore --source=<that-hash> src/runner.py",
    "# put the hash you noted in place of <that-hash>, brackets included",
    "",
    "git status -sb          # ONE modified file, and the branch line unchanged:",
    "                        # restore moves no branch, so HEAD is where it was",
    "git diff --stat         # the change is unstaged: restore writes the",
    "                        # working tree only, unless you ask for --staged",
    "head -1 src/runner.py   # QUEUE_DEPTH is back to its original 8",
    "",
    "git restore src/runner.py",
    "git status -sb          # clean again, ready for the next step",
    "",
    "# the index is restore's default source; --source lets a commit stand in",
    "# for it here"
  ]
},

{
  title: "Remove untracked clutter, carefully",
  level: "intermediate",
  task: [
    "Create two untracked files, `src/scratch.py` and `notes.txt`. Now list what",
    "a cleanup would delete *without deleting anything*, and only then delete",
    "them."
  ],
  solution: [
    "touch src/scratch.py notes.txt",
    "",
    "git clean -nd           # -n: report only. -d: folders too. \"Would remove ...\"",
    "git clean -fd           # -f: really do it. Removes them",
    "",
    "git status -sb          # clean",
    "# restore and reset leave untracked files alone; only clean removes them"
  ]
},

{
  title: "Collapse three commits into one",
  level: "intermediate",
  task: [
    "Make three trivial commits to a new `notes.md` file. Then combine all three",
    "into a single commit called `Add release notes`, without an interactive",
    "rebase and without losing the file contents."
  ],
  solution: [
    "printf 'A\\n' >> notes.md && git add notes.md && git commit -m \"note A\"",
    "printf 'B\\n' >> notes.md && git add notes.md && git commit -m \"note B\"",
    "printf 'C\\n' >> notes.md && git add notes.md && git commit -m \"note C\"",
    "",
    "git reset --soft HEAD~3",
    "# reset moves the branch to the commit you name. --soft leaves the index and",
    "# your files as they are. The default also unstages, and --hard also rewrites",
    "# your files",
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
  level: "intermediate",
  task: [
    "Undo the release-notes commit using the method that is safe on a branch",
    "other people already have: the one that adds a commit and leaves existing",
    "commits alone. Confirm afterwards that both the original and the undo are",
    "visible in the log."
  ],
  solution: [
    "git revert HEAD --no-edit       # a new commit that reverses the old one",
    "",
    "git log --oneline -3",
    "# \"Revert \\\"Add release notes\\\"\" sits on top of the original",
    "",
    "ls notes.md 2>/dev/null || echo \"notes.md is gone\"",
    "# 2>/dev/null hides ls's error message, and || runs echo only if ls fails.",
    "# The file is removed, but the history of it remains"
  ]
},

{
  title: "Rescue a commit from a deleted branch",
  task: [
    "Create a branch `spike`, commit a `src/version.py` file on it, then return",
    "to `main` and force-delete the branch. No branch points at the commit now.",
    "Find it again and copy just that commit onto `main` with `git cherry-pick`."
  ],
  solution: [
    "git switch -c spike",
    "printf 'VERSION = \"0.1.0\"\\n' > src/version.py",
    "git add src/version.py && git commit -m \"Add version constant\"",
    "",
    "git switch main",
    "git branch -D spike   # -D deletes even unmerged work. No branch points at it now",
    "",
    "git reflog                     # where HEAD has been: find \"Add version constant\"",
    "git cherry-pick <that-hash>",
    "# the hash on that reflog line. cherry-pick makes a new commit with the same change",
    "",
    "git log --oneline -2",
    "cat src/version.py             # the file is back, on main, new hash"
  ]
},

{
  title: "Break the branch, then recover it",
  task: [
    "Record the current commit hash. Now hard-reset three commits back, and",
    "confirm the damage in the log. Then put the branch back where it was, using",
    "the reflog: the local record of every place HEAD has been."
  ],
  solution: [
    "git rev-parse HEAD             # write this down",
    "",
    "git reset --hard HEAD~3",
    "git log --oneline -3           # three commits gone from the branch",
    "",
    "git reflog                     # every HEAD move, most recent first",
    "git reset --hard HEAD@{1}      # or: git reset --hard <the hash above>",
    "# HEAD@{1} is where HEAD was one move ago",
    "",
    "git log --oneline -3           # restored",
    "# reset moved the branch; it deleted no commits"
  ]
},

{
  title: "Final review",
  level: "intermediate",
  task: [
    "Take stock. Print the full history as a graph across all branches, list",
    "every branch, and count how many commits the repository holds. Two merges",
    "should be visible and everything else should be a straight line: every other",
    "branch in this lab was either rebased before merging or fast-forwarded, and",
    "neither leaves a fork behind."
  ],
  solution: [
    "git log --oneline --graph --all --decorate",
    "",
    "git branch -a                  # only main",
    "git rev-list --count HEAD      # total commits",
    "",
    "# the next act goes on in this same repository. When you are done with",
    "# the lab, the whole exercise is disposable:",
    "#   cd .. && rm -rf taskrunner"
  ]
},

{ act: "VIII — a release branch beside main" },

{
  title: "Keep a release branch, and promote main into it",
  level: "intermediate",
  task: [
    "Some teams keep a second long-lived branch, `release`, that takes in",
    "`main` only by merge, and only when `main` is ready to ship. It is one",
    "branching model among several, and this act shows the extra work it brings.",
    "Put a label named `release` on `main`'s tip without leaving `main`. Then",
    "add this `src/report.py` to `main` and commit it:",
    "| def success_rate(results):",
    "|     \"\"\"Share of tasks that returned a true value.\"\"\"",
    "|     return sum(1 for r in results if r) / len(results)",
    "|",
    "|",
    "| def summary(results):",
    "|     \"\"\"One line for the end of a run.\"\"\"",
    "|     return f\"{len(results)} tasks, {success_rate(results):.0%} succeeded\"",
    "Now promote it: merge `main` into `release` so that the graph records the",
    "promotion even though a fast-forward would do. Finish back on `main`."
  ],
  solution: [
    "git branch release             # a label on main's tip; you stay on main",
    "",
    "cat > src/report.py <<'EOF'",
    "def success_rate(results):",
    "    \"\"\"Share of tasks that returned a true value.\"\"\"",
    "    return sum(1 for r in results if r) / len(results)",
    "",
    "",
    "def summary(results):",
    "    \"\"\"One line for the end of a run.\"\"\"",
    "    return f\"{len(results)} tasks, {success_rate(results):.0%} succeeded\"",
    "EOF",
    "git add src/report.py && git commit -m \"Add a run summary\"",
    "",
    "git switch release",
    "git merge --no-ff main -m \"Promote main to release\"",
    "git switch main",
    "",
    "git log --oneline --graph --all -4",
    "# *   65208c7 Promote main to release",
    "# |\\",
    "# | * 52dd3e8 Add a run summary",
    "# |/",
    "#   (your hashes will differ.) Act V's --no-ff again: each promotion",
    "#   stays visible as a merge commit, and release moves only when",
    "#   something is merged into it"
  ]
},

{
  title: "Let main run ahead of the release",
  level: "intermediate",
  task: [
    "Commit two pieces of work to `main` that are not ready to ship: a new",
    "`src/export.py`, then a line in `README.md` announcing it.",
    "| def to_csv(results):",
    "|     return \",\".join(str(r) for r in results)",
    "Then ask git which commits the next promotion would bring."
  ],
  solution: [
    "cat > src/export.py <<'EOF'",
    "def to_csv(results):",
    "    return \",\".join(str(r) for r in results)",
    "EOF",
    "git add src/export.py && git commit -m \"Add a CSV export\"",
    "",
    "printf '\\nResults can be exported as CSV.\\n' >> README.md",
    "git commit -am \"Announce the CSV export\"",
    "",
    "git log --oneline release..main",
    "# de3cc06 Announce the CSV export",
    "# a8fd19a Add a CSV export",
    "#   act V's range: what main has and release lacks, which is exactly",
    "#   what a merge would bring across"
  ]
},

{
  title: "Copy one fix to the release, alone",
  level: "intermediate",
  task: [
    "A run with no tasks crashes the release: `success_rate([])` divides by zero.",
    "The rule here is that a fix goes into `main` first, so commit one there, as",
    "a guard just below the docstring:",
    "|     if not results:",
    "|         return 0.0",
    "`release` needs the fix now, and the two commits from the last step must not",
    "come with it. A merge cannot do that: it brings a commit together with",
    "everything behind it. Copy the fix, onto a branch `hotfix/empty-run` started",
    "from `release`, with `git cherry-pick` and the option that records where the",
    "copy came from. Read the copy's message. Then merge the branch into",
    "`release` with a merge commit, the way a pull request (a hosting site's",
    "request to merge a branch) would, and delete it. Finally, back on `main`, ask",
    "the last step's question again, and explain the answer."
  ],
  solution: [
    "# edit src/report.py so that success_rate reads:",
    "#     \"\"\"Share of tasks that returned a true value.\"\"\"",
    "#     if not results:",
    "#         return 0.0",
    "#     return sum(1 for r in results if r) / len(results)",
    "git commit -am \"Guard success_rate against an empty run\"",
    "git log --oneline -1           # note the hash: this is the fix",
    "",
    "git switch -c hotfix/empty-run release",
    "git cherry-pick -x <the-fix-hash>    # the hash you noted",
    "git log -1 --format=%B",
    "# Guard success_rate against an empty run",
    "#",
    "# (cherry picked from commit 9550b19eba7071db57499681339db7eb6fcef120)",
    "#   -x wrote that line. The copy is a new commit with a hash of its own,",
    "#   and the line is the only link back to the original",
    "",
    "git switch release",
    "git merge --no-ff hotfix/empty-run -m \"Merge hotfix/empty-run\"",
    "git branch -d hotfix/empty-run",
    "git switch main",
    "",
    "git log --oneline release..main",
    "# 9550b19 Guard success_rate against an empty run",
    "# de3cc06 Announce the CSV export",
    "# a8fd19a Add a CSV export",
    "#   three now, the fix among them: release holds a copy under another",
    "#   hash, and a range compares commits and ignores what they changed"
  ]
},

{
  title: "Ask what the next promotion really brings",
  level: "intermediate",
  task: [
    "The range lists three commits, and `release` already has the change from one",
    "of them. `git cherry` compares `main`'s commits with `release` by their",
    "changes and ignores hashes: ask it. Then compare two diffs. The three-dot",
    "form, `git diff release...main`, is what a pull request shows. The two-tip",
    "form, `git diff release main`, compares the branches as they stand. Only one",
    "of them mentions the fix."
  ],
  solution: [
    "git cherry -v release main     # -v adds each commit's message",
    "# + a8fd19a… Add a CSV export",
    "# + de3cc06… Announce the CSV export",
    "# - 9550b19… Guard success_rate against an empty run",
    "#   minus: release already holds this change, under another hash.",
    "#   Plus: new to release",
    "",
    "git diff --stat release...main",
    "#  README.md     | 2 ++",
    "#  src/export.py | 2 ++",
    "#  src/report.py | 2 ++        ← the fix, measured from the merge base",
    "",
    "git diff --stat release main",
    "#  README.md     | 2 ++",
    "#  src/export.py | 2 ++        ← no src/report.py: both tips agree on it"
  ]
},

{
  title: "Promote again, and watch the copy meet its original",
  level: "intermediate",
  task: [
    "The two commits are ready now. Before you merge, say whether the fix will",
    "conflict with its own copy. Then promote `main` into `release` as before,",
    "count the guards in the result, and find both versions of the fix in the",
    "history."
  ],
  solution: [
    "git switch release",
    "git merge --no-ff main -m \"Promote main to release\"",
    "# Merge made by the 'ort' strategy.",
    "#  README.md     | 2 ++",
    "#  src/export.py | 2 ++",
    "#   no conflict, and no src/report.py: since the merge base, both sides",
    "#   made the SAME change there, and a three-way merge (comparing both",
    "#   sides with the merge base) takes an identical change once",
    "",
    "grep -c 'if not results' src/report.py     # 1",
    "git log --oneline --all --grep='empty run'",
    "# 9550b19 Guard success_rate against an empty run",
    "# d278e37 Guard success_rate against an empty run",
    "#   one change under two hashes, both in release's history now",
    "",
    "git switch main"
  ]
},

{
  title: "Watch a revert stay behind",
  task: [
    "A second bug: `summary` reports `1 tasks`. Fix it on `main`, so that the",
    "function picks the noun first:",
    "|     noun = \"task\" if len(results) == 1 else \"tasks\"",
    "|     return f\"{len(results)} {noun}, {success_rate(results):.0%} succeeded\"",
    "Copy the fix to `release` the way you copied the last one. Then the team",
    "changes its mind: another program reads that line, so the wording has",
    "to stay as it was. Revert the fix on `main` the safe way, and promote.",
    "Compare `src/report.py` on the two branches, then put `release` right by",
    "reverting its copy of the fix, and finish on `main`."
  ],
  solution: [
    "# edit src/report.py: those two lines replace summary's return",
    "git commit -am \"Say 1 task, not 1 tasks\"",
    "",
    "git switch -c hotfix/one-task release",
    "git cherry-pick -x main        # a branch name works: its tip is the fix",
    "git switch release",
    "git merge --no-ff hotfix/one-task -m \"Merge hotfix/one-task\"",
    "git branch -d hotfix/one-task",
    "",
    "git switch main",
    "git revert --no-edit HEAD",
    "",
    "git switch release",
    "git merge --no-ff main -m \"Promote main to release\"",
    "# Merge made by the 'ort' strategy.",
    "#   and no file list at all. Since the merge base, main's fix and its",
    "#   revert cancel out, so main changed nothing there, and the merge",
    "#   keeps the only side that moved: release, with its copy of the fix",
    "",
    "git diff main release -- src/report.py",
    "# -    return f\"{len(results)} tasks, {success_rate(results):.0%} succeeded\"",
    "# +    noun = \"task\" if len(results) == 1 else \"tasks\"",
    "# +    return f\"{len(results)} {noun}, {success_rate(results):.0%} succeeded\"",
    "#   the revert did not reach the copy, and no conflict warned you",
    "",
    "git log --oneline --no-merges main..release",
    "# fce0adb Say 1 task, not 1 tasks",
    "# d278e37 Guard success_rate against an empty run",
    "#   release's own commits, merges aside: the two copies",
    "git revert --no-edit fce0adb                 # the copy: use your hash",
    "git diff main release -- src/report.py       # empty: the branches agree",
    "",
    "git switch main"
  ]
},

{
  title: "Fix once, and merge the fix into both",
  task: [
    "Both fixes so far were copies. The third reaches both branches as the",
    "same commit. First let `main` run ahead again, with an unready function",
    "appended to `src/export.py`:",
    "| def to_tsv(results):",
    "|     return \"\\t\".join(str(r) for r in results)",
    "Now the bug: `summary` rounds 99.6% up to 100%. Start `fix/precision` at the",
    "newest commit that `main` and `release` both contain, show one decimal place,",
    "and commit. Merge the branch into `main`, then into `release`, each with a",
    "merge commit. Delete the branch and go back to `main`. Then ask what the next",
    "promotion would bring, and which commit is now the newest one both contain."
  ],
  solution: [
    "cat >> src/export.py <<'EOF'",
    "",
    "",
    "def to_tsv(results):",
    "    return \"\\t\".join(str(r) for r in results)",
    "EOF",
    "git commit -am \"Add a TSV export\"",
    "",
    "git switch -c fix/precision $(git merge-base main release)",
    "#   act V's merge base, put to work: everything up to it is already on",
    "#   both branches, so this branch brings its own commit and nothing else",
    "# edit src/report.py: {success_rate(results):.1%} in summary's return",
    "git commit -am \"Show the success rate to one decimal place\"",
    "",
    "git switch main",
    "git merge --no-ff fix/precision -m \"Merge fix/precision\"",
    "git switch release",
    "git merge --no-ff fix/precision -m \"Merge fix/precision\"",
    "git branch -d fix/precision",
    "git switch main",
    "",
    "git log --oneline release..main",
    "# ce73b55 Merge fix/precision",
    "# 09d6233 Add a TSV export",
    "#   no fix in the list: release holds that very commit, not a copy",
    "",
    "git log --oneline -1 $(git merge-base main release)",
    "# a558363 Show the success rate to one decimal place",
    "#   the merge base moved up to the fix. No later promotion can bring it",
    "#   twice, and a revert of it would travel like any other change"
  ]
},

{ act: "IX — optional: under the branch names", optional: true },

{
  title: "Read a branch straight off the disk",
  level: "intermediate",
  task: [
    "A branch name is a *ref*: a name stored under `.git` that holds one",
    "commit hash. Print the file that says which branch you are on and the",
    "file that holds `main`'s hash. Then ask git for `main`'s hash the usual",
    "way and compare the two."
  ],
  solution: [
    "cat .git/HEAD                 # ref: refs/heads/main",
    "cat .git/refs/heads/main      # forty hex characters: main's commit",
    "git rev-parse main            # the same forty",
    "ls .git/refs/heads            # main  release: one file per branch",
    "",
    "# no file there? git gc, git's clean-up command, packs refs into one file,",
    "# .git/packed-refs. A repository in the newer reftable format keeps none as",
    "# files at all. Both are normal; git rev-parse --show-ref-format names yours"
  ]
},

{
  title: "Make a branch by writing its ref",
  task: [
    "If a branch is only a ref, writing the ref should be enough to make one.",
    "Create a branch called `scratch` at your current commit with the",
    "low-level command that writes refs, not with `git branch` or",
    "`git switch`, and check that `git branch` lists it. Then delete it the",
    "same way. `git help -a` lists the low-level commands: the small ones the",
    "everyday commands are built from."
  ],
  solution: [
    "git update-ref refs/heads/scratch HEAD",
    "git branch                    # main, release, scratch",
    "cat .git/refs/heads/scratch   # the same hash as main",
    "",
    "git update-ref -d refs/heads/scratch",
    "git branch                    # main, release",
    "",
    "# update-ref asks no questions. Pointed at refs/heads/main it would move",
    "# main without a word, but git branch main refuses:",
    "# fatal: a branch named 'main' already exists"
  ]
},

{
  title: "Leave commits where no branch command looks",
  task: [
    "Some AI agents in code editors save a checkpoint after each chat turn: a",
    "commit made without moving any branch. Git eventually deletes commits that",
    "no ref leads to, so each checkpoint gets a ref in the agent's own folder,",
    "such as `refs/agents/<session>/checkpoints/turn/<n>`. Make two of your own.",
    "Write a commit with HEAD's tree (git's record of its files, as in act IV) and",
    "HEAD as its parent, and point `refs/agents/demo/checkpoints/turn/0` at it;",
    "then a second commit on top of that one, under `turn/1`. No `git commit` and",
    "no `git switch`: the low-level commands again. Then compare what `git branch`,",
    "`git status`, the `--all` graph and `git for-each-ref` each report."
  ],
  solution: [
    "C0=$(git commit-tree -p HEAD -m \"checkpoint turn 0\" \"HEAD^{tree}\")",
    "git update-ref refs/agents/demo/checkpoints/turn/0 $C0",
    "C1=$(git commit-tree -p $C0 -m \"checkpoint turn 1\" \"HEAD^{tree}\")",
    "git update-ref refs/agents/demo/checkpoints/turn/1 $C1",
    "#   commit-tree writes a commit and prints its hash, and moves nothing. C0=",
    "#   keeps that hash in a shell variable, and $C0 reads it. \"HEAD^{tree}\" names",
    "#   HEAD's tree, quoted so the shell leaves the ^ and the braces alone",
    "",
    "git branch                    # main, release: nothing new",
    "git status -sb                # ## main: nothing changed anywhere",
    "git log --oneline --graph --all -3",
    "# * d4103d8 checkpoint turn 1",
    "# * 5f7e4d2 checkpoint turn 0",
    "#   no label on either, since no branch points there. (your hashes will",
    "#   differ.)",
    "git for-each-ref --format='%(refname)'",
    "# refs/agents/demo/checkpoints/turn/0",
    "# refs/agents/demo/checkpoints/turn/1",
    "# refs/heads/main",
    "# refs/heads/release",
    "",
    "# --all starts at every ref under refs/, so the graph finds them;",
    "# git branch reads only refs/heads/. Decorations are the names git prints in",
    "# brackets beside a commit: add --clear-decorations to the log to see the",
    "# refs' names on the two commits"
  ]
},

{
  title: "Hide them from the graph, two ways",
  task: [
    "Draw the `--all` graph again without the checkpoints: once by naming the",
    "folder to leave out, once by naming only what you want to see. Then find",
    "out what happens when the exclusion comes after `--all`, and when it",
    "names the folder without a wildcard (`*`, which stands for any text)."
  ],
  solution: [
    "git log --oneline --graph --exclude='refs/agents/*' --all -3",
    "git log --oneline --graph --branches --remotes --tags HEAD -3",
    "#   neither shows the checkpoints: both start at your newest commit on a",
    "#   branch. --remotes (branches on a server) and --tags (fixed names on commits)",
    "#   match nothing yet: the lab has neither",
    "",
    "git log --oneline --graph --all --exclude='refs/agents/*' -3",
    "#   the checkpoints are back: --exclude applies only to the next --all,",
    "#   --branches, --tags or --remotes",
    "git log --oneline --graph --exclude=refs/agents --all -3",
    "#   back again: without a wildcard the pattern must match a whole ref",
    "#   name, and no ref is called refs/agents",
    "",
    "# zsh needs the quotes: it stops at an unquoted * with \"no matches found\"",
    "# (other shells pass the * through to git)"
  ]
},

{
  title: "Delete the folder, and watch the commits outlive it",
  task: [
    "Keep the hash of `turn/0` in a shell variable. Then delete every ref",
    "under `refs/agents/` in one command, without typing their names. Show",
    "that git still has the commit, then make git throw it away for good and",
    "show that it is gone."
  ],
  solution: [
    "KEEP=$(git rev-parse refs/agents/demo/checkpoints/turn/0)",
    "",
    "git for-each-ref --format='delete %(refname)' refs/agents | git update-ref --stdin",
    "#   the format prints one \"delete <ref>\" line per ref, | passes them on, and",
    "#   --stdin makes update-ref read them",
    "git for-each-ref refs/agents  # prints nothing: the refs are gone",
    "git cat-file -t $KEEP   # -t prints its kind: commit. No ref, but still stored",
    "",
    "# git gc deletes commits that no ref or reflog entry leads to, once they are two",
    "# weeks old. --prune=now skips the wait. Use it only when no other program is",
    "# writing to the repository: close any editor that has it open",
    "git gc --prune=now",
    "git cat-file -t $KEEP",
    "# fatal: git cat-file: could not get object info",
    "",
    "# no reflog entry kept them longer: they did not move HEAD, and a ref in a",
    "# program's own folder gets no reflog by default. gc packed your branch",
    "# files too: cat .git/refs/heads/main now fails, the case the first step",
    "# of this act warned about"
  ]
},

{ act: "X — optional: working with a remote", optional: true },

{
  title: "Make a \"server\" on your own machine",
  level: "basics",
  task: [
    "Everything so far has been on one machine. A *remote* is another copy of a",
    "repository that yours can send commits to and receive them from. To practise",
    "without an account anywhere, create a *bare* repository called",
    "`taskrunner-origin.git` next to your project, with `main` as its first branch.",
    "A bare repository has no working tree, so commits sent to it have no files to",
    "update."
  ],
  solution: [
    "cd ..                                  # step out of taskrunner",
    "git init --bare -b main taskrunner-origin.git",
    "# -b main again: this names the branch a future copy of this repository",
    "# starts on. Left unset, the copy you make two steps from here can end up on a",
    "# branch that does not exist on the server",
    "",
    "ls taskrunner-origin.git                # HEAD, config, objects/, refs/: no src/",
    "cd taskrunner"
  ]
},

{
  title: "Connect and make the first push",
  level: "basics",
  task: [
    "Register that bare repository under the conventional name `origin`, then",
    "*push* `main` to it (send your commits and move the branch there to match).",
    "In the same command, pair your `main` with the server's, so that later pushes",
    "need no arguments. Confirm the server received it."
  ],
  solution: [
    "git remote add origin ../taskrunner-origin.git",
    "git remote -v                  # -v shows each remote's address",
    "",
    "git push -u origin main",
    "# -u pairs your main with the server's main, which becomes its upstream. Git",
    "# calls this tracking, a different sense from tracked files.",
    "# origin/main is your own record of where the server's main stood when you last",
    "# talked to the server. Git calls that record a remote-tracking branch.",
    "# Downloading from the server, which comes shortly, updates it",
    "",
    "git ls-remote origin           # asks the server what refs it holds",
    "                               # (refs: the names it holds, such as its branches)",
    "git status -sb                 # \"## main...origin/main\""
  ]
},

{
  title: "Clone it as if you were someone else",
  level: "basics",
  task: [
    "Clone the bare repository into a second directory to stand in for a",
    "colleague. One command does the work of `init`, `remote add` and downloading",
    "the commits. A clone does not copy settings, so the identity you set in act I",
    "stayed behind. Give the clone a name and email of its own."
  ],
  solution: [
    "cd ..",
    "git clone taskrunner-origin.git colleague",
    "cd colleague",
    "",
    "git config user.name \"A Colleague\"",
    "git config user.email \"colleague@example.com\"",
    "# with no identity set, git guesses one from your username and your machine's",
    "# name, or on some machines refuses to commit",
    "",
    "git log --oneline -5           # the full history came with it",
    "git remote -v                  # origin is already set up",
    "git status -sb                 # already paired with origin/main"
  ]
},

{
  title: "Push a change from the clone",
  level: "basics",
  task: [
    "From the clone, add a line to the README and push it. The server now has a",
    "commit your original repository lacks."
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
  level: "basics",
  task: [
    "Back in `taskrunner`, download the new state *without* changing your branch.",
    "Read exactly what is about to arrive, and only then integrate it."
  ],
  solution: [
    "cd ../taskrunner",
    "",
    "git fetch                             # downloads commits, changes no local branch",
    "git status -sb                        # \"behind 1\"",
    "git log HEAD..origin/main --oneline   # A..B: the commits B has that A lacks",
    "",
    "git pull                              # a fetch, then a merge into your branch",
    "git log --oneline -2"
  ]
},

{
  title: "Push a new branch without retyping its name",
  level: "basics",
  task: [
    "Create a branch with a long name, `Component/feature/queue-metrics`, commit a",
    "line `METRICS = True` at the end of `src/runner.py` on it, and try a plain",
    "`git push`. It will refuse. Fix it in a way that does not require typing the",
    "branch name again."
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
  level: "basics",
  task: [
    "In the clone, commit to `main` and push. In `taskrunner`, commit to `main`",
    "too, without pulling first, and change a different file from the one the",
    "clone changed. Try to push. Read the rejection, then bring the clone's",
    "commit in by replaying yours on top of it, and push properly. Plain `git pull`",
    "stops and asks how; `--rebase` is the answer here."
  ],
  solution: [
    "cd ../colleague",
    "printf 'A Colleague\\n' > AUTHORS.md",
    "git add AUTHORS.md && git commit -m \"Add an authors file\"",
    "git push",
    "",
    "cd ../taskrunner",
    "git switch main",
    "printf '\\n## Status\\n\\nEarly days.\\n' >> README.md",
    "git commit -am \"Add status section\"",
    "",
    "git push",
    "# ! [rejected]  main -> main (fetch first)",
    "#   the remote has commits your copy lacks",
    "",
    "git pull --rebase              # replay your commit on top of theirs",
    "git push",
    "",
    "# different files on the two sides, on purpose: this rejection comes from",
    "# diverged history. Conflicts in file content were act IV"
  ]
},

{
  title: "Rebase a pushed branch and push it again",
  level: "basics",
  task: [
    "Return to your feature branch, rebase it onto the updated `main`, and push.",
    "The plain push will be refused because the hashes changed. A *force-push*",
    "overwrites the server's branch: use the safe form, and say why plain",
    "`--force` is a bad idea."
  ],
  solution: [
    "git switch Component/feature/queue-metrics",
    "git rebase main                # commits replayed, new hashes",
    "",
    "git push",
    "# ! [rejected] ... (non-fast-forward)",
    "#   the server's branch would lose its old commits, which a plain push refuses",
    "",
    "git push --force-with-lease",
    "# the lease check: this overwrites ONLY if the server matches your last fetch;",
    "# aborts with \"stale info\" if someone pushed meanwhile.",
    "# plain --force skips that check and can delete their work."
  ]
},

{
  title: "Follow the bad hint, and watch what it builds",
  level: "intermediate",
  task: [
    "Let the trunk move again: in the clone, pull, extend `AUTHORS.md` on `main` and",
    "push. Back in `taskrunner`, on the feature branch: fetch, rebase onto the",
    "moved trunk, and push. Read the rejection's hint closely this time: it says",
    "you are *behind* and suggests a pull. Follow the suggestion with a",
    "rebase-pull, push again, then list the commits your branch would add to",
    "`main`. One of them should not be there."
  ],
  solution: [
    "cd ../colleague",
    "git pull                       # the trunk moved in the collision step and",
    "                               # this clone did not fetch it. Catch up, or",
    "                               # the push below is rejected (fetch first)",
    "printf 'A Second Colleague\\n' >> AUTHORS.md",
    "git commit -am \"Add a second author\"",
    "git push",
    "",
    "cd ../taskrunner",
    "git fetch",
    "git rebase origin/main         # your commit replayed, new hash again",
    "",
    "git push",
    "# ! [rejected] ... (non-fast-forward)",
    "# hint: Updates were rejected because the tip of your current branch is behind",
    "# hint: its remote counterpart. If you want to integrate the remote changes,",
    "# hint: use 'git pull' before pushing again.",
    "#   \"behind\" is wrong: you rewrote. git only sees two diverged tips and",
    "#   names the common cause; it cannot know this one was deliberate",
    "",
    "git pull --rebase              # the trap, on purpose",
    "# warning: skipped previously applied commit ...",
    "#   that was YOUR rebased commit, dropped in favour of the old copy:",
    "#   the pull replays your branch onto the old remote tip, and all that",
    "#   tip lacks is the trunk's new commit",
    "",
    "git push                       # ...and this one succeeds",
    "",
    "git log --oneline origin/main..HEAD",
    "# the clone's authors commit is in the list, under a new hash, so someone",
    "# else's commit is now on your branch"
  ]
},

{
  title: "Take the stray commit back out",
  level: "intermediate",
  task: [
    "Rebase the branch onto `origin/main` once more and watch what git does with",
    "the copied commit. Confirm the branch now adds one commit, yours, then push,",
    "answering this rejection the way the last one should have been answered."
  ],
  solution: [
    "git rebase origin/main",
    "# warning: skipped previously applied commit ...",
    "#   the same check as in the last step. Rebase compares changes as well as",
    "#   hashes, and the authors change is already in origin/main, so this time the",
    "#   replay drops the copy and keeps only your own commit",
    "",
    "git log --oneline origin/main..HEAD    # one commit: yours",
    "",
    "git push",
    "# ! [rejected]: the same words as before, caused again by your own rewrite",
    "git push --force-with-lease",
    "",
    "# pull answers a rejection when the server holds someone else's new work.",
    "# After a rebase of your own, use force-with-lease, and do not pull a",
    "# branch you have just rewritten"
  ]
},

{
  title: "Watch the force-push arrive",
  level: "intermediate",
  task: [
    "In the clone, fetch, then switch to the feature branch by its name alone,",
    "with no `-c` and no `origin/` prefix. Back in `taskrunner`, reword the",
    "metrics commit and force-push the rewrite. In the clone again, fetch once",
    "more: read the one-character marker in front of the branch line, then ask",
    "`git status` where you are. You changed nothing on this side. Read what it",
    "claims anyway."
  ],
  solution: [
    "cd ../colleague",
    "git fetch                # brings your record of the feature branch up to date",
    "git switch Component/feature/queue-metrics",
    "# exactly one remote has a branch of this name, so git creates the",
    "# local copy and pairs it with the remote one in a single step",
    "",
    "cd ../taskrunner",
    "git commit --amend -m \"Add a metrics toggle\"",
    "git push --force-with-lease",
    "",
    "cd ../colleague",
    "git fetch",
    "# + 4ed890d...9c1e07f Component/… -> origin/Component/…  (forced update)",
    "#   the + marks an update that was not a fast-forward: the branch was rewritten",
    "",
    "git status",
    "# \"Your branch and 'origin/Component/feature/queue-metrics' have",
    "#  diverged, and have 1 and 1 different commits each\", though you did",
    "#  nothing here. The hint offers git pull again, and by now you know what",
    "#  that would build"
  ]
},

{
  title: "Sort your copy, then follow the rewrite",
  level: "intermediate",
  task: [
    "Before changing anything, sort the commits on your copy of the branch: which",
    "hold changes the rewritten branch already has, and which are yours",
    "alone? `git cherry`, from act VIII, answers this commit by commit. Read its",
    "answer, then bring your copy level with the server without losing work."
  ],
  solution: [
    "git cherry -v origin/Component/feature/queue-metrics",
    "# - 4ed890d… Add metrics flag",
    "#   minus: this change is already on the rewritten branch under a new hash,",
    "#   so this is an old copy, safe to drop. A plus would mean a commit of your",
    "#   own, and you would then run git rebase with that same branch name instead,",
    "#   which keeps the + commits and drops the - ones by itself",
    "",
    "git reset --hard origin/Component/feature/queue-metrics",
    "git status -sb           # level with the server again, nothing lost"
  ]
},

{
  title: "Force-push after a background fetch",
  level: "intermediate",
  task: [
    "In the clone, push one commit to `main` and one to the feature branch. Back in",
    "`taskrunner`, fetch, as some code editors do by themselves, then rebase the",
    "feature branch onto the new trunk. Use a dry run to see whether a force-push",
    "with `--force-with-lease` alone would go through. Then push with",
    "`--force-with-lease` and the option that also checks your reflog (git's",
    "private log of where your branch has pointed), read why git refuses, redo the",
    "rebase starting from the server's version of the branch, and push the same",
    "way. Finally, bring your own `main` up to date with the server's."
  ],
  solution: [
    "cd ../colleague",
    "git switch main",
    "printf '\\nIssues welcome.\\n' >> README.md",
    "git commit -am \"Invite issues\"",
    "git push",
    "git switch Component/feature/queue-metrics",
    "printf 'METRICS_EVERY = 60\\n' >> src/runner.py",
    "git commit -am \"Sample metrics every minute\"",
    "git push",
    "",
    "cd ../taskrunner",
    "git fetch                      # stands in for a code editor's own fetch",
    "git rebase origin/main         # onto the new trunk, a new hash again",
    "",
    "git push --dry-run --force-with-lease --no-force-if-includes",
    "# --dry-run reports what would happen and pushes nothing. --no-force-if-includes",
    "# switches the reflog check off, in case your config turns it on",
    "# + 6f265f6...89a09f1 Component/… -> Component/…  (forced update)",
    "#   the lease check passes: it compares the server with your record of the",
    "#   branch, and the fetch moved that record to the clone's commit. Without",
    "#   --dry-run, that commit would now be gone from the server",
    "",
    "git push --force-with-lease --force-if-includes",
    "# ! [rejected] ... (remote ref updated since checkout)",
    "#   the reflog shows the server's commit was never in your branch:",
    "#   it only arrived with the fetch. The hint suggests",
    "#   git pull again, and after your own rebase that builds the same mess",
    "#   as in \"Follow the bad hint\"",
    "",
    "git log --oneline HEAD..origin/Component/feature/queue-metrics",
    "# 6f265f6 Sample metrics every minute    the clone's commit",
    "# e581bcb Add a metrics toggle           yours, before this rebase",
    "#   the two commits the lease-only push would have deleted",
    "",
    "git reset --hard origin/Component/feature/queue-metrics",
    "git rebase origin/main         # the same rebase, now with their commit",
    "git push --force-with-lease --force-if-includes",
    "# + ... (forced update): after the reset, their commit is in your reflog",
    "",
    "git switch main",
    "git pull                       # main was two commits behind: the clone's",
    "                               # authors change and its README line"
  ]
},

{
  title: "The fetch that fails over an unrelated branch",
  level: "intermediate",
  task: [
    "Give the server a short-lived branch: in `taskrunner`, put a label named",
    "`hotfix` on `main`'s tip, without leaving the branch you are on, and push",
    "it. Fetch once in the clone, so it learns the name. Back in `taskrunner`:",
    "delete `hotfix` from the server, rename it to `hotfix/typo`, and push that.",
    "Fetch in the clone, with pruning (deleting your local records of branches",
    "the server has removed) switched off for this one command. Read the error,",
    "say which branch it trips on and why, and fix it by hand. Clean up the",
    "server before moving on."
  ],
  solution: [
    "cd ../taskrunner",
    "git branch hotfix main         # a label on main's tip; no switch needed",
    "git push -u origin hotfix",
    "",
    "cd ../colleague",
    "git fetch                      # * [new branch]  hotfix -> origin/hotfix",
    "",
    "cd ../taskrunner",
    "git push origin --delete hotfix",
    "git branch -m hotfix hotfix/typo",
    "# renamed and not recreated: git keeps branch names as paths, so hotfix and",
    "# hotfix/typo cannot both exist. One would be a file and a folder at once",
    "git push -u origin hotfix/typo",
    "",
    "cd ../colleague",
    "git -c fetch.prune=false fetch",
    "# error: some local refs could not be updated; try running",
    "#  'git remote prune origin' to remove any old, conflicting branches",
    "#  ! [new branch] hotfix/typo -> origin/hotfix/typo (unable to update local ref)",
    "# your old origin/hotfix blocks the new name, and one blocked ref fails the",
    "# whole fetch, so an unrelated branch can stop it",
    "",
    "git update-ref -d refs/remotes/origin/hotfix",
    "# update-ref -d deletes one ref by its full name",
    "git fetch                      # * [new branch]  hotfix/typo: fixed",
    "# git fetch --prune does both in one command; pruning was off above because",
    "# with it on this error does not happen. The next step makes pruning permanent",
    "",
    "cd ../taskrunner",
    "git push origin --delete hotfix/typo",
    "git branch -D hotfix/typo",
    "# this deletes the label only: the commit it points at is main's tip and",
    "# stays where it is"
  ]
},

{
  title: "Tidy up the server",
  level: "basics",
  task: [
    "Fetch in the clone first, to be sure it knows about the feature branch. Then,",
    "back in `taskrunner`, merge that branch into `main`, push `main`, and delete",
    "the branch there and on the server. Finally, make the clone drop its records",
    "of branches the server has removed."
  ],
  solution: [
    "cd ../colleague",
    "git fetch",
    "git branch -r                  # -r lists your records of the server's branches:",
    "                               # origin/Component/feature/queue-metrics is there",
    "",
    "cd ../taskrunner",
    "git switch main",
    "git merge --no-ff Component/feature/queue-metrics -m \"Merge queue metrics\"",
    "git push",
    "",
    "git branch -d Component/feature/queue-metrics",
    "git push origin --delete Component/feature/queue-metrics",
    "",
    "cd ../colleague",
    "git fetch --prune              # drop the records of branches the server removed",
    "git branch -r                  # origin/main and origin/HEAD (the clone's",
    "                               # record of the server's default), nothing else",
    "",
    "git config --global fetch.prune true   # optional: do that always, on this machine"
  ]
},

{
  title: "Cut a release the server knows about",
  level: "intermediate",
  task: [
    "Back in `taskrunner`, mark the current `main` as version 0.1.0 with a *tag*",
    "(a fixed name on one commit), in the form that records who cut it and when.",
    "Push, then check what the server holds, and read the result carefully before",
    "making the server hold the tag too. Finally add one small commit on top and",
    "ask git where you now are relative to the release."
  ],
  solution: [
    "cd ../taskrunner",
    "",
    "git tag -a v0.1.0 -m \"First working cut\"",
    "git push",
    "# \"Everything up-to-date\", but the tag did not go:",
    "git ls-remote origin           # no refs/tags/ line: push ignored the tag",
    "",
    "git push origin v0.1.0",
    "git ls-remote origin           # refs/tags/v0.1.0: now the server has it",
    "",
    "printf '\\n## Ideas\\n' >> README.md",
    "git commit -am \"Start an ideas section\"",
    "git describe                   # v0.1.0-1-g…: one commit past the release",
    "",
    "# the annotation from -a records who cut the release and why, and plain git",
    "# describe looks at annotated tags only. A lightweight v0.1.0 (only a name)",
    "# would need git describe --tags to be seen at all"
  ]
},

{
  title: "Clean up everything",
  level: "basics",
  task: [
    "The whole exercise is disposable: three directories and nothing else. Remove",
    "them."
  ],
  solution: [
    "cd ..",
    "rm -rf taskrunner colleague taskrunner-origin.git",
    "# rm -rf deletes folders and everything in them, with no undo",
    "",
    "# nothing was installed and nothing lives outside these",
    "# directories, except any --global config you chose to set:",
    "#   git config --global --edit"
  ]
}

];
