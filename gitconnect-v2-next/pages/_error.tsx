import { NextPageContext } from 'next';
import NextError from 'next/error'
// import Error from 'next/error';

type ErrorProps = {
  statusCode: number;
};

const Error = ({ statusCode }: ErrorProps) => {
  return (
    <NextError statusCode={statusCode} />
    // <p>
    //   {statusCode
    //     ? `An error ${statusCode} occurred on server`
    //     : 'An error occurred on client'}
    // </p>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

