import { Link } from 'react-router-dom';
import { assetUrl } from '../services/api';

const placeholder =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=60';

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blogs/${blog.slug}`} className="course-card group h-full">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={assetUrl(blog.featuredImage, placeholder)}
          alt={blog.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {blog.category && <span className="badge bg-brand-50 text-brand mb-2 w-fit">{blog.category}</span>}
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-brand">{blog.title}</h3>
        <span className="text-ink-light text-xs mt-auto pt-3">
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
        </span>
      </div>
    </Link>
  );
}
