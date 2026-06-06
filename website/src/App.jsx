import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadSettings } from './store/settingsSlice';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  return <AppRoutes />;
}
