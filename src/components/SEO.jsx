import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSeoMeta } from '../utils/seoConfig';

const SEO = ({ title, description, image, article, schema }) => {
  const location = useLocation();
  const defaultMeta = getSeoMeta(location.pathname);

  const seo = {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    image: image || defaultMeta.openGraph.images[0].url,
    url: `${defaultMeta.openGraph.url}`,
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content="PackYourBags" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'PackYourBags',
          url: 'https://packyourbags.vercel.app',
          logo: 'https://packyourbags.vercel.app/logo.png', // Ensure this exists
          sameAs: [
            'https://twitter.com/packyourbags',
            'https://facebook.com/packyourbags',
            'https://instagram.com/packyourbags'
          ]
        })}
      </script>

      {/* Page Specific Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
