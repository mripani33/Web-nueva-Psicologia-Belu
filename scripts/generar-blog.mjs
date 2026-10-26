// =====================================================================
// Generador del blog estático — mariabelenprieto.com
//
// Lee los artículos de Firestore (colección "blog") y genera:
//   - blog/<slug>.html   → una página real por cada artículo publicado
//   - blog.html          → listado de artículos (con filtros por categoría)
//   - index.html         → los 3 artículos de la home (bloque entre marcadores)
//   - sitemap.xml        → páginas fijas + artículos
//
// Solo se publican los artículos con "Publicado" marcado en el admin.
// Lo ejecuta GitHub Actions (.github/workflows/publicar-blog.yml).
//
// Prueba local sin Firestore:  BLOG_MOCK=ruta/a/posts.json node scripts/generar-blog.mjs
// =====================================================================

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://mariabelenprieto.com';
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'maria-belen-prieto-web';
const API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyAXO7GpF5cMkVBF_9QV8w7S-4MKzKD2rEI';
const BLOG_DIR = path.join(ROOT, 'blog');
const SLUGS_FILE = path.join(BLOG_DIR, '_slugs.json');

// Páginas fijas para el sitemap (las que no son artículos)
const STATIC_PAGES = [
  { loc: '/', lastmod: '2026-10-24' },
  { loc: '/blog.html', lastmod: null }, // se usa la fecha del último artículo
  // recursos.html: fuera del sitemap hasta publicar el primer recurso
  { loc: '/aviso-legal.html', lastmod: '2026-10-24' },
  { loc: '/politica-privacidad.html', lastmod: '2026-10-24' },
  { loc: '/politica-cookies.html', lastmod: '2026-10-24' },
];

// ---------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const stripHtml = (html) => String(html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : cut.length).replace(/[.,;:]$/, '') + '…';
}

function slugify(title) {
  const base = String(title || 'articulo')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= 70) return base || 'articulo';
  return base.slice(0, 70).replace(/-[^-]*$/, '');
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function isoDate(value) {
  const m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function fechaLarga(value) {
  const iso = isoDate(value);
  if (!iso) return '';
  const [y, mo, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[mo - 1]} de ${y}`;
}

// Pexels sirve la foto al tamaño pedido: para la portada del artículo pedimos 1600px
function imagenGrande(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('pexels.com')) {
      u.searchParams.set('auto', 'compress');
      u.searchParams.set('cs', 'tinysrgb');
      u.searchParams.set('w', '1600');
      return u.toString();
    }
  } catch (e) { /* URL rara: se usa tal cual */ }
  return url;
}

// JSON seguro dentro de <script>
const jsonForScript = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

function writeIfChanged(file, content) {
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (prev === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

// ---------------------------------------------------------------------
// Lectura de Firestore (API REST, solo lectura pública)
// ---------------------------------------------------------------------
function decodeValue(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in v) return decodeFields(v.mapValue.fields || {});
  return null;
}
const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));

async function fetchPosts() {
  if (process.env.BLOG_MOCK) {
    return JSON.parse(fs.readFileSync(process.env.BLOG_MOCK, 'utf8'));
  }
  const posts = [];
  let pageToken = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blog`
      + `?pageSize=300&key=${API_KEY}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const res = await fetch(url, { headers: { Referer: `${SITE}/` } });
    if (!res.ok) {
      throw new Error(`Firestore respondió ${res.status}: ${(await res.text()).slice(0, 500)}`);
    }
    const data = await res.json();
    for (const doc of data.documents || []) {
      posts.push({ id: doc.name.split('/').pop(), ...decodeFields(doc.fields || {}) });
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return posts;
}

// Preguntas frecuentes: siteData/main → campo "faq" (se edita en la pestaña FAQ del admin)
async function fetchFaq() {
  if (process.env.FAQ_MOCK) return JSON.parse(fs.readFileSync(process.env.FAQ_MOCK, 'utf8'));
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/siteData/main?key=${API_KEY}`;
  const res = await fetch(url, { headers: { Referer: `${SITE}/` } });
  if (!res.ok) throw new Error(`Firestore (FAQ) respondió ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const doc = await res.json();
  const faq = decodeFields(doc.fields || {}).faq;
  return Array.isArray(faq) ? faq.filter((x) => x && x.question && x.answer) : [];
}

function faqBlock(items) {
  if (!items.length) return '<p class="faq-v2-empty">Próximamente.</p>';
  return items.map((item) => {
    const parrafos = String(item.answer).split(/\n+/).map((t) => t.trim()).filter(Boolean)
      .map((t) => `<p>${esc(t)}</p>`).join('');
    return `<details class="faq-v2-item">
                    <summary><h3>${esc(String(item.question).trim())}</h3><span class="faq-v2-icon" aria-hidden="true"></span></summary>
                    <div class="faq-v2-answer">${parrafos}</div>
                </details>`;
  }).join('\n                ');
}

// ---------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap" rel="stylesheet">`;

const ICONS = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="theme-color" content="#2D4356">`;

const NAVBAR = `<nav class="navbar">
        <a href="/" class="navbar-logo">María Belén Prieto</a>
        <a href="/blog.html" class="navbar-back">Todos los artículos</a>
    </nav>`;

const FOOTER = `<footer class="site-footer">
        <p>&copy; <span class="js-year">2026</span> María Belén Prieto · Psicóloga General Sanitaria · Nº colegiada CL06437</p>
        <p style="margin-top:0.6rem;">
            <a href="/">Inicio</a><a href="/blog.html">Blog</a><a href="/aviso-legal.html">Aviso legal</a><a href="/politica-privacidad.html">Privacidad</a><a href="/politica-cookies.html">Cookies</a>
        </p>
    </footer>
    <script>document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });</script>`;

function cardHtml(post, headingTag = 'h2') {
  const fecha = fechaLarga(post.date);
  const img = post.image ? ` style="background-image:url('${esc(post.image)}')"` : '';
  return `<a class="blog-card" href="/blog/${post.slug}.html" data-category="${esc(post.category || '')}">
                    <div class="blog-card-image"${img} role="img" aria-label="${esc(post.title)}">
                        ${post.category ? `<span class="blog-card-category">${esc(post.category)}</span>` : ''}
                    </div>
                    <div class="blog-card-content">
                        ${fecha ? `<div class="blog-card-meta">📅 ${fecha}</div>` : ''}
                        <${headingTag} class="blog-card-title">${esc(post.title)}</${headingTag}>
                        <p class="blog-card-excerpt">${esc(post.excerpt || '')}</p>
                        <span class="blog-card-link">Leer más →</span>
                    </div>
                </a>`;
}

function postPage(post, related) {
  const url = `${SITE}/blog/${post.slug}.html`;
  const title = `${post.title} | María Belén Prieto, Psicóloga`;
  const desc = truncate(post.excerpt ? String(post.excerpt).trim() : stripHtml(post.content), 158);
  const image = imagenGrande(post.image) || `${SITE}/og-image.jpg`;
  const published = isoDate(post.date) || isoDate(post.createdAt);
  const modified = isoDate(post.updatedAt) || published;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#articulo`,
        headline: post.title,
        description: desc,
        image: [image],
        datePublished: published,
        dateModified: modified,
        inLanguage: 'es-ES',
        articleSection: post.category || undefined,
        mainEntityOfPage: url,
        author: { '@type': 'Person', '@id': `${SITE}/#persona`, name: 'María Belén Prieto', url: `${SITE}/`, jobTitle: 'Psicóloga General Sanitaria' },
        publisher: { '@id': `${SITE}/#consulta` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog.html` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  const relatedHtml = related.length ? `
    <section class="post-related" aria-labelledby="relacionados">
        <h2 id="relacionados">Otros artículos</h2>
        <div class="blog-articles-grid">
                ${related.map((p) => cardHtml(p, 'h3')).join('\n                ')}
        </div>
    </section>` : '';

  return `<!DOCTYPE html>
<!-- Página generada automáticamente desde el admin. No editar a mano: los cambios se pierden. -->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${url}">
    ${ICONS}
    <meta property="og:type" content="article">
    <meta property="og:locale" content="es_ES">
    <meta property="og:site_name" content="María Belén Prieto · Psicóloga">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(post.title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${esc(image)}">
    ${published ? `<meta property="article:published_time" content="${published}">` : ''}
    ${modified ? `<meta property="article:modified_time" content="${modified}">` : ''}
    ${post.category ? `<meta property="article:section" content="${esc(post.category)}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(post.title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${esc(image)}">
    ${FONTS}
    <link rel="stylesheet" href="/blog.css">
    <script type="application/ld+json">
${jsonForScript(ld)}
    </script>
</head>
<body>
    ${NAVBAR}

    <main>
        <article>
            ${post.image ? `<img class="post-hero-img" src="${esc(imagenGrande(post.image))}" alt="${esc(post.title)}" width="1600" height="900" fetchpriority="high">` : ''}
            <div class="post-container">
                <nav class="post-breadcrumb" aria-label="Ruta de navegación">
                    <a href="/">Inicio</a> › <a href="/blog.html">Blog</a>${post.category ? ` › ${esc(post.category)}` : ''}
                </nav>
                ${post.category ? `<span class="post-category-badge">${esc(post.category)}</span>` : ''}
                <h1 class="post-title">${esc(post.title)}</h1>
                <div class="post-meta">
                    <div class="post-author">
                        <div class="post-author-avatar" aria-hidden="true">MB</div>
                        <span>María Belén Prieto · Psicóloga General Sanitaria</span>
                    </div>
                    ${published ? `<time datetime="${published}">${fechaLarga(published)}</time>` : ''}
                </div>
                <div class="post-content">
${post.content || '<p>Contenido próximamente.</p>'}
                </div>
                <aside class="post-cta">
                    <h2>¿Quieres dar el primer paso?</h2>
                    <p>Si este artículo te ha resonado, quizás es el momento de iniciar tu proceso terapéutico. Sesiones online y presenciales en Valladolid bajo consulta.</p>
                    <a href="/#contacto" class="post-cta-btn">Reservar una consulta</a>
                </aside>
            </div>
        </article>
${relatedHtml}
    </main>

    ${FOOTER}
</body>
</html>
`;
}

function blogListPage(posts) {
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const desc = 'Artículos sobre ansiedad, autocuidado, terapia y bienestar emocional escritos por María Belén Prieto, Psicóloga General Sanitaria.';
  const title = 'Blog de Psicología y Bienestar Emocional | María Belén Prieto';
  const redirects = Object.fromEntries(posts.map((p) => [p.id, p.slug]));
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog.html#blog`,
    url: `${SITE}/blog.html`,
    name: 'Blog de María Belén Prieto',
    description: desc,
    inLanguage: 'es-ES',
    author: { '@id': `${SITE}/#persona` },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}/blog/${p.slug}.html`, datePublished: isoDate(p.date) || undefined })),
  };

  return `<!DOCTYPE html>
<!-- Página generada automáticamente desde el admin. No editar a mano: los cambios se pierden. -->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${SITE}/blog.html">
    ${ICONS}
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_ES">
    <meta property="og:site_name" content="María Belén Prieto · Psicóloga">
    <meta property="og:url" content="${SITE}/blog.html">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${SITE}/og-image.jpg">
    ${FONTS}
    <link rel="stylesheet" href="/blog.css">
    <script type="application/ld+json">
${jsonForScript(ld)}
    </script>
    <script>
        // Enlaces antiguos (blog.html?post=ID) → nueva URL del artículo
        (function () {
            var mapa = ${JSON.stringify(redirects)};
            var id = new URLSearchParams(window.location.search).get('post');
            if (id && mapa[id]) window.location.replace('/blog/' + mapa[id] + '.html');
        })();
    </script>
</head>
<body>
    <nav class="navbar">
        <a href="/" class="navbar-logo">María Belén Prieto</a>
        <a href="/" class="navbar-back">← Volver al inicio</a>
    </nav>

    <main>
        <header class="blog-hero">
            <span class="blog-hero-tag">Blog</span>
            <h1>Artículos de psicología y bienestar emocional</h1>
            <p>Reflexiones, recursos y herramientas para acompañarte en tu camino hacia el bienestar emocional.</p>
        </header>

        ${categories.length > 1 ? `<div class="blog-filters" role="group" aria-label="Filtrar por categoría">
            <button type="button" class="filter-btn active" data-filter="todos">Todos</button>
            ${categories.map((c) => `<button type="button" class="filter-btn" data-filter="${esc(c)}">${esc(c)}</button>`).join('\n            ')}
        </div>` : ''}

        <div class="blog-container">
            <p class="blog-count" id="blog-count">${posts.length} artículo${posts.length === 1 ? '' : 's'}</p>
            <div class="blog-articles-grid" id="blog-articles-grid">
                ${posts.length ? posts.map((p) => cardHtml(p)).join('\n                ') : '<div class="blog-loading">Próximamente nuevos artículos.</div>'}
            </div>
        </div>
    </main>

    ${FOOTER}

    <script>
        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filtro = btn.getAttribute('data-filter');
                document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
                var visibles = 0;
                document.querySelectorAll('#blog-articles-grid .blog-card').forEach(function (card) {
                    var mostrar = filtro === 'todos' || card.getAttribute('data-category') === filtro;
                    card.hidden = !mostrar;
                    if (mostrar) visibles++;
                });
                document.getElementById('blog-count').textContent = visibles + ' artículo' + (visibles === 1 ? '' : 's');
            });
        });
    </script>
</body>
</html>
`;
}

function homeBlock(posts) {
  const destacados = posts.filter((p) => p.featured);
  const resto = posts.filter((p) => !p.featured);
  const elegidos = [...destacados, ...resto].slice(0, 3);
  if (!elegidos.length) {
    return '<p class="blog-v2-empty">Próximamente nuevos artículos.</p>';
  }
  return elegidos.map((p) => {
    const fecha = fechaLarga(p.date);
    const iso = isoDate(p.date);
    return `<a class="blog-v2-card" href="/blog/${p.slug}.html">
                <div class="blog-v2-media">
                    ${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" width="800" height="500">` : ''}
                    ${p.category ? `<span class="blog-v2-cat">${esc(p.category)}</span>` : ''}
                </div>
                <div class="blog-v2-body">
                    ${fecha ? `<time class="blog-v2-date" datetime="${iso}">${fecha}</time>` : ''}
                    <h3>${esc(p.title)}</h3>
                    <p>${esc(p.excerpt || '')}</p>
                    <span class="blog-v2-more">Leer artículo <span aria-hidden="true">→</span></span>
                </div>
            </a>`;
  }).join('\n            ');
}

function sitemap(posts) {
  const latest = posts.map((p) => isoDate(p.updatedAt) || isoDate(p.date)).filter(Boolean).sort().pop() || '2026-10-24';
  const entries = [
    ...STATIC_PAGES.map((p) => ({ loc: `${SITE}${p.loc}`, lastmod: p.lastmod || latest })),
    ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}.html`, lastmod: isoDate(p.updatedAt) || isoDate(p.date) })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `
    <lastmod>${e.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`;
}

// ---------------------------------------------------------------------
// Principal
// ---------------------------------------------------------------------
async function main() {
  const all = await fetchPosts();
  console.log(`Artículos en Firestore: ${all.length}`);

  // URLs estables: el slug se fija la primera vez y no cambia aunque se edite el título
  const slugs = fs.existsSync(SLUGS_FILE) ? JSON.parse(fs.readFileSync(SLUGS_FILE, 'utf8')) : {};
  const usados = new Set(Object.values(slugs));
  const ordenAlta = [...all].sort((a, b) => String(a.createdAt || a.date || '').localeCompare(String(b.createdAt || b.date || '')));
  for (const post of ordenAlta) {
    // Los borradores no reciben URL (el archivo de slugs es público)
    if (slugs[post.id] || post.published === false) continue;
    let base = slugify(post.title);
    let slug = base;
    for (let n = 2; usados.has(slug); n++) slug = `${base}-${n}`;
    slugs[post.id] = slug;
    usados.add(slug);
  }

  // Quita comillas sobrantes que envuelven el texto (pasa al pegar desde otro sitio)
  const sinComillas = (t) => (typeof t === 'string' ? t.trim().replace(/^["“”«»]+\s*/, '').replace(/\s*["“”«»]+$/, '').trim() : t);

  // La página ya tiene su H1 (el título): cualquier H1 dentro del contenido pasa a H2
  const sinH1 = (t) => (typeof t === 'string' ? t.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>') : t);

  const publicados = all
    .filter((p) => p.published !== false && p.title && p.content)
    .map((p) => ({ ...p, title: sinComillas(p.title), excerpt: sinComillas(p.excerpt), content: sinH1(sinComillas(p.content)), slug: slugs[p.id] }))
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || a.title.localeCompare(b.title, 'es'));
  console.log(`Publicados: ${publicados.length} · Borradores u ocultos: ${all.length - publicados.length}`);

  const cambios = [];
  const touch = (file, content) => { if (writeIfChanged(file, content)) cambios.push(path.relative(ROOT, file)); };

  // Una página por artículo
  for (const post of publicados) {
    const mismaCategoria = publicados.filter((p) => p.id !== post.id && post.category && p.category === post.category);
    const otros = publicados.filter((p) => p.id !== post.id && !mismaCategoria.includes(p));
    touch(path.join(BLOG_DIR, `${post.slug}.html`), postPage(post, [...mismaCategoria, ...otros].slice(0, 3)));
  }

  // Borrar páginas de artículos despublicados o eliminados
  const vigentes = new Set(publicados.map((p) => `${p.slug}.html`));
  if (fs.existsSync(BLOG_DIR)) {
    for (const f of fs.readdirSync(BLOG_DIR)) {
      if (f.endsWith('.html') && !vigentes.has(f)) {
        fs.unlinkSync(path.join(BLOG_DIR, f));
        cambios.push(`blog/${f} (eliminado)`);
      }
    }
  }

  touch(SLUGS_FILE, JSON.stringify(slugs, null, 2) + '\n');
  touch(path.join(ROOT, 'blog.html'), blogListPage(publicados));
  touch(path.join(ROOT, 'sitemap.xml'), sitemap(publicados));

  // Bloque de la home
  const indexFile = path.join(ROOT, 'index.html');
  const index = fs.readFileSync(indexFile, 'utf8');
  const re = /(<!-- BLOG-HOME:START -->)[\s\S]*?(<!-- BLOG-HOME:END -->)/;
  if (!re.test(index)) throw new Error('No se encontraron los marcadores BLOG-HOME en index.html');
  let nuevoIndex = index.replace(re, `$1\n            ${homeBlock(publicados)}\n            $2`);

  // Preguntas frecuentes de la home
  const reFaq = /(<!-- FAQ:START -->)[\s\S]*?(<!-- FAQ:END -->)/;
  if (!reFaq.test(nuevoIndex)) throw new Error('No se encontraron los marcadores FAQ en index.html');
  const faq = await fetchFaq();
  console.log(`Preguntas frecuentes: ${faq.length}`);
  nuevoIndex = nuevoIndex.replace(reFaq, `$1\n                ${faqBlock(faq)}\n                $2`);
  touch(indexFile, nuevoIndex);

  console.log(cambios.length ? `Archivos actualizados:\n  - ${cambios.join('\n  - ')}` : 'Sin cambios.');
}

main().catch((err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
