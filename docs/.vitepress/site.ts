/** 站点级配置：换域名或仓库名时只改这里。 */

export const SITE = {
  name: 'Ops Docs',
  titleTemplate: ':title | Ops Docs',
  description:
    'Docker Compose 中间件手册。讲清每个编排做什么、何时用、怎么跑、关键配置怎么改。',
  /** 仅 origin，不要带仓库路径；路径走 base。 */
  hostname: 'https://yaogengzhu.github.io',
  /** 项目站前缀。自定义域名时改成 '/'。 */
  base: '/ops-docs/',
  lang: 'zh-CN',
  locale: 'zh_CN',
  ogImage: '/og.png',
  keywords: 'Docker Compose, 一键部署, 中间件, MySQL, Redis, Nacos, 运维',
} as const

export function joinUrl(...parts: string[]): string {
  return parts
    .join('/')
    .replace(/([^:]\/)\/+/g, '$1')
    .replace(/\/$/, '')
}

export function pageCanonical(relativePath: string): string {
  const slug = relativePath
    .replace(/\\/g, '/')
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
    .replace(/\/$/, '')
  const base = SITE.base.endsWith('/') ? SITE.base : `${SITE.base}/`
  const origin = SITE.hostname.replace(/\/$/, '')
  if (!slug) return `${origin}${base}`
  return `${origin}${base}${slug}`
}
