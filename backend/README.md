# TUKKU-CREATION Gemini API

The mobile app calls this server; the Gemini API key stays on the server and is never bundled into the APK.

## Deploy to Google Cloud Run

1. Create a Gemini API key in Google AI Studio.
2. Create/select a Google Cloud project and enable Cloud Run + Artifact Registry.
3. From this folder, deploy the service:

```bash
gcloud run deploy tukku-creation-ai \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
``

Create the Secret Manager secret named `GEMINI_API_KEY` first and grant the Cloud Run service identity access to it. For production, add rate limiting/authentication and restrict ALLOWED_ORIGINS to the app's web origins if applicable.

## Configure the Android app

Build with the Cloud Run HTTPS URL:

```bash
cd mobile
EXPO_PUBLIC_TUKKU_API_URL=https://YOUR-CLOUD-RUN-URL npx eas-cli build --platform android --profile preview
``

The key is not placed in the app. The API currently generates text deliverables for all seven studios. Image-file, rendered-video, and synthesized-audio output require their dedicated Gemini media workflows and should be enabled as a separate phase rather than being represented as completed by a text response.
