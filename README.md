# Book AI Summarizer

Drop a PDF into `books/`, ask Claude to summarize it, and get beautiful chapter-by-chapter HTML summaries saved to `outputs/`. No scripts, no API keys — just Claude Code.

---

## Setup

Nothing to install. Just set up the folder structure (already done) and open Claude Code in this directory.

---

## How to Use

### Step 1 — Drop your book in
Copy any `.pdf` or `.docx` file into the `books/` folder.

### Step 2 — Ask Claude to summarize it
In Claude Code, just say:

```
Summarize hooked.pdf — first 4 chapters
Summarize atomic-habits.pdf — all chapters
Summarize thinking-fast-and-slow.pdf — chapters 1-3
```

Claude reads the PDF directly. No extraction step needed.

### Step 3 — Open your summaries
Navigate to `outputs/index.html` in your browser — that's your personal book library. Every book and chapter is linked from there.

---

## Output Structure

```
outputs/
├── index.html                  ← Master library (all books)
└── hooked/
    ├── index.html              ← Book index (all chapters)
    ├── ch01-the-habit-zone.html
    ├── ch02-trigger.html
    ├── ch03-action.html
    ├── ch04-variable-reward.html
    └── meta-summary.html
```

Each chapter page includes:
- **The Big Idea** — plain-English summary in 2-3 sentences
- **Key Concepts** — with analogies, real examples, and 💡 memory devices (acronyms, rhymes, vivid images)
- **Stories & Case Studies** — preserved as narrative, not bullets
- **Visual Breakdown** — diagrams recreated in HTML/CSS
- **Chapter Takeaways** — specific, actionable checklist
- **Apply This Week** — 1-2 things to do in the next 7 days

---

## Tips

- **Large books** — ask chapter by chapter if the book is very long (e.g. `chapters 1-5`, then `chapters 6-10`)
- **Diagrams** — if a page has an important diagram, screenshot it and share it with Claude so it can recreate it accurately
- **Index is auto-updated** — every time Claude adds a chapter, it updates `outputs/index.html` and the book's `index.html` automatically
- **Offline reading** — all HTML files are fully self-contained, no internet needed to open them
