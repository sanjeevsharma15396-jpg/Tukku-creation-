import React from 'react';
import {
  BookOpen,
  Clapperboard,
  Image as ImageIcon,
  Mic,
  Palette,
  Scissors,
  Youtube,
} from 'lucide-react';
import { AIToolId } from '../types/app';

interface ToolIconProps {
  toolId: AIToolId;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ toolId, className = 'w-5 h-5' }) => {
  switch (toolId) {
    case 'story-generator':
      return <BookOpen className={className} />;
    case 'image-generator':
      return <ImageIcon className={className} />;
    case 'video-generator':
      return <Clapperboard className={className} />;
    case 'voice-studio':
      return <Mic className={className} />;
    case 'cartoon-studio':
      return <Palette className={className} />;
    case 'youtube-studio':
      return <Youtube className={className} />;
    case 'video-editor':
      return <Scissors className={className} />;
  }
};
