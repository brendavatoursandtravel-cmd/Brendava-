# Detailed Setup Guide — Brendava Tours App

## 1. Firebase

1. Go to https://console.firebase.google.com → Create project “Brendava Tours”.
2. Add an **Web** app (you can also add Android/iOS later).
3. Copy the config object into `src/services/firebase.ts`.
4. Authentication → Sign-in method → enable **Email/Password**.
5. Firestore Database → Create database (start in production mode).
6. Firestore → Rules → paste the contents of `firestore.rules` → Publish.
7. (Optional) Create composite indexes if the console prompts you after first queries.

## 2. Cloudinary

1. Sign up at https://cloudinary.com (free tier is sufficient).
2. Dashboard → copy **Cloud Name**.
3. Settings → Upload → **Add upload preset**:
   - Preset name: `brendava_itineraries`
   - Signing mode: **Unsigned**
   - Folder: `itineraries` (optional)
4. Paste Cloud Name + preset into `src/services/cloudinary.ts`.

## 3. App icons & splash (optional but recommended)

Replace the placeholder files in `/assets`:
- `icon.png` (1024×1024)
- `splash.png`
- `adaptive-icon.png`
- `favicon.png`

Use the deep forest green `#1a4d2e` as brand colour.

## 4. GitHub

```bash
git init
git add .
git commit -m "Initial commit: Brendava Tours & Travel mobile app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brendava-tours-app.git
git push -u origin main
```

## 5. Linking to the website

On https://www.brendavatoursandtravel.com you can add:

- “Download our App” buttons linking to Google Play / App Store once published.
- Or host the web build as a PWA under a subdomain (e.g. `app.brendavatoursandtravel.com`).

```bash
npx expo export --platform web
# Upload the `dist` folder to any static host or Firebase Hosting
```

## 6. Environment variables (recommended for production)

Create a `.env` file (never commit it):

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

Then read them with `process.env.EXPO_PUBLIC_...` instead of hard-coding.
