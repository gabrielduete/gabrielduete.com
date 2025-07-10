import bee from '@/public/assets/images/lab/bee.jpeg'
import nuxt from '@/public/assets/images/lab/nuxt.png'

export const contributions = [
  {
    title: {
      pt: 'Issue: Melhoria no middleware do Nuxt',
      en: 'Issue: Improvement in Nuxt Middleware',
    },
    description: {
      pt: 'Sugeri uma melhoria no defineNuxtRouteMiddleware para funcionar em um SPA.',
      en: 'Suggested a fix for defineNuxtRouteMiddleware to work properly in SPA mode.',
    },
    image: nuxt,
    link: 'https://github.com/nuxt/nuxt/issues/32494',
    age: '2025',
  },
  {
    title: {
      pt: 'Guia de Javascript pro Beecrowd',
      en: 'Javascript Guide for Beecrowd',
    },
    description: {
      pt: 'Tive a honra de ter meu guia sobre javascript sendo reconhecido pela plataforma!',
      en: 'I had the honor of having my guide on javascript being recognized by the platform!',
    },
    image: bee,
    link: 'https://www.linkedin.com/posts/gabrielduete_beecrowd-activity-6932682593100283905-Bnvw?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC2UKmwB6Lx3Ty9cG5EOgFuy-2FfYvdmowY',
    age: '2022',
  },
]
