# parsemenu.js

Refreshes the menu site from the current Vietnamese Delight UberEats listing.

## What it does

1. Fetches the UberEats page using `curl` via `child_process` (Node's built-in `https` triggers UberEats's HTTP/1.1 bot challenge; curl negotiates HTTP/2 and gets through). The URL is a constant at the top of `parsemenu.js`.
2. Parses the JSON-LD `Restaurant` block for sections, item names, prices, and descriptions.
3. Parses the React Query state blob for per-item image URLs (with a regex fallback if the structured parse fails).
4. Downloads each unique image into `public/menu/<sha1(url)>.jpeg`, skipping files that already exist.
5. Writes `src/components/items.tsx`.

## Usage

```bash
node scripts/parsemenu.js
```

That's the whole workflow. Inspect the diff afterward and commit.

## When UberEats changes the URL

If the restaurant moves or the listing slug changes, update `UBEREATS_URL` at the top of `parsemenu.js`. Also update:
- `src/app/about/page.tsx` (address + Google Maps link)
- `src/app/layout.tsx` (Order button URL)

## When the script fails

- `curl` not on PATH: install it (it ships with macOS/Linux; on Windows install via winget or use WSL).
- HTTP non-200 from UberEats: anti-bot enforcement may have escalated. Save the page manually from a browser (File → Save Page As → Complete) and adapt the script to read from the saved HTML.
- Structured image parse fails: the regex fallback handles minor schema drift inside the React Query blob. If both fail, items get empty `imageSrc` and the site renders placeholder cards — fix in a follow-up.
