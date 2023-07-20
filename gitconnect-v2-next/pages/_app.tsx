import { useState, useEffect } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Analytics } from '@vercel/analytics/react';
import { getCookie, setCookie } from 'cookies-next';
import { Provider } from 'jotai';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import '../styles/tiptap.scss';
import { AppContainer } from '../components/AppContainer';
import { AuthProvider } from '../context/AuthContext';
import { mantineCache } from '../mantine/cache';

// MAY CAUSE ISSUES - just for icons for notitap
// import '@unocss/reset/tailwind.css'
// import 'uno.css'

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        {/* <title>GitConnect;</title> */}
        {/* <!DOCTYPE html> */}
        {/* <title>GitConnect: Your Career Launchpad for Development</title> */}
        <title>GitConnect: A new space for Developers, by Developers</title>
        <meta
          property="og:title"
          content="GitConnect: A new space built for Developers, by Developers"
        />
        {/* <meta property="og:title" content="GitConnect: Your Career Launchpad for Development" /> */}
        <meta
          property="og:image"
          content="https://www.gitconnect.dev/img/favicon/gclogo.png"
        />
        <meta property="og:url" content="https://www.gitconnect.dev/" />
        <meta
          name="description"
          content="Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together. Perfect for junior developers and those starting their coding journey."
        />
        {/* <meta name="description" content="Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together.Showcase your work, discover inspiring projects, and connect with like-minded developers in just a few clicks. 
        Perfect for junior developers and those starting their coding journey
        ." /> */}
        <meta
          name="keywords"
          content="developers, projects, showcase, connect, collaborate, junior developers, coding, GitHub, coding, GitHub, coding portfolio, project portfolio for junior developers, coding collaboration platform"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/img/favicon/gclogo.png" />
      </Head>
      <Provider>
        <ThemeProvider attribute="class">
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              theme={{
                colorScheme,
                // primaryColor: 'green',
              }}
              withGlobalStyles
              withNormalizeCSS
            >
              <ModalsProvider>
                <Notifications />
                <AuthProvider>
                  <AppContainer>
                    <Component {...pageProps} />
                    <Analytics />
                  </AppContainer>
                </AuthProvider>
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

// App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
//   colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
// });

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
