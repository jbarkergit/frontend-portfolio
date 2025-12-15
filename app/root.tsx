import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { StrictMode } from 'react';
import type { Route } from './+types/root';
import AuthProvider from './base/firebase/authentication/context/authProvider';
import styles from '/app/base/sass/stylesheets.scss?url';

export function meta() {
  return [
    { title: 'Portfolio' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Front End Web Development Portfolio' },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: 'shortcut icon', href: '#' },
  { rel: 'stylesheet', href: styles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </StrictMode>
  );
}

export function HydrateFallback() {
  return (
    <div className='hydrateFallback'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='6em'
        height='6em'
        viewBox='0 0 24 24'>
        <path
          fill='currentColor'
          d='M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z'
          opacity='.5'
        />
        <path
          fill='currentColor'
          d='M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z'>
          <animateTransform
            attributeName='transform'
            dur='1s'
            from='0 12 12'
            repeatCount='indefinite'
            to='360 12 12'
            type='rotate'
          />
        </path>
      </svg>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const err: { message: string; details: string; stack: string | undefined } = {
    message: 'Oops!',
    details: 'An unexpected error occurred.',
    stack: undefined,
  };

  if (isRouteErrorResponse(error)) {
    err.message = error.status === 404 ? '404' : 'Error';
    err.details =
      error.status === 404
        ? 'The browser was able to communicate with the server; however, the requested page could not be found.'
        : error.statusText || err.details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    err.details = error.message;
    err.stack = error.stack;
  }

  return (
    <main className='protocolError'>
      <article>
        <h1>{err.message}</h1>
        <p>
          <span>{err.details}.</span>
          <span>
            Please return to the{' '}
            <Link
              to='/'
              aria-label='Return to application hub'>
              {'application hub '}
            </Link>
            {'to continue browsing.'}
          </span>
        </p>
      </article>
    </main>
  );
}
