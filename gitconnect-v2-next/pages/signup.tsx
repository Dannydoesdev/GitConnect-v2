import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
// import GithubLogin from "../components/LoginPages/GithubLogin"
// import EmailSignup from "../components/SignupPages/EmailSignup"
// import GoogleLogin from "../components/LoginPages/GoogleLogin"
import { SignupPage } from '../components/SignupPages/NewSignup';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const { currentUser, loading, setupComplete, isNewUser, isAnonymous } =
    useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (
      setupComplete &&
      !loading &&
      router.pathname === '/signup' &&
      currentUser &&
      !isAnonymous
    ) {
      if (isNewUser) {
        router.replace('/addproject');
      } else {
        router.replace('/');
      }
    }
  }, [currentUser, loading, setupComplete, isNewUser, router, isAnonymous]);

  // Only show signup page if:
  // 1. We're not authenticated OR
  // 2. We're still setting up
  if (!currentUser || !setupComplete || isAnonymous) {
    return <SignupPage />;
  }

  return null;
};

export default Signup;
