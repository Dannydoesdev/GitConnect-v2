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
import { useRouter } from 'next/router';
import "@fontsource/inter"; 
// import 'sms.me/inter/inter.css'

// MAY CAUSE ISSUES - just for icons for notitap
// import '@unocss/reset/tailwind.css'
// import 'uno.css'

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const router = useRouter()
 
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
    {/* One way to do external stylesheet - not really recommended: */}
{/* eslint-disable-next-line @next/next/no-css-tags */}
        {/* <link rel="stylesheet" href="/css/styles.css" precedence="default" /> */}
        
        {/* <title>GitConnect;</title> */}
        {/* <!DOCTYPE html> */}
        {/* <title>GitConnect: Your Career Launchpad for Development</title> */}
        {/* <title>GitConnect: A new space for Developers, by Developers</title> */}
        <title>GitConnect: The Portfolio Platform for Devs</title>

        <meta
          property="og:title"
          content="GitConnect: The Portfolio Platform for Devs"
        />
        {/* <meta property="og:title" content="GitConnect: Your Career Launchpad for Development" /> */}
        <meta
          property="og:image"
          content="https://www.gitconnect.dev/img/favicon/gclogo.png"
        />
        <meta property="og:url" content="https://www.gitconnect.dev/" />
        <meta
          name="description"
          content="GitConnect is a dedicated platform for developers to build their portfolio, connect with opportunities, and with each other."
          // content="Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together. Perfect for junior developers and those starting their coding journey."
        />
        {/* <meta name="description" content="Embark on a coding journey where your projects take the spotlight. Join our budding community of developers and grow together.Showcase your work, discover inspiring projects, and connect with like-minded developers in just a few clicks. 
        Perfect for junior developers and those starting their coding journey
        ." /> */}
        <meta
          name="keywords"
          content="developers, devs, coding, developer portfolio platform, software engineers, freelance portfolios, freelance developers, projects, showcase, connect, collaborate, junior developers, GitHub, coding, coding portfolio, software developer projects, project portfolio for developers, coding collaboration platform"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/img/favicon/gclogo.png" />
      </Head>
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
                <Provider>
                  <AppContainer>
                    <Component key={router.asPath} {...pageProps} />
                    <Analytics />
                  </AppContainer>
                </Provider>
              </AuthProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ThemeProvider>
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
