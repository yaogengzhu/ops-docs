import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ServiceCatalog from './components/ServiceCatalog.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ServiceCatalog', ServiceCatalog)
  },
} satisfies Theme
