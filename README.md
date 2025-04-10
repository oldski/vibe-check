# 🎧 Vibe Check

A mood-tracking app that lets you log your daily vibe — inspired by the warmth of a temperature quilt, but driven by emotion, music, and memory.

## 🧠 Concept

Each day, you log a vibe:
- Select an **emotion**
- Add a short **message** (think tweet-style reflection)
- Optionally upload an **image or video**
- Drop in a **Spotify link** to capture the mood
- Save the vibe for that day

All vibes are visualized in a colorful grid — a growing quilt of feeling.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com/) (Postgres, RLS policies, auth, file storage)
- **Styling**: Tailwind CSS + Custom Color Mapping
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth
- **Storage**: Supabase Buckets for media uploads
- **Data Security**: Row-Level Security (RLS) for all user-specific content

---

## ✨ Features

- 🔐 **Secure Auth & Profile Linking**
- 🧵 **Daily Vibe Check-ins**
- 🎨 **Emotion-Based Color Palette**
- 🎵 **Music Embeds from Spotify**
- 🖼️ **Optional Media Upload (image/video)**
- 🔁 **Full CRUD (add/edit/delete) support**
- 🧊 **Visual Mood Grid**
- 🌗 **Light/Dark Theme Support**
- 📅 **Date-based vibe logging**
- 🚀 **Optimistic UI and seamless modal routing**

---

## 🧱 Components Overview

- `VibeGrid`: displays all vibes in a responsive grid
- `VibeForm`: enter/edit a vibe (add/edit/view mode)
- `VibeModal`: fullscreen modal for displaying or editing a vibe
- `VibeModalWrapper`: client component that manages form state + routing
- `MotionLink`: animated link transitions
- `utils/`: various helpers for working with Supabase, dates, and vibe styling

---

## 🚧 Roadmap

### 🔜 Near Future
- [ ] ✨ Optimistic UI updates for add/edit/delete
- [ ] 🧼 Form/Modal refactor for cleaner code separation
- [ ] 🔒 Protected onboarding page for profile creation
- [ ] 📅 Filter vibes by date range or emotion
- [ ] 🧵 Custom vibe frequency insights

### 💡 Future Features
- 🤖 **AI-powered playlist recommendations** based on overall vibe
- 🎧 Integrate with **Spotify, YouTube, or Apple Music**
- 📲 **Mobile app version** via React Native or Expo
- 🛸 Export/share your quilt of emotion

