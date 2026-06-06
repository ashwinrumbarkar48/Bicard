import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBars, FaTimes, FaPhoneAlt, FaChevronDown } from 'react-icons/fa';
import { assetUrl } from '../services/api';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/training', label: 'Training' },
  {
    label: 'Services',
    children: [
      { to: '/placements', label: 'Placements' },
      { to: '/staffing-solutions', label: 'Staffing Solutions' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { to: '/faculty', label: 'Faculty' },
      { to: '/blogs', label: 'Blog' },
      { to: '/gallery', label: 'Gallery' },
    ],
  },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSelector((s) => s.settings.data);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold rounded transition-colors ${
      isActive ? 'text-brand' : 'text-ink hover:text-brand'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-nav">
      <div className="container-bicard flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {settings?.logo ? (
            <img src={assetUrl(settings.logo)} alt="BICARD" className="h-9 w-auto" />
          ) : (
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-brand">BI</span>
              <span className="text-accent">CARD</span>
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <button className="px-3 py-2 text-sm font-semibold rounded text-ink hover:text-brand inline-flex items-center gap-1">
                  {item.label}
                  <FaChevronDown className="text-[10px] mt-0.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                  <div className="min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    {item.children.map((c) => (
                      <NavLink
                        key={c.to}
                        to={c.to}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm font-semibold ${isActive ? 'text-brand bg-brand/5' : 'text-ink hover:text-brand hover:bg-gray-50'}`
                        }
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {settings?.contactNumber && (
            <a href={`tel:${settings.contactNumber}`} className="flex items-center gap-2 text-sm font-semibold text-brand">
              <FaPhoneAlt /> {settings.contactNumber}
            </a>
          )}
          <Link to="/contact" className="btn-accent">Enroll Now</Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-2xl text-ink" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container-bicard py-3 flex flex-col">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="py-1">
                  <div className="py-2 text-xs font-bold uppercase tracking-wide text-ink-light">{item.label}</div>
                  {item.children.map((c) => (
                    <NavLink
                      key={c.to}
                      to={c.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block pl-4 py-2.5 text-base font-semibold ${isActive ? 'text-brand' : 'text-ink'}`
                      }
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 text-base font-semibold ${isActive ? 'text-brand' : 'text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-accent mt-3">
              Enroll Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
