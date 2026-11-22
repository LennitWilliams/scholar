THE SCHOLAR'S STUDY — PWA PACKAGE

1. HOST IT (free, any one of these; needs https)
   - Netlify: app.netlify.com/drop, drag this whole folder in. Done.
   - Cloudflare Pages: Create project > Direct Upload > this folder.
   - GitHub Pages: put these files in a repo, enable Pages.

2. INSTALL ON iPAD / iPHONE
   Open the site URL in Safari (while ONLINE, first time only, so the
   libraries cache) > Share > Add to Home Screen. Launch from the icon.
   After that it works fully offline.

3. SAVING / SYNC
   Exports, backups and the sync file open the iOS share sheet:
   choose "Save to Files" > iCloud Drive. To sync devices, save the sync
   file to iCloud Drive on one and import it on the other (merge is
   automatic; newer edits win). Do this manually; the PWA cannot read
   iCloud Drive on its own.

4. SAFETY
   Your library lives in the device's browser storage. Save a backup
   file to iCloud Drive regularly. iOS may clear storage for sites not
   used for weeks; the installed app asks for persistent storage, but a
   backup is the real protection.

5. UPDATES
   Re-upload index.html to your host. The app picks it up on next online
   launch. Change VER in sw.js if the libraries ever need re-caching.
