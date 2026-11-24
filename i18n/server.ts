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
    // Continue if cookie lookup fails
  }

  // 2. Try reading from Accept-Language header safely
  try {
    const headersList = await headers()
    let acceptLanguage = headersList.get('accept-language') || 'en-US'

    // Replace wildcard '*' which causes Intl.getCanonicalLocales to throw RangeError
    if (acceptLanguage.includes('*')) {
      acceptLanguage = acceptLanguage.replace(/\*/g, 'en')
    }

    const languages = new Negotiator({
      headers: { 'accept-language': acceptLanguage },
    }).languages()

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
    // Continue if header parsing fails
  }

  // 3. Fallback default
  return i18n.defaultLocale || 'en-US'
}

export { i18n } from './index'
