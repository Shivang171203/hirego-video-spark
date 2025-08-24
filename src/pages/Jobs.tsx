
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, MapPin, Clock, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  updateJob,
  getApplicationsByJob,
} from "../services/api";

function JobFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      company: "",
      location: "",
      salary: "",
      skills: "",
      status: "available",
    }
  );
  useEffect(() => {
    setForm(
      initialData || {
        title: "",
        company: "",
        location: "",
        salary: "",
        skills: "",
        status: "available",
      }
    );
  }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Job" : "Create Job Posting"}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              ...form,
              skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
            });
          }}
          className="space-y-3"
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Company"
            value={form.company}
            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Location"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Salary (e.g. $80,000 - $120,000)"
            value={form.salary}
            onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            required
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option value="available">Available</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? "Save Changes" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicationsModal({ open, onClose, applications }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Applications</h2>
        {applications.length === 0 ? (
          <div className="text-muted-foreground">No applications found.</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Resume</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b">
                  <td className="p-2">{app.candidate_name}</td>
                  <td className="p-2">{app.candidate_email}</td>
                  <td className="p-2">
                    {app.resume_url ? (
                      <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Resume</a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-2">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs();
  // backend returns a raw array for /jobs, or an object with { data }
  const jobsData = (res && (res as any).data) ? (res as any).data : (Array.isArray(res) ? (res as any) : []);
  setJobs(jobsData as any[]);
    } catch (e) {
  console.error('Failed to fetch jobs', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (data) => {
    await createJob(data);
    setShowJobModal(false);
    fetchJobs();
  };

  const handleEdit = async (data) => {
    await updateJob(editJob.id, data);
    setEditJob(null);
    setShowJobModal(false);
    fetchJobs();
  };

  const handleViewApplications = async (jobId) => {
    setSelectedJobId(jobId);
    setAppsLoading(true);
    setShowAppsModal(true);
    try {
  const res = await getApplicationsByJob(jobId);
  // backend may return raw array or { data: [...] }
  const apps = (res && (res as any).data) ? (res as any).data : (Array.isArray(res) ? res : []);
  setApplications(apps as any[]);
    } catch (e) {
  console.error('Failed to fetch applications for job', jobId, e);
  setApplications([]);
    }
    setAppsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage job postings and track candidate applications
          </p>
        </div>
        <Button onClick={() => { setEditJob(null); setShowJobModal(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job Posting
        </Button>
      </div>

      {loading ? (
        <div>Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <Badge variant={job.status === "available" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>-</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>-</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(job.skills || []).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">-</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewApplications(job.id)}>
                      View Applications
                    </Button>
                    <Button size="sm" onClick={() => { setEditJob(job); setShowJobModal(true); }}>
                      Edit Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JobFormModal
        open={showJobModal}
        onClose={() => { setShowJobModal(false); setEditJob(null); }}
        onSubmit={editJob ? handleEdit : handleCreate}
        initialData={editJob}
      />
      <ApplicationsModal
        open={showAppsModal}
        onClose={() => setShowAppsModal(false)}
        applications={applications}
      />
    </div>
  );
};

export default Jobs;
