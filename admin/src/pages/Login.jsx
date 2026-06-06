import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (values) => dispatch(login(values));

  return (
    <div className="min-h-screen grid place-items-center bg-ink px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-3xl font-extrabold">
            <span className="text-white">BI</span><span className="text-highlight">CARD</span>
          </span>
          <p className="text-gray-400 mt-1">Admin Portal</p>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-extrabold mb-1">Sign in</h1>
          <p className="text-ink-light text-sm mb-6">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" autoComplete="email" {...register('email', { required: true })} />
              {errors.email && <span className="text-accent text-xs">Email is required</span>}
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" autoComplete="current-password" {...register('password', { required: true })} />
              {errors.password && <span className="text-accent text-xs">Password is required</span>}
            </div>

            {error && <div className="bg-accent-50 text-accent text-sm rounded-lg p-3">{error}</div>}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
              {status === 'loading' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">© 2026 BICARD. Authorized access only.</p>
      </div>
    </div>
  );
}
