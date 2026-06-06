import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, image }) {
  const fullTitle = title ? `${title} | BICARD` : 'BICARD — Be Job Ready in Embedded Systems';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
