import { captureRemixErrorBoundaryError } from "@sentry/remix";
// import { cssBundleHref } from "@remix-run/css-bundle";
import { type LoaderFunction, type LinksFunction, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import appStylesheet from "~/styles/app.css";
import tailwindStylesheet from "~/styles/tailwind.css";
import nProgressStyles from "~/styles/nprogress.css";
import { useNProgress } from "./hooks/use-nprogress";

export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      ONEAUTH_API_HOST: process.env.ONEAUTH_API_HOST,
      PUBLIC_URL: process.env.PUBLIC_URL,
    },
  });
};

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-Light.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-Regular.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-Medium.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-Bold.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-BoldItalic.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    href: "/fonts/CWC-INDIA.woff2",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: appStylesheet },
  { rel: "stylesheet", href: tailwindStylesheet },
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default function App() {
  const { ENV } = useLoaderData();
  useNProgress();
  return (
    <html lang="en">
      <head>
        <title>Coding Blocks | ICC Cricket World Cup 2023 </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W5VWF3QB');`
        }}
        />
        {/* Google Tag Manager */}
        
        <Links />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5VWF3QB"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}

        <script src="https://unpkg.com/@coding-blocks/web-components@1.8.4/dist/index.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
