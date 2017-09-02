// tslint:disable-next-line:no-import-side-effect
import 'react';

declare module 'react' {
  // tslint:disable-next-line:no-unnecessary-qualifier
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
