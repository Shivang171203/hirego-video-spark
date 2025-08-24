
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, CheckCircle, Play, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCandidateDashboardJobs,
  getCandidateDashboardStats,
  getCandidateDashboardActivity,
} from "@/services/api";


const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const jobsRes = await getCandidateDashboardJobs();
        setJobs(jobsRes.data || []);
        const statsRes = await getCandidateDashboardStats();
        setStats(statsRes.data || null);
        const activityRes = await getCandidateDashboardActivity();
        setActivity(activityRes.data || []);
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleStartVideo = (jobId: number) => {
    navigate(`/candidate/video-recording/${jobId}`);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to HireGo AI</h1>
          <p className="text-gray-600 mt-2">
            Create your video resume and get matched with your dream job instantly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Available Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {job.status === "completed" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">Available</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {job.company} • {job.location}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        {job.salary}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills && job.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {job.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.duration}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {job.status === "completed" ? (
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleStartVideo(job.id)}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Start Video Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Videos Completed</span>
                  <span className="font-medium">{stats?.videosCompleted ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average AI Score</span>
                  <span className="font-medium text-green-600">{stats?.averageAiScore ? `${stats.averageAiScore}%` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications Sent</span>
                  <span className="font-medium">{stats?.applicationsSent ?? '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Ensure good lighting and audio quality</p>
                <p>• Look directly at the camera</p>
                <p>• Speak clearly and confidently</p>
                <p>• Keep answers concise but detailed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {activity.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-gray-600">{item.message}</p>
                    <p className="text-gray-500 text-xs">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
