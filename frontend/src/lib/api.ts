import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  type: 'IIT' | 'NIT' | 'IIIT' | 'Private' | 'Government' | 'Deemed';
  established: number;
  rating: number;
  total_reviews: number;
  annual_fees_min: number;
  annual_fees_max: number;
  placement_avg_package: number;
  placement_highest_package: number;
  placement_percentage: number;
  total_seats: number;
  nirf_rank: number;
  image_url: string;
  description: string;
  facilities: string[];
  accreditation: string;
  website: string;
  course_count?: number;
}

export interface Course {
  id: string;
  college_id: string;
  name: string;
  degree: string;
  duration: number;
  annual_fees: number;
  total_seats: number;
  exam_accepted: string[];
  cutoff_general: number;
}

export interface Review {
  id: string;
  college_id: string;
  reviewer_name: string;
  batch_year: number;
  rating: number;
  title: string;
  content: string;
  infrastructure_rating: number;
  faculty_rating: number;
  placement_rating: number;
  created_at: string;
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollegeDetailResponse {
  college: College;
  courses: Course[];
  reviews: Review[];
}

export interface PredictorResult {
  exam: string;
  rank: number;
  category: string;
  total: number;
  results: {
    safe: (College & { rank_min: number; rank_max: number })[];
    moderate: (College & { rank_min: number; rank_max: number })[];
    ambitious: (College & { rank_min: number; rank_max: number })[];
  };
}

export const collegesApi = {
  list: (params?: Record<string, string>) =>
    api.get<CollegesResponse>('/api/colleges', { params }),
  
  getById: (id: string) =>
    api.get<CollegeDetailResponse>(`/api/colleges/${id}`),
  
  compare: (ids: string[]) =>
    api.get<{ colleges: College[] }>('/api/colleges/compare/multi', {
      params: { ids: ids.join(',') }
    }),
  
  getFilters: () =>
    api.get<{ states: string[]; types: string[]; courses: string[] }>('/api/colleges/filters'),
};

export const predictorApi = {
  predict: (data: { exam: string; rank: number; category?: string }) =>
    api.post<PredictorResult>('/api/predictor', data),
  
  getExams: () =>
    api.get<{ exams: string[]; categories: string[] }>('/api/predictor/exams'),
};

export const formatFees = (fees: number): string => {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(1)}L`;
  }
  return `₹${(fees / 1000).toFixed(0)}K`;
};

export const formatPackage = (pkg: number): string => {
  if (pkg >= 10000000) {
    return `₹${(pkg / 10000000).toFixed(1)}Cr`;
  }
  if (pkg >= 100000) {
    return `₹${(pkg / 100000).toFixed(1)}L`;
  }
  return `₹${(pkg / 1000).toFixed(0)}K`;
};

export const typeColors: Record<string, string> = {
  'IIT': 'bg-amber-100 text-amber-800 border-amber-200',
  'NIT': 'bg-blue-100 text-blue-800 border-blue-200',
  'IIIT': 'bg-purple-100 text-purple-800 border-purple-200',
  'Deemed': 'bg-green-100 text-green-800 border-green-200',
  'Government': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Private': 'bg-pink-100 text-pink-800 border-pink-200',
};

// ---- Auth & Saved Items ----
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_color: string;
  created_at: string;
}

export interface SavedCollege extends College {
  saved_at: string;
}

export interface SavedComparison {
  id: string;
  college_ids: string[];
  label: string;
  created_at: string;
  colleges: { id: string; name: string; type: string }[];
}

export const authApi = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => api.post('/api/auth/register', { name, email, password }),
  me: () => api.get('/api/auth/me'),
  getSaved: () => api.get<{ savedColleges: SavedCollege[]; savedComparisons: SavedComparison[] }>('/api/auth/saved'),
  saveCollege: (id: string) => api.post(`/api/auth/saved/college/${id}`),
  unsaveCollege: (id: string) => api.delete(`/api/auth/saved/college/${id}`),
  saveComparison: (college_ids: string[], label?: string) => api.post('/api/auth/saved/comparison', { college_ids, label }),
  deleteComparison: (id: string) => api.delete(`/api/auth/saved/comparison/${id}`),
};

// ---- Q&A ----
export interface Question {
  id: string;
  user_id: string;
  author_name: string;
  avatar_color: string;
  college_id: string | null;
  college_name: string | null;
  college_type: string | null;
  title: string;
  body: string | null;
  tags: string[];
  answer_count: number;
  upvotes: number;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  author_name: string;
  avatar_color: string;
  body: string;
  upvotes: number;
  is_accepted: boolean;
  userUpvoted: boolean;
  created_at: string;
}

export const qaApi = {
  list: (params?: Record<string, string>) => api.get<{ questions: Question[]; total: number; totalPages: number; page: number }>('/api/qa', { params }),
  getById: (id: string) => api.get<{ question: Question; answers: Answer[] }>(`/api/qa/${id}`),
  create: (data: { title: string; body?: string; college_id?: string; tags?: string[] }) => api.post('/api/qa', data),
  answer: (questionId: string, body: string) => api.post(`/api/qa/${questionId}/answers`, { body }),
  upvoteQuestion: (id: string) => api.post(`/api/qa/${id}/upvote`),
  upvoteAnswer: (id: string) => api.post(`/api/qa/answers/${id}/upvote`),
  acceptAnswer: (id: string) => api.patch(`/api/qa/answers/${id}/accept`),
};
