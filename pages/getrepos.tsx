import type { NextPage } from 'next'
import { AuthContext } from "../context/AuthContext"
import React, { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import AuthRoute from "../HoC/authRoute"


// runs BEFORE the component is rendered (as opposed to using useEffect)
export const getStaticProps = async () => {
  
  // const { userData } = useContext(AuthContext)
//   <AuthRoute>
//     console.log(userData)
// </AuthRoute>

  // returns a response object - pass it to JSON
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  // Make it into an array of objects
  const data = await res.json();

  // return the value from the function to be used in the browser - it has a props property

  // put things you want to make available in the component
  // NOTE the curly bracers - returning an object
  return {
    // gets attached to the props in the below component
    props: { companies: data }
  }
}

const GetRepos = ({companies}: any) => {

  console.log(companies)

  return (

    <h1>Hi</h1>

  )


}

export default GetRepos