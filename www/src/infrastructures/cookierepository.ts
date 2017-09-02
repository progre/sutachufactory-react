import * as Cookies from 'js-cookie';
import { sync as uid } from 'uid-safe';

export function getOrCreateToken() {
  const existsToken = Cookies.get('user-token');
  if (existsToken) {
    return existsToken;
  }
  const newToken = uid(16);
  Cookies.set('user-token', newToken, { expires: 365 });
  return newToken;
}

export function setName(name: string) {
  Cookies.set('name', name, { expires: 365 });
}

export function getName() {
  return Cookies.get('name');
}
