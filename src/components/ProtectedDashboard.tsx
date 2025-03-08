import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import { Link, useNavigate } from "react-router-dom";
import { getTasks } from "../services/plannerService";
import { graphScopes } from "../auth/authConfig";
import NavBar from "./NavBar";

interface DashboardProps {
  planId: string;
}

interface Task {
  id: string;
  title: string;
  assignments: Record<string, any>;
  assignedTo: string[];
  startDateTime?: string;
  dueDateTime?: string;
  bucketName: string;
  percentComplete: number;
  priority: number;
  categoryLabels: string[];
}

export default function ProtectedDashboard({ planId }: DashboardProps) {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [completionRate, setCompletionRate] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());
  const [planName, setPlanName] = useState<string>("");

  useEffect(() => {
    const checkAuth = () => {
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0) navigate("/login");
    };
    checkAuth();
  }, [instance, navigate]);

  useEffect(() => {
    const account = instance.getActiveAccount();
    if (!account) {
      navigate("/login");
      return;
    }

    if (!planId) {
      navigate("/plans");
      return;
    }

    const fetchData = async () => {
      try {
        const client = Client.init({
          authProvider: async (done) => {
            try {
              const token = await instance
                .acquireTokenSilent({
                  scopes: graphScopes,
                  account: account,
                })
                .catch(async (error: any) => {
                  console.error(
                    "Token acquisition failed, trying redirect:",
                    error
                  );
                  await instance.acquireTokenRedirect({
                    scopes: graphScopes,
                    account: account,
                  });
                  return null;
                });

              if (token) done(null, token.accessToken);
            } catch (error) {
              console.error("Final token acquisition error:", error);
              done(error as Error, null);
            }
          },
        });

        let users = new Map<string, string>();
        try {
          const usersResponse = await client
            .api("/users")
            .select("id,displayName,userPrincipalName")
            .top(999)
            .get();

          users = new Map(
            usersResponse.value.map((u: any) => [
              u.id,
              u.displayName || u.userPrincipalName,
            ])
          );
        } catch (error) {
          console.warn("User fetch failed, using assignment IDs:", error);
        }

        const [tasksResponse, bucketsResponse, planResponse] =
          await Promise.all([
            getTasks(client, planId).catch((error) => {
              console.error("Tasks fetch failed:", error);
              return [];
            }),
            client
              .api(`/planner/plans/${planId}/buckets`)
              .get()
              .catch((error) => {
                console.error("Buckets fetch failed:", error);
                return { value: [] };
              }),
            client
              .api(`/planner/plans/${planId}`)
              .get()
              .catch((error) => {
                console.error("Plan details fetch failed:", error);
                return { title: "Unnamed Plan", categoryDescriptions: {} };
              }),
          ]);

        // Set plan name from the plan response
        setPlanName(planResponse.title || "Unnamed Plan");

        const rate =
          tasksResponse.length > 0
            ? (tasksResponse.filter((t: any) => t.percentComplete === 100)
                .length /
                tasksResponse.length) *
              100
            : 0;

        const bucketMap = new Map(
          bucketsResponse.value.map((b: any) => [b.id, b.name])
        );

        const categoryMap = new Map(
          Object.entries(planResponse.categoryDescriptions || {}).map(
            ([key, value]) => [key.toLowerCase(), (value as any)?.name || key]
          )
        );

        const enhancedTasks = tasksResponse.map((task: any) => ({
          id: task.id,
          title: task.title || "Untitled Task",
          assignments: task.assignments || {},
          assignedTo: Object.keys(task.assignments || {}).map(
            (id) => users.get(id) || id
          ),
          startDateTime: task.startDateTime,
          dueDateTime: task.dueDateTime,
          bucketName: bucketMap.get(task.bucketId) || "Uncategorized",
          percentComplete: task.percentComplete || 0,
          priority: task.priority || 0,
          categoryLabels: Object.entries(task.appliedCategories || {})
            .filter(([_, value]) => value)
            .map(([key]) => categoryMap.get(key.toLowerCase()) || key),
        }));

        setUserMap(users);
        setCompletionRate(rate);
        setTasks(enhancedTasks);
        setLoading(false);
      } catch (err) {
        console.error("Global fetch error:", err);
        setError(
          "Failed to load dashboard data. Please refresh or try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, instance, navigate]);

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Urgent";
      case 3:
        return "Important";
      case 5:
        return "Medium";
      case 9:
        return "Low";
      default:
        return "Not set";
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <NavBar/>
      <div className="dashboard-header">
        <h1>Task Management Dashboard</h1>
      </div>

      <div className="completion-sections">
        <h2>Overall Completion Progress</h2>
        <div className="progress-containers">
          <div
            className="progress-bars"
            style={{ width: `${completionRate}%` }}
          >
            <span className="progress-texts">{completionRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="task-list">
        <h2>
          Current Tasks in Plan:
          <span className="plan-name">{planName}</span>
        </h2>
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned To</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Bucket</th>
                <th>Progress</th>
                <th>Priority</th>
                <th>Labels</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{(task.assignedTo || []).join(", ") || "Unassigned"}</td>
                  <td>
                    {task.startDateTime
                      ? new Date(task.startDateTime).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {task.dueDateTime
                      ? new Date(task.dueDateTime).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{task.bucketName}</td>
                  <td>
                    <div className="status-bar">
                      <div
                        className="status-progress"
                        style={{ width: `${task.percentComplete}%` }}
                      />
                      <span className="status-text">
                        {task.percentComplete}%
                      </span>
                    </div>
                  </td>
                  <td>{getPriorityLabel(task.priority)}</td>
                  <td>{(task.categoryLabels || []).join(", ") || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
