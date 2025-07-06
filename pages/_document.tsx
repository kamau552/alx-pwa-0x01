import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
<Html lang="en">
  <Head>
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icons/apple-icon-152x152.png" />
    <meta name="theme-color" content="#FFFFFF" />
  </Head>
  <body className="antialiased">
    <Main />
    <NextScript />
  </body>
</Html>
  );
}
