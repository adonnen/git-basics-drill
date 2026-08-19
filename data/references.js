/* =============================================================================
   references.js — the two books a card can link to, and the aliases.

   A card names a section with a short key instead of a full URL, so the same
   section can be reused by many cards and fixed in one place if it moves.

   To add a section, put a new line in the right "sections" list, then use its
   key as a card's `proGit` or `bottomUp` field. If a card names a key that is
   not here, the browser console says so on the next reload.

   ALIASES, at the foot of this file, is what makes `git lg` in a card's text
   into something you can click. Its expansions are copied from
   examples/gitconfig and `tools/check.js` fails if the two ever disagree.
   ============================================================================= */

const REFERENCES = {

  proGit: {
    base: "https://git-scm.com/book/en/v2/",
    sections: {
      "Appendix-A:-Git-in-Other-Environments-Graphical-Interfaces": "A1.1 — Graphical Interfaces",
      "Customizing-Git-Git-Configuration": "8.1 — Git Configuration",
      "Distributed-Git-Maintaining-a-Project": "5.3 — Maintaining a Project",
      "Getting-Started-First-Time-Git-Setup": "1.6 — First-Time Git Setup",
      "Git-Basics-Getting-a-Git-Repository": "2.1 — Getting a Git Repository",
      "Git-Basics-Git-Aliases": "2.7 — Git Aliases",
      "Git-Basics-Recording-Changes-to-the-Repository": "2.2 — Recording Changes (Ignoring Files)",
      "Git-Basics-Tagging": "2.6 — Tagging",
      "Git-Basics-Undoing-Things": "2.4 — Undoing Things",
      "Git-Basics-Viewing-the-Commit-History": "2.3 — Viewing the Commit History",
      "Git-Basics-Working-with-Remotes": "2.5 — Working with Remotes",
      "Git-Branching-Basic-Branching-and-Merging": "3.2 — Basic Branching and Merging",
      "Git-Branching-Branch-Management": "3.3 — Branch Management",
      "Git-Branching-Branches-in-a-Nutshell": "3.1 — Branches in a Nutshell",
      "Git-Branching-Rebasing": "3.6 — Rebasing",
      "Git-Branching-Remote-Branches": "3.5 — Remote Branches",
      "Git-Internals-Git-References": "10.3 — Git References",
      "Git-Internals-Maintenance-and-Data-Recovery": "10.7 — Maintenance and Data Recovery",
      "Git-Tools-Advanced-Merging": "7.8 — Advanced Merging",
      "Git-Tools-Credential-Storage": "7.14 — Credential Storage",
      "Git-Tools-Interactive-Staging": "7.2 — Interactive Staging",
      "Git-Tools-Rerere": "7.9 — Rerere",
      "Git-Tools-Reset-Demystified": "7.7 — Reset Demystified",
      "Git-Tools-Revision-Selection": "7.1 — Revision Selection",
      "Git-Tools-Rewriting-History": "7.6 — Rewriting History",
      "Git-Tools-Stashing-and-Cleaning": "7.3 — Stashing and Cleaning",
      "Git-Tools-Submodules": "7.11 — Submodules",
      "Git-on-the-Server-Generating-Your-SSH-Public-Key": "4.3 — Generating Your SSH Public Key",
      "Git-on-the-Server-Getting-Git-on-a-Server": "4.2 — Getting Git on a Server"
    }
  },

  bottomUp: {
    base: "https://jwiegley.github.io/git-from-the-bottom-up/",
    sections: {
      "a-commit-by-any-other-name": { title: "A commit by any other name…", path: "1-Repository/6-a-commit-by-any-other-name.html" },
      "branching-and-the-power-of-rebase": { title: "Branching and the power of rebase", path: "1-Repository/7-branching-and-the-power-of-rebase.html" },
      "directory-content-tracking": { title: "Repository: Directory content tracking", path: "1-Repository/1-directory-content-tracking.html" },
      "doing-a-hard-reset": { title: "Doing a hard reset", path: "3-Reset/4-doing-a-hard-reset.html" },
      "doing-a-mixed-reset": { title: "Doing a mixed reset", path: "3-Reset/2-doing-a-mixed-reset.html" },
      "doing-a-soft-reset": { title: "Doing a soft reset", path: "3-Reset/3-doing-a-soft-reset.html" },
      "interactive-rebasing": { title: "Interactive rebasing", path: "1-Repository/8-interactive-rebasing.html" },
      "introduction": { title: "Introduction — glossary", path: "" },
      "meet-the-middle-man": { title: "The Index: Meet the middle man", path: "2-The-Index/1-meet-the-middle-man.html" },
      "stashing-and-the-reflog": { title: "Stashing and the reflog", path: "4-Stashing-and-the-reflog.html" },
      "the-beauty-of-commits": { title: "The beauty of commits", path: "1-Repository/5-the-beauty-of-commits.html" },
      "to-reset-or-not-to-reset": { title: "To reset, or not to reset", path: "3-Reset/1-to-reset-or-not-to-reset.html" }
    }
  }

};


/* -----------------------------------------------------------------------------
   The aliases the cards mention.

   Write `git lg` in a card, between backticks, and it becomes a chip that opens
   what the alias expands to. Nothing else is needed: no field on the card, no
   second mark to remember. A name that is not listed here stays plain code, so
   `git status` is left alone.

   To add one: copy its definition out of examples/gitconfig, exactly as it
   stands there, and write a sentence saying what it buys you. The check script
   compares the two and fails on drift.
   -------------------------------------------------------------------------- */

const ALIASES = {

  lg: {
    expands: "log --all --oneline --graph --decorate",
    note: "The shape of the whole repository in one screen — every branch, every " +
          "tag, drawn as a graph. The one alias to learn first."
  },

  s: {
    expands: "status -sb",
    note: "Status without the tutorial: one line per file, plus a branch line at " +
          "the top saying how far ahead or behind you are."
  },

  fixit: {
    expands: "commit --amend --no-edit",
    note: "Folds whatever you have staged into the last commit and keeps its " +
          "message, so a forgotten file costs no “fix typo” commit."
  },

  recent: {
    expands: "branch --sort=-committerdate --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:dim)%(committerdate:relative)%(color:reset)'",
    note: "Your branches in the order you last touched them, each with how long " +
          "ago that was. Answers “what was I working on last week”."
  },

  "nuke-preview": {
    expands: "!echo '── tracked changes that would be reset ──' && git diff --stat && echo '── untracked files that would be removed ──' && git clean -nd",
    note: "Shows exactly what a full reset would destroy, and destroys nothing. " +
          "Run it before the real thing, every time."
  },

  nuke: {
    expands: "!f() { echo 'This discards ALL uncommitted changes AND untracked files.'; " +
             "printf 'Are you sure? (y/N) '; read ans; if [ \"$ans\" = 'y' ] || [ \"$ans\" = 'Y' ]; " +
             "then git reset --hard HEAD && git clean -fd && echo 'Done.'; else echo 'Aborted.'; fi }; f",
    note: "Working tree back to HEAD and untracked files gone, after asking. It " +
          "asks because neither half is recoverable — no reflog returns work that " +
          "was never committed."
  }

};
