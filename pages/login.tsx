import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
// import GithubLogin from "../components//LoginPages/GithubLogin"
// import EmailLogin from "../components/LoginPages/EmailLogin"
// import GoogleLogin from "../components//LoginPages/GoogleLogin"
// import { LoginPage } from "../components/LoginPages/Login"
import { LoginPage } from '@/components/SignupPages/NewLogin';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const Router = useRouter();

  if (currentUser) {
    Router.push('/');
    return <></>;
  } else {
    return <LoginPage />;
  }
};

export default Login;
