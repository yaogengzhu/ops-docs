import type { HeadConfig, TransformContext } from 'vitepress'
import { SITE, joinUrl, pageCanonical } from './site'

function jsonLd(data: Record<string, unknown>): HeadConfig {
  return ['script', { type: 'application/ld+json' }, JSON.stringify(data)]
}

export function transformPageHead({ pageData }: TransformContext): HeadConfig[] {
  const title = pageData.title || SITE.name
  const description = pageData.description || SITE.description
  const canonical = pageCanonical(pageData.relativePath)
  const ogImage = joinUrl(SITE.hostname, SITE.base, SITE.ogImage.replace(/^\//, ''))
  const isHome = pageData.relativePath === 'index.md'
  const keywords =
    (pageData.frontmatter.keywords as string | undefined) || SITE.keywords

  const tags: HeadConfig[] = [
    ['link', { rel: 'canonical', href: canonical }],
    ['meta', { name: 'keywords', content: keywords }],
    ['meta', { name: 'description', content: description }],
    ['meta', { property: 'og:site_name', content: SITE.name }],
    ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
    ['meta', { property: 'og:locale', content: SITE.locale }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: canonical }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: ogImage }],
  ]

  if (isHome) {
    tags.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: pageCanonical('index.md'),
        description: SITE.description,
        inLanguage: SITE.lang,
      }),
    )
  } else {
    tags.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: title,
        description,
        url: canonical,
        inLanguage: SITE.lang,
        author: { '@type': 'Organization', name: SITE.name },
      }),
    )
  }

  return tags
}
