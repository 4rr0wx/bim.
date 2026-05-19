import { useEffect, useState } from 'react';

type ApiState<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'ready'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };

export function useApi<T>(loader: () => Promise<T>, deps: unknown[]): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    loader()
      .then((data) => {
        if (active) {
          setState({ status: 'ready', data });
        }
      })
      .catch((error: Error) => {
        if (active) {
          setState({ status: 'error', error });
        }
      });

    return () => {
      active = false;
    };
  }, deps);

  return state;
}
