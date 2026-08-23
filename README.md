# KD_Portfolio

Personal portfolio of **Krishna Deshpande** — a terminal / vim-themed static site built with vanilla HTML, CSS and JavaScript. No frameworks, no build step: edit the files, push, done.

**Live site:** hosted on GitHub Pages with a custom domain.

---

## Pending uploads (post-22 Aug update)

The site works as-is, but a few links point at files that still need to be added:

| What | Where it goes |
|---|---|
| `resume.pdf` | Repo root — both Resume buttons already point at it |
| `certs/best-capstone-award.jpg` | Certificate image for the Best Capstone Project Award card |
| `certs/google-cloud-foundations.jpg` | Certificate image for the Google Cloud Foundations card |
| Go rewrite of Handwriting-Recognition | Push the repo, then swap the card's `href` (it temporarily points at the GitHub repositories list — see the `TODO(Krishna)` comment in `index.html`) |
| Next AWS certification | After the exam (Sep 2026): fill in the exact cert name and turn the dashed "in progress" card into a real linked card — see "Certifications" below |

If your certificate files have different names or formats, either rename the files or edit the `href`s in `index.html` to match — they just have to agree.

---

## Files

| File | What it does |
|---|---|
| `index.html` | All page content — experience, projects, certifications, skills, links |
| `style.css` | All styling, including both the dark and light themes |
| `script.js` | Theme toggle, typewriter effect, matrix mouse trail, mobile menu |
| `certs/` | Certificate images that the certification cards link to |
| `README.md` | This guide |

---

## Features

- **Dark / light theme** — the `:set bg=light` button in the navbar switches themes, vim-style. The choice is remembered between visits and the first visit follows the visitor's system preference.
- **Typewriter hero** — the two `//` tagline lines type themselves out on load.
- **Matrix mouse trail** — moving the mouse leaves a faint trail of falling glyphs. Visitors can switch it off with the `fx=on` toggle in the gold vim bar. It automatically stays off on touch devices and for visitors who prefer reduced motion.
- **Responsive** — works down to small phones; nav collapses into a hamburger menu.

---

## How to edit content

Everything lives in `index.html`. Search for the section you want:

### Name, subtitle, taglines (hero)

```html
<h1 class="hero-name">[Krishna Deshpande]</h1>
<p class="hero-subtitle">DEVOPS &amp; AWS</p>
```

The typed tagline text is set in `data-type-text` attributes — edit those, not the (empty) tag contents:

```html
<p class="comment" data-type-text="// Programmer Analyst @ Cognizant"></p>
```

The `import DevOps` / `import AWS` lines above the name live in the `.hero-import` paragraph.

### Resume link

The resume button appears in **two places** — the navbar and the mobile menu. Keep them in sync.

Both currently point at `resume.pdf`, so uploading your resume to this repository as `resume.pdf` is all it takes:

```html
<a class="btn-resume" href="resume.pdf" target="_blank" rel="noopener">Resume</a>
```

A Google Drive share link works too — just swap the `href` in both places.

### Experience

Each job is one `.exp-card`. The Cognizant card shows how to stack roles in one company — it currently stacks three (Programmer Analyst → Programmer Analyst Trainee → Intern). Every role after the first uses `class="exp-role exp-role-second"` to get the dashed divider, so add or remove role blocks freely.

To add a new job, copy an entire `<div class="exp-card"> … </div>` block and edit it. `exp-card full` makes a card span the full row.

> When you change dates or titles here, update the CV to match — the two should never disagree.

### Projects ("Architecture Archives")

Each project is one `.arch-card`. To add a project, copy this template inside `<div class="arch-grid">`:

```html
<div class="arch-card">
    <p class="arch-name">Project-Name</p>
    <p class="arch-desc">One or two sentences about what it does and how.</p>
    <div class="exp-tags">
        <span class="tag green">Tech1</span>
        <span class="tag green">Tech2</span>
    </div>
    <div class="arch-footer">
        <a href="https://github.com/you/repo" target="_blank" rel="noopener" class="arch-cmd">
            <span class="prompt">$ </span>cat src/&nbsp;↗
        </a>
    </div>
</div>
```

The dashed **devops-lab** card is a placeholder — when your first DevOps project is ready, replace that card with a real one using the template above. The **Handwriting-Recognition** card describes the Go rewrite; its link needs to be pointed at the new repo (marked with a `TODO(Krishna)` comment).

### Certifications

Every certification card is a link, so visitors always land on proof:

- **External badges** (Credly etc.) link directly — nothing to host.
- **Image-based proofs** live in this repo's `certs/` folder. Upload each certificate image with the exact filename used in the card's `href`, or edit the `href` to match your file.

The dashed **AWS Certification // in progress** card is a placeholder for the exam scheduled in Sep 2026. Once passed: fill in the exact certification name, swap the `<div>` for an `<a class="cert-card" href="…">` pointing at the badge, and remove the `cert-card-pending` class.

### Skills

Plain `<span class="skill-tag">` lists under the **Operational Matrix** heading (which now sits above Certifications), grouped under labels. Add or remove spans freely.

### Contact links

GitHub / LinkedIn / email URLs are set on the `.social-item` anchors near the bottom of `index.html`. The email is a `mailto:` link.

---

## How to change the look

All colors live at the **top of `style.css`** in two blocks:

- `:root, [data-theme="dark"]` — the dark terminal theme
- `[data-theme="light"]` — the cream "vim light" theme

Change a variable once and it applies everywhere. The most useful ones:

| Variable | Controls |
|---|---|
| `--gold` | Accent color (headings, buttons, cursor) |
| `--bg-primary` / `--bg-card` | Page and card backgrounds |
| `--text-primary` / `--text-muted` / `--text-dim` | Text shades |
| `--content-width` | Max width of the page content (default 1100px) |

Font sizes are set per-component in `style.css` — search the class name (e.g. `.arch-desc`) and adjust.

### Tuning or removing the mouse trail

In `script.js`, section 3:

- `MAX_PARTICLES` — how many glyphs can exist at once (default 90)
- `SPAWN_DISTANCE` — mouse travel in px between glyphs (higher = sparser)
- `GLYPHS` — the character set used
- The `0.55` in the `alpha` line — maximum glyph opacity

To remove the effect entirely: delete section 3 in `script.js`, the `<canvas id="fx-canvas">` line in `index.html`, and the `#fx-canvas` rule in `style.css`.

---

## Publishing changes (GitHub Pages)

The site redeploys automatically on every push to `main`.

**Editing in the browser:** open the file on github.com → pencil icon → make changes → **Commit changes**. Live in about a minute.

**Editing locally:**

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
# edit files, preview by opening index.html in a browser
git add .
git commit -m "Update projects"
git push
```

> **Important:** the repository contains a `CNAME` file holding the custom domain. **Never delete it** — removing it disconnects the domain from the site.

---

## License

Personal site — feel free to borrow the structure, but replace all personal content.
