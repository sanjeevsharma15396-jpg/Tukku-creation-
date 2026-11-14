# TUKKU-CREATION — AI Cartoon Story Video

## Product goal

A user enters a story in Hindi or English and receives a cartoon-story video that can be previewed and saved as MP4. The workflow must be usable from the Android app over the internet, with AI features clearly separated from the final local video assembly.

## User flow

1. Enter a story, choose language, aspect ratio (9:16, 16:9, 1:1), visual style, and target duration.
2. AI turns the story into a scene-by-scene storyboard. Each scene includes narration, character descriptions, image prompt, on-screen caption, and approximate duration.
3. User reviews/edits the storyboard before spending any media-generation credits.
4. Generate one cartoon image per scene using an image-generation provider. Keep character descriptions consistent across scenes; allow regeneration of an individual scene.
5. Generate Hindi/English narration using a text-to-speech provider; allow the user to preview and replace narration.
6. Assemble scene images, gentle pan/zoom motion, captions, narration, and optional royalty-safe background music into an MP4 on the device where feasible. Show progress, allow cancellation, and save/share the finished file.
7. Clearly label AI-generated images/audio and disclose any provider limits or watermark.

## Cost and reliability requirements

- Do not promise unlimited or permanently free AI generations. Provider free quotas, availability, watermarks, and terms can change.
- Start with a low-cost/free-quota mode where available, with explicit daily limits and a visible estimate before generation.
- Never put Gemini or other provider API keys in the APK. All provider calls must go through a secured backend with rate limiting, quotas, abuse protection, and spend caps.
- If image or voice generation is unavailable, preserve the storyboard and let the user retry later; do not claim a video was rendered.
- The existing Gemini integration currently generates text only. It is not an image generator, TTS engine, or MP4 renderer.
- The backend is not deployed, and `EXPO_PUBLIC_TUKKU_API_URL` is not configured in the current preview APK.

## Implementation milestones

### M1 — Storyboard
- Add structured storyboard generation to the backend (JSON scene list).
- Add editable scene list UI and save storyboard to My Projects.
- Validate JSON and handle empty/unsafe output.

### M2 — Cartoon images
- Select and integrate an image-generation provider after checking current pricing, free quota, usage rights, and API availability.
- Generate and cache one image per scene; support per-scene retry and character consistency.

### M3 — Narration and sound
- Integrate TTS with Hindi voice support and user preview.
- Add optional licensed/royalty-safe music selection and volume controls.

### M4 — MP4 assembly
- Add Android-compatible media assembly/export with progress, cancellation, storage permission handling, and MP4 validation.
- Test short vertical videos on low-memory Android devices.

### M5 — Release readiness
- Add AI disclosures, content moderation/reporting, privacy disclosures, deletion controls, and provider cost limits.
- Run real-device tests before marking the feature complete.

## Acceptance criteria

A release is not considered complete until a user can enter a story, review generated scenes, see actual generated cartoon image files, hear generated narration, preview the composed video, and save a playable MP4. Text-only output or a storyboard is not a completed cartoon video.
