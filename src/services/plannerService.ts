//services/plannerServices.ts

import { Client } from "@microsoft/microsoft-graph-client";

// Modified helper function with client parameter
async function getAllPages(client: Client, api: any) {
  let results: any[] = [];
  let response = await api.get();
  results = response.value || [];
  while (response["@odata.nextLink"]) {
    response = await client.api(response["@odata.nextLink"]).get();
    results = [...results, ...(response.value || [])];
  }
  return results;
}

// Updated getPlans function
let cachedPlans: any[] = [];
export const getPlans = async (client: Client) => {
  try {
    if (cachedPlans.length > 0) return cachedPlans;
    // Get personal plans
    const personalPlans = await getAllPages(client, client.api('/me/planner/plans'));

    // Get all memberOf and filter to groups
    const allMemberships = await getAllPages(client, client.api('/me/memberOf'));
    const groups = allMemberships.filter(
      (item: any) => item['@odata.type'] === '#microsoft.graph.group'
    );

    // Get plans from each group
    const groupPlans = await Promise.all(
      groups.map(async (group: any) => {
        try {
          return await getAllPages(client, client.api(`/groups/${group.id}/planner/plans`));
        } catch (error) {
          console.error(`Error fetching plans for group ${group.id}:`, error);
          return [];
        }
      })
    );
    cachedPlans = [...personalPlans, ...groupPlans.flat()]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    return cachedPlans;
    // Combine and deduplicate
    return [...personalPlans, ...groupPlans.flat()]
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
};

// Fetch all buckets in a plan
export const getBucketsForPlan = async (client: Client, planId: string) => {
  try {
    const response = await client.api(`/planner/plans/${planId}/buckets`).get();
    return response.value;
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return [];
  }
};


// Fetch a single plan by ID to get its name
export const getPlanById = async (client: Client, planId: string) => {
  try {
    const response = await client.api(`/planner/plans/${planId}`).get();
    return response; // includes { id, title, createdBy, etc. }
  } catch (error) {
    console.error("Error fetching plan by ID:", error);
    return null;
  }
};

/**
 * Create a weekly recurring task in a specific bucket with custom fields:
 *   - dueDate
 *   - progress => percentComplete
 *   - priority => integer (0..10)
 *   - labels => appliedCategories
 */
export const createWeeklyTask = async (
  client: Client,
  planId: string,
  bucketId: string,
  taskDetails: {
    title: string;
    assignTo: string[];
    startDate: Date;    // for "startDate"
    dueDate: Date;      // new required "Due Date"
    progress: string;   // "Not Started" | "In Progress" | "Completed"
    priority: string;   // "Urgent" | "Important" | "Medium" | "Low"
    labels: string[];   // e.g. ["Blue", "Green", ...]
  }
) => {
  // 1) Convert progress to percentComplete
  let percentComplete = 0;
  if (taskDetails.progress === "In Progress") percentComplete = 50;
  if (taskDetails.progress === "Completed")   percentComplete = 100;

  // 2) Convert priority to an integer. (0 is highest; 9 or 10 is lowest.)
  //    Example mapping:
  //    Urgent => 1, Important => 3, Medium => 5, Low => 9
  let priorityValue = 5;
  switch (taskDetails.priority) {
    case "Urgent":
      priorityValue = 1;
      break;
    case "Important":
      priorityValue = 3;
      break;
    case "Low":
      priorityValue = 9;
      break;
    default:
      // "Medium"
      priorityValue = 5;
      break;
  }

  // 3) Convert label names to appliedCategories
  //    Planner only supports "category1..category25".
  //    We'll define a simple mapping for a few color labels:
  const labelMap: Record<string, string> = {
    Blue: "category1",
    Green: "category2",
    Yellow: "category3",
    Red: "category4",
    Purple: "category5",
    Orange: "category6",
  };

  const appliedCategories: any = {};
  // Initialize all to false
  Object.values(labelMap).forEach((cat) => {
    appliedCategories[cat] = false;
  });

  // For each selected label, set the corresponding category to true
  taskDetails.labels.forEach((lbl) => {
    const catKey = labelMap[lbl];
    if (catKey) {
      appliedCategories[catKey] = true;
    }
  });

  // 4) Recurrence date (1 week after startDate)
  const recurrenceEnd = new Date(taskDetails.startDate);
  recurrenceEnd.setDate(recurrenceEnd.getDate() + 7);

  // 5) Build assignments object
  const assignments = taskDetails.assignTo.reduce((acc: any, userId) => {
    acc[userId] = {
      "@odata.type": "#microsoft.graph.plannerAssignment",
      orderHint: " !"
    };
    return acc;
  }, {});

  // 6) POST request to /planner/tasks
  //    - Use dueDateTime from the user’s "dueDate"
  //    - Use percentComplete for progress
  //    - Use priority for priority
  //    - Use appliedCategories for labels
  return client.api('/planner/tasks').post({
    planId,
    bucketId,
    title: taskDetails.title,
    assignments,
    startDateTime: taskDetails.startDate.toISOString(),
    dueDateTime: taskDetails.dueDate.toISOString(),
    percentComplete,
    priority: priorityValue,
    appliedCategories,
    // If you still want weekly recurrence (Preview):
    recurrence: {
      pattern: {
        type: "weekly",
        interval: 1
      },
      range: {
        // endDateTime => 1 week from startDate, or you can decide differently
        endDateTime: recurrenceEnd.toISOString()
      }
    }
  });
};

export const getTasks = async (client: Client, planId: string) => {
  const response = await client
    .api(`/planner/plans/${planId}/tasks`)
    .get();
  return response.value;
};

export const getCompletionRate = async (client: Client, planId: string) => {
  const tasks = await getTasks(client, planId);
  if (tasks.length === 0) return 0;
  
  const completed = tasks.filter((t: any) => t.percentComplete === 100).length;
  return (completed / tasks.length) * 100;
};