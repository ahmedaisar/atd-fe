# Hotel Data Fetch Workflow

This project fetches hotel MAP data server-side and stores it locally. **Never fetch the dynamic worker endpoint from client-side code.**

## Files
- `scripts/data/fetch-remote-hotels.ts`: Node-only script performing the HTTPS request and writing JSON outputs.
- `types/hotel.ts`: Type definitions and index builder.
- `data/generated/`: Output directory (configurable via `OUTPUT_DIR`).
  - `hotels-raw.json`: Raw hotel array.
  - `hotels-index.json`: Lightweight searchable index.
  - `hotels-bundle.json`: Combined object with meta + raw + index.

## Environment Variables
Define in `.env.local` (see `.env.local.example`):
```
DYNAMIC_WORKER_URL=https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker
CHECKIN_DATE=2025-11-11
CHECKOUT_DATE=2025-11-12
OUTPUT_DIR=data/generated
```
Override dates at runtime if needed:
```
CHECKIN_DATE=2025-12-01 CHECKOUT_DATE=2025-12-05 pnpm data:fetch-hotels
```

## Running
```
pnpm data:fetch-hotels
```
Outputs three JSON files with a timestamped meta block.

## Safety / Constraints
- Do not import `fetch-remote-hotels.ts` in any client component.
- The script uses `https` directly (no fetch polyfill) to avoid bundler assumptions.
- Heuristic parsing locates a hotels array; adjust logic once the upstream schema is fixed.

## Next Steps (Optional)
- Add hashing / ETag caching to skip writing unchanged data.
- Integrate basic validation with Zod once schema known.
- Create incremental diff file for versioning.
