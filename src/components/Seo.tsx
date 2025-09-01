import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  articlePublishedTime?: string; // ISO
}

const DEFAULT_TITLE = 'Worknix – Curated Private & Government Jobs';
const DEFAULT_DESC = 'Discover curated private & government job opportunities. Fast, free, no login needed.';

export function Seo({ title, description, image, noIndex, canonical, articlePublishedTime }: SeoProps) {
  const fullTitle = title ? `${title} | Worknix` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const img = image ;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
  {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
  {articlePublishedTime && <meta property="og:type" content="article" />}
  {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}

export default Seo;
