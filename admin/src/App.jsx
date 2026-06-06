import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResourceCrud from './pages/ResourceCrud';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<ResourceCrud resourceKey="courses" />} />
          <Route path="/blogs" element={<ResourceCrud resourceKey="blogs" />} />
          <Route path="/faculty" element={<ResourceCrud resourceKey="faculty" />} />
          <Route path="/placement-partners" element={<ResourceCrud resourceKey="placement-partners" />} />
          <Route path="/testimonials" element={<ResourceCrud resourceKey="testimonials" />} />
          <Route path="/gallery" element={<ResourceCrud resourceKey="gallery" />} />
          <Route path="/pages" element={<ResourceCrud resourceKey="pages" />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Super Admin only */}
        <Route element={<ProtectedRoute roles={['Super Admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
