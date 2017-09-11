// tslint:disable-next-line:import-name
import Head from 'next/head';
import Router from 'next/router';
import * as NProgress from 'nprogress';

Router.onRouteChangeStart = (url) => { NProgress.start(); };
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default function Header() {
  return (
    <Head>
      <link rel="stylesheet" href="/static/nprogress.css" />
      <link rel="stylesheet" href="/static/style.css" />
    </Head>
  );
}
