import type { DefaultTheme } from 'vitepress'
import catalog from './catalog.json'

export type Category = {
  id: string
  name: string
  summary: string
}

export type Service = {
  slug: string
  name: string
  category: string
  title: string
  description: string
  keywords?: string
  giteePath: string
  versions: string[]
  featured?: boolean
}

export const CATEGORIES = catalog.categories as Category[]
export const SERVICES = catalog.services as Service[]

export function servicesByCategory(categoryId: string): Service[] {
  return SERVICES.filter((s) => s.category === categoryId)
}

export function featuredServices(): Service[] {
  return SERVICES.filter((s) => s.featured)
}

export function buildSidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: '开始使用',
      items: [
        { text: '这是什么', link: '/guide/what-is-this' },
        { text: '环境准备', link: '/guide/getting-started' },
        { text: '常见坑', link: '/guide/pitfalls' },
        { text: '全部服务', link: '/guide/catalog' },
      ],
    },
    ...CATEGORIES.map((cat) => ({
      text: cat.name,
      collapsed: true,
      items: servicesByCategory(cat.id).map((s) => ({
        text: s.name,
        link: `/${cat.id}/${s.slug}`,
      })),
    })),
  ]
}
