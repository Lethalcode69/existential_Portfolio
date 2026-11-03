# existential.design: Aman Singh portfolio

A static, no-build site. Everything needed to deploy is in this folder.

## Structure

```
/
├── index.html              the whole portfolio (one page, semantic HTML + JSON-LD)
├── 404.html                branded not-found page (noindex)
├── css/
│   ├── main.css            base, nav, hero, capabilities, selected work, case studies, footer
│   ├── sections.css        hero stage, About (tabs), resume tab, process, FAQ (loads after main.css)
│   └── error.css           404 page
├── js/
│   ├── hero-pointcloud.js  hero animation (loops continuously)
│   ├── scene.js            loader, nav, menu, hero hand-off
│   ├── about.js            About reveal + Experience / Education / Toolkit tabs
│   ├── selected-work.js    horizontal project panels + case-study dialogs
│   ├── process.js  faq.js  footer-logo.js  whatsapp.js  soundtrack.js
├── assets/
│   ├── img/                project mockups, portrait, brand mark (WebP)
│   ├── audio/soundtrack.mp3
│   └── docs/Aman_Kumar_Singh_Resume.pdf     <- the sticky "Resume" tab downloads this
├── favicon.ico  favicon.svg  favicon-16.png  favicon-32.png
├── apple-touch-icon.png  icon-192.png  icon-512.png  icon-maskable-512.png
├── og-image.jpg            1200x630 social preview
├── site.webmanifest  robots.txt  sitemap.xml
├── vercel.json             Vercel headers, caching, www -> apex redirect
├── _headers                same rules for Netlify / Cloudflare Pages
├── .htaccess               same rules for Apache / cPanel / Hostinger
└── .nojekyll               stops GitHub Pages from running Jekyll
```

## Deploy

Pick one. All of them serve the folder as-is (no build command, output directory = the folder root).

- **Vercel**: import the folder or repo, framework preset "Other". `vercel.json` is picked up automatically.
- **Netlify**: drag the folder onto app.netlify.com/drop, or connect the repo. `_headers` is picked up automatically.
- **Cloudflare Pages**: connect the repo, build command empty, output directory `/`. `_headers` is picked up automatically.
- **GitHub Pages**: push to a repo and enable Pages. `.nojekyll` is already here. Custom headers are not supported there, so the CSP and caching rules will not apply.
- **Apache / cPanel / Hostinger**: upload the folder contents to `public_html`. `.htaccess` handles HTTPS, www redirect, compression, caching and headers.

Then point the domain at the host and confirm it serves over HTTPS.

## Before you launch

1. **Domain.** Everything is set to `https://existential.design`. If the live domain differs, find and replace it in `index.html` (canonical, og:url, og:image, JSON-LD), `sitemap.xml`, `robots.txt`, `vercel.json` and `.htaccess`.
2. **Search Console.** Add the property, submit `https://existential.design/sitemap.xml`, and request indexing for the home page.
3. **Preview the share card.** Paste the URL into LinkedIn Post Inspector and the Facebook Sharing Debugger (re-scrape if you ever change `og-image.jpg`).
4. **Check structured data** with Google's Rich Results Test and validator.schema.org.
5. **Run PageSpeed Insights** on mobile and desktop for a baseline.

## Editing

- **Cache busting.** CSS and JS are cached for a year and referenced with `?v=20261103`. When you change any CSS or JS file, bump that number in `index.html` (find and replace) so visitors get the new file.
- **Resume.** Replace `assets/docs/Aman_Kumar_Singh_Resume.pdf`, keeping the file name.
- **Soundtrack.** Replace `assets/audio/soundtrack.mp3`.
- **WhatsApp number / message.** Top of `js/whatsapp.js`.
- **Icons.** `favicon*`, `icon-*`, `apple-touch-icon.png` and `og-image.jpg` were generated from the orbital brand mark. Drop in your own finals using the same file names.
- **Content Security Policy.** It allows only files from the same origin. If you add analytics, web fonts or embeds, add their hosts to the policy in `vercel.json`, `_headers` and `.htaccess`.

## SEO notes

- One `h1`, a single `main` landmark, descriptive alt text and explicit width/height on every image.
- Title 60 characters, description 153 characters, canonical, hreflang, robots directives, Open Graph and Twitter cards.
- JSON-LD: `WebSite`, `ProfilePage`, `Person`, `ImageObject` and `FAQPage` (generated from the visible FAQ text).
- The four case studies open as in-page dialogs, so search engines see their text on the home page but cannot list each one as its own result. Giving each case study its own URL (`/work/kinetic`, etc.) is the biggest remaining SEO upgrade.
