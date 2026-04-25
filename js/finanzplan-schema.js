/* ═══════════════════════════════════════════════════════════════════════
 * Finanzplan – gemeinsames Datenmodell
 * Wird sowohl vom Renten-Rechner (index.html) als auch von der
 * Finanzplan-Seite (finanzplan.html) genutzt, damit JSON-Export und
 * -Import ohne Backend kompatibel sind.
 * Single Source of Truth für Schema-Version, Defaults, Utils.
 * ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const SCHEMA_VERSION = 'finanzplan.v1';
  const STORAGE_KEY = 'satoshiRetirement.finanzplan.v1';
  const HANDOFF_KEY = 'satoshiRetirement.finanzplanHandoff.v1';

  // ── Kategorien ───────────────────────────────────────────────────────
  const INCOME_CATEGORIES = [
    { id: 'salary',      label: 'Gehalt / Lohn (netto)' },
    { id: 'self',        label: 'Selbstständigkeit / Freelance' },
    { id: 'rental',      label: 'Mieteinnahmen' },
    { id: 'capital',     label: 'Kapitalerträge / Dividenden' },
    { id: 'partner',     label: 'Partnerin / Partner Beitrag' },
    { id: 'side',        label: 'Nebeneinkünfte' },
    { id: 'other_in',    label: 'Sonstiges' },
  ];

  const EXPENSE_CATEGORIES = [
    { id: 'housing',       label: 'Miete / Hypothek',  bucket: 'fix' },
    { id: 'utilities',     label: 'Nebenkosten / Strom / Gas', bucket: 'fix' },
    { id: 'insurance',     label: 'Versicherungen',     bucket: 'fix' },
    { id: 'mobility',      label: 'Auto / Mobilität',   bucket: 'fix' },
    { id: 'subscriptions', label: 'Abos / Streaming',   bucket: 'fix' },
    { id: 'family',        label: 'Familie / Kinder / Partner', bucket: 'fix' },
    { id: 'food',          label: 'Lebensmittel',       bucket: 'var' },
    { id: 'leisure',       label: 'Freizeit / Reisen',  bucket: 'var' },
    { id: 'health',        label: 'Gesundheit',         bucket: 'var' },
    { id: 'debt',          label: 'Kredit-Raten',       bucket: 'fix' },
    { id: 'other_exp',     label: 'Sonstige Ausgaben',  bucket: 'var' },
  ];

  const ASSET_CATEGORIES = [
    { id: 'btc',         label: 'Bitcoin' },
    { id: 'cash',        label: 'Bargeld / Tagesgeld' },
    { id: 'stocks_etf',  label: 'Aktien / ETFs' },
    { id: 'real_estate', label: 'Immobilie (Eigentum)' },
    { id: 'gold',        label: 'Gold / Edelmetalle' },
    { id: 'crypto_alt',  label: 'Crypto (Nicht-Bitcoin)' },
    { id: 'other_asset', label: 'Sonstiges Vermögen' },
  ];

  const LIABILITY_CATEGORIES = [
    { id: 'mortgage',    label: 'Hypothek / Immobilienkredit' },
    { id: 'consumer',    label: 'Konsumkredit / Ratenkredit' },
    { id: 'car',         label: 'Auto-Kredit / Leasing' },
    { id: 'lombard',     label: 'Lombard / Wertpapier-Kredit' },
    { id: 'overdraft',   label: 'Dispo / Überziehung' },
    { id: 'student',     label: 'Studienkredit / BAföG' },
    { id: 'other_liab',  label: 'Sonstige Schulden' },
  ];

  // ── Defaults ─────────────────────────────────────────────────────────
  function defaultPlan() {
    return {
      schema: SCHEMA_VERSION,
      exportedAt: null,
      source: null, // 'renten-rechner' | 'finanzplan'
      profile: {
        age: null,
        targetRetirementAge: null,
        location: null,        // free text, z.B. "Berlin"
        relationshipStatus: null, // 'single' | 'partner' | 'married'
        children: 0,
      },
      stack: {
        btc: 0,
        sats: 0,
        selfCustody: null,           // null | true | false
        savingsPlanMonthlyEur: null, // DCA-Sparrate in EUR
      },
      income:      { items: [] },
      expenses:    { items: [] },
      assets:      { items: [] },
      liabilities: { items: [] },
      assumptions: {
        cagr: 0.16,            // erwartete BTC-Rendite p.a.
        withdrawalRate: 0.035, // sichere Entnahmerate
        btcPriceEur: null,     // Live-Preis (informativ)
      },
    };
  }

  // ── ID Helper ────────────────────────────────────────────────────────
  function uid(prefix) {
    return (prefix || 'i') + '_' + Math.random().toString(36).slice(2, 9);
  }

  function makeItem(kind, partial) {
    const base = {
      id: uid(kind),
      label: '',
      amount: 0,
      frequency: 'monthly', // 'monthly' | 'yearly' | 'oneoff'
      category: null,
      note: '',
    };
    if (kind === 'asset') {
      delete base.amount; delete base.frequency;
      base.value = 0;
    }
    if (kind === 'liab') {
      delete base.amount; delete base.frequency;
      base.balance = 0;
      base.monthlyPayment = 0;
      base.interestRate = 0;
    }
    return Object.assign(base, partial || {});
  }

  // ── Normalisierung beim Import (Robustheit gegen alte Versionen) ─────
  function normalize(plan) {
    if (!plan || typeof plan !== 'object') return defaultPlan();
    const d = defaultPlan();
    const out = {
      schema: SCHEMA_VERSION,
      exportedAt: plan.exportedAt || null,
      source: plan.source || null,
      profile: Object.assign({}, d.profile, plan.profile || {}),
      stack: Object.assign({}, d.stack, plan.stack || {}),
      income:      { items: Array.isArray(plan.income?.items)      ? plan.income.items      : [] },
      expenses:    { items: Array.isArray(plan.expenses?.items)    ? plan.expenses.items    : [] },
      assets:      { items: Array.isArray(plan.assets?.items)      ? plan.assets.items      : [] },
      liabilities: { items: Array.isArray(plan.liabilities?.items) ? plan.liabilities.items : [] },
      assumptions: Object.assign({}, d.assumptions, plan.assumptions || {}),
    };
    // sats <-> btc Konsistenz
    if (out.stack.btc && !out.stack.sats) out.stack.sats = Math.round(out.stack.btc * 1e8);
    if (out.stack.sats && !out.stack.btc) out.stack.btc = out.stack.sats / 1e8;
    return out;
  }

  // ── localStorage Persistenz ──────────────────────────────────────────
  function loadPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalize(JSON.parse(raw));
    } catch (e) { return null; }
  }

  function savePlan(plan) {
    try {
      const out = normalize(plan);
      out.exportedAt = new Date().toISOString();
      out.source = 'finanzplan';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
      return out;
    } catch (e) { return null; }
  }

  // ── Handoff: Daten vom Renten-Rechner an Finanzplan-Seite reichen ────
  function setHandoff(plan) {
    try {
      localStorage.setItem(HANDOFF_KEY, JSON.stringify(plan));
    } catch (e) {}
  }

  function consumeHandoff() {
    try {
      const raw = localStorage.getItem(HANDOFF_KEY);
      if (!raw) return null;
      localStorage.removeItem(HANDOFF_KEY);
      return normalize(JSON.parse(raw));
    } catch (e) { return null; }
  }

  // ── Renten-Rechner → Plan ────────────────────────────────────────────
  // Nimmt die vorhandenen Inputs aus dem Renten-Rechner und baut daraus
  // einen vollständigen Plan. Dient als Brücke zwischen den beiden Tools.
  function fromRentenRechner(input) {
    const p = defaultPlan();
    p.source = 'renten-rechner';
    p.exportedAt = new Date().toISOString();

    p.profile.age = num(input.age);
    p.profile.targetRetirementAge = num(input.retireAge);

    const btc = num(input.existingBtc) || (num(input.existingSats) / 1e8);
    p.stack.btc = btc;
    p.stack.sats = Math.round(btc * 1e8);
    p.stack.savingsPlanMonthlyEur = num(input.monthlySaving);

    p.assumptions.cagr = (num(input.cagrPct) || 16) / 100;
    p.assumptions.withdrawalRate = (num(input.withdrawalPct) || 3.5) / 100;
    p.assumptions.btcPriceEur = num(input.btcPriceEur) || null;

    // Eine konsolidierte Ausgabenposition (User kann sie später aufdröseln)
    if (num(input.monthlyExpense) > 0) {
      p.expenses.items.push(makeItem('expense', {
        label: 'Lebenshaltungskosten (gesamt, aus Renten-Rechner)',
        amount: num(input.monthlyExpense),
        frequency: 'monthly',
        category: 'other_exp',
      }));
    }
    // BTC-Sparplan fließt aus dem Cashflow ab → als Ausgabe modelliert.
    // note '__btc_dca__' lässt Sankey & Tipp-Engine die Position erkennen.
    if (num(input.monthlySaving) > 0) {
      p.expenses.items.push(makeItem('expense', {
        label: 'Bitcoin-Sparplan (DCA)',
        amount: num(input.monthlySaving),
        frequency: 'monthly',
        category: 'other_exp',
        note: '__btc_dca__',
      }));
    }

    return p;
  }

  function num(x) {
    const n = typeof x === 'number' ? x : parseFloat(String(x || '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  }

  // ── JSON Datei Export / Import ───────────────────────────────────────
  function exportToFile(plan, filename) {
    const out = normalize(plan);
    out.exportedAt = new Date().toISOString();
    if (!out.source) out.source = 'finanzplan';
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || ('satoshi-finanzplan-' + new Date().toISOString().slice(0,10) + '.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(String(reader.result || '{}'));
          resolve(normalize(obj));
        } catch (e) { reject(e); }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  // ── Public API ───────────────────────────────────────────────────────
  global.Finanzplan = {
    SCHEMA_VERSION,
    STORAGE_KEY,
    HANDOFF_KEY,
    INCOME_CATEGORIES,
    EXPENSE_CATEGORIES,
    ASSET_CATEGORIES,
    LIABILITY_CATEGORIES,
    defaultPlan,
    makeItem,
    uid,
    normalize,
    loadPlan,
    savePlan,
    setHandoff,
    consumeHandoff,
    fromRentenRechner,
    exportToFile,
    importFromFile,
  };
})(window);
