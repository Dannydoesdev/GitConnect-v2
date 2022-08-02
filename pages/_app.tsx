import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import {getCookie, setCookies} from 'cookies-next'
import { mantineCache } from '../mantine/cache';
import { useColorScheme } from '@mantine/hooks'
import { AppContainer } from '../components/AppContainer'
import { useState } from 'react'
import App from 'next/app';

// export default function MyApp({ Component, pageProps }: AppProps) {
  export default function MyApp( props: any ) {

  console.log(props)
  const { Component, pageProps } = props;
  //What colour scheme the user prefers
  // const preferredColorScheme = useColorScheme();

  // Loading the scheme in with props instead - sent via cookie fn below
  const [colorScheme, setColorScheme] = useState(props.colorScheme)
  // set to value OR the colorscheme
    const toggleColorScheme = (value: any) => {
      // console.log('value' + value)
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {maxAge: 60*60*24*30})
  }
    


  return (
    <AuthProvider>
       <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={mantineCache}
        theme={{
          /** Put mantine theme override here */
          colorScheme
        }}
        >
          <AppContainer>
            <Component {...pageProps} />
          </AppContainer>
        </MantineProvider>
        </ColorSchemeProvider>
      </AuthProvider >
     
  )
}

// export default MyApp

// Theme can be based on 'system'
// App is going to load in some props
// MUST BE CTX ('context' did not work)
MyApp.getInitialProps = ({ ctx }: any) => ({
  // the props aboce pass in the color scheme
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'n ',
})