import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signOut } from "firebase/auth"
import AuthRoute from "../HoC/authRoute"
import { AuthContext } from "../context/AuthContext"
import { ColorModeSwitcher } from "../components/ColorModeSwitcher"


const Index: NextPage = () => {
  
  console.log('index page')

  const { userData, currentUser } = useContext(AuthContext)
  // const { currentUser } = useContext(AuthContext)
  const Router = useRouter()

  const signOutHandler = async () => {
    await signOut(auth)
  }

  const signInHandler = () => {
    Router.push("/login")
  }

  const registerHandler = () => {
    Router.push("/signup")
  }

  console.log(userData)

  if (currentUser) {
    return (
      // <AuthRoute>
      <div>
        <h1 className="text-8xl dark:text-white text-center font-black">GitConnect;</h1>
    
        <div className="mt-4 flex flex-col gap-y-2">
          {/* Lay out logged in user data on page */}
          {Object.entries(userData).map(([key, value]: any, index) => {
            return (
              <div key={index} className="flex gap-x-3 items-center justify-center">
                <h4>{key}:</h4>
                <h6>{value ? value : 'Not Provided'}</h6>
              </div>
            )
          })}


          <div className="flex gap-x-3 items-center justify-center">
            <h4>Profile picture</h4>
            {userData.userPhotoLink ? (
              <img
                className="rounded-full object-contain w-32 h-32"
                src={userData.userPhotoLink}
                alt={userData.userName}
              />
            ) : (
              "null"
            )}
          </div>
        </div>
      </div>
      // /* </AuthRoute> */
    )
  } else {
    return (
      <div>
        {/* Can't get this component to work */}
        {/* <HeaderAction  />
         */}        
        <h1 className="text-8xl dark:text-white text-center font-black">GitConnect;</h1>
      <div className = 'flex flex-col justify-center items-center sm:flex-row'>
       
        </div>
      </div>
    )
  }


  return <></>
}

export default Index


// button example: 
{/* <button
          className="text-center p-3 border-2 bg-gray-800 text-white rounded-lg mx-auto block mt-10"
          onClick={signInHandler}
        > */}

// const Home: NextPage = () => {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center py-2">
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
//         <h1 className="text-6xl font-bold">
//           Welcome to{' '}
//           <a className="text-blue-600" href="https://nextjs.org">
//             Next.js!
//           </a>
//         </h1>

//         <p className="mt-3 text-2xl">
//           Get started by editing{' '}
//           <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
//             pages/index.tsx
//           </code>
//         </p>

//         <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
//           <a
//             href="https://nextjs.org/docs"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Find in-depth information about Next.js features and its API.
//             </p>
//           </a>

//           <a
//             href="https://nextjs.org/learn"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Learn &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Learn about Next.js in an interactive course with quizzes!
//             </p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Examples &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Discover and deploy boilerplate example Next.js projects.
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
//           >
//             <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
//             <p className="mt-4 text-xl">
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className="flex h-24 w-full items-center justify-center border-t">
//         <a
//           className="flex items-center justify-center gap-2"
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//         </a>
//       </footer>
//     </div>
//   )
// }

// export default Home
