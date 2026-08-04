# Original Website and Portal Subdomain Design

## Goal

Restore the existing public Elevate website at `https://elevate-sharm.com` and
`https://www.elevate-sharm.com`, while keeping the new school portal available
at `https://portal.elevate-sharm.com`.

## Chosen Architecture

- Netlify continues hosting the original static website at the apex and `www`.
- The Hetzner server continues hosting the Dockerized portal and its persistent
  SQLite database and uploads.
- Netlify DNS points `portal.elevate-sharm.com` to the Hetzner IPv4 address.
- Caddy provisions HTTPS for `portal.elevate-sharm.com` and proxies it to the
  existing `app:3000` container.
- The original website adds a visible `School Portal` navigation link to
  `https://portal.elevate-sharm.com/login`.

The portal remains at the root of its own hostname. It will not be mounted at
`/portal`, because that would require Next.js base-path, asset, API, cookie,
manifest, and proxy changes that are unnecessary for the requested outcome.

## Cutover Sequence

1. Run the documented backup script and verify the new archive before the
   cutover.
2. Add an A record for `portal` pointing to `62.238.98.72`.
3. Add `portal.elevate-sharm.com` to Caddy without stopping the portal app or
   touching `/root/elevate/data`.
4. Validate and gracefully reload Caddy, then wait for its automatic
   certificate issuance.
5. Verify the portal landing page, login page, founder login, and dashboard on
   the new hostname.
6. Restore Netlify routing with the current supported manual records: apex
   `ALIAS` to `apex-loadbalancer.netlify.com` and `www` `CNAME` to
   `elevate-homeschool.netlify.app`, replacing only their Hetzner A records.
7. Verify the original website at both public hostnames.
8. Add and publish the original website's `School Portal` link.
9. Verify navigation from the original site to the portal and recheck the
   existing nightly backup.
10. After the old DNS TTL expires, remove the obsolete apex and `www` Caddy
    blocks, validate the configuration, and gracefully reload Caddy again.

The Google Workspace CNAME, MX, and TXT records remain unchanged.

## Portal Configuration

The final Caddy site block is:

```caddyfile
portal.elevate-sharm.com {
    reverse_proxy app:3000
}
```

No portal application code, accounts, passwords, database contents, uploads,
Docker volumes, or backup settings will change.

## Original Website Change

Add one top-navigation link in `index.html`:

```html
<li><a href="https://portal.elevate-sharm.com/login">School Portal</a></li>
```

The existing visual language and navigation structure remain unchanged.

## Verification

- Public DNS returns Netlify for the apex and `www`, and `62.238.98.72` for
  `portal`.
- Normal certificate validation succeeds for all three hostnames.
- The apex serves the original page titled
  `A Modern High School, Personalized for Your Child | Elevate Learning Center`.
- `www` serves or redirects to the same original website.
- `https://portal.elevate-sharm.com/login` loads and the founder account reaches
  `/dashboard`.
- The original website's `School Portal` link targets the portal login URL.
- Both Docker Compose services remain up and the dated backup archive remains
  present.

## Rollback

If the portal hostname fails, keep the original website restored and revert
only the portal Caddy/DNS addition. The existing portal data remains intact on
Hetzner. If the Netlify restoration fails, restore the previous apex and `www`
A records temporarily while diagnosing; do not alter application data or
Docker volumes.

## Non-Goals

- No redesign of the original website.
- No `/portal` path-based deployment.
- No account or password changes.
- No deletion of the Netlify project, Hetzner server, portal data, or backups.
