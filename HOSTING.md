# Putting Acorn on a phone

This folder is the whole app. It makes **no external requests at all** — no CDN,
no font server, no lookup download — so once installed it behaves identically
with no signal.

## What it needs

One HTTPS address. That is the only requirement, and it is not negotiable:
browsers refuse to install an app or run a service worker over plain HTTP. The
one exception is `http://localhost`, which is treated as secure — useful for a
quick look on the PC, no use on a phone.

## The quickest host: GitHub Pages (free, about five minutes)

1. Create a repository — it can be private; Pages still serves it on a paid
   plan, or make it public if the forms carry nothing sensitive. **These files
   carry no crew or customer data**, only the blank forms and the network
   lookup.
2. Upload the contents of this folder to the root of the repository — the files
   themselves, not the folder.
3. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save.**
4. Wait a minute. The address appears on that page, in the form
   `https://<you>.github.io/<repo>/`.

Anything else that serves static files over HTTPS works just as well —
Cloudflare Pages, Netlify, an IIS folder on the company server. There is no
server-side code, no database and no build step.

## Installing on Android

1. Open the address in **Chrome** on the phone.
2. Wait for it to finish loading once — that is when it takes its copy.
   The app is 8 MB, so do this on wifi.
3. **⋮ → Add to Home screen** (Chrome may offer "Install app" itself).
4. Open it from the home screen, not from Chrome. It runs full screen with no
   address bar, and it is now offline-capable.

To prove it: turn on aeroplane mode and open it again. Everything works —
every form, the 3,152-CMR lookup, and PDF generation.

## Installing on Windows

Same address in Chrome or Edge → the install icon at the right of the address
bar → Install. It gets a Start-menu entry and its own window.

## Releasing a new version

Replace the files on the host. That is the whole of it — no reinstall, no
sideloading, nothing for the crews to do by hand.

They get it three ways, in order of how soon:

1. **They ask.** Settings has a **Version** card with a *Check for updates*
   button. It says either "Up to date" or "Version 0.69 is available" and
   installs it on the spot, taking a few seconds and reopening the app. Nothing
   on the device is lost — records, photos and the chosen folder all stay.
2. **They are told.** Next time the app opens with a signal it notices by itself
   and says so. It does not interrupt: a sheet in progress is never reloaded
   underneath them.
3. **Eventually, on its own**, whenever the browser next re-checks.

The version shown in Settings is the release number plus a hash of the build —
`0.68-67bdd928`. Worth reading out when someone reports something odd, because
it identifies the exact build they are running rather than just the number.

## What is not in this build

- **Sending email.** There is no transport yet, so sync writes to a store in the
  browser rather than sending anything. Everything up to that point — building
  the PDFs, filing them, composing the subject and body — is real.
- **Filing PDFs into folders** works in Chrome on Android 132+ and on Chrome or
  Edge on Windows. Where the browser has no folder access the Save button on the
  finish screen still works and the settings screen says so.

## Landowner Search (0.80)

The Consent Archive tile is now **Landowner Search**. It reads `landowners.enc`, which the office's
Consent Filer publishes into this same folder after every run. The file is encrypted, and each device
asks once for the team passcode. Until the office has published it, the tile says so. Setup is
covered in ConsentFiler\ACORN-LANDOWNER-SEARCH.md.

## The landowner search's files

Consent Filer publishes two files into this folder, beside `index.html`:

- `landowners.enc` - the consent register, encrypted.
- `users.json` - who may sign in: a hash of each user's email address and their copy
  of the key, locked with their own password. No addresses, names or passwords.

Both are written after every run, so neither needs editing by hand.
