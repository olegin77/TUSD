# Known Issues - TUSD Webapp

## SSR Incompatibility with Solana Wallet Adapters

**Status:** ⚠️ KNOWN LIMITATION
**Date Identified:** 2025-11-01
**Severity:** High (blocks production deployment)
**Detailed Documentation:** `/SSR_ISSUE_DOCUMENTATION.md` in project root

---

### Summary

The webapp experiences persistent HTTP 500 errors due to `ReferenceError: window is not defined` during server-side rendering. This is a fundamental architectural incompatibility between Next.js 15 App Router's webpack bundling and Solana wallet adapter libraries that require browser APIs.

### Error Details

```
⨯ ReferenceError: window is not defined
    at 19378 (.next/server/chunks/821.js:1:653057)
    at c (.next/server/webpack-runtime.js:1:143)
```

**HTTP Status:** 500 Internal Server Error
**Affected:** All routes including root `/`
**Error Digest:** `1911084206`

### Root Cause

1. Webpack bundles Solana wallet adapter code into server chunks during **build time**
2. Next.js 15 App Router analyzes all components for RSC compatibility, triggering server bundling
3. Runtime protections (`ssr: false`, dynamic imports, `useEffect`) cannot prevent build-time bundling
4. Server attempts to execute bundled code containing browser `window` object references

### Attempted Fixes (All Failed)

All standard SSR mitigation strategies were attempted and documented:

- ✅ `export const dynamic = 'force-dynamic'` in layout
- ✅ `serverExternalPackages` configuration
- ✅ Aggressive webpack externalization rules
- ✅ Dynamic imports with `ssr: false`
- ✅ All wallet imports moved to client-side `useEffect`
- ✅ CSS `@import` removed

**Result:** Error persists at identical location across all attempts.

### Current State

- **Backend:** 100% operational at http://143.198.17.162:3001
- **Webapp:** Returns HTTP 500 on all routes
- **Container:** Running but non-functional (ID: `6e4ae99ddc8d`)

### Path Forward

This limitation requires one of the following approaches:

1. **Client-Side Only Rendering** (Recommended)
   - Convert to static export (`output: 'export'`)
   - Serve as static site from CDN/nginx
   - **Pros:** Clean solution, no SSR complexity
   - **Cons:** Loses server-side data fetching

2. **Downgrade Next.js** (Alternative)
   - Migrate to Next.js 13/14 with Pages Router
   - Different bundling behavior may resolve issue
   - **Pros:** Proven compatibility with wallet adapters
   - **Cons:** Loses Next.js 15 features, major refactoring

3. **Alternative Wallet Library** (Long-term)
   - Migrate to `@solana/wallet-standard` or similar
   - **Pros:** Modern, better SSR support
   - **Cons:** Significant refactoring (16-24 hours)

### For Developers

**Important:** Do NOT attempt additional SSR mitigation strategies. This issue is architectural and cannot be resolved with configuration alone. See `/SSR_ISSUE_DOCUMENTATION.md` for comprehensive technical analysis.

**Current workaround:** Use backend API directly for testing wallet functionality.

---

**Last Updated:** 2025-11-01
**Documented By:** Technical Analysis
**For Questions:** See project root `/SSR_ISSUE_DOCUMENTATION.md`
