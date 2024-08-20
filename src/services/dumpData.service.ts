import dumpDataMember, { dumpDataPayload } from '../model/dumpData.model';

// Define the service function for inserting a new record
export async function insertDumpData(payload: dumpDataPayload) {
  try {
    // Create a new record in the dumpDataMember table
    const newDumpData = await dumpDataMember.create(payload);

    // Send a success response
    return newDumpData;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error inserting data: ${error.message}`);
  }
}
