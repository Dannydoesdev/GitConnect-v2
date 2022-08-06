import {
  AppShell,
  Footer,
  Group,
  Header,
  Text,
  Button
} from '@mantine/core'
import { ColorModeSwitcher } from "../components/ColorModeSwitcher"
import { useState, useContext } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signOut } from "firebase/auth"


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



  const { userData, currentUser } = useContext(AuthContext)
  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  const signOutHandler = async () => {
    await signOut(auth)
    // Router.push("/login")
  }

  const signInHandler = () => {
    Router.push("/login")
  }

  const registerHandler = () => {
    Router.push("/signup")
  }

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
      fixed={true} 
      //can pass a component in now
      footer={
        <Footer height={60} p="md">
          {/* Setup flex with Group - note spacing and sizing is set based on word sizes (xl etc) */}
          <Group position="apart" spacing="xl">
            {/* Can also use regular styling (like fontWeight) */}
            <Text size="sm:"><span style={{ fontWeight: "bolder" }}> Copyright </span> GitConnect; 2022</Text>
            
            </Group>
        </Footer>
      }
      // pass in the header and use divs with CSS styling instead of 'Group'
      header={
        // p = padding size
        <Header height={65} p="xs" mt='xs'>
          <Group position="apart" align='center' spacing="" height='100%'>
            <Group>
          {/* <div style={{ display: 'flex', alignItems: 'center', height:"100%" }}> */}
          <Link href='/' passHref><Text component='a' className='dark:text-white' size='xl' weight="bolder">GitConnect;</Text></Link>
            <ColorModeSwitcher />
            </Group>

            {/* NAV BUTTONS FOR SIGNED IN USER */}

            {currentUser ?
            <>
                <Group position='center'>
                  <Link href='/userinfo' passHref><Text component='a' className='dark:text-white' size='md' weight="bolder">User</Text></Link>
                  <Link href='/getrepos' passHref><Text component='a' className='dark:text-white' size='md' weight="bolder">Add Repos</Text></Link>
                  <Link href='/profiles/projects' passHref><Text component='a' className='dark:text-white' size='md' weight="bolder">Projects</Text></Link>
                  {/* <Link href='/profiles' passHref><Text component='a' className='dark:text-white' size='md' weight="bolder">Find Profiles</Text></Link> */}
              </Group>
              <Group>
      <Link href="#" passHref>
        <Button
            component="a"
            size='xs'
            onClick={signOutHandler}
          // className='mx-auto'
          sx={(theme) => ({
            // subscribe to color scheme changes
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
          })}
        >Sign out</Button>
        </Link>
        </Group>
                
                {/* <Group>
           
                
          <button
          className="text-center p-2 border-2 bg-gray-800 px-5 text-white rounded-lg block"
          onClick={signOutHandler}
        >
          Sign out
        </button>
                </Group> */}
              </>
              :
             
          //      <Group>
          //      <button
          //    className="text-center p-2 border-2 bg-gray-800 px-5 text-white rounded-lg block"
          //    onClick={signInHandler}
          //  >
          //    Sign in
          //          </button>
          //          <button
          //      className="text-center p-2 border-2 bg-gray-800 text-white rounded-lg block"
          //      onClick={registerHandler}
          //    >
          //      Create account
          //    </button>
              
          //     </Group> 
                   <Group>
                   <Link href="#" passHref>
                     <Button
                         component="a"
                         size='xs'
                         onClick={signInHandler}
                       // className='mx-auto'
                       sx={(theme) => ({
                         // subscribe to color scheme changes
                         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
                       })}
                     >Sign in</Button>
                </Link>
                <Link href="#" passHref>
                     <Button
                         component="a"
                         size='xs'
                         onClick={registerHandler}
                       // className='mx-auto'
                       sx={(theme) => ({
                         // subscribe to color scheme changes
                         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
                       })}
                     >Create Account</Button>
                     </Link>
                     </Group>     
          }
                 
            </Group>
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