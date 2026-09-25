# Material Symbols Outlined provenance

- **Upstream repository:** https://github.com/google/material-design-icons
- **Immutable upstream revision:** `528cb964c01fb2b09bc3b9208f82b6d8f8c1c1e2` (`Update Symbols`, 2026-07-24)
- **Retrieved (UTC):** 2026-07-27
- **License:** Apache License, Version 2.0; the upstream `LICENSE` is vendored as `LICENSE`.

## Vendored files

| File | Upstream path | SHA-256 |
| --- | --- | --- |
| `MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf` | `variablefont/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf` | `b5126c4655e0756f334d684104156b98b82ef7d61212a81c041b9e6cfa8ba925` |
| `MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints` | `variablefont/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints` | `8567a3d0512ce8a735a739d325e83ee7010d9bf7f6f8ed6a699c07c817ea907d` |
| `LICENSE` | `LICENSE` | `58d1e17ffe5109a7ae296caafcadfdbe6a7d176f0bc4ab01e12a689b0499d8bd` |

Immutable source URLs:

- https://raw.githubusercontent.com/google/material-design-icons/528cb964c01fb2b09bc3b9208f82b6d8f8c1c1e2/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.ttf
- https://raw.githubusercontent.com/google/material-design-icons/528cb964c01fb2b09bc3b9208f82b6d8f8c1c1e2/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.codepoints
- https://raw.githubusercontent.com/google/material-design-icons/528cb964c01fb2b09bc3b9208f82b6d8f8c1c1e2/LICENSE

## Manual refresh procedure (never part of CMake configure/build)

1. Select a reviewed immutable commit SHA from the official `google/material-design-icons` repository; never use a moving branch name.
2. Manually retrieve only the Outlined TTF, matching `.codepoints`, and upstream `LICENSE` from URLs pinned to that SHA. Do not add WOFF2.
3. If the upstream revision supplies a `NOTICE`, replace `NOTICE` with that exact file; otherwise retain the absence statement and attribution in `NOTICE`.
4. Update this file with the revision, retrieval date, exact paths, URLs, and SHA-256 values calculated from the downloaded bytes.
5. Run `pwsh -File tools/validate-material-symbols-assets.ps1`. It performs no network access and must succeed before review.

This repository does not fetch these files at build time or runtime.
