'use client'

import { ReactNode } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiArrowRight, FiArrowUpRight, FiGlobe, FiMapPin } from 'react-icons/fi'

import { careerLinks } from '../data'
import { IExperienceLink, IExperiences } from '../types'
import { trackSpotlight } from '../utils/spotlight'
import { linkIcons } from './ExternalLink'

type BentoCardProps = {
  eyebrow: string
  experience: IExperiences
  className?: string
  children: ReactNode
}

const BentoCard = ({
  eyebrow,
  experience,
  className,
  children,
}: BentoCardProps) => {
  const t = useTranslations('CarrerPage.Highlights')

  return (
    <li
      onMouseMove={trackSpotlight}
      className={clsx(
        'spotlight-card spotlight-loop flex flex-col gap-large rounded-sm border border-green-weak-border bg-bg-cards p-large text-white',
        className,
      )}
    >
      <p className='text-xsmall font-bold tracking-wider text-gray-400 uppercase'>
        {eyebrow}
      </p>
      <div className='flex flex-1 flex-col gap-base'>{children}</div>
      <Link
        href={`#experience-${experience}`}
        className='group flex w-fit items-center gap-xxsmall text-xsmall text-gray-300 hover:text-card-accent'
      >
        <span>
          {t('seeExperience')}
          <span className='sr-only'>: {eyebrow}</span>
        </span>
        <FiArrowRight
          aria-hidden
          className='transition-transform group-hover:translate-x-1'
        />
      </Link>
    </li>
  )
}

type AreaStatProps = {
  area: string
  value: string
  label: string
  children: ReactNode
}

const AreaStat = ({ area, value, label, children }: AreaStatProps) => (
  <div className='flex flex-col gap-xsmall'>
    <p className='text-xsmall font-bold tracking-wider text-card-accent uppercase'>
      {area}
    </p>
    <p className='flex flex-col gap-xxsmall'>
      <span className='text-title-giant leading-none font-extrabold'>
        {value}
      </span>
      <span className='text-xsmall text-gray-300'>{label}</span>
    </p>
    <div className='text-xsmall text-gray-400'>{children}</div>
  </div>
)

const statsGridClassName =
  'grid gap-large sm:grid-cols-3 sm:[&>*+*]:border-l sm:[&>*+*]:border-green-weak-border sm:[&>*+*]:pl-large'

const openSourceLinks: {
  link: IExperienceLink
  name: string
  detail: string
}[] = [
  { link: careerLinks.nuxtIssue, name: 'nuxt', detail: 'nuxtDetail' },
  { link: careerLinks.unleashPr, name: 'unleash', detail: 'unleashDetail' },
  { link: careerLinks.atomiumRepo, name: 'atomium', detail: 'atomiumDetail' },
  { link: careerLinks.he4rt, name: 'he4rt', detail: 'he4rtDetail' },
]

const CareerHighlights = () => {
  const t = useTranslations('CarrerPage.Highlights')
  const tFeed = useTranslations('CarrerPage.Feed')

  return (
    <section
      aria-labelledby='career-highlights-title'
      className='flex flex-col gap-large'
    >
      <header className='flex flex-col gap-xxsmall'>
        <h2
          id='career-highlights-title'
          className='text-title-giant font-bold text-primary'
        >
          {t('title')}
        </h2>
        <p className='text-medium text-primary opacity-80'>
          {t('description')}
        </p>
      </header>

      <ul className='grid gap-base md:grid-flow-dense md:grid-cols-2 lg:grid-cols-3'>
        <BentoCard
          eyebrow={t('petlove.eyebrow')}
          experience='petlove'
          className='md:col-span-2'
        >
          <div className={statsGridClassName}>
            <AreaStat
              area={t('petlove.ux.area')}
              value={t('petlove.ux.value')}
              label={t('petlove.ux.label')}
            >
              {t('petlove.ux.detail')}
            </AreaStat>
            <AreaStat
              area={t('petlove.accessibility.area')}
              value={t('petlove.accessibility.value')}
              label={t('petlove.accessibility.label')}
            >
              {t('petlove.accessibility.detail')}
            </AreaStat>
            <AreaStat
              area={t('petlove.devsecops.area')}
              value={t('petlove.devsecops.value')}
              label={t('petlove.devsecops.label')}
            >
              {t('petlove.devsecops.detail')}
            </AreaStat>
          </div>
        </BentoCard>

        <BentoCard
          eyebrow={t('international.eyebrow')}
          experience='nimbus-black'
        >
          <FiGlobe aria-hidden className='h-8 w-8 text-amber-300' />
          <p className='flex flex-col gap-xxsmall'>
            <span className='text-title-headline font-bold'>
              {t('international.title')}
            </span>
            <span className='text-medium text-gray-300'>
              {t('international.company')} · {t('international.product')}
            </span>
          </p>
          <p className='flex items-center gap-xxsmall text-xsmall text-gray-400'>
            <FiMapPin aria-hidden />
            {t('international.location')}
          </p>
        </BentoCard>

        <BentoCard
          eyebrow={t('juntosSomosMais.eyebrow')}
          experience='juntos-somos-mais'
          className='md:col-span-2'
        >
          <div className={statsGridClassName}>
            <AreaStat
              area={t('juntosSomosMais.cicd.area')}
              value={t('juntosSomosMais.cicd.value')}
              label={t('juntosSomosMais.cicd.label')}
            >
              <dl className='flex flex-col gap-xxsmall'>
                <div className='flex items-center gap-xsmall'>
                  <dt className='w-12 shrink-0'>
                    {t('juntosSomosMais.cicd.before')}
                  </dt>
                  <dd className='flex flex-1 items-center gap-xsmall'>
                    <span className='h-1.5 w-full rounded-full bg-green-white' />
                    {t('juntosSomosMais.cicd.beforeValue')}
                  </dd>
                </div>
                <div className='flex items-center gap-xsmall'>
                  <dt className='w-12 shrink-0'>
                    {t('juntosSomosMais.cicd.after')}
                  </dt>
                  <dd className='flex flex-1 items-center gap-xsmall'>
                    <span className='h-1.5 w-1/5 rounded-full bg-card-accent' />
                    {t('juntosSomosMais.cicd.afterValue')}
                  </dd>
                </div>
              </dl>
            </AreaStat>
            <AreaStat
              area={t('juntosSomosMais.security.area')}
              value={t('juntosSomosMais.security.value')}
              label={t('juntosSomosMais.security.label')}
            >
              {t('juntosSomosMais.security.detail')}
            </AreaStat>
            <AreaStat
              area={t('juntosSomosMais.designSystem.area')}
              value={t('juntosSomosMais.designSystem.value')}
              label={t('juntosSomosMais.designSystem.label')}
            >
              {t('juntosSomosMais.designSystem.detail')}
            </AreaStat>
          </div>
        </BentoCard>

        <BentoCard eyebrow={t('openSource.eyebrow')} experience='open-source'>
          <p className='text-subtitle font-bold'>{t('openSource.title')}</p>
          <ul className='grid gap-xsmall sm:grid-cols-2 md:grid-cols-1'>
            {openSourceLinks.map(({ link, name, detail }) => {
              const Icon = linkIcons[link.kind]

              return (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group/tile flex h-full flex-col gap-xxsmall rounded-sm border border-green-weak-border px-small py-xsmall transition-colors hover:border-sky-300/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300'
                  >
                    <span className='flex items-center justify-between gap-xsmall text-medium font-bold'>
                      {t(`openSource.${name}`)}
                      <FiArrowUpRight
                        aria-hidden
                        className='shrink-0 text-gray-400 transition-transform group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:text-sky-300'
                      />
                    </span>
                    <span className='flex items-center gap-xxsmall text-xsmall text-gray-300 group-hover/tile:text-sky-300'>
                      <Icon aria-hidden className='shrink-0' />
                      {t(`openSource.${detail}`)}
                    </span>
                    <span className='sr-only'>{tFeed('newTab')}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </BentoCard>
      </ul>
    </section>
  )
}

export default CareerHighlights
