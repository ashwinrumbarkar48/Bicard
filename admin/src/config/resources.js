/**
 * Declarative config for the generic admin CRUD pages.
 * Each entry describes how to list and edit one backend resource.
 *
 * Field types: text | textarea | richtext | number | select | toggle |
 *              image | list (string[]) | tags (string[]) | faqs ([{question,answer}])
 */
export const resources = {
  courses: {
    label: 'Courses',
    singular: 'Course',
    endpoint: 'courses',
    imageField: 'image',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Type' },
      { key: 'duration', label: 'Duration' },
      { key: 'fees', label: 'Fees' },
      { key: 'isPublished', label: 'Status', type: 'published' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      {
        name: 'category',
        label: 'Type',
        type: 'select',
        half: true,
        options: [
          { value: 'Course', label: 'Course (short-term)' },
          { value: 'Training', label: 'Training (diploma / program)' },
        ],
      },
      { name: 'shortDescription', label: 'Short Description', type: 'textarea' },
      { name: 'description', label: 'Full Description', type: 'richtext' },
      { name: 'duration', label: 'Duration', type: 'text', half: true },
      { name: 'fees', label: 'Fees', type: 'text', half: true },
      { name: 'image', label: 'Cover Image', type: 'image' },
      { name: 'curriculum', label: 'Curriculum (one item per line)', type: 'list' },
      { name: 'benefits', label: 'Benefits (one item per line)', type: 'list' },
      { name: 'faqs', label: 'FAQs', type: 'faqs' },
      { name: 'metaTitle', label: 'Meta Title (SEO)', type: 'text' },
      { name: 'metaDescription', label: 'Meta Description (SEO)', type: 'textarea' },
      { name: 'isPublished', label: 'Published', type: 'toggle' },
    ],
  },

  blogs: {
    label: 'Blogs',
    singular: 'Blog Post',
    endpoint: 'blogs',
    imageField: 'featuredImage',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', half: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        half: true,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },
      { name: 'content', label: 'Content', type: 'richtext' },
      { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { name: 'metaTitle', label: 'Meta Title (SEO)', type: 'text' },
      { name: 'metaDescription', label: 'Meta Description (SEO)', type: 'textarea' },
    ],
  },

  faculty: {
    label: 'Faculty',
    singular: 'Faculty Member',
    endpoint: 'faculty',
    imageField: 'photo',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'experience', label: 'Experience' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', half: true },
      { name: 'qualification', label: 'Qualification', type: 'text', half: true },
      { name: 'experience', label: 'Experience', type: 'text', half: true },
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'description', label: 'Bio', type: 'textarea' },
    ],
  },

  'placement-partners': {
    label: 'Placement Partners',
    singular: 'Partner',
    endpoint: 'placement-partners',
    imageField: 'logo',
    columns: [
      { key: 'companyName', label: 'Company' },
      { key: 'website', label: 'Website' },
    ],
    fields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { name: 'website', label: 'Website URL', type: 'text' },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  testimonials: {
    label: 'Testimonials',
    singular: 'Testimonial',
    endpoint: 'testimonials',
    imageField: 'image',
    columns: [
      { key: 'studentName', label: 'Student' },
      { key: 'course', label: 'Course' },
      { key: 'rating', label: 'Rating' },
    ],
    fields: [
      { name: 'studentName', label: 'Student Name', type: 'text', required: true },
      { name: 'course', label: 'Course', type: 'text', half: true },
      { name: 'rating', label: 'Rating (0-5)', type: 'number', half: true },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'testimonial', label: 'Testimonial', type: 'textarea' },
    ],
  },

  pages: {
    label: 'Pages',
    singular: 'Page',
    endpoint: 'pages',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'isPublished', label: 'Status', type: 'published' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext' },
      { name: 'metaTitle', label: 'Meta Title (SEO)', type: 'text' },
      { name: 'metaDescription', label: 'Meta Description (SEO)', type: 'textarea' },
      { name: 'isPublished', label: 'Published', type: 'toggle' },
    ],
  },

  gallery: {
    label: 'Gallery',
    singular: 'Gallery Item',
    endpoint: 'gallery',
    imageField: 'image',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', half: true },
      { name: 'videoUrl', label: 'Video URL (optional)', type: 'text', half: true },
      { name: 'image', label: 'Image', type: 'image', required: true },
    ],
  },
};

export const getResource = (key) => resources[key];
