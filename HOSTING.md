# Landowner Search — for field teams until Acorn is released

Just the landowner search from Acorn, as an app of its own: type part of a
functional location, or pick a CMR and then a location, and see who owns the
land, how to reach them, and what was agreed. It works with no signal once it
has downloaded the register.

It is **the same search as Acorn**, not a copy of it: `build.py` lifts Acorn's
own search code out of the Acorn PWA word for word. Same passcode, same
register, same results.

## Where the data comes from

Nothing changes in the office. The Consent Filer keeps publishing
`landowners.enc` into the **Acorn** repository as it does now, and this app
downloads it from there:

    https://raw.githubusercontent.com/EmiFyn/Acorn/main/landowners.enc

That works from any site because GitHub serves the file to any web page that
asks. The address can be changed in the app's Settings if the register ever
moves.

**One thing that would stop it:** if the Acorn repository is made private, that
address stops answering. If that is ever wanted, have the Consent Filer publish
`landowners.enc` into this repository too, and set the address in Settings to
just `landowners.enc`.

The register is encrypted and only the team passcode opens it, which is why it
is safe on a public host. Each phone asks for the passcode once.

## Putting it online (GitHub Pages, about five minutes)

1. Create a new repository — for example `landowner-search`. Public is fine:
   **these files carry no landowner data**, only the app. (Pages on a private
   repository needs a paid GitHub plan.)
2. Upload **the contents of this folder** to the root of the repository — the
   files themselves, not the folder. Include `.nojekyll`.
3. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` →
   Save.**
4. Wait a minute. The address appears on that page, e.g.
   `https://emifyn.github.io/landowner-search/`. That is the link to send the
   crews.

It will also run from any other HTTPS host — there is no server side.

## Installing it

**Android (Chrome):** open the link → wait for it to load once (on wifi or
signal) → **⋮ → Add to Home screen** or **Install app** → open it from the home
screen → enter the team passcode.

**iPhone / iPad (Safari):** open the link → **Share → Add to Home Screen** →
open it from the home screen → enter the passcode. Use it from the home-screen
icon rather than a Safari tab: Safari may clear the storage of a site that
hasn't been visited for a while, and the home-screen app is where it keeps the
register reliably.

**Windows (Edge or Chrome):** open the link → the install icon at the right of
the address bar → Install.

To prove it works offline: aeroplane mode on, open it, search.

## Keeping it current

- **The register** updates by itself whenever the phone has signal — on
  opening, and when signal comes back — at most every five minutes. **Refresh**
  on the search screen forces it.
- **The app** updates when you replace the files in the repository. Phones
  notice next time they open with signal and show **Update now** at the top;
  it never reloads by itself mid-search. Settings → *Check for updates* asks
  straight away.

## Rebuilding after Acorn changes

If the search changes in Acorn, rebuild this from the new Acorn PWA and upload
the output:

    python3 build.py <path to Acorn's index.html> <output folder>

It needs Python with `cairosvg` and `Pillow` (for the icons). It stops with a
message rather than building something wrong if Acorn's search has moved in a
way it doesn't expect.

## When Acorn is released

Crews move to the Acorn app, which has the same search on its dashboard tile.
This app can then simply be deleted from the phones; nothing in it needs
keeping — the register comes back from the office on any device with the
passcode.
