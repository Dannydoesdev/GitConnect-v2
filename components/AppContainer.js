import {
  AppShell,
  Footer,
  Group,
  Header,
  Text
} from '@mantine/core'
import { ColorModeSwitcher } from "../components/ColorModeSwitcher"
import { useState } from 'react'

export const AppContainer = ({ children }, props) => {


  // console.log(props)
  // // const { Component, pageProps } = props;
  // //What colour scheme the user prefers
  // // const preferredColorScheme = useColorScheme();

  // // Loading the scheme in with props instead - sent via cookie fn below
  // const [colorScheme, setColorScheme] = useState(props.colorScheme)
  // // set to value OR the colorscheme
  //   const toggleColorScheme = (value) => {
  //     // console.log('value' + value)
  //   const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
  //   setColorScheme(nextColorScheme);
  //   setCookies('mantine-color-scheme', nextColorScheme, {maxAge: 60*60*24*30})
  // }


  return (
    <AppShell
      styles={{
        main: {
          // background: "#FFFFFF",
          width: "100vw",
          height: "100vg",
          paddingLeft: "0px",
        }
      }}
      // boolean fixed = fixed on every single page
      fixed 
      //can pass a component in now
      footer={
        <Footer height={60} p="md">
          {/* Setup flex with Group - note spacing and sizing is set based on word sizes (xl etc) */}
          <Group position="apart" spacing="xl">
            {/* Can also use regular styling (like fontWeight) */}
            <Text size="sm:"><span style={{ fontWeight: "bolder" }}> Copyright </span> Daniel McGee 2022</Text>
            {/* <Text size="sm:"><span style={{ fontWeight: "bolder" }}>🎉 End Time: </span> 7:51pm</Text> */}
            </Group>
        </Footer>
      }
      // pass in the header and use divs with CSS styling instead of 'Group'
      header={
        // p = padding size
        <Header height={90} p="md" mt='sm'>
          <Group position="apart" align='center' spacing="xl" height='100%'>
          {/* <div style={{ display: 'flex', alignItems: 'center', height:"100%" }}> */}
            <Text size='xl' weight="bolder">GitConnect;</Text>
            <ColorModeSwitcher />
            </Group>
          {/* </div> */}
          
        </Header>
      }
    >
      {children}
    </AppShell>
  )
}

// Theme can be based on 'system'
// App is going to load in some props
// MUST BE CTX ('context' did not work)
// AppContainer.getInitialProps = ({ ctx }) => ({
  // the props aboce pass in the color scheme
  // colorScheme: getCookie('mantine-color-scheme', ctx) || 'n ',
// })