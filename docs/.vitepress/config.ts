import { defineConfig } from 'vitepress'
import { SITE, joinUrl } from './site'
import { buildSidebar } from './catalog'
import { transformPageHead } from './seo'

export default defineConfig({
  lang: SITE.lang,
  title: SITE.name,
  description: SITE.description,
  titleTemplate: SITE.titleTemplate,
  base: SITE.base,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  sitemap: {
    hostname: `${joinUrl(SITE.hostname, SITE.base)}/`,
  },
  head: [
    ['link', { rel: 'icon', href: `${SITE.base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#0b1220' }],
    ['meta', { name: 'author', content: SITE.name }],
  ],
  transformHead: transformPageHead,
  themeConfig: {
    logo: { src: '/favicon.svg', alt: 'Ops Docs' },
    nav: [
      { text: '开始使用', link: '/guide/getting-started' },
      { text: '全部服务', link: '/guide/catalog' },
    ],
    sidebar: buildSidebar(),
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除',
            backButtonTitle: '关闭',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '上次更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    footer: {
      message: 'Docker Compose 中间件手册',
      copyright: '© Ops Docs',
    },
  },
})
