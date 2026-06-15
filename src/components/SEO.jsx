import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, isArticle = false }) => {
  const siteName = "Padmanaban M | Full-Stack Developer";
  const defaultDesc = "Portfolio of Padmanaban M, a Full-Stack Developer engineering fast, scalable, and highly interactive web applications using React, Next.js, and Node.js.";
  const image = "https://padcoder.com/og-image.jpg"; // Create a 1200x630 screenshot of your hero section and place in public/

  // JSON-LD Schema for Google & AI Search Engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Padmanaban M",
    "jobTitle": "Full-Stack Developer",
    "url": "https://padcoder.com",
    "sameAs": [
      "https://github.com/Pad-coder",
      "https://www.linkedin.com/in/padmanaban-coder/",
      "https://x.com/pad_coder"
    ],
    "knowsAbout": ["React", "Next.js", "Node.js", "MongoDB", "JavaScript", "Frontend Architecture"]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={`https://padcoder.com${url || ''}`} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={isArticle ? "article" : "website"} />
      <meta property="og:url" content={`https://padcoder.com${url || ''}`} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Padcoder" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@pad_coder" />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;