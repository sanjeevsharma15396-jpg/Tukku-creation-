import Constants from 'expo-constants';
import { AIToolId, AppLanguage } from '../types';

const API_URL =
  Constants.expoConfig?.extra?.tukkuApiUrl ||
  process.env.EXPO_PUBLIC_TUKKU_API_URL ||
  '';

export const isAiServerConfigured = Boolean(API_URL);

export async function generateWithGemini(input: {
  toolId: AIToolId;
  prompt: string;
  language: AppLanguage;
  context?: Record<string, string>;
}): Promise<string> {
  if (!API_URL) {
    throw new Error('AI_SERVER_NOT_CONFIGURED');
  }
  const response = await fetch(`${String(API_URL).replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `AI request failed (${response.status})`);
  }
  if (typeof payload.text !== 'string' || !payload.text.trim()) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }
  return payload.text.trim();
}

/**
 * Free offline helper. This creates an editable production worksheet on-device;
 * it is deliberately not presented as AI-generated story/media.
 */
export function generateOfflineDraft(input: {
  toolId: AIToolId;
  prompt: string;
  language: AppLanguage;
  context?: Record<string, string>;
}): string {
  const hi = input.language === 'hi';
  const brief = input.prompt.trim();
  const context = Object.entries(input.context ?? {})
    .map(([key, value]) => `• ${key}: ${value}`)
    .join('\n');
  const labels: Record<string, { title: string; steps: string[] }> = {
    'story-generator': {
      title: hi ? 'कहानी बनाने की रूपरेखा' : 'Story-building outline',
      steps: hi
        ? ['शुरुआत: मुख्य किरदार और उसकी इच्छा दिखाएँ।', 'समस्या: ऐसी मुश्किल लाएँ जिससे किरदार को संघर्ष करना पड़े।', 'कोशिश: किरदार 2–3 अलग तरीके आज़माए।', 'भावनात्मक मोड़: कोई मदद, त्याग या नया सच सामने आए।', 'अंत: समस्या का संतोषजनक समाधान और सीख दें।']
        : ['Opening: introduce the main character and their goal.', 'Conflict: create a clear obstacle.', 'Attempts: show 2–3 attempts to solve it.', 'Emotional turn: reveal help, sacrifice, or a new truth.', 'Ending: resolve the conflict and land a memorable takeaway.'],
    },
    'image-generator': {
      title: hi ? 'इमेज प्रॉम्प्ट वर्कशीट' : 'Image prompt worksheet',
      steps: hi
        ? ['किरदार/विषय और उसकी पहचान तय करें।', 'चेहरे के भाव, कपड़े और शरीर की बनावट लिखें।', 'लोकेशन, समय, रोशनी और रंग चुनें।', 'कैमरा एंगल और फ्रेमिंग तय करें।', 'हर सीन में वही character description दोहराएँ।']
        : ['Define the subject and identity.', 'Specify expression, clothing, and proportions.', 'Choose location, time, lighting, and palette.', 'Set camera angle and framing.', 'Reuse the same character description across scenes.'],
    },
    'video-generator': {
      title: hi ? 'वीडियो सीन प्लान' : 'Video scene plan',
      steps: hi
        ? ['सीन 1: 3–5 सेकंड का मजबूत हुक।', 'सीन 2: जगह और किरदार स्थापित करें।', 'सीन 3: मुख्य एक्शन और संवाद।', 'सीन 4: भावनात्मक/मजेदार मोड़।', 'सीन 5: निष्कर्ष और दर्शकों के लिए CTA।']
        : ['Scene 1: a strong 3–5 second hook.', 'Scene 2: establish location and characters.', 'Scene 3: deliver the main action and dialogue.', 'Scene 4: add an emotional or funny twist.', 'Scene 5: conclude and add a viewer CTA.'],
    },
    'voice-studio': {
      title: hi ? 'वॉइस रिकॉर्डिंग स्क्रिप्ट प्लान' : 'Voice recording script plan',
      steps: hi
        ? ['पहली लाइन साफ़ और आकर्षक बोलें।', 'लंबे वाक्यों को छोटे हिस्सों में बाँटें।', 'भावनात्मक शब्दों पर हल्का जोर दें।', 'हर संवाद के बाद स्वाभाविक विराम रखें।', 'रिकॉर्डिंग सुनकर शोर और वॉल्यूम जाँचें।']
        : ['Open with a clear, engaging first line.', 'Break long sentences into short phrases.', 'Emphasize key emotional words naturally.', 'Leave a natural pause after each line.', 'Review the recording for noise and volume.'],
    },
    'cartoon-studio': {
      title: hi ? 'कार्टून एपिसोड प्लान' : 'Cartoon episode plan',
      steps: hi
        ? ['किरदारों की उम्र, रूप, कपड़े और आवाज़ तय करें।', 'हर किरदार का स्वभाव और बोलने का तरीका लिखें।', 'सीन के हिसाब से एक्शन और संवाद बाँटें।', 'हर सीन में किरदार का रूप एक जैसा रखें।', 'अंत में मजेदार या भावुक payoff दें।']
        : ['Define each character’s look, clothing, and voice.', 'Give every character a distinct personality.', 'Assign actions and dialogue scene by scene.', 'Keep character appearance consistent.', 'End with a funny or emotional payoff.'],
    },
    'youtube-studio': {
      title: hi ? 'YouTube वीडियो प्लान' : 'YouTube video plan',
      steps: hi
        ? ['पहले 5 सेकंड में दर्शक का ध्यान खींचें।', 'वीडियो का वादा साफ़ बताएँ।', 'हर 20–30 सेकंड में नया दृश्य या जानकारी दें।', 'बीच में अनावश्यक दोहराव हटाएँ।', 'अंत में छोटा और स्पष्ट CTA रखें।']
        : ['Hook viewers in the first 5 seconds.', 'State the video promise clearly.', 'Add a new visual or idea every 20–30 seconds.', 'Remove repetition and slow sections.', 'Finish with a short, clear CTA.'],
    },
    'video-editor': {
      title: hi ? 'एडिटिंग चेकलिस्ट' : 'Editing checklist',
      steps: hi
        ? ['सीन को कहानी के क्रम में रखें।', 'खाली विराम और गलत टेक हटाएँ।', 'संवाद के अनुसार subtitles जोड़ें।', 'Background music को आवाज़ से धीमा रखें।', 'Export से पहले पूरा वीडियो देखकर जाँचें।']
        : ['Arrange scenes in story order.', 'Remove dead air and bad takes.', 'Add subtitles synced to dialogue.', 'Keep background music below the voice.', 'Watch the full export before publishing.'],
    },
  };
  const item = labels[input.toolId] ?? labels['story-generator'];
  const heading = hi ? 'आपका विषय' : 'Your brief';
  const instruction = hi
    ? 'यह Free Offline Mode की editable रूपरेखा है, AI से बना अंतिम कंटेंट नहीं। हर बिंदु को अपने हिसाब से पूरा करें।'
    : 'This is an editable Free Offline Mode outline, not AI-generated final content. Expand each step in your own words.';
  return `${item.title}\n\n${heading}:\n${brief}\n\n${context ? (hi ? 'सेटिंग्स:' : 'Settings:') + '\n' + context + '\n\n' : ''}${hi ? 'अगले कदम:' : 'Next steps:'}\n${item.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n${instruction}`;
}
