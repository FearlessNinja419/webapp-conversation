import type { FC } from 'react'
import React from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'
import { getLocaleOnServer, i18n } from '@/i18n/server'

const App: FC<IMainProps> = async (props) => {
  // Wrap locale detection in a safe fallback so invalid headers like '*' never crash Next.js
  let locale = i18n.defaultLocale || 'en-US'
  try {
    const detectedLocale = await getLocaleOnServer()
    if (detectedLocale)
      locale = detectedLocale
  }
  catch {
    locale = i18n.defaultLocale || 'en-US'
  }

  return (
    <Main
      {...props}
      params={{
        ...props.params,
        locale,
      }}
    />
  )
}

export default App
