import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { MantineProvider, Button, AppShell, ColorSchemeProvider } from '@mantine/core';
import {getCookie, setCookie} from 'cookies-next'
import { mantineCache } from '../mantine/cache';
import { useColorScheme } from '@mantine/hooks'
import { AppContainer } from '../components/AppContainer'
import { useState } from 'react'
import App from 'next/app';
import { stringify } from 'querystring';

// export default function MyApp({ Component, pageProps }: AppProps) {
  export default function MyApp( props: any ) {

  console.log(props)
  const { Component, pageProps } = props;
  //What colour scheme the user prefers
  // const preferredColorScheme = useColorScheme();

  // Loading the scheme in with props instead - sent via cookie fn below
    const [colorScheme, setColorScheme] = useState(props.colorScheme)
    console.log('color scheme top' + colorScheme)
    // const [twColorScheme, setTwColorScheme] = useState('light')
  // set to value OR the colorscheme
    const toggleColorScheme = (value: any) => {
      // console.log('value' + value)
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
      setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 })
      
      console.log(JSON.stringify(colorScheme))
      console.log('lil test above')
      console.log(`${getCookie('mantine-color-scheme')} cookie test`)

      console.log('color scheme' + colorScheme)

      const colorSchemeString = JSON.stringify(colorScheme)

      console.log(stringify(colorScheme) + 'test')
      // IN PROGRESS: NEED TO USE COOKIES
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
// if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//   setTwColorScheme('dark')
// } else {
//   setTwColorScheme('dark')
// }

// Whenever the user explicitly chooses light mode
// localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
// localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
// localStorage.removeItem('theme')


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
            colorScheme,
            components: {
              // add class styles for tailwind
              AppShell: {
                classNames: { root:  colorScheme  }
            }
          }        
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