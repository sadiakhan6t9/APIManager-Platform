import '../styles/globals.css';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

const noLayoutPages = ['/login', '/register'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showLayout = !noLayoutPages.includes(router.pathname);

  return (
    <>
      {showLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
