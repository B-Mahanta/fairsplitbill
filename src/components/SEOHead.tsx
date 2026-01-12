import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
  keywords = 'bill splitting calculator, fair split, expense sharing, bill splitter app, group expenses, restaurant bill calculator, itemize receipt, split check, divide bill, shared expenses calculator, proportional bill split, free bill splitter, receipt splitter, bill divider, group dinner calculator',
  canonical,
  ogImage = 'https://fairsplitbill.netlify.app/og-image.png'
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `https://fairsplitbill.netlify.app${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  return (
    <Helmet>
      {/* Basic Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
