// ─────────────────────────────────────────────────────────────────────
// Dynamic Open-Graph image for Freiheits-Zeitmaschine shares.
// Renders a 1200×630 PNG with the user's personalised DCA result.
// Runs on Vercel Edge Runtime via @vercel/og — no JSX, pure JS.
// ─────────────────────────────────────────────────────────────────────
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// Tiny createElement shim so we can skip a JSX build step entirely.
function h(type, props, ...children) {
    return {
        type,
        props: { ...(props || {}), children: children.length <= 1 ? children[0] : children }
    };
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
    const multiple = invested > 0 ? value / invested : 0;
    const roiPct = invested > 0 ? ((value - invested) / invested) * 100 : 0;

    // ─── Visual tree (no JSX) ───
    const tree = h('div', {
        style: {
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(135deg, #0d1117 0%, #1c2333 100%)',
            fontFamily: '"Inter", sans-serif',
            color: '#e6edf3',
            position: 'relative',
            padding: '60px 70px',
        }
    },
        // Background glow
        h('div', { style: {
            position: 'absolute', top: '-200px', right: '-200px',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,147,26,0.25) 0%, transparent 70%)',
            display: 'flex',
        } }),
        h('div', { style: {
            position: 'absolute', bottom: '-300px', left: '-100px',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(63,185,80,0.15) 0%, transparent 70%)',
            display: 'flex',
        } }),

        // Top brand row
        h('div', { style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '40px',
        } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
                h('div', { style: {
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f7931a, #fdb94d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '30px', fontWeight: 800, color: '#fff',
                } }, '₿'),
                h('div', { style: {
                    fontSize: '26px', fontWeight: 800,
                    color: '#f7931a', display: 'flex',
                } }, 'Satoshi',
                    h('span', { style: { color: '#e6edf3', marginLeft: '6px' } }, 'Retirement')
                )
            ),
            h('div', { style: {
                fontSize: '15px', color: '#8b949e',
                textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700,
                display: 'flex',
            } }, '⏳ Freiheits-Zeitmaschine')
        ),

        // Hero readout
        h('div', { style: {
            display: 'flex', flexDirection: 'column', flex: 1,
            justifyContent: 'center',
        } },
            h('div', { style: {
                fontSize: '26px', color: '#8b949e', fontWeight: 600,
                marginBottom: '16px', display: 'flex',
            } }, `Aus ${fmtEur(invested)} wären heute geworden:`),
            h('div', { style: {
                fontSize: '140px', fontWeight: 900, lineHeight: 1,
                background: 'linear-gradient(135deg, #f7931a 0%, #fdb94d 100%)',
                backgroundClip: 'text', color: 'transparent',
                marginBottom: '14px', display: 'flex',
            } }, fmtEur(value)),
            h('div', { style: {
                fontSize: '30px', color: '#e6edf3', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
            } },
                h('span', { style: {
                    color: '#3fb950',
                    display: 'flex',
                } }, multiple >= 1 ? `${multiple.toFixed(1)}× Einsatz` : `${(multiple * 100).toFixed(0)}% Einsatz`),
                h('span', { style: { color: '#30363d', display: 'flex' } }, '·'),
                h('span', { style: { display: 'flex' } }, `₿ ${btc.toFixed(4)} Stack`),
                h('span', { style: { color: '#30363d', display: 'flex' } }, '·'),
                h('span', { style: { color: '#58a6ff', display: 'flex' } },
                    years > 0 ? `${years.toFixed(0)} Jahre DCA × ${fmtEur(amount)}/Monat` : 'DCA-Backtest')
            )
        ),

        // Bottom CTA
        h('div', { style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '40px', paddingTop: '30px',
            borderTop: '1px solid rgba(139,148,158,0.2)',
        } },
            h('div', { style: {
                fontSize: '22px', color: '#e6edf3', fontWeight: 500,
                display: 'flex',
            } }, 'Berechne deine eigene Freiheit →'),
            h('div', { style: {
                fontSize: '22px', fontWeight: 800, color: '#f7931a',
                display: 'flex',
            } }, 'satoshi-retirement.de')
        )
    );

    return new ImageResponse(tree, {
        width: 1200,
        height: 630,
        headers: {
            'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        },
    });
}
