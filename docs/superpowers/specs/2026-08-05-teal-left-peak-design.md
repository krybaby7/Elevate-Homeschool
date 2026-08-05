# Teal Left Peak Design

**Date:** 2026-08-05  
**Status:** Explicitly approved for immediate production deployment

## Design

Keep the existing two-peak geometry and header spacing unchanged. Change only the left peak (`.brand-mark::before`) from Elevate blue to the existing Elevate aqua/teal token (`--aqua: #82dfe9`). Keep the right peak (`.brand-mark::after`) blue (`--blue: #2f68df`).

This creates a subtle two-tone mark that remains consistent with the homepage palette and preserves the stronger blue on the higher, forward peak.

## Verification

- A contract test must distinguish the left teal peak from the right blue peak.
- The complete homepage test suite and JavaScript syntax check must pass.
- Production must serve the updated CSS and display both pseudo-elements without horizontal layout changes.
