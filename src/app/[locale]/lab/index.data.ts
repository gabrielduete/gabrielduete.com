import bee from '@/../public/assets/images/lab/bee.jpeg'
import duetetheme from '@/../public/assets/images/lab/duete-theme.png'
import nuxt from '@/../public/assets/images/lab/nuxt.png'
import sandevistan from '@/../public/assets/images/lab/sandevistan.png'
import logo from '@/../public/assets/images/logo.png'

export const FILTERS = {
  'pt-br': ['Todos', 'Open Source', 'Engenharia', 'Úteis'],
  en: ['All', 'Open Source', 'Engineering', 'Utils'],
} as const

export const CONTRIBUTIONS = [
  {
    title: {
      pt: 'Melhoria no middleware do Nuxt',
      en: 'Improvement in Nuxt Middleware',
    },
    description: {
      pt: 'Sugeri uma melhoria no defineNuxtRouteMiddleware para funcionar em um SPA.',
      en: 'Suggested a fix for defineNuxtRouteMiddleware to work properly in SPA mode.',
    },
    image: nuxt,
    link: 'https://github.com/nuxt/nuxt/issues/32494',
    age: '2025',
    category: {
      pt: 'Open Source',
      en: 'Open Source',
    },
  },
  {
    title: {
      pt: 'Duete Theme',
      en: 'Duete Theme',
    },
    description: {
      pt: 'Um tema escuro minimalista com tons de verde e azul , criado para conforto visual e excelente contraste.',
      en: 'A minimalist dark theme with green and bluish tones, crafted for visual comfort and excellent contrast.',
    },
    image: duetetheme,
    link: 'https://marketplace.visualstudio.com/items?itemName=GabrielDuete.duete-theme',
    age: '2025',
    category: {
      pt: ['Úteis', 'Open Source'],
      en: ['Utils', 'Open Source'],
    },
  },
  {
    title: {
      pt: 'Meu Blog | Portfólio',
      en: 'My Blog | Portfolio',
    },
    description: {
      pt: 'Meu portfólio e blog pessoal, onde compartilho meus artigos e projetos.',
      en: 'My personal portfolio and blog, where I share my articles and projects.',
    },
    image: logo,
    link: 'https://github.com/gabrielduete/gabrielduete.com',
    age: '2025',
    category: {
      pt: ['Engenharia', 'Open Source'],
      en: ['Engineering', 'Open Source'],
    },
  },

  {
    title: {
      pt: 'Sandevistan',
      en: 'Sandevistan',
    },
    description: {
      pt: 'Minha biblioteca virtual de estudos em Engenharia de Software.',
      en: 'My Virtual Library of Software Engineering Studies.',
    },
    image: sandevistan,
    link: 'https://sandevistan.vercel.app/',
    age: '2024',
    category: {
      pt: ['Úteis', 'Open Source'],
      en: ['Utils', 'Open Source'],
    },
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
    category: {
      pt: ['Úteis', 'Open Source'],
      en: ['Utils', 'Open Source'],
    },
  },
]
