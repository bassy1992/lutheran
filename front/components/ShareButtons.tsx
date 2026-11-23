import React from 'react';
import { Share2, Facebook, Twitter, Mail } from 'lucide-react';

export interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  description = '',
  url = typeof window !== 'undefined' ? window.location.href : '',
  className = ''
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
        <Share2 size={16} />
        Share:
      </span>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-all"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      <a
        href={shareLinks.email}
        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-600 hover:text-white transition-all"
        title="Share via Email"
      >
        <Mail size={18} />
      </a>
    </div>
  );
};

export default ShareButtons;
