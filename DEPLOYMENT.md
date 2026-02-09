# Tessera Website: Vercel + YouTube Guide

This guide walks you through **deploying the site on Vercel** and **using unlisted YouTube videos** instead of hosting long videos in the repo.

---

## Part 1: Deploy on Vercel

### Step 1 – Sign in to Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in (use **Continue with GitHub**).
2. Authorize Vercel to access your GitHub account if prompted.

### Step 2 – Import the project

1. Click **“Add New…”** → **“Project”** (or **“Import Project”**).
2. Find the **TESSERA** repo (`hari-prasaad-33/TESSERA`).
3. If it’s not listed, click **“Adjust GitHub App Permissions”** and grant Vercel access to that repository.
4. Select the **TESSERA** repo and click **“Import”**.

### Step 3 – Configure the project

Vercel usually detects Vite. Confirm:

| Setting        | Value                    |
|----------------|--------------------------|
| **Framework Preset** | Vite                 |
| **Root Directory**   | `./` (leave default) |
| **Build Command**    | `npm run build`      |
| **Output Directory** | `dist`               |
| **Install Command**  | `npm install`       |

Leave **Environment Variables** empty unless you add some later.

### Step 4 – Deploy

1. Click **“Deploy”**.
2. Wait for the build to finish (typically 1–2 minutes).
3. You’ll get a URL like `https://tessera-xxxx.vercel.app`. Click it to open the site.

### Step 5 – Optional: custom domain

- In the project dashboard, go to **Settings → Domains**.
- Add your domain and follow Vercel’s DNS instructions.

---

## Part 2: Use YouTube (unlisted) for long videos

Using **unlisted** YouTube videos keeps them off search and public listings, but anyone with the link (or your site) can watch. This avoids large video files in the repo and keeps Vercel builds fast.

### Step 1 – Upload to YouTube

1. Go to **[youtube.com](https://www.youtube.com)** and sign in.
2. Click the **camera +** icon (Create) → **Upload video**.
3. Select your file (e.g. `founders-video.mp4`, `tessera-one-demo.mp4`).
4. While it uploads, set:
   - **Title** (e.g. “Tessera – From the Founder”, “Tessera One Demo”).
   - **Visibility**: choose **Unlisted**.
   - **Unlisted** = only people with the link can see it; it won’t appear in search or on your channel.
5. Click **Publish** (or **Save** if you prefer to add more details later).

### Step 2 – Get the video links

1. Open **YouTube Studio** → **[youtube.com/studio](https://studio.youtube.com)**.
2. Go to **Content** and click the video.
3. Copy the **link** (e.g. `https://www.youtube.com/watch?v=abc123XYZ`).

   Or from the share dialog on the video page: **Share** → copy the link. The link format is:

   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - or `https://youtu.be/VIDEO_ID`

You need one link per video (e.g. founder video, demo video).

### Step 3 – Put the links in the code

The site’s `VideoPlayer` supports both **local files** and **YouTube URLs**. To use YouTube, set `src` to the YouTube link.

**Founder video (home page):**

- File: `src/components/FounderVideoSection.jsx`
- Replace the founder video source with your unlisted YouTube link:

```jsx
// Before (local file):
const FOUNDER_VIDEO_SRC = '/videos/founders-video.mp4';

// After (YouTube unlisted) – use your real link:
const FOUNDER_VIDEO_SRC = 'https://www.youtube.com/watch?v=YOUR_FOUNDER_VIDEO_ID';
```

**Demo video (Discover page):**

- File: `src/components/DiscoverPage.jsx`
- Replace the demo video source:

```jsx
// Before (local file):
const DEMO_VIDEO_SRC = '/videos/tessera-one-demo.mp4';

// After (YouTube unlisted):
const DEMO_VIDEO_SRC = 'https://www.youtube.com/watch?v=YOUR_DEMO_VIDEO_ID';
```

Supported URL formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

Save the files, commit, and push. Vercel will redeploy automatically if the repo is connected.

### Step 4 – Optional: remove large videos from the repo

After switching to YouTube and confirming the site works:

1. Delete the video files from `public/videos/` (e.g. `founders-video.mp4`, `tessera-one-demo.mp4`).
2. Keep `README.txt` in `public/videos/` if you use it, or remove it.
3. Commit and push to shrink the repo and speed up clones/builds.

---

## Quick reference

| Task              | Where / What |
|-------------------|--------------|
| Vercel dashboard  | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Redeploy          | Push to the connected branch, or **Deployments** → **Redeploy** |
| Founder video URL | `src/components/FounderVideoSection.jsx` → `FOUNDER_VIDEO_SRC` |
| Demo video URL    | `src/components/DiscoverPage.jsx` → `DEMO_VIDEO_SRC` |
| YouTube visibility| **Unlisted** = link-only, not in search |

If you want, we can next add a small “How to get VIDEO_ID from a watch link” note or a checklist for go-live.
