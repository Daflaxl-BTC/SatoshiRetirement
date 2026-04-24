// ─────────────────────────────────────────────────────────────────────
// Dynamic share landing page.
// Renders minimal HTML with URL-specific OG / Twitter tags so that
// Twitter / LinkedIn / WhatsApp scrapers see the personalised preview.
// Humans get auto-redirected to the main app with deep-link params.
// ─────────────────────────────────────────────────────────────────────
export const config = { runtime: 'edge' };

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function fmtEur(n) {
    if (!isFinite(n) || n <= 0) return '€0';
    if (n >= 1_000_000) return '€' + (n / 1_000_000).toFixed(2).replace('.', ',') + ' Mio.';
    return '€' + Math.round(n).toLocaleString('de-DE');
}

function parseNum(v, fallback) {
    const n = parseFloat(v);
    return isFinite(n) ? n : fallback;
}

export default function handler(req) {
    const url = new URL(req.url);
    const q = url.searchParams;

    const value = parseNum(q.get('value'), 0);
    const invested = parseNum(q.get('invested'), 0);
    const btc = parseNum(q.get('btc'), 0);
    const years = parseNum(q.get('years'), 0);
    const amount = parseNum(q.get('amount'), 0);
    const start = q.get('start') || '';
    const multiple = invested > 0 ? value / invested : 0;

    // Build OG image URL — same params
    const ogParams = new URLSearchParams();
    ['value', 'invested', 'btc', 'years', 'amount'].forEach(k => {
        const v = q.get(k);
        if (v) ogParams.set(k, v);
    });
    const origin = url.origin;
    const ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;

    // Deep-link back to main app
    const appParams = new URLSearchParams();
    if (start) appParams.set('start', start);
    if (amount) appParams.set('amount', String(amount));
    const deepLink = `/?${appParams.toString()}#zeitmaschine`;

    // Marketing copy
    const title = `Aus ${fmtEur(invested)} wären ${fmtEur(value)} geworden`;
    const description = years > 0
        ? `Mit ${fmtEur(amount)}/Monat Bitcoin-DCA über ${years.toFixed(0)} Jahre: das ${multiple.toFixed(1)}-fache meines Einsatzes. Berechne deine Zeitmaschine.`
        : `Bitcoin-Freiheitsrechner: was DCA in der Vergangenheit wirklich gebracht hätte. Berechne deine Zeitmaschine.`;

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} · Satoshi Retirement</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#f7931a">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Satoshi Retirement">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url.toString())}">
<meta property="og:locale" content="de_DE">
<meta property="og:image" content="${esc(ogImageUrl)}">
<meta property="og:image:secure_url" content="${esc(ogImageUrl)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@satoshiretire">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImageUrl)}">
<meta name="twitter:image:alt" content="${esc(title)}">

<meta http-equiv="refresh" content="0; url=${esc(deepLink)}">
<link rel="canonical" href="${esc(origin + deepLink)}">
<style>
  body{margin:0;background:#0d1117;color:#e6edf3;font-family:-apple-system,Inter,sans-serif;
       display:flex;flex-direction:column;align-items:center;justify-content:center;
       min-height:100vh;padding:2rem;text-align:center}
  .brand{color:#f7931a;font-weight:800;font-size:1.4rem;margin-bottom:2rem}
  .brand span{color:#e6edf3}
  h1{font-weight:800;line-height:1.2;max-width:700px;margin:0 0 1rem}
  p{color:#8b949e;max-width:600px;margin:0 0 2rem}
  a{color:#f7931a;text-decoration:none;font-weight:700;
    display:inline-block;padding:0.9rem 2rem;border:2px solid #f7931a;border-radius:12px}
  a:hover{background:rgba(247,147,26,0.1)}
</style>
</head>
<body>
  <div class="brand">₿ Satoshi<span>Retirement</span></div>
  <h1>${esc(title)}</h1>
  <p>${esc(description)}</p>
  <a href="${esc(deepLink)}">Zur Zeitmaschine →</a>
  <script>setTimeout(function(){location.replace(${JSON.stringify(deepLink)});},100);</script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
