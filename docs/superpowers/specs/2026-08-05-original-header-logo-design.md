# Original Header Logo Design

## Goal

Use the established Elevate logo consistently in both the header and footer of the public homepage.

## Design

- Replace the header's CSS-drawn two-peak mark and separate `ELEVATE` text with the same `assets/images/Elevate Logo.png` image used in the footer.
- Place the transparent white-and-blue logo on a compact navy background within the existing light header so the white lettering remains legible.
- Preserve the current sticky header, navigation links, menu behavior, and header height as closely as possible.
- Size the logo responsively so it remains clear without crowding the mobile menu.
- Keep the brand link accessible with the existing `Elevate home` label.

## Scope

Only the public homepage header branding and its contract test will change. The footer logo asset and all other page content and behavior remain unchanged.

## Verification

- A contract test will confirm that the header uses the same logo asset as the footer and that the removed custom peak markup is absent.
- The complete site test suite and JavaScript syntax check will run before deployment.
- After deployment, the production HTML and CSS will be checked for the shared logo asset and header presentation rules.
