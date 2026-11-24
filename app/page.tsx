import type { FC } from 'react'
import React from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const App: FC<IMainProps> = async (props) => {
  // Hardcode the default locale to 'en-US' so it completely bypasses
  // the 'Intl.getCanonicalLocales' bug that crashes Next.js on wildcard '*' headers
  const locale = 'en-US'

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
