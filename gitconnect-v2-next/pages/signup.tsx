import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
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

  if (!currentUser || !setupComplete || isAnonymous) {
    return <SignupPage />;
  }

  return null;
};

export default Signup;
