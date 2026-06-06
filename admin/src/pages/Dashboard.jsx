import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FaUserFriends, FaBook, FaBlog, FaChalkboardTeacher, FaQuoteRight } from 'react-icons/fa';
import api from '../services/api';
import { PageHeader, Loading } from '../components/ui';

const PIE_COLORS = ['#00633F', '#C6272B', '#FDD303', '#42a079'];

const cardMeta = [
  { key: 'totalLeads', label: 'Total Leads', icon: FaUserFriends, color: 'bg-brand' },
  { key: 'totalCourses', label: 'Courses', icon: FaBook, color: 'bg-accent' },
  { key: 'totalBlogs', label: 'Blogs', icon: FaBlog, color: 'bg-highlight text-ink' },
  { key: 'totalFaculty', label: 'Faculty', icon: FaChalkboardTeacher, color: 'bg-ink' },
  { key: 'totalTestimonials', label: 'Testimonials', icon: FaQuoteRight, color: 'bg-brand-700' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard…" />;
  if (!data) return <div className="text-ink-light">Unable to load dashboard.</div>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your CMS content and leads" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cardMeta.map((c) => (
          <div key={c.key} className="card p-5">
            <div className={`h-11 w-11 rounded-lg grid place-items-center text-white text-lg mb-3 ${c.color}`}>
              <c.icon />
            </div>
            <div className="text-2xl font-extrabold">{data.cards[c.key] ?? 0}</div>
            <div className="text-ink-light text-sm">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly leads */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-extrabold mb-4">Monthly Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.charts.monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#00633F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inquiry sources */}
        <div className="card p-6">
          <h3 className="font-extrabold mb-4">Inquiry Sources</h3>
          {data.charts.inquirySources.length === 0 ? (
            <p className="text-ink-light text-sm py-20 text-center">No leads yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.charts.inquirySources}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {data.charts.inquirySources.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
