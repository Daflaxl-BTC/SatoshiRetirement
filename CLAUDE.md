# Claude Code – Projekt-Instruktionen: SatoshiRetirement

Diese Datei wird automatisch von Claude Code bei Session-Start geladen. Sie ist im Repo committet und gilt identisch auf Mac und Windows.

---

## 🎯 Kontext

- **Projekt**: SatoshiRetirement – Statische Landing-Page (Bitcoin-Ruhestand-Rechner o.ä.)
- **Entwickler**: Solo-Dev (Felix), arbeitet parallel auf Mac und Windows
- **Sprache**: Antworte auf Deutsch, knapp und direkt, ohne lange Erklärungen
- **Stack**: Static HTML + CSS + Vendor JS, deployed auf Vercel

---

## 🟢 SESSION-START PROTOKOLL (automatisch bei jeder neuen Session)

Führe zu Beginn JEDER neuen Session diese Checks aus und melde das Ergebnis kompakt in einem Block (✅ / ⚠️ pro Punkt). Nicht einfach überspringen.

1. **OS & Branch erkennen**
   - Zeige aktuelles OS (darwin/win32), Branch und Verzeichnis.

2. **Git Sync-Status prüfen**
   - `git fetch --all --prune`
   - Prüfe: lokale uncommitted changes? Branch ahead/behind/diverged?
   - Existiert ein Stash vom anderen Gerät? → anzeigen, nicht auto-apply
   - Bei sauberem Stand + Remote neuer: `git pull --ff-only`
   - Bei Divergenz: STOP und Nutzer fragen, niemals auto-mergen

3. **Kurz-Briefing**
   - Was wurde seit meinem letzten Commit geändert?
   - Offene TODOs im Code (z.B. Impressum/Datenschutz)?

---

## 🔴 SESSION-END PROTOKOLL (wenn ich "Session beenden" / "fertig für heute" sage)

1. `git status` – uncommitted changes zeigen
2. Commit-Message nach Conventional Commits vorschlagen (feat:, fix:, chore:, docs:, refactor:)
3. Nach Bestätigung: add + commit + push
4. WIP-Kram → `git stash push -u -m "WIP <gerät> <datum>"` vorschlagen
5. Final: "Gerät X bereit – Gerät Y kann übernehmen"

---

## ⚡ GOLDEN RULES (gelten IMMER, nicht nur bei Session-Start/End)

1. **Bei Merge-Konflikten: fragen, nicht raten.**
2. **Line Endings**: `.gitattributes` mit `* text=auto eol=lf` muss existieren. Falls nicht → anlegen.
3. **Bei destruktiven Befehlen** (force push, rebase, reset --hard, Branch löschen): IMMER vorher explizit bestätigen lassen.
4. **Vercel Production**: Deploys nur von `main` nach expliziter Freigabe.
5. **Legal-Seiten** (Impressum, Datenschutz): nur mit explizitem Auftrag ändern.

---

## 📁 Projekt-spezifische Hinweise

- Reiner statischer HTML/CSS-Stack mit Vendor-JS-Libs in `vendor/`.
- Vercel Deployment via `vercel.json`. Änderungen daran immer im Preview testen.
- Bitcoin-Preis / Rechner-Logik: bei Änderungen an Berechnungen Zahlenbeispiele prüfen.

---

## 🚫 Was Claude NICHT tun soll

- Keine ungefragten Refactorings.
- Kein Hinzufügen von Build-Tools (Webpack, Vite) ohne Nachfrage.
- Keine `git push --force` ohne explizite Bestätigung.
- Keine Commits ohne meine Freigabe der Message.
- Keine Production-Deploys ohne Bestätigung.
- Keine Änderungen an Impressum/Datenschutz ohne Auftrag.

---

## 📝 Kommunikationsstil

- Deutsch, direkt, knapp.
- Status-Meldungen als kompakte Listen mit ✅ / ⚠️ / ❌.
- Lange Erklärungen nur wenn explizit gewünscht.
- Code-Vorschläge: Diff statt kompletter File, wenn möglich.
- Bei Unsicherheit: lieber fragen als raten.

---

# Notion-Archivierung (gilt für alle Claude Code Sessions)

## Regel
Nach jeder Datei, die in dieser Session erstellt oder substanziell
geändert wird (Code-Datei, PDF, DOCX, XLSX, Bild, Config, Workflow-JSON,
Diagramm, etc.) legst du automatisch eine neue Unterseite in Notion an.
Eine logische Arbeitseinheit = eine Unterseite. Bei Iterationen am
selben Artefakt innerhalb der Session: bestehende Seite updaten, nicht
neu anlegen.

## Notion-Ziel anhand des Arbeitsordners wählen
Lies das aktuelle Working Directory (pwd / cwd) und wähle das Ziel
aus dieser Mapping-Tabelle:

| Pfad enthält             | Notion-Zielseite                  |
|--------------------------|-----------------------------------|
| `clarum`                 | Clarum / Dev-Log                  |
| `quickalert`             | QuickAlert / Dev-Log              |
| `daflaxl` oder `n8n`     | Automation / Workflow-Log         |
| `displate`               | Displate / Asset-Log              |
| `garage` oder `mietrecht`| Immobilien / Garage Feldmoching   |
| (kein Match)             | siehe Fallback                    |

Resolve den Zielnamen via `notion-search`, dann nutze die Page-ID
für `notion-create-pages`.

## Fallback bei unbekanntem Ordner
Frag genau einmal am Anfang der Session:
„Working Directory `<pfad>` ist keinem Notion-Ziel zugeordnet.
Welches Notion-Ziel soll ich nutzen? (a) Allgemein / Dev-Scratch,
(b) anderes Ziel angeben, (c) für diese Session nicht archivieren"
Antwort merken bis Session-Ende.

## Inhalt jeder Unterseite
- Titel: prägnant, beschreibend (nicht der Dateiname)
- Datum + Working Directory + ggf. Git-Branch
- Erstellte/geänderte Dateien: Pfade relativ zum cwd
- Was umgesetzt wurde: 3–6 Sätze, konkret
- Technische Entscheidungen: Bibliotheken, Patterns, Trade-offs
- Offene Punkte / TODOs
- Commands zum Reproduzieren (falls relevant): kurzer Bash/PS-Block

## Iterationen
Bei mehreren Edits am selben Artefakt in einer Session:
`notion-update-page` statt neue Seite. Versionshistorie als
Bullet-Liste pflegen („v1 14:32: …, v2 15:10: …").

## Bestätigung
Nach erfolgreicher Archivierung nur eine Zeile:
`📎 Notion: <Titel> → <URL>`

## Override durch Projekt
Existiert im Working Directory eine Datei `.claude/notion-target.md`
oder steht in der lokalen `CLAUDE.md` ein Block
`notion_target: <Seitenname-oder-URL>`, hat das Vorrang vor der
Mapping-Tabelle oben.
