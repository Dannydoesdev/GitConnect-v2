import { GetServerSidePropsContext } from 'next';
import { useState, useEffect } from 'react'
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext'
import { getCookie, setCookie } from 'cookies-next';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
// import { NotificationsProvider } from '@mantine/notifications';
import { AppContainer } from '../components/AppContainer'
import { mantineCache } from '../mantine/cache';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>GitConnect;</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/img/favicon/gclogo.png" />
      </Head>
      <AuthProvider>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            theme={{
              colorScheme,
              // primaryColor: 'green',
            }}
            withGlobalStyles
            withNormalizeCSS>
            {/* <NotificationsProvider> */}
              <AppContainer>
                <Component {...pageProps} />
              </AppContainer>
            {/* </NotificationsProvider> */}
          </MantineProvider>
        </ColorSchemeProvider>
      </AuthProvider >
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});
