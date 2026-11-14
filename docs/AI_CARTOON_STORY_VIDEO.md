# TUKKU-CREATION — User-supplied images to MP4 video

## Confirmed product scope

The user will create or obtain the cartoon images separately and upload/select them in TUKKU-CREATION. The app's primary job is to turn those supplied images into a finished, playable MP4 video. Do not require an AI image-generation provider for this workflow.

## Android workflow

1. Select multiple images from the phone gallery.
2. Reorder images into the story sequence; remove or replace individual images.
3. Choose video format: vertical 9:16, landscape 16:9, or square 1:1.
4. Set duration per image or apply one duration to all images.
5. Add visual motion to still images (pan, zoom in/out, gentle Ken Burns-style movement).
6. Choose transitions between images (cut, fade, dissolve, slide).
7. Add optional title, captions/subtitles, and end card.
8. Add a user's own narration/audio file and optional background music; provide volume controls and audio fade in/out.
9. Preview the timeline and total duration.
10. Render a real MP4 file on the Android device, show progress, allow cancellation, and save/share the output.

## AI role

AI is optional and not required to render the video. If the existing Gemini backend is connected later, it may help draft captions, scene order, or narration text from a story. It must not block manual image-to-video creation.

## Cost and reliability requirements

- Prioritize a no-paid-API workflow: image selection, transitions, motion, captions, and local MP4 export should not call an AI media-generation API.
- Be transparent about any optional provider or service that has costs or usage limits.
- Never put provider API keys in the APK.
- Preserve the user's project and selected images if export fails; show a useful error and allow retry.
- Do not show a "video generated" success state until a playable MP4 file has actually been created and saved.
- The current app's Gemini integration returns text only. It does not currently render MP4 files.
- The Gemini backend is not deployed, and `EXPO_PUBLIC_TUKKU_API_URL` is not configured in the current preview APK.

## Implementation milestones

### M1 — Image timeline UI
- Add multi-image picker and permission handling.
- Add reorder/remove controls, per-image duration, aspect ratio, and project persistence.
- Add preview of the ordered image sequence.

### M2 — Motion and overlays
- Add pan/zoom presets and transitions.
- Add title/captions/end card and safe-area positioning for vertical video.
- Add audio file selection, narration/music tracks, volume, and fades.

### M3 — MP4 rendering
- Choose a maintained Android-compatible rendering approach compatible with the project's Expo SDK / native build.
- Render actual MP4 with selected images, timing, motion, overlays, transitions, and audio.
- Show render progress, cancellation, storage handling, and clear errors.
- Verify exported files play in Android gallery and can be shared.

### M4 — Optional AI assistance
- Once backend hosting is configured, optionally use Gemini for story-to-scene suggestions or caption/narration drafts.
- Keep manual editing and video export usable even when AI or internet is unavailable.

### M5 — Release readiness
- Test on real Android devices, including low-memory devices and long image sequences.
- Add privacy disclosures for user media, deletion controls, and clear export limitations.
- Do not claim the feature is complete until a real MP4 has been generated and played successfully on-device.

## Acceptance criteria

A user can select their own cartoon images, arrange them, set timing and motion, add audio and captions, preview the result, export a playable MP4, and find/share that file from the phone. AI image generation is not part of this required workflow.
