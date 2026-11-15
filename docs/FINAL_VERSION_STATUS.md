# TUKKU-CREATION — Integrated Final Version status

Last reviewed: 15 November 2026

## Release principles

- Free-first and offline-first wherever practical.
- No paid provider, hosting, subscription, billing account, or paid API may be enabled without the owner's explicit approval.
- Never put AI provider secrets in the Android app.
- Never label a prompt, storyboard, or timeline as a generated image/video/audio file.
- The final release is one integrated Android app. Development may be incremental, but the release APK must be tested as one complete build.
- Prefer local processing for image sequencing, motion, captions, voice tracks, and MP4 export.

## Current verified implementation

| Area | Current state |
|---|---|
| Android app foundation | Expo SDK 52 / React Native 0.76 app |
| Seven creative studios | Story, image prompt, video prompt, voice, cartoon, YouTube, video editor screens exist |
| Project storage | Local project drafts and preferences via AsyncStorage |
| Offline assistant | Editable production outlines; not true AI generation |
| Gemini text service | Client/backend code exists; backend is not deployed and app URL is not configured |
| Daily AI counter | Local AsyncStorage counter, 10 per day; UX limit only, not secure/server-enforced |
| Gallery images | Multi-image selection, up to 30 images per selection, reorder/remove, duration and aspect ratio |
| Phone TTS | Android system Text-to-Speech preview for Hindi/English; requires installed phone voice |
| MP4 export | Not implemented |
| In-app voice recording | Not implemented |
| Audio tracks/music/subtitles/transitions | Not implemented as a rendered timeline |
| AI image/video generation | Not integrated |
| Premium/subscription | Not implemented; no payment or billing should be activated |

## Integrated final acceptance checklist

### A. Core app
- [ ] App starts reliably on a real Android phone.
- [ ] All seven studios navigate correctly and save/reopen projects.
- [ ] Hindi and English UI/output work consistently.
- [ ] No broken controls, placeholder-only claims, or data loss on restart.

### B. Story and character workflow
- [ ] Story generator creates a complete story when a free AI endpoint is configured; offline outline remains available without network.
- [ ] Story can be split into scenes with dialogue, action, image prompts, and video prompts.
- [ ] Character profiles store appearance, clothing, voice notes, and reference image paths.
- [ ] Scene prompts reuse the selected character profiles consistently.

### C. Images and video
- [ ] Gallery selections are copied into app-managed persistent storage.
- [ ] Scene order, duration, crop, motion preset, and transition are editable.
- [ ] 9:16, 16:9, and 1:1 preview/export layouts work.
- [ ] Any AI media provider remains disabled until separately approved and priced.
- [ ] A rendered file is playable MP4, not a prompt or timeline placeholder.

### D. Voice and audio
- [ ] Hindi/English phone TTS preview works when Android voices are installed.
- [ ] In-app voice recording saves a local audio file.
- [ ] User can attach narration and background music, adjust levels, and preview sync.
- [ ] Captions/subtitles can be edited and rendered into the video.

### E. Export
- [ ] Local Android MP4 renderer handles images, timing, motion, transitions, overlays, and audio.
- [ ] Export has progress, cancellation, failure recovery, and storage checks.
- [ ] Output is verified in Android gallery and share sheet.
- [ ] A long 5–10 minute project is tested on a real phone for memory and performance.

### F. Privacy, limits, and cost safety
- [ ] No provider key is embedded in APK.
- [ ] AI requests show which service is being used and its quota/estimated cost.
- [ ] Paid operations are off by default and require an explicit confirmation immediately before use.
- [ ] Monthly spending cap is enforced server-side before any paid integration is enabled.
- [ ] User media remains local unless a clearly disclosed upload is requested.
- [ ] Project/media deletion controls are available.

### G. Release
- [ ] TypeScript and Expo config checks pass.
- [ ] Full Android build succeeds.
- [ ] APK installed and tested on a physical Android phone.
- [ ] Final release is one integrated, versioned APK.

## Build quota protection

The GitHub Actions workflow now runs free TypeScript and Expo config checks on pushes. An APK build only runs when a maintainer manually starts the workflow and explicitly sets `build_apk=true`. This avoids accidentally consuming the account's monthly Expo Android build quota while features are still under development.

## Known blockers

1. Expo's Android free build quota was exhausted at the last recorded build attempt (15 Nov 2026); that attempt failed after upload, not because of TypeScript. The workflow now avoids automatic APK builds.
2. The existing Gemini server is not deployed and no API URL is configured in the mobile app.
3. A local MP4 rendering approach compatible with this app's Expo/native setup still needs to be selected and implemented.
4. Recording, persistent media asset copying, subtitle/audio timeline, and real MP4 export remain to be implemented.
5. AI image/video generation and paid subscription are intentionally not enabled.

## Delivery rule

Do not call TUKKU-CREATION "Final" or hand over a release APK until the integrated acceptance checklist above is completed and a real APK has been installed and tested.