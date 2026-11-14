import { AppLanguage } from '../types';

export interface TranslationSchema {
  appName: string;
  tagline: string;
  splashSubtext: string;
  enterStudio: string;
  common: {
    back: string;
    loading: string;
    loadingProjects: string;
    saving: string;
    retry: string;
    storageErrorTitle: string;
    storageErrorBody: string;
    viewInProjects: string;
    refresh: string;
    phaseOneTag: string;
  };
  tabs: {
    home: string;
    create: string;
    projects: string;
    tools: string;
    settings: string;
  };
  home: {
    personalBadge: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    promptLabel: string;
    promptPlaceholder: string;
    generateButton: string;
    promptRequired: string;
    recentProjectsTitle: string;
    viewAll: string;
    noRecentProjects: string;
    toolsGridTitle: string;
    toolsGridSubtitle: string;
  };
  create: {
    headerTitle: string;
    headerSubtitle: string;
    phaseNoticeTitle: string;
    phaseNoticeBody: string;
    selectToolLabel: string;
    projectTitleLabel: string;
    projectTitlePlaceholder: string;
    promptLabel: string;
    promptPlaceholder: string;
    outputLanguageLabel: string;
    saveButton: string;
    updateButton: string;
    savedToast: string;
    clearDraft: string;
    validationError: string;
    openDedicatedTool: string;
  };
  projects: {
    headerTitle: string;
    headerSubtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    placeholderTag: string;
    draftTag: string;
    emptyTitle: string;
    emptyBody: string;
    emptySearchTitle: string;
    emptySearchBody: string;
    resetSearch: string;
    createNew: string;
    restorePlaceholders: string;
    openInCreate: string;
    deleteProject: string;
    confirmDeleteTitle: string;
    confirmDeleteBody: string;
    cancel: string;
    confirm: string;
  };
  tools: {
    headerTitle: string;
    headerSubtitle: string;
    categories: {
      all: string;
      writing: string;
      visual: string;
      audioVideo: string;
    };
    openTool: string;
    phase1Label: string;
  };
  toolScreens: {
    story: {
      genreLabel: string;
      genres: string[];
      toneLabel: string;
      tones: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    image: {
      styleLabel: string;
      styles: string[];
      ratioLabel: string;
      ratios: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    video: {
      formatLabel: string;
      formats: string[];
      durationLabel: string;
      durations: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    voice: {
      voiceProfileLabel: string;
      profiles: string[];
      paceLabel: string;
      paces: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    cartoon: {
      characterLabel: string;
      characterPlaceholder: string;
      styleLabel: string;
      styles: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    youtube: {
      formatLabel: string;
      formats: string[];
      hookLabel: string;
      hookPlaceholder: string;
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
    editor: {
      ratioLabel: string;
      ratios: string[];
      checklistLabel: string;
      checklistItems: string[];
      titlePlaceholder: string;
      promptPlaceholder: string;
    };
  };
  settings: {
    headerTitle: string;
    headerSubtitle: string;
    languageSection: string;
    languageTitle: string;
    languageDesc: string;
    hindiOption: string;
    englishOption: string;
    themeSection: string;
    themeTitle: string;
    themeDesc: string;
    themeObsidian: string;
    themeAmethyst: string;
    preferencesSection: string;
    autoSaveTitle: string;
    autoSaveDesc: string;
    placeholdersTitle: string;
    placeholdersDesc: string;
    defaultOutputTitle: string;
    replaySplashTitle: string;
    replaySplashDesc: string;
    replaySplashAction: string;
    clearStorageTitle: string;
    clearStorageDesc: string;
    clearStorageAction: string;
    confirmClearTitle: string;
    confirmClearBody: string;
    appInfoSection: string;
    appNameLabel: string;
    packageLabel: string;
    platformLabel: string;
    usageLabel: string;
    usageValue: string;
    phaseLabel: string;
    phaseValue: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationSchema> = {
  hi: {
    appName: 'TUKKU-CREATION',
    tagline: 'Create Your Imagination with AI',
    splashSubtext: 'आपका व्यक्तिगत AI क्रिएटिव स्टूडियो',
    enterStudio: 'स्टूडियो खोलें',
    common: {
      back: 'वापस',
      loading: 'लोड हो रहा है...',
      loadingProjects: 'स्थानीय प्रोजेक्ट्स लोड हो रहे हैं...',
      saving: 'सेव हो रहा है...',
      retry: 'पुनः प्रयास करें',
      storageErrorTitle: 'स्टोरेज लोड करने में समस्या',
      storageErrorBody: 'स्थानीय डेटा पढ़ते या सहेजते समय त्रुटि हुई। कृपया पुनः प्रयास करें।',
      viewInProjects: 'मेरे प्रोजेक्ट्स में देखें',
      refresh: 'रिफ्रेश',
      phaseOneTag: 'Gemini AI · टेक्स्ट जनरेशन',
    },
    tabs: {
      home: 'होम',
      create: 'बनाएं',
      projects: 'मेरे प्रोजेक्ट्स',
      tools: 'AI टूल्स',
      settings: 'सेटिंग्स',
    },
    home: {
      personalBadge: 'व्यक्तिगत स्टूडियो · Android',
      welcomeTitle: 'नमस्ते, क्रिएटर',
      welcomeSubtitle: 'आज आप क्या कल्पना करना और संवारना चाहते हैं?',
      promptLabel: 'AI प्रॉम्प्ट लिखें',
      promptPlaceholder: 'अपना आइडिया, कहानी या वीडियो कॉन्सेप्ट यहाँ लिखें...',
      generateButton: 'ड्राफ्ट तैयार करें',
      promptRequired: 'कृपया आगे बढ़ने के लिए अपना प्रॉम्प्ट लिखें।',
      recentProjectsTitle: 'हाल के प्रोजेक्ट्स',
      viewAll: 'सभी देखें',
      noRecentProjects: 'अभी कोई प्रोजेक्ट नहीं है। पहला ड्राफ्ट बनाएं।',
      toolsGridTitle: 'AI क्रिएटिव टूल्स',
      toolsGridSubtitle: '7 समर्पित स्टूडियो मॉड्यूल',
    },
    create: {
      headerTitle: 'क्रिएट स्टूडियो',
      headerSubtitle: 'प्रॉम्प्ट तैयार करें और स्थानीय रूप से सेव करें',
      phaseNoticeTitle: 'Gemini AI · टेक्स्ट जनरेशन',
      phaseNoticeBody:
        'Gemini से टेक्स्ट स्क्रिप्ट, स्टोरी और क्रिएटिव प्लान बनाएं। इमेज, वीडियो और ऑडियो फाइल रेंडरिंग के लिए अलग मीडिया सेवाएं जोड़नी होंगी।',
      selectToolLabel: 'स्टूडियो टूल चुनें',
      projectTitleLabel: 'प्रोजेक्ट शीर्षक',
      projectTitlePlaceholder: 'उदा. हिमालय की रहस्यमयी कहानी',
      promptLabel: 'क्रिएटिव प्रॉम्प्ट',
      promptPlaceholder: 'विस्तार से अपना आइडिया, दृश्य या स्क्रिप्ट निर्देश लिखें...',
      outputLanguageLabel: 'प्रोजेक्ट भाषा',
      saveButton: 'प्रोजेक्ट सेव करें',
      updateButton: 'प्रोजेक्ट अपडेट करें',
      savedToast: 'प्रोजेक्ट "मेरे प्रोजेक्ट्स" में सेव हो गया।',
      clearDraft: 'नया ड्राफ्ट',
      validationError: 'कृपया प्रोजेक्ट शीर्षक या प्रॉम्प्ट भरें।',
      openDedicatedTool: 'समर्पित स्टूडियो स्क्रीन खोलें',
    },
    projects: {
      headerTitle: 'मेरे प्रोजेक्ट्स',
      headerSubtitle: 'आपके सहेजे गए ड्राफ्ट और टेम्पलेट्स',
      searchPlaceholder: 'प्रोजेक्ट या प्रॉम्प्ट खोजें...',
      filterAll: 'सभी',
      placeholderTag: 'सहेजा गया टेम्पलेट',
      draftTag: 'स्थानीय ड्राफ्ट',
      emptyTitle: 'अभी कोई प्रोजेक्ट सेव नहीं है',
      emptyBody: 'अपना पहला क्रिएटिव आइडिया सेव करने के लिए नया ड्राफ्ट शुरू करें या टेम्पलेट्स पुनः लोड करें।',
      emptySearchTitle: 'कोई परिणाम नहीं मिला',
      emptySearchBody: 'आपकी खोज से मेल खाने वाला कोई प्रोजेक्ट नहीं मिला।',
      resetSearch: 'खोज रीसेट करें',
      createNew: 'नया प्रोजेक्ट बनाएं',
      restorePlaceholders: 'टेम्पलेट प्लेसहोल्डर दिखाएं',
      openInCreate: 'एडिट करें',
      deleteProject: 'हटाएं',
      confirmDeleteTitle: 'प्रोजेक्ट हटाएं?',
      confirmDeleteBody: 'यह प्रोजेक्ट स्थानीय स्टोरेज से स्थायी रूप से हट जाएगा।',
      cancel: 'रद्द करें',
      confirm: 'हटाएं',
    },
    tools: {
      headerTitle: 'AI टूल्स हब',
      headerSubtitle: 'हर रचनात्मक कार्य के लिए विशेष स्टूडियो',
      categories: {
        all: 'सभी (7)',
        writing: 'लेखन व यूट्यूब',
        visual: 'इमेज व कार्टून',
        audioVideo: 'वॉइस व वीडियो',
      },
      openTool: 'स्टूडियो खोलें',
      phase1Label: 'Gemini AI · टेक्स्ट जनरेशन',
    },
    toolScreens: {
      story: {
        genreLabel: 'कहानी की शैली',
        genres: ['लोककथा', 'रहस्य', 'प्रेरणादायक', 'बाल कथा'],
        toneLabel: 'लेखन टोन',
        tones: ['भावनात्मक', 'रोमांचक', 'सरल'],
        titlePlaceholder: 'उदा. चाँदनी घाटी का रहस्य',
        promptPlaceholder: 'पात्र, स्थान और कहानी की मुख्य घटना लिखें...',
      },
      image: {
        styleLabel: 'विज़ुअल स्टाइल',
        styles: ['सिनेमैटिक', '3D आर्ट', 'डिजिटल पेंटिंग', 'मिनिमलिस्ट'],
        ratioLabel: 'आस्पेक्ट रेशियो',
        ratios: ['1:1', '16:9', '9:16', '4:3'],
        titlePlaceholder: 'उदा. सुनहरा मंदिर दृश्य',
        promptPlaceholder: 'रोशनी, रंग, पृष्ठभूमि और मुख्य विषय का वर्णन करें...',
      },
      video: {
        formatLabel: 'वीडियो फ़ॉर्मेट',
        formats: ['शॉर्ट्स 9:16', 'रील्स', 'लैंडस्केप 16:9'],
        durationLabel: 'लक्ष्य अवधि',
        durations: ['15s', '30s', '60s'],
        titlePlaceholder: 'उदा. भविष्य का शहर टीज़र',
        promptPlaceholder: 'दृश्य-दर-दृश्य शॉट्स, कैमरा मूवमेंट और गति लिखें...',
      },
      voice: {
        voiceProfileLabel: 'वॉइस प्रोफ़ाइल',
        profiles: ['कथावाचक', 'ऊर्जावान', 'शांत'],
        paceLabel: 'बोलने की गति',
        paces: ['धीमी', 'सामान्य', 'तेज़'],
        titlePlaceholder: 'उदा. सुबह की प्रेरणा वॉइसओवर',
        promptPlaceholder: 'पूरी वॉइसओवर स्क्रिप्ट और विराम संकेत यहाँ लिखें...',
      },
      cartoon: {
        characterLabel: 'मुख्य किरदार का नाम / प्रकार',
        characterPlaceholder: 'उदा. चीकू रोबोट (जिज्ञासु दोस्त)',
        styleLabel: 'एनीमेशन स्टाइल',
        styles: ['2D क्लासिक', '3D टून', 'कॉमिक स्ट्रिप'],
        titlePlaceholder: 'उदा. चीकू और जादुई पेड़',
        promptPlaceholder: 'एपिसोड का दृश्य, संवाद और कॉमेडी या सीख लिखें...',
      },
      youtube: {
        formatLabel: 'वीडियो प्रकार',
        formats: ['YouTube Shorts', 'लॉन्ग वीडियो', 'पॉडकास्ट'],
        hookLabel: 'शुरुआती हुक (प्रथम 5 सेकंड)',
        hookPlaceholder: 'उदा. क्या आप जानते हैं यह आसान ट्रिक?',
        titlePlaceholder: 'उदा. AI टूल्स से समय कैसे बचाएं',
        promptPlaceholder: 'मुख्य बिंदु, विवरण और कॉल-टू-एक्शन लिखें...',
      },
      editor: {
        ratioLabel: 'आउटपुट रेशियो',
        ratios: ['9:16', '16:9', '1:1'],
        checklistLabel: 'एडिटिंग चेकलिस्ट',
        checklistItems: ['इंट्रो हुक कट', 'हिन्दी सबटाइटल्स', 'म्यूज़िक क्यू', 'आउट्रो CTA'],
        titlePlaceholder: 'उदा. ट्रैवल रील फाइनल एडिट',
        promptPlaceholder: 'टाइमस्टैम्प, कट पॉइंट्स और ट्रांज़िशन नोट्स लिखें...',
      },
    },
    settings: {
      headerTitle: 'सेटिंग्स',
      headerSubtitle: 'भाषा, थीम और व्यक्तिगत प्राथमिकताएं',
      languageSection: 'ऐप भाषा',
      languageTitle: 'प्राथमिक और द्वितीयक भाषा',
      languageDesc: 'पूरे ऐप का इंटरफ़ेस तुरंत बदलें',
      hindiOption: 'हिन्दी (प्राथमिक)',
      englishOption: 'English (द्वितीयक)',
      themeSection: 'डार्क थीम',
      themeTitle: 'प्रीमियम ब्लैक व वायलेट सतह',
      themeDesc: 'आरामदायक और आकर्षक डार्क पैलेट चुनें',
      themeObsidian: 'ऑब्सिडियन ब्लैक',
      themeAmethyst: 'डीप अमेथिस्ट',
      preferencesSection: 'व्यक्तिगत प्राथमिकताएं',
      autoSaveTitle: 'प्रॉम्प्ट ड्राफ्ट ऑटो-सेव',
      autoSaveDesc: 'टाइप करते समय क्रिएट स्क्रीन ड्राफ्ट सुरक्षित रखें',
      placeholdersTitle: 'सहेजे गए प्रोजेक्ट प्लेसहोल्डर',
      placeholdersDesc: 'प्रोजेक्ट सूची में शुरुआती टेम्पलेट शामिल रखें',
      defaultOutputTitle: 'डिफ़ॉल्ट प्रोजेक्ट भाषा',
      replaySplashTitle: 'स्प्लैश स्क्रीन पूर्वावलोकन',
      replaySplashDesc: 'TUKKU-CREATION स्वागत एनीमेशन फिर से देखें',
      replaySplashAction: 'चलाएं',
      clearStorageTitle: 'लोकल स्टोरेज रीसेट करें',
      clearStorageDesc: 'सभी सहेजे गए प्रोजेक्ट हटाएं और डिफ़ॉल्ट स्थिति पर लौटें',
      clearStorageAction: 'रीसेट',
      confirmClearTitle: 'सभी डेटा रीसेट करें?',
      confirmClearBody: 'इससे आपके सभी स्थानीय ड्राफ्ट हट जाएंगे।',
      appInfoSection: 'ऐप जानकारी',
      appNameLabel: 'ऐप का नाम',
      packageLabel: 'पैकेज ID',
      platformLabel: 'प्लेटफ़ॉर्म',
      usageLabel: 'उपयोग मोड',
      usageValue: 'केवल व्यक्तिगत उपयोग',
      phaseLabel: 'रिलीज़ चरण',
      phaseValue: 'चरण 1 · कोर फ़ाउंडेशन (v1.0.0)',
    },
  },
  en: {
    appName: 'TUKKU-CREATION',
    tagline: 'Create Your Imagination with AI',
    splashSubtext: 'Your Personal AI Creative Studio',
    enterStudio: 'Enter Studio',
    common: {
      back: 'Back',
      loading: 'Loading...',
      loadingProjects: 'Loading local projects...',
      saving: 'Saving locally...',
      retry: 'Retry',
      storageErrorTitle: 'Storage Error',
      storageErrorBody: 'Unable to read or write local storage. Please try again.',
      viewInProjects: 'View in My Projects',
      refresh: 'Refresh',
      phaseOneTag: 'Gemini AI · Text generation',
    },
    tabs: {
      home: 'Home',
      create: 'Create',
      projects: 'My Projects',
      tools: 'AI Tools',
      settings: 'Settings',
    },
    home: {
      personalBadge: 'Personal Studio · Android',
      welcomeTitle: 'Welcome, Creator',
      welcomeSubtitle: 'What would you like to imagine and structure today?',
      promptLabel: 'AI Prompt Input',
      promptPlaceholder: 'Describe your story, visual scene, voiceover, or video idea...',
      generateButton: 'Prepare Draft',
      promptRequired: 'Please enter a creative prompt before continuing.',
      recentProjectsTitle: 'Recent Projects',
      viewAll: 'View All',
      noRecentProjects: 'No saved projects yet. Start your first draft.',
      toolsGridTitle: 'AI Creative Tools',
      toolsGridSubtitle: '7 modular creative studios',
    },
    create: {
      headerTitle: 'Create Studio',
      headerSubtitle: 'Compose structured prompts and save locally',
      phaseNoticeTitle: 'Phase 1 · Local Workspace Mode',
      phaseNoticeBody:
        'No fake AI outputs are fabricated in Phase 1. Your prompt and project structure save securely on your device; live AI engines connect in Phase 2.',
      selectToolLabel: 'Select AI Studio Tool',
      projectTitleLabel: 'Project Title',
      projectTitlePlaceholder: 'e.g. Himalayan Mystery Short Story',
      promptLabel: 'Creative Prompt',
      promptPlaceholder: 'Write detailed scene directions, story notes, or script cues...',
      outputLanguageLabel: 'Project Language',
      saveButton: 'Save Project',
      updateButton: 'Update Project',
      savedToast: 'Project saved to My Projects.',
      clearDraft: 'New Draft',
      validationError: 'Please provide a project title or prompt.',
      openDedicatedTool: 'Open Dedicated Tool Studio',
    },
    projects: {
      headerTitle: 'My Projects',
      headerSubtitle: 'Your saved local briefs and starter placeholders',
      searchPlaceholder: 'Search projects or prompts...',
      filterAll: 'All',
      placeholderTag: 'Saved Placeholder',
      draftTag: 'Local Draft',
      emptyTitle: 'No Projects Saved Yet',
      emptyBody: 'Create a new creative brief or restore starter placeholders to organize your workspace.',
      emptySearchTitle: 'No Matching Projects',
      emptySearchBody: 'Try another keyword or clear your active filter.',
      resetSearch: 'Reset Search',
      createNew: 'Create Project',
      restorePlaceholders: 'Show Starter Placeholders',
      openInCreate: 'Open in Create',
      deleteProject: 'Delete',
      confirmDeleteTitle: 'Delete Project?',
      confirmDeleteBody: 'This project will be permanently removed from local storage.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
    tools: {
      headerTitle: 'AI Tools Hub',
      headerSubtitle: 'Dedicated creative modules built for your workflow',
      categories: {
        all: 'All (7)',
        writing: 'Writing & YouTube',
        visual: 'Image & Cartoon',
        audioVideo: 'Voice & Video',
      },
      openTool: 'Open Studio',
      phase1Label: 'Phase 1 Ready · Local Briefs',
    },
    toolScreens: {
      story: {
        genreLabel: 'Story Genre',
        genres: ['Folklore', 'Mystery', 'Motivational', 'Kids'],
        toneLabel: 'Narrative Tone',
        tones: ['Emotional', 'Suspenseful', 'Simple'],
        titlePlaceholder: 'e.g. Mystery of Moonlit Valley',
        promptPlaceholder: 'Describe characters, setting, and key story events...',
      },
      image: {
        styleLabel: 'Visual Style',
        styles: ['Cinematic', '3D Art', 'Digital Painting', 'Minimalist'],
        ratioLabel: 'Aspect Ratio',
        ratios: ['1:1', '16:9', '9:16', '4:3'],
        titlePlaceholder: 'e.g. Golden Mountain Temple',
        promptPlaceholder: 'Describe lighting, colors, composition, and focal subject...',
      },
      video: {
        formatLabel: 'Video Format',
        formats: ['Shorts 9:16', 'Reels', 'Landscape 16:9'],
        durationLabel: 'Target Duration',
        durations: ['15s', '30s', '60s'],
        titlePlaceholder: 'e.g. Future City Teaser',
        promptPlaceholder: 'Write scene-by-scene shots, camera motion, and pacing...',
      },
      voice: {
        voiceProfileLabel: 'Voice Profile',
        profiles: ['Storyteller', 'Energetic', 'Calm'],
        paceLabel: 'Speaking Pace',
        paces: ['Slow', 'Normal', 'Fast'],
        titlePlaceholder: 'e.g. Morning Focus Narration',
        promptPlaceholder: 'Write full voiceover script and pause cues here...',
      },
      cartoon: {
        characterLabel: 'Lead Character Name / Role',
        characterPlaceholder: 'e.g. Chiku Bot (Curious Companion)',
        styleLabel: 'Animation Style',
        styles: ['2D Classic', '3D Toon', 'Comic Strip'],
        titlePlaceholder: 'e.g. Chiku and the Magic Tree',
        promptPlaceholder: 'Outline episode scenes, dialogue, and takeaway...',
      },
      youtube: {
        formatLabel: 'Content Format',
        formats: ['YouTube Shorts', 'Long Video', 'Podcast'],
        hookLabel: 'Opening Hook (First 5s)',
        hookPlaceholder: 'e.g. Did you know this simple workflow?',
        titlePlaceholder: 'e.g. Save Time with Modular Workflows',
        promptPlaceholder: 'Outline key talking points, description, and CTA...',
      },
      editor: {
        ratioLabel: 'Output Ratio',
        ratios: ['9:16', '16:9', '1:1'],
        checklistLabel: 'Editing Checklist',
        checklistItems: ['Intro Hook Cut', 'Hindi Subtitles', 'Music Cue', 'Outro CTA'],
        titlePlaceholder: 'e.g. Travel Reel Final Cut',
        promptPlaceholder: 'Record timestamps, cut points, and transition notes...',
      },
    },
    settings: {
      headerTitle: 'Settings',
      headerSubtitle: 'Language, dark theme, and personal preferences',
      languageSection: 'App Language',
      languageTitle: 'Primary & Secondary Language',
      languageDesc: 'Switch the entire app interface immediately',
      hindiOption: 'हिन्दी (Primary)',
      englishOption: 'English (Secondary)',
      themeSection: 'Dark Theme',
      themeTitle: 'Black & Deep Purple Surface',
      themeDesc: 'Select your preferred dark studio depth',
      themeObsidian: 'Obsidian Black',
      themeAmethyst: 'Deep Amethyst',
      preferencesSection: 'Personal Preferences',
      autoSaveTitle: 'Auto-Save Prompt Drafts',
      autoSaveDesc: 'Keep your active Create prompt preserved locally',
      placeholdersTitle: 'Saved Project Placeholders',
      placeholdersDesc: 'Include starter template projects in My Projects',
      defaultOutputTitle: 'Default Project Language',
      replaySplashTitle: 'Splash Screen Preview',
      replaySplashDesc: 'Replay the TUKKU-CREATION animated intro',
      replaySplashAction: 'Replay',
      clearStorageTitle: 'Reset Local Storage',
      clearStorageDesc: 'Remove saved projects and restore default settings',
      clearStorageAction: 'Reset',
      confirmClearTitle: 'Reset Local Data?',
      confirmClearBody: 'All locally saved drafts will be cleared.',
      appInfoSection: 'App Information',
      appNameLabel: 'App Name',
      packageLabel: 'Package ID',
      platformLabel: 'Platform',
      usageLabel: 'Usage Mode',
      usageValue: 'Personal Use Only',
      phaseLabel: 'Release Stage',
      phaseValue: 'Phase 1 · Core Foundation (v1.0.0)',
    },
  },
};
