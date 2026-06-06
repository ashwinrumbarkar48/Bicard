import { useEffect, useState, useRef } from 'react';

/**
 * Tiny data-fetching hook. Re-runs whenever any value in `deps` changes.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.error || err.message || 'Something went wrong');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
