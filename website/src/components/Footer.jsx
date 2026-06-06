import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
};

export default function Footer() {
  const settings = useSelector((s) => s.settings.data);
  const social = settings?.socialLinks || {};
  const year = 2026;

  return (
    <footer className="relative bg-deep-dark text-gray-300 mt-20 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="relative container-bicard py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="text-2xl font-extrabold">
            <span className="text-white">BI</span>
            <span className="text-highlight">CARD</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Industry-focused Embedded Systems, VLSI & IoT training with 100% placement assistance. Be job-ready with BICARD.
          </p>
          <div className="flex gap-3 mt-5">
            {Object.entries(socialIcons).map(([key, Icon]) =>
              social[key] ? (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition-colors"
                  aria-label={key}
                >
                  <Icon className="text-sm" />
                </a>
              ) : null
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-highlight">Courses</Link></li>
            <li><Link to="/training" className="hover:text-highlight">Training</Link></li>
            <li><Link to="/about" className="hover:text-highlight">About Us</Link></li>
            <li><Link to="/blogs" className="hover:text-highlight">Blog</Link></li>
            <li><Link to="/gallery" className="hover:text-highlight">Gallery</Link></li>
            <li><Link to="/terms" className="hover:text-highlight">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/placements" className="hover:text-highlight">Placements</Link></li>
            <li><Link to="/staffing-solutions" className="hover:text-highlight">Staffing Solutions</Link></li>
            <li><Link to="/faculty" className="hover:text-highlight">Faculty</Link></li>
            <li><Link to="/training" className="hover:text-highlight">P.G Diploma in Embedded Systems</Link></li>
            <li><Link to="/training" className="hover:text-highlight">Accelerated Career Program (nasscom)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            {settings?.address && (
              <li className="flex gap-2"><FaMapMarkerAlt className="mt-1 text-highlight shrink-0" /> {settings.address}</li>
            )}
            {settings?.contactNumber && (
              <li className="flex gap-2"><FaPhoneAlt className="mt-1 text-highlight shrink-0" /> <a href={`tel:${settings.contactNumber}`} className="hover:text-highlight">{settings.contactNumber}</a></li>
            )}
            {settings?.email && (
              <li className="flex gap-2"><FaEnvelope className="mt-1 text-highlight shrink-0" /> <a href={`mailto:${settings.email}`} className="hover:text-highlight">{settings.email}</a></li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-bicard py-5 text-center text-sm text-gray-400">
          © {year} BICARD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
