import { Link } from 'react-router-dom';
import { FaRegClock, FaArrowRight } from 'react-icons/fa';
import { assetUrl } from '../services/api';
import { StarRating } from './ui';

const placeholder =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=60';

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} className="course-card group h-full">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={assetUrl(course.image, placeholder)}
          alt={course.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {course.duration && (
          <span className="absolute top-3 left-3 badge bg-white/90 backdrop-blur text-ink shadow">
            <FaRegClock className="mr-1" /> {course.duration}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {course.title}
        </h3>
        <p className="text-ink-light text-sm mt-1.5 line-clamp-2">{course.shortDescription}</p>

        <div className="mt-2.5">
          <StarRating value={course.rating || 4.7} count={course.ratingCount || '1,200'} />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
          <span className="text-lg font-extrabold text-ink">{course.fees || 'Enquire'}</span>
          <span className="text-brand font-bold text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
            View <FaArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
