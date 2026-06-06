import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/SEO';
import { submitContact } from '../services/content.service';
import { getRecaptchaToken } from '../utils/recaptcha';

export default function Contact() {
  const settings = useSelector((s) => s.settings.data);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const onSubmit = async (values) => {
    setStatus(null);
    try {
      const recaptchaToken = await getRecaptchaToken('contact');
      const res = await submitContact({ ...values, recaptchaToken });
      setStatus('success');
      setMessage(res.message || 'Thank you! We will get back to you shortly.');
      reset();
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <SEO title="Contact Us" description="Get in touch with BICARD for course enquiries and free career counselling." />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Get in touch</h1>
          <p className="mt-2 text-brand-100">Have a question? Our counsellors are here to help.</p>
        </div>
      </section>

      <section className="container-bicard py-12 grid lg:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold">Contact information</h2>
          <ul className="space-y-5">
            {settings?.address && (
              <li className="flex gap-4">
                <span className="h-11 w-11 grid place-items-center rounded-full bg-brand-50 text-brand text-lg shrink-0"><FaMapMarkerAlt /></span>
                <div><div className="font-bold">Address</div><div className="text-ink-light">{settings.address}</div></div>
              </li>
            )}
            {settings?.contactNumber && (
              <li className="flex gap-4">
                <span className="h-11 w-11 grid place-items-center rounded-full bg-brand-50 text-brand text-lg shrink-0"><FaPhoneAlt /></span>
                <div><div className="font-bold">Phone</div><a href={`tel:${settings.contactNumber}`} className="text-ink-light hover:text-brand">{settings.contactNumber}</a></div>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-4">
                <span className="h-11 w-11 grid place-items-center rounded-full bg-brand-50 text-brand text-lg shrink-0"><FaEnvelope /></span>
                <div><div className="font-bold">Email</div><a href={`mailto:${settings.email}`} className="text-ink-light hover:text-brand">{settings.email}</a></div>
              </li>
            )}
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-card shadow-card p-6">
          {status === 'success' ? (
            <div className="bg-brand-50 text-brand rounded p-6 text-center font-semibold">{message}</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Full name</label>
                <input className="input" {...register('name', { required: true })} />
                {errors.name && <span className="text-accent text-xs">Name is required</span>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" {...register('email', { required: true })} />
                  {errors.email && <span className="text-accent text-xs">Email is required</span>}
                </div>
                <div>
                  <label className="label">Mobile</label>
                  <input className="input" {...register('mobile')} />
                </div>
              </div>
              <div>
                <label className="label">Course of interest</label>
                <input className="input" placeholder="e.g. Embedded Systems & IoT" {...register('course')} />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input" rows="4" {...register('message')} />
              </div>
              {status === 'error' && <div className="text-accent text-sm">{message}</div>}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
