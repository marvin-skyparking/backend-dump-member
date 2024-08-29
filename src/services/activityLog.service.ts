import ActivityLog, { ActivityLogAttributes } from '../model/activityLog.model';

// Define the service function for inserting a new record
export async function insertActivityLog(payload: ActivityLogAttributes) {
  try {
    // Create a new record in the ActivityLog table
    const newActivityLog = await ActivityLog.create(payload);

    // Return the newly created record
    return newActivityLog;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error inserting activity log: ${error.message}`);
  }
}
