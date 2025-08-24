// Applications API
export async function getApplicationsByJob(jobId: number) {
  const res = await apiRequest<any>(`/applications/job/${jobId}`);
  if (Array.isArray(res)) return { data: res } as any;
  return res;
}

export async function createApplication(applicationData: any) {
  return apiRequest('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

export async function updateApplication(id: number, applicationData: any) {
  return apiRequest(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(applicationData),
  });
}

export async function deleteApplication(id: number) {
  return apiRequest(`/applications/${id}`, {
    method: 'DELETE',
  });
}
// Job CRUD API
export async function getJobs() {
  const res = await apiRequest<any>('/jobs');
  if (Array.isArray(res)) return { data: res } as any;
  return res;
}

export async function createJob(jobData: any) {
  return apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(id: number, jobData: any) {
  return apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id: number) {
  return apiRequest(`/jobs/${id}`, {
    method: 'DELETE',
  });
}
// Candidate Dashboard API
export async function getCandidateDashboardJobs() {
  return apiRequest('/candidate-dashboard/jobs');
}

export async function getCandidateDashboardStats() {
  return apiRequest('/candidate-dashboard/stats');
}

export async function getCandidateDashboardActivity() {
  return apiRequest('/candidate-dashboard/activity');
}
const API_BASE_URL = 'http://localhost:5000/api';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  experience_years: number;
  location: string;
  ai_match_score: number;
  status: 'Active' | 'Interviewing' | 'Shortlisted' | 'Rejected' | 'Hired';
  has_video_resume: boolean;
  rating: number;
  skills: string[];
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CandidateFilters {
  page?: number;
  limit?: number;
  status?: string;
  position?: string;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  minAiMatch?: number;
  hasVideoResume?: boolean;
  skills?: string;
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get all candidates with optional filters
export async function getCandidates(filters: CandidateFilters = {}): Promise<ApiResponse<Candidate[]>> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const queryString = params.toString();
  const endpoint = `/candidates${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<Candidate[]>(endpoint);
}

// Get candidate by ID
export async function getCandidate(id: number): Promise<ApiResponse<Candidate>> {
  return apiRequest<Candidate>(`/candidates/${id}`);
}

// Create new candidate
export async function createCandidate(candidateData: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Candidate>> {
  return apiRequest<Candidate>('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidateData),
  });
}

// Update candidate
export async function updateCandidate(id: number, candidateData: Partial<Candidate>): Promise<ApiResponse<Candidate>> {
  return apiRequest<Candidate>(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(candidateData),
  });
}

// Delete candidate
export async function deleteCandidate(id: number): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/candidates/${id}`, {
    method: 'DELETE',
  });
}

// Get candidate statistics
export async function getCandidateStats(): Promise<ApiResponse<{
  total: number;
  active: number;
  interviewing: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  with_video_resume: number;
  average_ai_match: number;
}>> {
  return apiRequest('/candidates/stats/overview');
}

// Search candidates
export async function searchCandidates(query: string, limit: number = 20): Promise<ApiResponse<Candidate[]>> {
  return apiRequest<Candidate[]>(`/candidates/search/query?q=${encodeURIComponent(query)}&limit=${limit}`);
}

// Bulk update candidate status
export async function bulkUpdateStatus(candidateIds: number[], status: string): Promise<ApiResponse<Candidate[]>> {
  return apiRequest<Candidate[]>('/candidates/bulk/status', {
    method: 'PATCH',
    body: JSON.stringify({ candidateIds, status }),
  });
} 