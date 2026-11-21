# existential.design — website

Static, build-free site: plain HTML, CSS and JavaScript. No framework, no bundler, no dependencies.
Everything in this folder is the site. Upload it as-is.

## Structure

```
index.html              the landing page (title, meta, Open Graph and JSON-LD structured data live in <head>)
404.html                branded "page not found" page (mascot, noindex)
css/
  main.css              base, hero, navigation, about, case studies, footer
  sections.css          lifecycle, "How we work", FAQ (loaded after main.css, order matters)
js/                     one file per feature, loaded with defer in the order listed in index.html
  lifecycle.js          3D lifecycle simulation
  main.js               hero → sections hand-off, menu, section tracking
  about.js, about-geometry.js, about-scroll.js    About overlay
  selected-work.js      horizontal project panels + case-study overlays
  faq.js, process.js, logo-reveal.js
  whatsapp.js           floating WhatsApp button (edit the number at the top of the file)
  sound.js              optional ambient soundtrack (starts only after the visitor allows it)
assets/
  img/                  mascot, project screenshots, portrait (WebP)
  audio/                ambient-soundtrack.mp3
favicon.ico · favicon.svg · favicon-16.png · favicon-32.png · apple-touch-icon.png
icon-192.png · icon-512.png · icon-maskable-512.png      PWA / home-screen icons
og-image.jpg            1200×630 social share image
site.webmanifest        web app manifest
robots.txt · sitemap.xml
.htaccess               Apache (cPanel / shared hosting)
_headers                Netlify and Cloudflare Pages
vercel.json             Vercel
.nojekyll               GitHub Pages (stops Jekyll from touching the folders)
```

## Preview locally

Serve the folder over HTTP. Opening `index.html` by double-click will not work correctly, because
the 3D scene and the root-relative icon/manifest paths need a web server.

```
python3 -m http.server 8080      # then open http://localhost:8080
# or
npx serve .
```

## Deploy

Upload the contents of this folder to the **root** of the domain.

| Host | How |
| --- | --- |
| **Vercel** | Import the repo or drag the folder in. `vercel.json` sets headers, caching and the www → apex redirect. No build command, output directory `.` |
| **Netlify** | Drag the folder into Netlify Drop, or connect the repo. `_headers` is picked up automatically. No build command, publish directory `.` |
| **Cloudflare Pages** | Connect the repo or upload. `_headers` is supported. No build command, output directory `/`. |
| **GitHub Pages** | Push to a repo and enable Pages. `.nojekyll` is included. Pages cannot send custom headers, so put Cloudflare in front if you want the security headers. Set the custom domain in the repo settings. |
| **Apache / cPanel** | Upload everything including the dotfiles (`.htaccess`, `.nojekyll`). `.htaccess` handles HTTPS, www → apex, MIME types, gzip, caching, security headers and the 404 page. Needs `mod_rewrite`, `mod_headers`, `mod_deflate`. |

`404.html` is served automatically for unknown URLs on all of the above.

## After it is live

1. Confirm the domain. Every absolute URL assumes **https://existential.design**. If the domain differs, find-and-replace it in
   `index.html`, `404.html`, `robots.txt`, `sitemap.xml` and `vercel.json`.
2. Submit `https://existential.design/sitemap.xml` in Google Search Console and Bing Webmaster Tools, then request indexing of the homepage.
3. Test the structured data at <https://search.google.com/test/rich-results> and <https://validator.schema.org>.
4. Check the share preview in the LinkedIn Post Inspector and the Facebook Sharing Debugger (they cache the first fetch).
5. Run PageSpeed Insights on mobile and desktop.

## SEO included

- Title (≤ 60 characters) and meta description (≤ 160), canonical URL, hreflang, robots directives
- Open Graph and Twitter card tags with a 1200×630 image and alt text
- JSON-LD: WebSite, WebPage, ProfessionalService (with the four disciplines), Person, FAQPage
- Crawlable FAQ text, `<noscript>` fallback content, `lang="en"`, descriptive image alt text
- `robots.txt`, `sitemap.xml` (with image entries), favicon set, web manifest, theme colour
- Performance: all media are real files (not inlined), explicit image width/height, hero image preloaded,
  below-the-fold images lazy-loaded, scripts deferred, soundtrack downloaded only when played,
  one-year immutable caching for versioned assets, compression on Apache
- Security headers: CSP (scripts must be external files, no inline JS), HSTS, nosniff, frame-ancestors, referrer and permissions policies

## Editing

- **Versioned assets.** CSS, JS and image URLs in `index.html` end in `?v=…`. After you change a file, change its
  `?v=` value (any new string) so visitors get the new version instead of a cached copy.
- **FAQ.** The six questions appear twice: in the page markup and in the FAQPage JSON-LD in `<head>`. Keep them identical.
- **Inline scripts.** The CSP blocks inline `<script>` blocks. Put new JavaScript in a file under `js/`.
- **Sitemap.** Update `<lastmod>` in `sitemap.xml` when the page content changes.
- **WhatsApp.** Number and pre-filled message are at the top of `js/whatsapp.js`.

## Sizes

index.html 81 KB · css 146 KB + 14 KB · soundtrack 1043 KB (loads on demand)
