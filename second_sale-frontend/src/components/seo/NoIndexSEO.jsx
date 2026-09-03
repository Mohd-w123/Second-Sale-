import SEOHead from './SEOHead';

export default function NoIndexSEO({ title, path = '/' }) {
  return (
    <SEOHead
      title={title}
      description="SecondSale account and order page."
      path={path}
      noindex
    />
  );
}
