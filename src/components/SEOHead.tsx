import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title = 'FairSplit - Fair Bill Splitting Calculator | Split Bills Based on Consumption',
  description = 'Free bill splitting calculator that divides expenses fairly based on what each person consumed. Perfect for restaurants, group dinners, and shared expenses. No signup required.',
  keywords = 'bill splitting calculator, fair split, expense sharing, bill splitter app, group expenses, restaurant bill calculator',
  canonical,
  ogImage = 'https://fairsplit.app/og-image.png'
}: SEOHeadProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Update description
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', `https://fairsplit.app${location.pathname}`, true);
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || `https://fairsplit.app${location.pathname}`);
  }, [title, description, keywords, canonical, ogImage, location]);
  
  return null;
};
