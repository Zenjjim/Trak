import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import theme from 'theme';
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta content={'HR-system for Blank AS'} name='description'></meta>
          <meta content={'TRAK'} key='ogtitle' property='og:title' />
          <meta content={'HR-system for Blank AS'} key='ogdesc' property='og:description' />
          <meta content={theme.palette.primary.main} name='theme-color' />
          <link href='https://fonts.googleapis.com/css?family=Lato:300,400,500,700&display=swap' rel='stylesheet' />
          <link href='https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,500,700&display=swap' rel='stylesheet' />
          <link href='/favicon.ico' rel='shortcut icon' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
