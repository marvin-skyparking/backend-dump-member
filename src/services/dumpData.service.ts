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

export async function markAsExported(memberIds: number[]): Promise<void> {
  await dumpDataMember.update(
    { isExported: true },
    {
      where: {
        id: memberIds
      }
    }
  );
}

export async function updatePaymentStatusToBayar(
  plateNumber: string
): Promise<[number, dumpDataMember[]]> {
  try {
    // Validate that plateNumber is provided
    if (!plateNumber) {
      throw new Error('Plate number is required.');
    }

    // Find the dumpDataMember record by plateNumber
    const member = await dumpDataMember.findOne({
      where: { noPolisi: plateNumber }
    });

    // Check if the record exists
    if (!member) {
      throw new Error(`Member with plate number ${plateNumber} not found.`);
    }

    // Update the Payment status to "bayar"
    const [affectedRows, updatedMember] = await dumpDataMember.update(
      { Payment: 'BAYAR' },
      {
        where: { noPolisi: plateNumber },
        returning: true
      }
    );

    if (affectedRows === 0) {
      throw new Error(
        `Failed to update payment status for plate number ${plateNumber}.`
      );
    }

    return [affectedRows, updatedMember];
  } catch (error: any) {
    throw new Error(`Error updating payment status: ${error.message}`);
  }
}
