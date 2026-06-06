import { useSelector } from 'react-redux';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

// Strip everything except digits; wa.me needs a country-coded number with no "+" or spaces.
const toWaNumber = (raw) => (raw || '').replace(/[^\d]/g, '');

export default function FloatingContact() {
  const settings = useSelector((s) => s.settings.data);
  const phone = settings?.contactNumber;
  const wa = toWaNumber(settings?.whatsappNumber || settings?.contactNumber);

  if (!phone && !wa) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {wa && (
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent("Hi BICARD, I'd like to know more about your courses.")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white text-2xl shadow-lg hover:scale-110 transition-transform"
        >
          <FaWhatsapp />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          aria-label="Call BICARD"
          className="h-14 w-14 grid place-items-center rounded-full bg-brand text-white text-xl shadow-lg hover:scale-110 transition-transform"
        >
          <FaPhoneAlt />
        </a>
      )}
    </div>
  );
}
