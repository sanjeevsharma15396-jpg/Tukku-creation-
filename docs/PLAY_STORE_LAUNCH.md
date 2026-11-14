# TUKKU-CREATION — Play Store launch and monetization plan

This document tracks the work required before public launch. It deliberately distinguishes implemented functionality from planned integrations.

## Current verified state

- Android preview APK build completed successfully on 2026-11-14.
- EAS build: https://expo.dev/accounts/sanjeev1996/projects/tukku-creation/builds/411c99c8-e92a-48c9-b635-34a26978c63b
- Gemini backend source exists under `backend/`, but the service has not yet been deployed to Cloud Run.
- The mobile AI panel currently returns and saves text. Real image-file generation, rendered video export, and synthesized audio are not yet implemented.
- AdMob and Google Play Billing are not yet integrated. No real ads or purchases should be shown or charged until those integrations are configured and tested.

## Monetization approach

Use a freemium model with two complementary revenue streams:

1. AdMob ads for eligible free-tier users.
2. Google Play Billing subscriptions for Pro/Premium entitlements.

Proposed initial price hypotheses (not live products; validate AI cost and user demand first):
- Free: limited daily credits, ads.
- Pro: ₹199/month, higher monthly credit allowance, fewer/no ads.
- Premium: ₹499/month, larger allowance and priority processing.

Do not promise unlimited generations. Set per-tool credit costs and monthly caps using measured Gemini/media-provider costs, Play fees, taxes, and a safety margin. Keep subscription benefits recurring and clearly disclose price, billing period, auto-renewal, cancellation and trial terms.

## Required accounts and secrets

### Google Play Console
- Create a developer account using the correct legal account type (Personal for an individual; Organization for a registered business).
- Complete identity verification and device verification if requested.
- Current registration fee: US$25 one-time (payment methods vary by country).
- Personal accounts created after 2023-11-13 must complete the required closed test: at least 12 testers opted in continuously for 14 days before applying for production access.
- Create the app entry, complete store listing, Data safety, App access, Ads declaration, content rating, target audience, privacy policy, and app-content declarations.

Official references:
- https://support.google.com/googleplay/android-developer/answer/6112435
- https://support.google.com/googleplay/android-developer/answer/14151465

### Google AdMob
- Create/verify an AdMob account and add the Android app.
- Obtain the AdMob App ID and separate ad-unit IDs (banner/interstitial/rewarded only where appropriate).
- Configure consent/privacy messaging and test ads first. Never ship test IDs as production ads.
- Declare ads accurately in Play Console.

### Google Play Billing
- Create subscription products in Play Console only after the developer account and app are ready.
- Integrate Play Billing, verify purchase tokens on a trusted backend, grant/revoke entitlements server-side, and handle renewals, cancellations, grace periods, refunds and acknowledgement.
- Do not unlock paid features based only on a client-side flag.
- Digital subscriptions and credits sold in a Play-distributed app must follow Google Play's billing policy unless an applicable exception/program applies.

Official references:
- https://support.google.com/googleplay/android-developer/answer/9858738
- https://support.google.com/googleplay/android-developer/answer/10281818

## AI safety and user trust

Before public release:
- Add in-app reporting/flagging for AI outputs and a monitored support channel.
- Add server-side prompt/output safety checks and rate limits.
- Prevent prohibited content, especially child exploitation/abuse, non-consensual sexual deepfakes, scams, harassment and deceptive content.
- Publish a privacy policy describing prompts, generated content, retention, processors, deletion and support contact.
- Clearly label AI-generated output and avoid implying that text generation has produced an image/video/audio file.

Official references:
- https://support.google.com/googleplay/android-developer/answer/13985936
- https://support.google.com/googleplay/android-developer/answer/14094294

## Launch sequence

1. Deploy the Gemini backend to Cloud Run with the Gemini key stored in Google Secret Manager (not in the APK or source repository).
2. Set the EAS preview/production environment variable `EXPO_PUBLIC_TUKKU_API_URL` to the deployed HTTPS backend URL and rebuild.
3. Test every tool on real Android devices; verify output quality, failure states, persistence, network behavior and cost controls.
4. Implement actual image, video and voice generation providers and export flows; do not mark these complete until files can be created, previewed and saved.
5. Integrate AdMob and Play Billing after the owner supplies the required account IDs and products.
6. Complete privacy, AI reporting/moderation, store listing and Play Console declarations.
7. Run internal testing, then the required closed test if applicable, fix feedback, apply for production access and submit for review.

## Owner inputs needed when ready

- Play Console developer account created and account type selected.
- AdMob account and Android App ID/ad-unit IDs.
- Support email and public privacy-policy URL.
- Confirmation of final subscription prices and included credit allowances.
- Google Cloud project with Cloud Run and Secret Manager configured.

Never share API keys, access tokens, signing keys or billing credentials in chat or commit them to Git.
