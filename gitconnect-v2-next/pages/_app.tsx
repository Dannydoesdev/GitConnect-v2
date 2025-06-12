import { useState, useEffect } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getCookie, setCookie } from 'cookies-next';
import { Provider } from 'jotai';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import '../styles/tiptap.scss';
import { AppContainer } from '../components/AppContainer';
import { AuthProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import '@fontsource/inter';

// Previous solution here for future ref - just for icons for notitap
// import '@unocss/reset/tailwind.css'
// import 'uno.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();

  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const [isClient, setIsClient] = useState(false);

  // This effect runs only on the client after hydration
  useEffect(() => {
    setIsClient(true);
    // Get color scheme from cookie on client-side only
    const savedColorScheme =
      (getCookie('mantine-color-scheme') as ColorScheme) || 'dark';
    setColorScheme(savedColorScheme);
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>GitConnect: The Portfolio Platform for Devs</title>

        <meta
          property='og:title'
          content='GitConnect: The Portfolio Platform for Devs'
        />
        <meta
          property='og:image'
          content='https://www.gitconnect.dev/img/favicon/gclogo.png'
        />
        <meta property='og:url' content='https://www.gitconnect.dev/' />
        <meta
          name='description'
          content='GitConnect is a dedicated platform for developers to build their portfolio, connect with opportunities, and with each other.'
        />
        <meta
          name='keywords'
          content='developers, devs, coding, developer portfolio platform, software engineers, freelance portfolios, freelance developers, projects, showcase, connect, collaborate, junior developers, GitHub, coding, coding portfolio, software developer projects, project portfolio for developers, coding collaboration platform'
        />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <link rel='icon' href='/img/favicon/gclogo.png' />
      </Head>
      <ThemeProvider attribute='class'>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{
              colorScheme,
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <ModalsProvider>
              <Notifications />
              <AuthProvider>
                {/* <AuthProviderAnonymous> */}
                <Provider>
                  {/* Introducing the following change to prevent hydration errors - but needs full testing */}
                  {isClient ? (
                    <AppContainer>
                      <Component key={router.asPath} {...pageProps} />
                      <Analytics />
                      <SpeedInsights />
                    </AppContainer>
                  ) : (
                    <div style={{ visibility: 'hidden' }}>
                      <Component key={router.asPath} {...pageProps} />
                    </div>
                  )}
                  {/* <AppContainer>
                    <Component key={router.asPath} {...pageProps} />
                    <Analytics />
                    <SpeedInsights />
                  </AppContainer> */}
                </Provider>
                {/* </AuthProviderAnonymous> */}
              </AuthProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ThemeProvider>
    </>
  );
}
