// utils/getLangProps.ts
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getLangProps =
  (namespaces: string[]) =>
  async ({ locale }: { locale: string }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    }
  }
