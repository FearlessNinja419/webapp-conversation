import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import { i18n } from './index'

export const getLocaleOnServer = async (): Promise<string> => {
  // 1. Try reading from cookie first
  try {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('locale')?.value
    if (localeCookie && i18n.locales.includes(localeCookie as any)) {
      return localeCookie
    }
  } catch {
    // fallback if cookies aren't ready
  }

  // 2. Try reading from browser Accept-Language header
  try {
    const headersList = await headers()
    let acceptLanguage = headersList.get('accept-language') || 'en-US'

    // Fix the crash: remove any '*' wildcards that break Intl.getCanonicalLocales
    if (acceptLanguage.includes('*')) {
      acceptLanguage = acceptLanguage.replace(/\*/g, 'en')
    }

    const languages = new Negotiator({
      headers: { 'accept-language': acceptLanguage },
    }).languages()

    // Filter out any invalid language tags
    const validLanguages = languages.filter((lang) => {
      try {
        Intl.getCanonicalLocales(lang)
        return true
      } catch {
        return false
      }
    })

    if (validLanguages.length > 0) {
      return match(validLanguages, i18n.locales, i18n.defaultLocale)
    }
  } catch {
    // fallback if header parsing fails
  }

  // 3. Ultimate fallback
  return i18n.defaultLocale || 'en-US'
}
