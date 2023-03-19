export {}

// import '../styles/globals.css'
// import type { AppProps } from 'next/app'
// import { AuthProvider } from '../context/AuthContext'
// import { MantineProvider, Button, AppShell, ColorSchemeProvider, ColorScheme } from '@mantine/core';
// import { getCookie, setCookie } from 'cookies-next'
// import { mantineCache } from '../mantine/cache';
// import { useColorScheme } from '@mantine/hooks'
// import { AppContainer } from '../components/AppContainer'
// import { useState, useEffect } from 'react'
// import App from 'next/app';
// import { stringify } from 'querystring';



// // export default function MyApp({ Component, pageProps }: AppProps) {
// function MyApp(props: any) {

//   //   console.log('props')
//   // console.log(props)
//   const { Component, pageProps } = props;

//   // console.log(getCookie('mantine-color-scheme'))
//   // let firstColorScheme
//   // // Run on render

//   // const firstCookie = JSON.stringify(getCookie('mantine-color-scheme'))
//   // console.log(firstColorScheme)
//   // console.log(props)
//   //What colour scheme the user prefers
//   // const preferredColorScheme = useColorScheme();

//   // Loading the scheme in with props instead - sent via cookie fn below
//   // const [colorScheme, setColorScheme] = useState(props.colorScheme)
//   const [colorScheme, setColorScheme] = useState<any>('dark')

//   // Set color scheme with cookie on first load
//   useEffect(
//     () => {
//       // firstColorScheme = getCookie('mantine-color-scheme')
//       setColorScheme(getCookie('mantine-color-scheme') ? getCookie('mantine-color-scheme') : 'dark')
//       // props.colorScheme = firstColorScheme
//       // checks if the OS dark mode object exists and if it = dark
//     },
//     // Run once
//     [])


//   // console.log('color scheme top ' + colorScheme)
//   // const [twColorScheme, setTwColorScheme] = useState('light')
//   // set to value OR the colorscheme
//   const toggleColorScheme = (value: any) => {
//     // console.log('value' + value)
//     const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
//     setColorScheme(nextColorScheme);
//     setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 })

//     // console.log(`${getCookie('mantine-color-scheme')} cookie test`)

//     // const colorSchemeString = JSON.stringify(colorScheme)
//     // console.log(stringify(colorScheme) + 'test')

//     // IN PROGRESS: NEED TO USE COOKIES
//     // On page load or when changing themes, best to add inline in `head` to avoid FOUC
//     // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//     //   setTwColorScheme('dark')
//     // } else {
//     //   setTwColorScheme('dark')
//     // }

//     // Whenever the user explicitly chooses light mode
//     // localStorage.theme = 'light'

//     // Whenever the user explicitly chooses dark mode
//     // localStorage.theme = 'dark'

//     // Whenever the user explicitly chooses to respect the OS preference
//     // localStorage.removeItem('theme')


//   }

//   return (
//     <AuthProvider>
//       <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
//         <MantineProvider

//           withGlobalStyles
//           withNormalizeCSS
//           emotionCache={mantineCache}
//           theme={{
//             /** Put mantine theme override here */
//             colorScheme,
//             components: {
//               // add class styles for tailwind
//               AppShell: {
//                 classNames: { root: colorScheme }
//               }
//             }
//           }}
//         >
//           <AppContainer>
//             <Component {...pageProps} />
//           </AppContainer>
//         </MantineProvider>
//       </ColorSchemeProvider>
//     </AuthProvider >

//   )
// }



// // Theme can be based on 'system'
// // App is going to load in some props
// // MUST BE CTX ('context' did not work)

// // MyApp.getInitialProps = ({ ctx }: any) => ({
// //   // the props aboce pass in the color scheme
// //   colorScheme: getCookie('mantine-color-scheme', ctx) || 'n ',
// // })

// // export function getStaticProps(ctx: any) {
// //   return {
// //     props: {
// //       colorScheme: getCookie('mantine-color-scheme', ctx) || 'n ',
// //     }
// //   }
// // }

// // export const getServerSideProps = ({ req, res }) => {
// //   setCookie('test', 'value', { req, res, maxAge: 60 * 6 * 24 });
// //   getCookie('test', { req, res });
// //   getCookies({ req, res });
// //   deleteCookie('test', { req, res });

// //   return { props: {} };
// // };

// export default MyApp