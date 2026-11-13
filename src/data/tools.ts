import { AIToolItem } from '../types/app';

export const AI_TOOLS: AIToolItem[] = [
  {
    id: 'story-generator',
    category: 'writing',
    gradientClass: 'from-violet-700 to-purple-600',
    title: {
      hi: 'AI स्टोरी जनरेटर',
      en: 'AI Story Generator',
    },
    shortLabel: {
      hi: 'स्टोरी',
      en: 'Story',
    },
    description: {
      hi: 'कहानी की रूपरेखा, संवाद और स्क्रिप्ट ड्राफ्ट तैयार करें।',
      en: 'Organize story outlines, dialogues, and narrative script drafts.',
    },
    phaseOneNote: {
      hi: 'चरण 1 में आपका स्टोरी प्रॉम्प्ट स्थानीय रूप से सहेजा जाता है।',
      en: 'In Phase 1, your story prompt and script brief are saved locally.',
    },
  },
  {
    id: 'image-generator',
    category: 'visual',
    gradientClass: 'from-violet-600 to-fuchsia-600',
    title: {
      hi: 'AI इमेज जनरेटर',
      en: 'AI Image Generator',
    },
    shortLabel: {
      hi: 'इमेज',
      en: 'Image',
    },
    description: {
      hi: 'विज़ुअल कॉन्सेप्ट, थंबनेल आइडिया और आर्ट प्रॉम्प्ट सेव करें।',
      en: 'Draft visual art concepts, scene prompts, and thumbnail briefs.',
    },
    phaseOneNote: {
      hi: 'चरण 1 में इमेज प्रॉम्प्ट और स्टाइल नोट्स सुरक्षित रहते हैं।',
      en: 'In Phase 1, image prompts and visual style notes are stored locally.',
    },
  },
  {
    id: 'video-generator',
    category: 'audio-video',
    gradientClass: 'from-purple-800 to-violet-600',
    title: {
      hi: 'AI वीडियो जनरेटर',
      en: 'AI Video Generator',
    },
    shortLabel: {
      hi: 'वीडियो',
      en: 'Video',
    },
    description: {
      hi: 'शॉर्ट्स और रील्स के लिए दृश्य-दर-दृश्य वीडियो प्रॉम्प्ट लिखें।',
      en: 'Plan scene-by-scene video briefs for shorts and reels.',
    },
    phaseOneNote: {
      hi: 'चरण 2 में वीडियो इंजन जुड़ने के लिए ड्राफ्ट तैयार रखें।',
      en: 'Keep video scene briefs ready for Phase 2 generation engine.',
    },
  },
  {
    id: 'voice-studio',
    category: 'audio-video',
    gradientClass: 'from-purple-700 to-purple-500',
    title: {
      hi: 'AI वॉइस स्टूडियो',
      en: 'AI Voice Studio',
    },
    shortLabel: {
      hi: 'वॉइस',
      en: 'Voice',
    },
    description: {
      hi: 'हिन्दी और अंग्रेज़ी वॉइसओवर स्क्रिप्ट और टोन तैयार करें।',
      en: 'Prepare Hindi and English voiceover scripts and narration cues.',
    },
    phaseOneNote: {
      hi: 'चरण 1 में वॉइस स्क्रिप्ट और उच्चारण नोट्स सेव किए जाते हैं।',
      en: 'Voice narration scripts and tone notes are saved locally in Phase 1.',
    },
  },
  {
    id: 'cartoon-studio',
    category: 'visual',
    gradientClass: 'from-violet-700 to-purple-500',
    title: {
      hi: 'कार्टून स्टूडियो',
      en: 'Cartoon Studio',
    },
    shortLabel: {
      hi: 'कार्टून',
      en: 'Cartoon',
    },
    description: {
      hi: 'किरदार, एनीमेशन सीन और बच्चों की कहानियों के आइडिया बनाएं।',
      en: 'Design character concepts, animated scenes, and storyboards.',
    },
    phaseOneNote: {
      hi: 'किरदार और स्टोरीबोर्ड प्रॉम्प्ट स्थानीय प्रोजेक्ट में जुड़ते हैं।',
      en: 'Character sheets and storyboard briefs save directly to My Projects.',
    },
  },
  {
    id: 'youtube-studio',
    category: 'writing',
    gradientClass: 'from-purple-900 to-purple-600',
    title: {
      hi: 'यूट्यूब क्रिएटर स्टूडियो',
      en: 'YouTube Creator Studio',
    },
    shortLabel: {
      hi: 'यूट्यूब',
      en: 'YouTube',
    },
    description: {
      hi: 'वीडियो टाइटल, हुक, विवरण और कंटेंट प्लान व्यवस्थित करें।',
      en: 'Plan video titles, hooks, descriptions, and upload outlines.',
    },
    phaseOneNote: {
      hi: 'अपने सभी चैनल कंटेंट प्लान एक निजी स्थान पर संभालें।',
      en: 'Organize channel hooks, scripts, and outlines locally.',
    },
  },
  {
    id: 'video-editor',
    category: 'audio-video',
    gradientClass: 'from-purple-950 to-violet-600',
    title: {
      hi: 'वीडियो एडिटर',
      en: 'Video Editor',
    },
    shortLabel: {
      hi: 'एडिटर',
      en: 'Editor',
    },
    description: {
      hi: 'कट पॉइंट्स, कैप्शन नोट्स और एडिटिंग टाइमलाइन चेकलिस्ट बनाएं।',
      en: 'Track cut timestamps, caption scripts, and editing checklists.',
    },
    phaseOneNote: {
      hi: 'एडिटिंग प्लान और टाइमलाइन नोट्स स्थानीय मेमोरी में रहते हैं।',
      en: 'Editing notes and cut checklists persist in local device storage.',
    },
  },
];
