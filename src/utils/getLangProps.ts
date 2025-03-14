import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getLangProps =
  (namespaces = ['common']) =>
  async ({ locale }: { locale: string }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    }
  }
