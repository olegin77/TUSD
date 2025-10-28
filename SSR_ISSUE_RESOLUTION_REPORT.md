# SSR Issue Resolution Report - USDX/Wexel Project

**Date:** 2025-10-28  
**Status:** ❌ BLOCKED - Critical SSR issue with Solana Wallet Adapters  
**Task:** T-0126.1 - Bug fixing after comprehensive testing

---

## Problem Summary

**Error:** `ReferenceError: window is not defined`  
**Location:** Multiple pages (/dashboard, /boost, /marketplace, etc.)  
**Root Cause:** Solana wallet adapter libraries use browser-specific APIs (`window`) during module import, which fails during Next.js SSR/SSG

---

## Attempted Solutions (10+ attempts)

### 1. ✅ Added SSR Guards
- Added `typeof window !== "undefined"` checks in TronProvider
- Added `typeof window` checks in api.ts
- **Result:** Fixed some issues, but not the core problem

### 2. ❌ ClientOnly Wrapper
- Created `<ClientOnly>` component
- Wrapped MultiWalletProvider
- **Result:** Didn't prevent module-level imports

### 3. ❌ Dynamic Import with ssr: false
- Used `dynamicImport()` for BoostApplication and BoostHistory
- Set `{ ssr: false }`
- **Result:** Modules still imported on server

### 4. ❌ Force Dynamic Rendering
- Added `export const dynamic = 'force-dynamic'` to all wallet pages
- **Result:** Next.js still attempts prerendering during build

### 5. ❌ Next.config.js Modifications
- Added webpack fallbacks for Node.js modules
- Added `experimental.missingSuspenseWithCSRBailout`
- Externalized pino-pretty
- **Result:** Reduced errors but didn't solve core issue

### 6. ❌ Conditional Provider Loading
- Made MultiWalletProvider load WalletContextProvider conditionally
- Used `useState` and `useEffect` for client-only loading
- **Result:** Providers load on client, but build still fails

### 7. ❌ Updated boost/page.tsx
- Renamed `dynamic` import to `dynamicImport` to avoid naming conflict
- **Result:** Fixed naming conflict, SSR issue remains

### 8. ❌ Added force-dynamic to All Pages
- Added to: dashboard, boost, marketplace, pools, wallet, oracles, wexel/[id]
- Added to admin pages: oracles, pools, users, wexels, settings
- **Result:** Still attempts prerendering

---

## Root Cause Analysis

The issue occurs because:

1. **@solana/wallet-adapter-wallets** imports all wallet adapters at module level
2. Many adapters (WalletConnect, Torus, etc.) use `window` object immediately on import
3. Next.js runs these imports during SSR/SSG build phase
4. `window` is undefined on server → crash

**Critical code path:**
```
WalletProvider.tsx 
  → imports @solana/wallet-adapter-wallets
    → imports WalletConnectWalletAdapter
      → imports @walletconnect/solana-adapter
        → imports pino logger
          → tries to access window
            → ReferenceError
```

---

## Working Workarounds

### Option A: Disable Static Generation ⚠️
**Pros:** Would fix the build  
**Cons:** Loses Next.js SSG benefits, slower initial page loads

```javascript
// next.config.js
module.exports = {
  output: 'export', // OR
  experimental: {
    appDir: true,
    serverActions: false,
  },
}
```

### Option B: Remove Problematic Wallets ✅ RECOMMENDED
Only use wallets that don't require server-side initialization:

```typescript
// WalletProvider.tsx - Use only these:
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Remove: Torus, WalletConnect, Ledger
  ],
  []
);
```

### Option C: Separate Layouts for Wallet Pages ✅ RECOMMENDED
Create route groups:

```
app/
  (public)/       # SSR-enabled, no wallet
    page.tsx
    layout.tsx
  (wallet)/       # Client-only, has wallet
    dashboard/
    boost/
    layout.tsx    # Has MultiWalletProvider
```

### Option D: Use Next.js 14 App Router Properly
```typescript
// app/boost/page.tsx
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const runtime = 'nodejs' // not 'edge'
```

---

## Recommended Solution

**Implement Option B + Option C:**

### Step 1: Simplify Wallet Adapters (5 min)
```typescript
// src/providers/WalletProvider.tsx
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Remove problematic adapters
  ],
  []
);
```

### Step 2: Create Route Groups (10 min)
```bash
# Restructure app directory
apps/webapp/src/app/
  (public)/          # No wallet, SSR enabled
    page.tsx
    layout.tsx       # Basic layout
  (wallet)/          # With wallet, client-only
    dashboard/
    boost/
    marketplace/
    layout.tsx       # Has MultiWalletProvider
```

### Step 3: Test Build (2 min)
```bash
cd apps/webapp
pnpm build
```

---

## Files Modified (Session Summary)

### Created:
1. `apps/webapp/src/components/ClientOnly.tsx` - Client-only wrapper component

### Modified:
2. `apps/webapp/src/app/layout.tsx` - Added ClientOnly wrapper
3. `apps/webapp/src/app/dashboard/page.tsx` - Added force-dynamic
4. `apps/webapp/src/app/boost/page.tsx` - Multiple SSR fixes
5. `apps/webapp/next.config.js` - Webpack config for Node.js modules
6. `apps/webapp/src/providers/MultiWalletProvider.tsx` - Conditional loading
7. `apps/webapp/src/providers/TronProvider.tsx` - SSR guards
8. `apps/webapp/src/lib/api.ts` - Replaced window.location
9. `apps/webapp/src/components/ui/button.tsx` - Fixed framer-motion types
10. Multiple page.tsx files - Added force-dynamic exports

---

## Impact Assessment

### Current State:
- ❌ Build: FAILS on prerendering
- ✅ TypeScript: 0 errors
- ✅ Backend: All tests pass
- ⚠️ Linting: 35 warnings (non-critical)

### Estimated Fix Time:
- **Option A:** 5 minutes (but impacts performance)
- **Option B:** 15 minutes (recommended)
- **Option C:** 30 minutes (best for scalability)
- **Option B + C:** 45 minutes (optimal solution)

### Risk Level:
- **High:** Blocks production deployment
- **Medium:** Requires architectural changes
- **Low:** Solutions are well-documented

---

## Next Steps (Prioritized)

### Immediate (P0):
1. ✅ Document current state (this report)
2. 🔴 **Implement Option B** - Remove problematic wallet adapters
3. 🔴 Test build with simplified wallets
4. 🔴 Commit working solution

### Short-term (P1):
5. Implement route groups for better separation
6. Add proper error boundaries
7. Update documentation

### Long-term (P2):
8. Investigate wallet adapter alternatives
9. Consider custom wallet integration
10. Performance optimization

---

## Lessons Learned

1. **Third-party libraries** with browser dependencies are problematic in SSR
2. **Next.js 15** has stricter SSR requirements than v14
3. **Force-dynamic** doesn't prevent build-time prerendering
4. **Dynamic imports** don't help with module-level code execution
5. **Wallet adapters** should be lazy-loaded and conditional

---

## References

- [Next.js SSR Issues](https://nextjs.org/docs/messages/prerender-error)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)

---

## Decision Log

| Date | Decision | Rationale | Result |
|------|----------|-----------|--------|
| 2025-10-28 | Try ClientOnly wrapper | Standard Next.js pattern | Failed - module imports |
| 2025-10-28 | Add force-dynamic | Official Next.js solution | Failed - build still prerenders |
| 2025-10-28 | Conditional provider loading | Avoid server imports | Failed - imports at module level |
| 2025-10-28 | Document and recommend workarounds | Unblock development | **Current state** |

---

## Recommendations for User

**Choice 1: Quick Fix (5-15 min)**
- Remove WalletConnect and Torus adapters
- Keep only Phantom and Solflare
- Test build immediately

**Choice 2: Proper Fix (45 min)**
- Implement route groups
- Separate wallet and non-wallet pages
- Add proper loading states
- Better user experience

**Choice 3: Defer (accept workaround)**
- Use `pnpm dev` for development
- Deploy with warnings
- Fix later when time permits

---

**Status:** Awaiting user decision on fix approach  
**Blocker:** SSR incompatibility with wallet adapters  
**ETA:** 15-45 minutes depending on chosen solution

---

*Report generated: 2025-10-28*  
*Agent: Cursor AI (Sonnet 4.5)*
