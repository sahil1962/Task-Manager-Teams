// components/TaskCreator.tsx

import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import { Link } from "react-router-dom";

import {
  getBucketsForPlan,
  createWeeklyTask,
  getPlanById,
} from "../services/plannerService";
import { loginRequest } from "../auth/authConfig";

interface TaskCreatorProps {
  planId: string;
}

export default function TaskCreator({ planId }: TaskCreatorProps) {
  const { instance, accounts } = useMsal();

  // Basic fields
  const [planName, setPlanName] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);

  // Additional fields
  const [progress, setProgress] = useState("Not Started"); // default
  const [priority, setPriority] = useState("Medium"); // default
  const [labels, setLabels] = useState<string[]>([]); // multiple selection

  // Data from Graph
  const [users, setUsers] = useState<any[]>([]);
  const [buckets, setBuckets] = useState<any[]>([]);
  const [selectedBucket, setSelectedBucket] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!planId || accounts.length === 0) return;
      const account = accounts[0];

      try {
        // Acquire token with necessary scopes
        const tokenResponse = await instance.acquireTokenSilent({
          account,
          scopes: loginRequest.scopes,
        });

        const client = Client.init({
          authProvider: (done) => {
            done(null, tokenResponse.accessToken);
          },
        });

        // 1) Fetch plan details to get the plan name
        const plan = await getPlanById(client, planId);
        if (plan) {
          setPlanName(plan.title || "");
        }

        // 2) Fetch all users (for assignment list)
        const userResponse = await client.api("/users").get();
        setUsers(userResponse.value);

        // 3) Fetch buckets for the selected plan
        const planBuckets = await getBucketsForPlan(client, planId);
        setBuckets(planBuckets);

        // Default bucket selection (e.g., first bucket)
        if (planBuckets.length > 0) {
          setSelectedBucket(planBuckets[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [instance, accounts, planId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBucket) {
      alert("Please select a bucket before creating a task.");
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }
    if (!startDate) {
      alert("Start Date is required.");
      return;
    }
    if (!dueDate) {
      alert("Due Date is required.");
      return;
    }
    if (assignees.length === 0) {
      alert("Please assign at least one user.");
      return;
    }
    if (!progress) {
      alert("Please select a progress status.");
      return;
    }
    if (!priority) {
      alert("Please select a priority.");
      return;
    }
    if (labels.length === 0) {
      alert("Please select at least one label.");
      return;
    }

    setSubmitting(true);

    try {
      const account = accounts[0];
      const tokenResponse = await instance.acquireTokenSilent({
        account,
        scopes: loginRequest.scopes,
      });

      const client = Client.init({
        authProvider: (done) => {
          done(null, tokenResponse.accessToken);
        },
      });

      await createWeeklyTask(client, planId, selectedBucket, {
        title,
        assignTo: assignees,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        progress,
        priority,
        labels,
      });

      alert("Task created successfully!");

      // Clear form
      setTitle("");
      setStartDate("");
      setDueDate("");
      setAssignees([]);
      setProgress("Not Started");
      setPriority("Medium");
      setLabels([]);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-creator">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/dashboard">Back</Link>
        </div>
      </nav>

      {/** Display the plan name in an <h1> header **/}
      <h2>
        Create Weekly Task in Plan
        <span className="plan-name">"{planName}"</span>
      </h2>
      <form onSubmit={handleSubmit}>
        {/** Title **/}
        <div className="form-group">
          <label>Task Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/** Start Date **/}
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/** Due Date **/}
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/** Progress **/}
        <div className="form-group">
          <label>Progress:</label>
          <select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            required
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/** Priority **/}
        <div className="form-group">
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/** Labels (Multi-select) **/}
        <div className="form-group">
          <label>Labels (select one or more):</label>
          <select
            multiple
            value={labels}
            onChange={(e) =>
              setLabels(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            required
          >
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Red">Red</option>
            <option value="Purple">Purple</option>
            <option value="Orange">Orange</option>
          </select>
        </div>

        {/** Assignees **/}
        <div className="form-group">
          <label>Assign To (select multiple):</label>
          <select
            multiple
            value={assignees}
            onChange={(e) =>
              setAssignees(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
        </div>

        {/** Buckets **/}
        <div className="form-group">
          <label>Bucket:</label>
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            required
          >
            {buckets.map((bucket) => (
              <option key={bucket.id} value={bucket.id}>
                {bucket.name}
              </option>
            ))}
          </select>
        </div>

        {/** Submit **/}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
