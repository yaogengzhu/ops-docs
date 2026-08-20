<script setup lang="ts">
import { withBase } from 'vitepress'
import { CATEGORIES, servicesByCategory } from '../../catalog'

function href(categoryId: string, slug: string) {
  return withBase(`/${categoryId}/${slug}`)
}
</script>

<template>
  <div class="catalog">
    <section v-for="cat in CATEGORIES" :key="cat.id" class="catalog__group">
      <header class="catalog__head">
        <h2>{{ cat.name }}</h2>
        <p>{{ cat.summary }}</p>
      </header>
      <div class="catalog__grid">
        <a
          v-for="svc in servicesByCategory(cat.id)"
          :key="svc.slug"
          class="card"
          :href="href(cat.id, svc.slug)"
        >
          <strong>{{ svc.name }}</strong>
          <span v-if="svc.featured" class="tag">详解</span>
          <p>{{ svc.description }}</p>
        </a>
      </div>
    </section>
  </div>
</template>
