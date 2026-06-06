import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ScrollToTop from '../components/ScrollToTop';

import Home from '../pages/Home';
import About from '../pages/About';
import Courses from '../pages/Courses';
import Training from '../pages/Training';
import CourseDetails from '../pages/CourseDetails';
import Blogs from '../pages/Blogs';
import BlogDetails from '../pages/BlogDetails';
import Faculty from '../pages/Faculty';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Placements from '../pages/Placements';
import StaticPage from '../pages/StaticPage';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/training" element={<Training />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/staffing-solutions" element={<StaticPage slug="staffing-solutions" fallbackTitle="Staffing Solutions" />} />
          <Route path="/terms" element={<StaticPage slug="terms-conditions" fallbackTitle="Terms & Conditions" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
