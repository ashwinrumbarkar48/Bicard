import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaTachometerAlt, FaBook, FaBlog, FaChalkboardTeacher, FaHandshake,
  FaQuoteRight, FaImages, FaFileAlt, FaUserFriends, FaCog, FaUsersCog, FaSignOutAlt, FaBars, FaTimes,
} from 'react-icons/fa';
import { logout } from '../store/authSlice';

const nav = [
  { to: '/', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/courses', label: 'Courses', icon: FaBook },
  { to: '/blogs', label: 'Blogs', icon: FaBlog },
  { to: '/faculty', label: 'Faculty', icon: FaChalkboardTeacher },
  { to: '/placement-partners', label: 'Partners', icon: FaHandshake },
  { to: '/testimonials', label: 'Testimonials', icon: FaQuoteRight },
  { to: '/gallery', label: 'Gallery', icon: FaImages },
  { to: '/pages', label: 'Pages', icon: FaFileAlt },
  { to: '/leads', label: 'Leads', icon: FaUserFriends },
  { to: '/settings', label: 'Settings', icon: FaCog },
  { to: '/users', label: 'Users', icon: FaUsersCog, roles: ['Super Admin'] },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const items = nav.filter((n) => !n.roles || (user && n.roles.includes(user.role)));

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-ink text-white flex flex-col transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-xl font-extrabold">
            <span className="text-white">BI</span><span className="text-highlight">CARD</span>
            <span className="text-gray-400 text-xs font-semibold ml-2">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass} onClick={() => setOpen(false)}>
              <n.icon /> {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 border-t border-white/10 text-gray-300 hover:text-white text-sm font-semibold">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button className="lg:hidden text-xl" onClick={() => setOpen((v) => !v)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold leading-tight">{user?.name}</div>
              <div className="text-xs text-ink-light">{user?.role}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-brand text-white grid place-items-center font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
