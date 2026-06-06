import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitInquiry } from '../services/content.service';
import { getRecaptchaToken } from '../utils/recaptcha';

export default function InquiryForm({ courseTitle }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');

  const onSubmit = async (values) => {
    setStatus(null);
    try {
      const recaptchaToken = await getRecaptchaToken('inquiry');
      const res = await submitInquiry({ ...values, course: courseTitle, recaptchaToken });
      setStatus('success');
      setMessage(res.message || 'Thank you! We will reach out shortly.');
      reset();
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return <div className="bg-brand-50 text-brand rounded p-4 text-sm font-semibold">{message}</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input className="input" placeholder="Your name" {...register('name', { required: true })} />
        {errors.name && <span className="text-accent text-xs">Name is required</span>}
      </div>
      <div>
        <input className="input" placeholder="Email" type="email" {...register('email', { required: true })} />
        {errors.email && <span className="text-accent text-xs">Email is required</span>}
      </div>
      <div>
        <input className="input" placeholder="Mobile number" {...register('mobile')} />
      </div>
      <textarea className="input" rows="3" placeholder="Message (optional)" {...register('message')} />
      {status === 'error' && <div className="text-accent text-sm">{message}</div>}
      <button type="submit" disabled={isSubmitting} className="btn-accent w-full">
        {isSubmitting ? 'Sending…' : 'Request a Call Back'}
      </button>
    </form>
  );
}
