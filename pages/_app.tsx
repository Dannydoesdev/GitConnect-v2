import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { MantineProvider } from '@mantine/core';
import { mantineCache } from '../mantine/cache';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={mantineCache}
        theme={{
          /** Put mantine theme override here */
          // colorScheme: 'dark',
        }}
      >
      <Component {...pageProps} />
      </MantineProvider>
  </AuthProvider >
  )
}

export default MyApp
