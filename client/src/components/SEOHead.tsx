import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  courseData?: {
    provider: string;
    duration: string;
    level: string;
    category: string;
    price?: number;
    rating?: number;
    enrollmentCount?: number;
  };
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  courseData
}: SEOHeadProps) {
  const siteName = 'Elira - Magyar Online Oktatási Platform';
  const fullTitle = title.includes('Elira') ? title : `${title} | ${siteName}`;
  const currentUrl = url || window.location.href;
  const defaultImage = '/assets/elira-og-image.jpg';
  const ogImage = image || defaultImage;

  // Generate structured data for courses
  const courseStructuredData = courseData ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": courseData.provider
    },
    "educationalLevel": courseData.level,
    "courseMode": "online",
    "inLanguage": "hu",
    "timeRequired": courseData.duration,
    "teaches": keywords.join(', '),
    ...(courseData.price && {
      "offers": {
        "@type": "Offer",
        "price": courseData.price,
        "priceCurrency": "HUF"
      }
    }),
    ...(courseData.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": courseData.rating,
        "bestRating": 5
      }
    })
  } : null;

  // Generate article structured data
  const articleStructuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": ogImage,
    "author": {
      "@type": "Person",
      "name": author || "Elira"
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "/assets/elira-logo.png"
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author || siteName} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${title} - Elira kurzus`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="hu_HU" />

      {/* Article specific OG tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - Elira kurzus`} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Hungarian" />
      <meta name="geo.region" content="HU" />
      <meta name="geo.country" content="Hungary" />

      {/* Structured Data */}
      {courseStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(courseStructuredData)}
        </script>
      )}
      {articleStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
      )}

      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "alternateName": "Elira",
          "url": "https://elira.hu",
          "logo": "/assets/elira-logo.png",
          "description": "Magyar online oktatási platform egyetemi kurzusokkal",
          "foundingDate": "2024",
          "founders": [{
            "@type": "Organization",
            "name": "Elira Team"
          }],
          "areaServed": "Hungary",
          "serviceType": "Online Education"
        })}
      </script>
    </Helmet>
  );
}

// Predefined SEO configurations for different page types
export const seoConfigs = {
  home: {
    title: 'Elira - Magyar Online Oktatási Platform',
    description: 'Fedezd fel a legjobb magyar egyetemi kurzusokat online. Személyre szabott tanulási útvonalak, interaktív tartalmak és prémium oktatási élmény.',
    keywords: ['online oktatás', 'egyetemi kurzusok', 'magyar oktatás', 'e-learning', 'távoktatás', 'képzés']
  },
  courses: {
    title: 'Kurzusok - Elira',
    description: 'Böngéssz a magyar egyetemek széles kurzuskínálatában. Informatika, üzlet, mérnöki tudományok és még sok más terület.',
    keywords: ['kurzusok', 'online tanfolyamok', 'egyetemi képzések', 'szakmai fejlődés']
  },
  trending: {
    title: 'Trending Kurzusok - Elira',
    description: 'A legkedveltebb és legaktuálisabb kurzusok Magyarországon. Csatlakozz a legnagyobb tanulói közösségekhez.',
    keywords: ['trending kurzusok', 'népszerű képzések', 'aktuális tanfolyamok']
  },
  careers: {
    title: 'Karrierfejlesztés - Elira',
    description: 'Építsd fel álmaid karrierjét személyre szabott tanulási útvonalakkal. AI-alapú karriertanácsadás és szakmai fejlődés.',
    keywords: ['karrierfejlesztés', 'szakmai fejlődés', 'álláskeresés', 'képzés']
  }
};

// Hook for dynamic SEO updates
export function useSEO(config: Partial<SEOHeadProps>) {
  React.useEffect(() => {
    // Update page title immediately for better UX
    if (config.title) {
      document.title = config.title.includes('Elira') 
        ? config.title 
        : `${config.title} | Elira`;
    }
  }, [config.title]);

  return null;
}