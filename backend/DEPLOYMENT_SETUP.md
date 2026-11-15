# TUKKU-CREATION backend deployment

The mobile app's Gemini text generation needs a reachable HTTPS backend. The Gemini key must stay on the server and must never be placed in the APK.

## One-time Google Cloud setup

1. Create or select a Google Cloud project.
2. Enable billing for that project. Cloud Run may have a free usage allowance, but billing setup is still generally required and usage beyond allowances can cost money.
3. Create a service account for GitHub Actions with permissions to deploy Cloud Run services, build source, enable APIs, and act as the Cloud Run runtime service account. Grant the runtime service account permission to access the Gemini key if using Secret Manager.
4. Add these GitHub repository Actions secrets:
   - `GCP_PROJECT_ID`: Google Cloud project ID.
   - `GCP_SA_KEY`: service-account JSON key.
   - `GEMINI_API_KEY`: Gemini API key (the existing key can be reused).
   - `EXPO_TOKEN`: already used by the Android APK workflow.

## Deploy

Open GitHub → Actions → **Deploy TUKKU-CREATION AI Backend** → Run workflow. The workflow deploys `backend/` to Cloud Run in `asia-south1` and checks `/health`.

The successful run summary shows the HTTPS backend URL. Add that URL as an EAS environment variable named `EXPO_PUBLIC_TUKKU_API_URL` for the `preview` environment, then run the Android APK workflow again. Do not put the Gemini API key in an Expo/EAS variable or in the app.

## Cost and safety

Cloud Run, Cloud Build, Artifact Registry, and Gemini API may incur charges. Set Google Cloud budgets/alerts before enabling use. The API is currently text-only; a successful health check does not mean image generation, video generation, voice synthesis, or MP4 export are implemented.
