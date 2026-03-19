/**
 * Utility functions for managing Open Graph and Twitter Card meta tags
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video';
  twitterHandle?: string;
}

/**
 * Set Open Graph and Twitter Card meta tags for social sharing
 */
export function setMetaTags(config: MetaTagsConfig): void {
  const {
    title,
    description,
    image = 'https://via.placeholder.com/1200x630?text=Trinity+Lutheran+Church',
    url = window.location.href,
    type = 'website',
    twitterHandle = '@TrinityLutheran'
  } = config;

  // Set page title
  document.title = title;

  // Open Graph meta tags
  setMetaTag('og:title', title);
  setMetaTag('og:description', description);
  setMetaTag('og:image', image);
  setMetaTag('og:url', url);
  setMetaTag('og:type', type);
  setMetaTag('og:site_name', 'Trinity Lutheran Church Ghana');

  // Twitter Card meta tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', image);
  setMetaTag('twitter:creator', twitterHandle);

  // Standard meta tags
  setMetaTag('description', description);
}

/**
 * Helper function to set or update a meta tag
 */
function setMetaTag(name: string, content: string): void {
  let element = document.querySelector(`meta[property="${name}"]`) ||
                document.querySelector(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
    if (isProperty) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Reset meta tags to default values
 */
export function resetMetaTags(): void {
  setMetaTags({
    title: 'Trinity Lutheran Church Ghana',
    description: 'Spreading the grace and truth of Jesus Christ throughout the heart of Ghana. Join our community of faith.',
    url: 'https://trinitylutheranghana.org'
  });
}
