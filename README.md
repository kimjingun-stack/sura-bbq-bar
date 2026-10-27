# SURA Brand Profile

One HTML master, one fact ledger, four language dictionaries. Node 22+.

```sh
npm ci
npm run check:i18n
npm run check:facts
npm run build
npm test
node tests/server.mjs
```

Open http://127.0.0.1:4173. For browser verification install Chrome or run `npx playwright install chromium` and remove the `channel: 'chrome'` option in the browser scripts if Chrome is unavailable.

## Editing

- `index.html`: English master, original section IDs, `data-ver` module membership, `{{fact.path|format}}` bindings and detail panels.
- `data/i18n.json`: EN/KO/ID/ZH strings. English HTML remains the default; the build inlines only the dictionaries needed by each output.
- `data/facts.json`: approved values, null placeholders, and inherited numerical claim provenance. Do not edit generated `data/facts.md`.
- `assets/brand/`: existing photographs/video. No base64 media.
- `assets/profile-details.js`: modal, hash links, focus trap and print expansion.
- `build/build.mjs`: static version builds, private fact sheet and public output tree.
- `data/confirm-list.md`: outstanding source and factual approvals. Missing source prose is deliberately blank.

Facts references fail on unknown paths. Missing i18n keys fail the build/check. The facts checker examines all master visible text and all translation values rather than exempting whole sections. Style values, SVG geometry and executable code are not business copy. Existing numerical claims are retained with their source keys under `legacy_numeric_claims`; they are not newly verified facts.

## Profiles

| Version | URL | Chapters |
|---|---|---|
| General | `/` | Cover, story, philosophy/functions, special, signature, guests, ratings/voices/media, store summary, expansion principle |
| Leasing | `/leasing/` | Original 16 anchor modules grouped into 14 chapters, plus leasing appendix |
| Investment | `/investors/?k=…` | Leasing + investment skeleton/data-room notices; no historical JV terms |
| Partnership | `/partners/` | Common brand chapters, selected operations, partners, shared values, reserved source checklist |
| Career | `/careers/` | Common brand chapters, operations/training, management, organization, journey, Grow with SURA |
| Executive | `/executive/` | Two image-led screens / two A4 portrait pages |
| Visual brief | `/brief/` | Six image-led chapters / six A4 landscape pages; added from the user's PDF references |
| Fact sheet | Private files only | `data/facts.json` and generated `data/facts.md`; never copied to public output |

`build/manifest.json` records exact IDs and sizes. All 16 original anchor IDs remain in the master. Reviews and recognition are grouped within ratings without changing their anchor IDs.

## Investment access

Vercel publishes **only `dist/public`**. The investment document is generated at `dist/private/investment/index.html`, kept outside public output. The server function uses the same renderer with its privately packaged master and ledgers, avoiding a dependency on generated files being present before function tracing. `/investors/` rewrites to `api/investors.mjs`; it compares the query token against server-side `INVESTOR_ACCESS_TOKEN` with a constant-time comparison. An unset token, short token, duplicate token, wrong token or unsupported method returns 404. The response is private/no-store, noindex and no-referrer. No private HTML, dictionaries or fact ledger exist in the public static tree. The function fails closed before a server token is configured. Token possession grants access; revoke/rotate through protected environment configuration when needed. This PR does not change production environment variables.

Do not configure the token through public build-time variables. Sensitive financial negotiation terms belong in a separate data room, not in any HTML profile. Source control access and deployment access remain existing project permissions.

## Verification and PDFs

```sh
npm run test:browser
SURA_OUTPUT_DIR=/absolute/output/path node tests/export-pdf.mjs
```

Browser verification covers all seven HTML profiles: EN/KO at 1440, 1024, 768, 390, 360; ID/ZH at 1440 and 390 (98 cases). It checks horizontal overflow, console/page errors, missing keys and broken images; every real detail button is activated with the keyboard and tested for Escape/focus return. Hash opening and beforeprint panel movement are checked too. Tests use an explicit local test token only. PDF exports support EN/KO visual brief and Executive; exact page counts and rendered output must be reviewed after layout edits.

A PR from `feature/profile-v2` is the review boundary. Do not push to main, merge or deploy production without the task's required authorization.
