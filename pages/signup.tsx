import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { doc, getDoc } from 'firebase/firestore';
// import GithubLogin from "../components/LoginPages/GithubLogin"
// import EmailSignup from "../components/SignupPages/EmailSignup"
// import GoogleLogin from "../components/LoginPages/GoogleLogin"
import { SignupPage } from '../components/SignupPages/NewSignup';
import { AuthContext } from '../context/AuthContext';
import Loading from './loading';
// import { db } from '../firebase/clientApp';

const Signup = () => {
  const { currentUser, loading, setupComplete, isNewUser, userData } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Debug logging
    // console.log('Auth State:', {
    //   currentUser: currentUser,
    //   userData: userData,
    //   loading,
    //   setupComplete,
    //   isNewUser,
    //   currentPath: router.pathname
    // });

    // Only handle redirects when:
    // 1. Setup is complete
    // 2. We're not loading
    // 3. We're actually on the signup page (prevents redirect loops)
    // 4. We have a currentUser (authenticated)
    if (setupComplete && 
        !loading && 
        router.pathname === '/signup' && 
        currentUser) {
      
      // Use router.replace to avoid adding to history
      if (isNewUser) {
        router.replace('/addproject');
      } else {
        router.replace('/');
      }
    }
  }, [currentUser, loading, setupComplete, isNewUser, router]);

  // If we're in a loading state, we could show a loading indicator
  // if (loading) {
  //   return <Loading />; // You might want to replace this with a proper loading component
  // }

  // Only show signup page if:
  // 1. We're not authenticated OR
  // 2. We're still setting up
  if (!currentUser || !setupComplete) {
    return <SignupPage />;
  }

  // This will show briefly while the redirect is happening
  return null;
};

export default Signup;

// console.log('currentUser in Signup.tsx useEffect:')
// console.log(currentUser)
// console.log('loading in Signup.tsx useEffect:')
// console.log(loading)
// console.log('userData in Signup.tsx useEffect:')
// console.log(userData)
// const handleAuthState = async () => {
//   if (currentUser && !loading) {
//     // Check if user document exists
//     const userDocRef = doc(db, `users/${currentUser.uid}/profileData/publicData`);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       console.log('User doc exists');
//       const userDocData = userDoc.data();
//       const createdAt = userDocData.gitconnect_created_at_unix;
//       console.log('createdAt:', createdAt);
//       const isNewUser = Date.now() - createdAt < 100000; // Within last 10 seconds
//       console.log('is new user calculation:', Date.now() - createdAt);
//       console.log('isNewUser:', isNewUser);

//       if (isNewUser) {
//         console.log('New user detected, redirecting to addproject');
//         Router.push("/addproject");
//       } else {
//         console.log('Existing user detected, redirecting to home');
//         Router.push("/");
//       }
//     }
//     // If doc doesn't exist yet, we wait for AuthContext to create it
//     console.log('User doc does not exist yet, waiting for AuthContext to create it');
//   }
// };

// handleAuthState();
// }, [currentUser, loading, Router]);
