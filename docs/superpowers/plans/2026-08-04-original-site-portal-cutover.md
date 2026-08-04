# Original Site and Portal Subdomain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the original Netlify website at the apex and `www`, move the existing Dockerized portal to `portal.elevate-sharm.com`, and link the two without changing portal data or accounts.

**Architecture:** Netlify serves the original static site at the apex and `www`. Netlify DNS sends only `portal.elevate-sharm.com` to the Hetzner server, where Caddy terminates TLS and proxies to the unchanged Next.js container. The original static navigation links directly to the portal login URL.

**Tech Stack:** Netlify DNS and static hosting, Caddy 2, Docker Compose, Next.js 16, SQLite/Prisma, static HTML, GitHub.

---

## File Map

- Modify `C:\Users\adami\AppData\Roaming\CherryStudio\Data\Agents\h571xiwwn\elevate\Caddyfile`: add the portal hostname during transition, then leave only the portal hostname after DNS TTL expiry.
- Modify `index.html`: add the public `School Portal` navigation link.
- Preserve `/root/elevate/data`, `/root/elevate/backups`, Caddy named volumes, all user accounts, and all passwords.

### Task 1: Create a fresh pre-cutover backup

**Files:**
- Verify: `/root/elevate/scripts/backup.sh`
- Verify: `/root/elevate/backups/elevate-2026-08-04.tar.gz`

- [ ] **Step 1: Run the documented backup**

Run from PowerShell:

```powershell
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'cd /root/elevate && ./scripts/backup.sh'
```

Expected: exit code `0`.

- [ ] **Step 2: Verify the archive and its contents**

```powershell
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'test -s /root/elevate/backups/elevate-2026-08-04.tar.gz && tar -tzf /root/elevate/backups/elevate-2026-08-04.tar.gz'
```

Expected: exit code `0`; output contains `backup.db` and `uploads/`.

### Task 2: Bring up the portal hostname without removing the current hostnames

**Files:**
- Modify: `C:\Users\adami\AppData\Roaming\CherryStudio\Data\Agents\h571xiwwn\elevate\Caddyfile`

- [ ] **Step 1: Add the transitional Caddy block**

Make the file exactly:

```caddyfile
elevate-sharm.com {
    reverse_proxy app:3000
}

www.elevate-sharm.com {
    redir https://elevate-sharm.com{uri} permanent
}

portal.elevate-sharm.com {
    reverse_proxy app:3000
}
```

- [ ] **Step 2: Add the portal DNS record**

In Netlify DNS add exactly:

```text
Type:  A
Name:  portal
Value: 62.238.98.72
TTL:   Netlify default
```

Do not edit the Google verification CNAME, Google MX, or Google TXT records. Leave the apex and `www` A records in place during this stage.

- [ ] **Step 3: Copy the transitional Caddyfile to the server**

```powershell
scp.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' `
  'C:\Users\adami\AppData\Roaming\CherryStudio\Data\Agents\h571xiwwn\elevate\Caddyfile' `
  'root@62.238.98.72:/root/elevate/Caddyfile'
```

Expected: exit code `0`.

- [ ] **Step 4: Validate and gracefully reload Caddy**

```powershell
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'cd /root/elevate && docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile'
```

Expected: validation reports `Valid configuration`; reload exits `0`. Do not restart the app and do not run `docker compose down`.

- [ ] **Step 5: Verify DNS and certificate issuance**

```powershell
Resolve-DnsName portal.elevate-sharm.com -Type A -Server 1.1.1.1
curl.exe --fail --silent --show-error --location --output NUL `
  --write-out 'portal-login %{http_code} %{url_effective}\n' `
  https://portal.elevate-sharm.com/login
```

Expected: DNS returns only `62.238.98.72`; HTTPS returns `200` without disabling certificate validation.

### Task 3: Verify the portal on its permanent hostname

**Files:**
- Verify only; no source changes.

- [ ] **Step 1: Verify the landing and login pages**

Open `https://portal.elevate-sharm.com/` and `https://portal.elevate-sharm.com/login` in the signed-in browser session.

Expected: the portal landing page and login form render without certificate warnings.

- [ ] **Step 2: Verify authentication and one server action**

Use the existing founder credential documented in the deployment guide. Submit the login form and confirm the final URL is `https://portal.elevate-sharm.com/dashboard`. Open one dashboard section such as Announcements to exercise authenticated navigation.

Expected: dashboard and section load successfully. Do not change the password or create accounts.

- [ ] **Step 3: Verify container health and Caddy certificate logs**

```powershell
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'cd /root/elevate && docker compose ps && docker compose logs --since=10m caddy'
```

Expected: both services are `Up`; Caddy reports successful production certificate issuance for `portal.elevate-sharm.com`.

### Task 4: Restore the original website at the apex and www

**Files:**
- Netlify DNS records only.

- [ ] **Step 1: Remove only the two Hetzner web A records**

Delete exactly:

```text
elevate-sharm.com     A 62.238.98.72
www.elevate-sharm.com A 62.238.98.72
```

Do not delete the `portal` A record or any Google CNAME/MX/TXT record.

- [ ] **Step 2: Restore the two supported Netlify web records**

Add exactly:

```text
elevate-sharm.com     ALIAS apex-loadbalancer.netlify.com
www.elevate-sharm.com CNAME elevate-homeschool.netlify.app
```

Netlify's dashboard does not expose its internal automatic `NETLIFY` type for
manual creation. These are Netlify's documented manual equivalents and preserve
the existing project/domain assignment.

- [ ] **Step 3: Verify public DNS and original-site content**

Poll authoritative Netlify nameservers plus `1.1.1.1` and `8.8.8.8` until the apex and `www` no longer resolve to `62.238.98.72`.

Then run:

```powershell
curl.exe --fail --silent --show-error --location https://elevate-sharm.com/ |
  Select-String 'A Modern High School, Personalized for Your Child'
curl.exe --fail --silent --show-error --location --output NUL `
  --write-out 'www %{http_code} %{url_effective}\n' https://www.elevate-sharm.com/
```

Expected: the original Elevate marketing page is returned with normal TLS validation; `www` serves or redirects to the same site.

### Task 5: Add and publish the School Portal navigation link

**Files:**
- Modify: `index.html` in the original website repository.

- [ ] **Step 1: Run the link assertion before editing**

```powershell
rg -n 'https://portal\.elevate-sharm\.com/login|School Portal' index.html
```

Expected: no matches and a non-zero exit code.

- [ ] **Step 2: Add the minimal navigation link**

Insert after the existing Contact item:

```html
<li><a href="https://portal.elevate-sharm.com/login">School Portal</a></li>
```

- [ ] **Step 3: Verify the exact link and HTML diff**

```powershell
rg -n '<li><a href="https://portal\.elevate-sharm\.com/login">School Portal</a></li>' index.html
git diff --check
git diff -- index.html
```

Expected: one matching link; `git diff --check` exits `0`; the diff contains only the navigation item.

- [ ] **Step 4: Commit the website change**

```powershell
git add index.html
git commit -m 'Add school portal navigation link'
```

Expected: one new commit containing only `index.html`.

- [ ] **Step 5: Push and wait for Netlify production deployment**

```powershell
git push origin main
```

Expected: push succeeds; Netlify publishes the new commit from `main`.

- [ ] **Step 6: Verify the published link**

```powershell
curl.exe --fail --silent --show-error --location https://elevate-sharm.com/ |
  Select-String 'https://portal.elevate-sharm.com/login'
```

Expected: exactly one match. Also click `School Portal` in the browser and confirm it opens the portal login page.

### Task 6: Complete end-to-end verification

**Files:**
- Verify only.

- [ ] **Step 1: Verify all public URLs with normal TLS validation**

```powershell
curl.exe --fail --silent --show-error --location --output NUL --write-out 'site %{http_code} %{url_effective}\n' https://elevate-sharm.com/
curl.exe --fail --silent --show-error --location --output NUL --write-out 'www %{http_code} %{url_effective}\n' https://www.elevate-sharm.com/
curl.exe --fail --silent --show-error --location --output NUL --write-out 'portal %{http_code} %{url_effective}\n' https://portal.elevate-sharm.com/login
```

Expected: all final responses are `200`.

- [ ] **Step 2: Recheck services, cron, and backup**

```powershell
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'cd /root/elevate && docker compose ps && crontab -l && test -s backups/elevate-2026-08-04.tar.gz && ls -lh backups/elevate-2026-08-04.tar.gz'
```

Expected: both services are `Up`; cron is exactly `10 3 * * * /root/elevate/scripts/backup.sh`; the backup exists and is non-empty.

### Task 7: Remove obsolete apex and www Caddy blocks after TTL expiry

**Files:**
- Modify: `C:\Users\adami\AppData\Roaming\CherryStudio\Data\Agents\h571xiwwn\elevate\Caddyfile`

- [ ] **Step 1: Wait through the former 3600-second DNS TTL**

Keep the transitional Caddy blocks active for at least one hour after the Netlify DNS restoration so clients with cached A records continue receiving a valid response.

- [ ] **Step 2: Make the final Caddyfile exact**

```caddyfile
portal.elevate-sharm.com {
    reverse_proxy app:3000
}
```

- [ ] **Step 3: Copy, validate, and gracefully reload the final configuration**

```powershell
scp.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' `
  'C:\Users\adami\AppData\Roaming\CherryStudio\Data\Agents\h571xiwwn\elevate\Caddyfile' `
  'root@62.238.98.72:/root/elevate/Caddyfile'
ssh.exe -i 'C:\Users\adami\.ssh\elevate_hetzner_ed25519' -o BatchMode=yes root@62.238.98.72 `
  'cd /root/elevate && docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile && docker compose ps'
```

Expected: validation succeeds, reload exits `0`, and both services remain `Up`.

- [ ] **Step 4: Run the final URL verification again**

Repeat Task 6 Step 1 and confirm all three public URLs still return `200` with normal certificate validation.
