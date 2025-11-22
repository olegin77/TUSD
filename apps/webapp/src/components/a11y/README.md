# Accessibility (a11y) Guidelines

This directory contains accessibility components and utilities for the USDX Wexel platform.

## Components

### SkipToContent

Allows keyboard users to skip navigation and jump directly to main content.

```tsx
import { SkipToContent } from "@/components/a11y";

<SkipToContent />;
```

### ScreenReaderOnly

Renders content that is only visible to screen readers.

```tsx
import { ScreenReaderOnly } from "@/components/a11y";

<ScreenReaderOnly>
  <span>Additional context for screen readers</span>
</ScreenReaderOnly>;
```

### AriaLiveRegion

Announces dynamic content changes to screen readers.

```tsx
import { AriaLiveRegion } from "@/components/a11y";

<AriaLiveRegion message="Deposit successful!" politeness="polite" clearDelay={5000} />;
```

### FocusTrap

Traps keyboard focus within a container (essential for modals).

```tsx
import { FocusTrap } from "@/components/a11y";

<FocusTrap active={isOpen} onEscape={handleClose}>
  <div>Modal content</div>
</FocusTrap>;
```

### useKeyboardNavigation Hook

Hook for implementing keyboard navigation patterns.

```tsx
import { useKeyboardNavigation } from "@/components/a11y";

useKeyboardNavigation({
  onEnter: handleSelect,
  onEscape: handleClose,
  onArrowDown: navigateDown,
  onArrowUp: navigateUp,
});
```

## Accessibility Checklist

### ✅ Keyboard Navigation

- [x] All interactive elements are keyboard accessible
- [x] Focus indicators are visible
- [x] Tab order is logical
- [x] Skip to main content link implemented
- [x] Focus trap for modals

### ✅ Screen Reader Support

- [x] Semantic HTML elements used
- [x] ARIA labels and roles where needed
- [x] Live regions for dynamic content
- [x] Alternative text for images
- [x] Form labels properly associated

### ✅ Visual Accessibility

- [ ] Color contrast meets WCAG AA standards (4.5:1 for text)
- [x] Text can be resized up to 200%
- [x] No information conveyed by color alone
- [x] Focus indicators are visible

### ✅ Content Structure

- [x] Proper heading hierarchy (h1 -> h2 -> h3)
- [x] Landmark regions (header, nav, main, footer)
- [x] Lists for list content
- [x] Tables for tabular data with proper headers

## WCAG 2.1 Compliance

Target Level: **AA**

### Perceivable

- Text alternatives (1.1.1) ✅
- Captions (1.2.2) N/A
- Adaptable (1.3) ✅
- Distinguishable (1.4) ⚠️ (needs color contrast audit)

### Operable

- Keyboard Accessible (2.1) ✅
- Enough Time (2.2) ✅
- Seizures (2.3) ✅
- Navigable (2.4) ✅
- Input Modalities (2.5) ✅

### Understandable

- Readable (3.1) ✅
- Predictable (3.2) ✅
- Input Assistance (3.3) ✅

### Robust

- Compatible (4.1) ✅

## Testing Tools

### Automated Testing

```bash
# Run accessibility tests with Jest
pnpm test:a11y

# Lighthouse accessibility audit
lighthouse https://localhost:3000 --only-categories=accessibility

# axe-core testing
pnpm add -D @axe-core/react
```

### Manual Testing

1. **Keyboard Only Navigation**
   - Tab through all interactive elements
   - Use Enter/Space to activate
   - Use Escape to close dialogs
   - Use Arrow keys for navigation

2. **Screen Reader Testing**
   - macOS: VoiceOver (Cmd + F5)
   - Windows: NVDA (free) or JAWS
   - Mobile: TalkBack (Android) or VoiceOver (iOS)

3. **Browser Extensions**
   - axe DevTools
   - WAVE
   - Lighthouse (Chrome DevTools)

## Common Patterns

### Accessible Button

```tsx
<button type="button" aria-label="Close dialog" onClick={handleClose}>
  <ScreenReaderOnly>Close</ScreenReaderOnly>
  <span aria-hidden="true">×</span>
</button>
```

### Accessible Form

```tsx
<form onSubmit={handleSubmit}>
  <label htmlFor="amount">
    Deposit Amount
    <input
      id="amount"
      type="number"
      aria-describedby="amount-help"
      aria-required="true"
      aria-invalid={hasError}
    />
  </label>
  <span id="amount-help">Minimum deposit: $100</span>
  {hasError && (
    <div role="alert" aria-live="assertive">
      Please enter a valid amount
    </div>
  )}
</form>
```

### Accessible Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <FocusTrap active onEscape={handleClose}>
    <h2 id="dialog-title">Confirm Deposit</h2>
    <p id="dialog-description">You are about to deposit $1,000 into Pool 1</p>
    <button onClick={handleConfirm}>Confirm</button>
    <button onClick={handleClose}>Cancel</button>
  </FocusTrap>
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

## Browser Support

Accessibility features are tested and supported in:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Reporting Issues

If you encounter accessibility issues:

1. Check this documentation first
2. Test with keyboard and screen reader
3. Report with specific steps to reproduce
4. Include browser/assistive technology used
