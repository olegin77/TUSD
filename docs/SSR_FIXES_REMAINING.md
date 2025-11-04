# Remaining SSR Compatibility Fixes

**Status:** 3 of 15 files fixed
**Last Updated:** November 4, 2025
**Commit:** 68fa3f6

## Summary

The webapp HTTP 400 error is caused by 15 files accessing browser APIs (localStorage, window, navigator, socket.io) without SSR guards. This document lists all remaining fixes needed.

---

## ✅ FIXED (3/15)

1. **`apps/webapp/src/components/a11y/a11y-provider.tsx`**
   - Fixed: Dynamic import for @axe-core/react
   - Status: ✅ Complete

2. **`apps/webapp/src/lib/api/auth.ts`**
   - Fixed: All localStorage calls wrapped with `typeof window !== "undefined"`
   - Status: ✅ Complete

3. **`apps/webapp/src/hooks/useWalletAuth.ts`**
   - Fixed: Added "use client" directive + useEffect initialization
   - Status: ✅ Complete

---

## ⚠️ REMAINING FIXES (12/15)

### Priority 1: Admin Pages - localStorage in useEffect (8 files)

All admin pages have the same pattern - `localStorage.getItem("admin_token")` in useEffect without SSR checks. These already have "use client" but access localStorage incorrectly.

#### 1. `apps/webapp/src/app/(wallet)/admin/settings/page.tsx` (Line 34)

**Current Code:**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix:**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

#### 2. `apps/webapp/src/app/(wallet)/admin/login/page.tsx` (Line 34)

**Current Code:**
```typescript
localStorage.setItem("admin_token", data.access_token);
```

**Fix:**
```typescript
if (typeof window !== "undefined") {
  localStorage.setItem("admin_token", data.access_token);
}
```

---

####  3. `apps/webapp/src/app/(wallet)/admin/layout.tsx` (Line 42)

**Current Code:**
```typescript
localStorage.removeItem("admin_token");
```

**Fix:**
```typescript
if (typeof window !== "undefined") {
  localStorage.removeItem("admin_token");
}
```

---

#### 4. `apps/webapp/src/app/(wallet)/admin/page.tsx` (Line 40)

**Current Code:**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix:**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

#### 5. `apps/webapp/src/app/(wallet)/admin/pools/page.tsx` (Line 34)

**Current Code:**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix:**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

#### 6. `apps/webapp/src/app/(wallet)/admin/users/page.tsx` (Line 50)

**Current Code:**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix:**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

#### 7. `apps/webapp/src/app/(wallet)/admin/wexels/page.tsx` (Line 60)

**Current Code:**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix:**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

#### 8. `apps/webapp/src/app/(wallet)/admin/oracles/page.tsx` (Lines 50, 123)

**Current Code (Line 50):**
```typescript
const token = localStorage.getItem("admin_token");
```

**Current Code (Line 123):**
```typescript
const token = localStorage.getItem("admin_token");
```

**Fix (both locations):**
```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
```

---

### Priority 2: Hooks - Browser API Access (2 files)

#### 9. `apps/webapp/src/hooks/useNotifications.ts` (Lines 2, 20-24)

**Current Code:**
```typescript
import { io, Socket } from "socket.io-client";
// ...
const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
```

**Fix:**
Add "use client" at top + add SSR guard in useEffect:
```typescript
"use client";

import { io, Socket } from "socket.io-client";
// ...

useEffect(() => {
  if (typeof window === "undefined") return;

  const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
  setSocket(newSocket);
  // ... rest of code
}, []);
```

---

#### 10. `apps/webapp/src/hooks/useWallet.ts` (Already has "use client")

**Status:** Has "use client" directive - should be OK
**Action:** Verify no module-level browser API access

---

### Priority 3: Pages - Navigator API (1 file)

#### 11. `apps/webapp/src/app/(wallet)/wexel/[id]/page.tsx` (Line 76)

**Current Code:**
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // ...
};
```

**Fix:**
```typescript
const copyToClipboard = (text: string) => {
  if (typeof window === "undefined" || !navigator.clipboard) return;
  navigator.clipboard.writeText(text);
  // ...
};
```

---

### Priority 4: Components - Already Protected

#### 12. `apps/webapp/src/components/wallet/WalletConnect.tsx`

**Status:** Has "use client" directive
**Action:** Verify implementation - likely OK

---

## Quick Fix Script

For batch-fixing admin pages with similar patterns:

```bash
# Fix all localStorage.getItem in admin pages
find apps/webapp/src/app/\(wallet\)/admin -name "*.tsx" -type f | while read file; do
  # Replace getItem
  perl -i -pe 's/const (\w+) = localStorage\.getItem\(("admin_token")\);/const $1 = typeof window !== "undefined" ? localStorage.getItem($2) : null;/g' "$file"

  # Replace setItem
  perl -i -pe 's/localStorage\.setItem\(("admin_token"), ([^)]+)\);/if (typeof window !== "undefined") localStorage.setItem($1, $2);/g' "$file"

  # Replace removeItem
  perl -i -pe 's/localStorage\.removeItem\(("admin_token")\);/if (typeof window !== "undefined") localStorage.removeItem($1);/g' "$file"
done
```

---

## Testing After Fixes

1. Build webapp: `cd apps/webapp && pnpm build`
2. Start production server: `cd /home/nod/tusd/TUSD && node apps/webapp/server.js`
3. Test: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/`
4. Expected: HTTP 200 (not 400)

---

##  Impact

**Current State:**
- Docker builds successfully
- Server starts without crashes
- Backend API 100% operational (PostgreSQL, Redis, Indexer healthy)
- Webapp returns HTTP 400 due to SSR errors

**After Fixes:**
- All pages should render successfully
- No "window is not defined" errors
- Full SSR compatibility
- Production-ready deployment

---

## Files Modified So Far

1. `apps/webapp/server-polyfills.js` - Created
2. `apps/webapp/server.js` - Created
3. `apps/webapp/next.config.js` - Removed standalone mode
4. `apps/webapp/package.json` - Moved Next.js to dependencies
5. `apps/webapp/Dockerfile` - Updated for custom server
6. `apps/indexer/prisma/schema.prisma` - Added output path
7. `pnpm-lock.yaml` - Updated
8. `apps/webapp/src/components/a11y/a11y-provider.tsx` - Fixed
9. `apps/webapp/src/lib/api/auth.ts` - Fixed
10. `apps/webapp/src/hooks/useWalletAuth.ts` - Fixed

---

## Next Steps

1. Apply remaining 12 fixes using patterns above
2. Test locally with `pnpm dev`
3. Build production: `pnpm build`
4. Deploy to DigitalOcean
5. Verify HTTP 200 response
6. Commit and push to GitHub

---

**Note:** These fixes are straightforward - all follow the same pattern of wrapping browser API calls with `typeof window !== "undefined"` checks. Estimated time: 30-45 minutes for all remaining fixes.
