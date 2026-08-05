/* =============================================================================
   references.js — the two books a card can link to.

   A card names a section with a short key instead of a full URL, so the same
   section can be reused by many cards and fixed in one place if it moves.

   To add a section, put a new line in the right "sections" list, then use its
   key as a card's `proGit` or `bottomUp` field. If a card names a key that is
   not here, the browser console says so on the next reload.
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
