# CVMaker — Privacy-First Resume Builder

> Build a professional CV in your browser. No backend. No tracking. No data ever leaves your device.

## Features

- **Privacy-first** — all data lives in runtime memory only; page reload clears everything
- **Upload & parse** — import PDF or DOCX, auto-extract name, contact, experience, skills
- **Full editor** — Personal, Experience, Education, Skills, Certifications, Languages, Interests, Custom sections
- **Drag-and-drop** section reordering
- **3 CV templates** — Classic, Modern, Minimal
- **Live preview** with zoom controls
- **Export** — PDF and DOCX, both client-side
- **Print** — optimized CSS for direct browser printing
- **Dark / Light mode**
- **Feedback gate** — star rating before first download (console log only)
- **Mobile-friendly** — toggle between editor and preview

## Quick Start

```bash
git clone https://github.com/yourusername/cv-maker.git
cd cv-maker
npm install
npm run dev
```

## Deploy to GitHub Pages

### Automatic (GitHub Actions — recommended)

1. Push to `main` — the workflow in `.github/workflows/deploy.yml` handles the build and deploy automatically.
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Edit `deploy.yml` and change `VITE_BASE_PATH: /cv-maker` to match your actual repository name.

### Manual

```bash
VITE_BASE_PATH=/cv-maker npm run build
npm run deploy
```

Then: **Settings → Pages → Source → gh-pages branch**

## Customize Accent Color

Edit `src/styles/global.css`:
```css
:root        { --accent: #c8622a; }
[data-theme="dark"] { --accent: #e07840; }
```

## Privacy

Zero network requests beyond Google Fonts. No cookies. No analytics. No localStorage for CV data. Everything is destroyed on page reload.

## Tech Stack

React 18 · Vite · SortableJS · html2pdf.js · docx.js · pdfjs-dist · mammoth · CSS Modules

## License

MIT
