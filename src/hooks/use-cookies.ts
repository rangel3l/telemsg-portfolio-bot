import Cookies from 'js-cookie';

interface CookieOptions {
  expires?: number;
  path?: string;
}

export const useCookies = () => {
  const setCookie = (name: string, value: unknown, options: CookieOptions = {}) => {
    try {
      const stringValue = JSON.stringify(value);
      Cookies.set(name, stringValue, {
        expires: options.expires || 7, // 7 dias por padrão
        path: options.path || '/',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  };

  const getCookie = (name: string) => {
    try {
      const value = Cookies.get(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  };

  const removeCookie = (name: string, options: CookieOptions = {}) => {
    Cookies.remove(name, {
      path: options.path || '/',
    });
  };

  return { setCookie, getCookie, removeCookie };
};
