import { IPaginatePayload } from '../interfaces/pagination.interface';
import Transaction, {
  MembershipStatus,
  StatusProgress,
  TransactionAttributes,
  TransactionCreationAttributes
} from '../model/dataTransaksi.model';
import { Op, fn, col, where, literal } from 'sequelize';
import dumpDataMember from '../model/dumpData.model';
import sequelize from '../config/database';

// Create a new transaction
export async function createTransaction(
  data: TransactionCreationAttributes
): Promise<Transaction> {
  try {
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error: any) {
    // Log the original error for debugging purposes
    console.error('Error creating transaction:', error);
    // Throw a new error with the original message
    throw new Error(error.message || 'Failed to create transaction');
  }
}
// Get all transactions with pagination and search

export async function getAllTransactions(
  payload: IPaginatePayload = {}
): Promise<{ rows: Transaction[]; count: number }> {
  try {
    const { page = 1, limit = 10, search = '', sort = 'desc' } = payload;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Create an array of search conditions
    const searchFields = [
      'email',
      'phonenumber',
      'fullname',
      'NoCard',
      'PlateNumber',
      'vehicletype',
      'membershipStatus',
      'statusProgress',
      'NoRef'
    ];

    // Build search condition with 'LIKE' and 'updatedAt' logic
    const searchCondition = search
      ? {
          [Op.and]: [
            // Exclude 'ismember' if 'updatedAt' is before the 20th of the month
            {
              [Op.or]: [
                { membershipStatus: { [Op.ne]: 'ismember' } },
                {
                  membershipStatus: 'ismember',
                  updatedAt: {
                    [Op.gte]: fn(
                      'DATE_SUB',
                      fn('NOW'),
                      literal('INTERVAL DAYOFMONTH(updatedAt) - 20 DAY')
                    )
                  }
                }
              ]
            },
            {
              [Op.or]: searchFields.map((field) => ({
                [field]: { [Op.like]: `%${search}%` }
              }))
            }
          ]
        }
      : {
          [Op.or]: [
            { membershipStatus: { [Op.ne]: 'ismember' } },
            {
              membershipStatus: 'ismember',
              updatedAt: {
                [Op.gte]: fn(
                  'DATE_SUB',
                  fn('NOW'),
                  literal('INTERVAL DAYOFMONTH(updatedAt) - 20 DAY')
                )
              }
            }
          ]
        }; // Handle cases without search

    // Fetch transactions with pagination, search, and sorting by 'createdAt' or 'updatedAt'
    const { count, rows } = await Transaction.findAndCountAll({
      where: searchCondition,
      limit,
      offset,
      order: [
        [fn('GREATEST', col('createdAt'), col('updatedAt')), sort.toUpperCase()] // Apply dynamic sort (asc or desc)
      ]
    });

    return { rows, count };
  } catch (error: any) {
    console.error('Error details:', error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}
// Get a transaction by ID
export async function getTransactionByIds(
  id: number
): Promise<Transaction | null> {
  try {
    return await Transaction.findByPk(id);
  } catch (error) {
    throw new Error('Failed to fetch transaction');
  }
}

// Update a transaction by ID
export async function updateTransaction(
  id: number,
  data: Partial<TransactionAttributes>
): Promise<[number, Transaction[]]> {
  try {
    return await Transaction.update(data, {
      where: { id },
      returning: true
    });
  } catch (error) {
    throw new Error('Failed to update transaction');
  }
}

export async function updateTransactionData(
  NoCard: string,
  data: Partial<TransactionAttributes>
): Promise<[number, Transaction[]]> {
  try {
    const transaction = await Transaction.findOne({ where: { NoCard } });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    // Filter out any fields that are null or undefined
    const updatedData = {
      ...data,
      stnk: data.stnk ?? transaction.stnk, // Keep the old value if the new one is null
      licensePlate: data.licensePlate ?? transaction.licensePlate // Keep the old value if the new one is null
    };

    return await Transaction.update(updatedData, {
      where: { NoCard },
      returning: true
    });
  } catch (error) {
    throw new Error('Failed to update transaction');
  }
}

export async function markTransactionAsPaid(
  transactionId: number,
  ApprovedBy: string,
  paidAmount: number
): Promise<{ affectedRows: number; updatedTransactions: Transaction[] }> {
  try {
    const [affectedRows, updatedTransactions] = await Transaction.update(
      {
        isBayar: true,
        approvedBy: ApprovedBy,
        paidAmount: paidAmount
      },
      {
        where: { id: transactionId },
        returning: true
      }
    );

    if (affectedRows === 0) {
      throw new Error(`Transaction with ID ${transactionId} not found.`);
    }

    return { affectedRows, updatedTransactions };
  } catch (error: any) {
    throw new Error(
      `Failed to update transaction payment status: ${error.message}`
    );
  }
}

// Delete a transaction by ID
export async function deleteTransaction(id: number): Promise<number> {
  try {
    return await Transaction.destroy({
      where: { id }
    });
  } catch (error) {
    throw new Error('Failed to delete transaction');
  }
}

// Example utility function to check membership status
export async function fetchMembershipStatus(
  email: string,
  phoneNumber: string
): Promise<string | null> {
  try {
    const transaction = await Transaction.findOne({
      where: {
        email,
        phonenumber: phoneNumber
      }
    });

    return transaction ? transaction.membershipStatus : null;
  } catch (error) {
    throw new Error('Failed to fetch membership status');
  }
}

// Count the number of new members in the last month
export async function countNewMembers(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        membershipStatus: 'new'
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting new members:', error);
    throw new Error('Failed to count new members');
  }
}

// Count transactions with statusProgress 'take'
export async function countStatusProgressTake(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        statusProgress: 'take'
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting statusProgress "take":', error);
    throw new Error('Failed to count statusProgress "take"');
  }
}

// Count transactions with statusProgress 'done'
export async function countStatusMembership(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        membershipStatus: 'ismember'
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting statusProgress "take":', error);
    throw new Error('Failed to count statusProgress "take"');
  }
}

// Count transactions with statusProgress 'done'
export async function countStatusProgressDone(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        statusProgress: 'done'
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting statusProgress "done":', error);
    throw new Error('Failed to count statusProgress "done"');
  }
}

// Count transactions with statusProgress 'progress'
export async function countStatusProgressProgress(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        statusProgress: 'progress'
      }
    });
    return count;
  } catch (error) {
    console.error('Error counting statusProgress "progress":', error);
    throw new Error('Failed to count statusProgress "progress"');
  }
}

// Count transactions with statusProgress 'add data' in the last month
export async function countStatusProgressAddDataLastMonth(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        statusProgress: 'add data',
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
        }
      }
    });
    return count;
  } catch (error) {
    console.error(
      'Error counting statusProgress "add data" in the last month:',
      error
    );
    throw new Error(
      'Failed to count statusProgress "add data" in the last month'
    );
  }
}

export async function countAllTransactions(): Promise<number> {
  try {
    const count = await Transaction.count();
    return count;
  } catch (error) {
    console.error('Error counting all transactions:', error);
    throw new Error('Failed to count all transactions');
  }
}

export async function countExtendMember(): Promise<number> {
  try {
    const count = await Transaction.count({
      where: {
        membershipStatus: 'extend'
      }
    });
    return count;
  } catch (error) {
    throw new Error('Failed to count statusProgress "progress"');
  }
}

export async function findTransactionById(
  transactionId: number
): Promise<Transaction | null> {
  try {
    // Find the transaction by primary key
    const transaction = await Transaction.findByPk(transactionId);

    return transaction;
  } catch (error) {
    throw new Error('Failed to find transaction');
  }
}

export async function updatePaymentStatusByFields(
  noCard: string | null,
  plateNumber: string | null
): Promise<number> {
  try {
    // Create the where clause based on provided parameters
    const whereClause: any = {};

    if (noCard) {
      whereClause[Op.or] = [{ NoKartu: noCard }];
    }

    if (plateNumber) {
      if (!whereClause[Op.or]) {
        whereClause[Op.or] = [];
      }
      whereClause[Op.or].push({ noPolisi: plateNumber });
    }

    // Check if whereClause has valid conditions
    if (!whereClause[Op.or]) {
      throw new Error('Neither noCard nor plateNumber provided.');
    }

    // Update the Payment field to 'BAYAR'
    const [affectedRows] = await dumpDataMember.update(
      {
        Payment: 'BAYAR'
      },
      {
        where: whereClause
      }
    );

    return affectedRows;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }
}

export async function findTransactionData(
  NoCardOrEmail: string
): Promise<Transaction[] | null> {
  try {
    // Find the transaction by NoCard or email, matching the provided value exactly
    const transaction = await Transaction.findAll({
      where: {
        [Op.or]: [
          { NoCard: NoCardOrEmail }, // Match by NoCard
          { email: NoCardOrEmail } // Match by email
        ]
      }
    });

    return transaction;
  } catch (error) {
    throw new Error('Failed to find transaction');
  }
}

export async function findTransactionByPlate(
  PlateNumber: string
): Promise<Transaction | null> {
  try {
    // Find the transaction by PlateNumber
    const transaction = await Transaction.findOne({
      where: { PlateNumber } // Specify the condition for the query
    });

    return transaction;
  } catch (error) {
    throw new Error('Failed to find transaction');
  }
}

export async function findTransactionByCard(
  NoCard: string
): Promise<Transaction | null> {
  try {
    // Find the transaction by NoCard
    const transaction = await Transaction.findOne({
      where: { NoCard } // Specify the condition for the query
    });

    return transaction;
  } catch (error) {
    throw new Error('Failed to find transaction');
  }
}

export async function updateStatusProgress(
  id: number,
  status: StatusProgress
): Promise<Transaction | null> {
  try {
    // Find the transaction by ID
    const transaction = await Transaction.findByPk(id);

    // If the transaction doesn't exist, return null or handle as needed
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update the statusProgress
    transaction.statusProgress = status;
    await transaction.save(); // Save the updated transaction

    return transaction; // Return the updated transaction
  } catch (error) {
    console.error('Error updating statusProgress:', error);
    throw new Error('Failed to update statusProgress');
  }
}

export async function getTransactionsByStatus(
  status: StatusProgress,
  page: number = 1,
  limit: number = 10,
  sort: string = 'desc' // Default to 'desc' if not provided
): Promise<{ transactions: Transaction[]; totalCount: number }> {
  try {
    // Ensure status is valid before querying
    if (!status) {
      throw new Error('Invalid status provided');
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Find transactions by exact status with pagination and sorting
    const { rows: transactions, count: totalCount } =
      await Transaction.findAndCountAll({
        where: {
          statusProgress: {
            [Op.eq]: status // Ensure exact match for statusProgress
          }
        },
        offset: offset,
        limit: limit,
        order: [['createdAt', sort.toUpperCase()]] // Apply dynamic sorting based on 'asc' or 'desc'
      });

    // Return the transactions along with total count for pagination
    return { transactions, totalCount };
  } catch (error) {
    console.error('Error retrieving transactions by status:', error);
    throw new Error('Failed to retrieve transactions by status');
  }
}

export async function getPaymentStatusByFields(
  noCard: string | null,
  plateNumber: string | null
): Promise<Transaction | null> {
  try {
    // Ensure both noCard and plateNumber are provided
    if (!noCard || !plateNumber) {
      throw new Error('Both noCard and plateNumber must be provided.');
    }

    // Query the database to find a record that matches both noCard and plateNumber
    const result = await Transaction.findOne({
      where: {
        NoCard: noCard,
        PlateNumber: plateNumber
      }
    });

    return result;
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    throw new Error('Failed to retrieve payment status');
  }
}

export async function updateStatusMembership(
  id: number
): Promise<Transaction | null> {
  try {
    // Find the transaction by ID
    const transaction = await Transaction.findByPk(id);

    // If the transaction doesn't exist, return null or handle as needed
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update the statusProgress
    transaction.membershipStatus = MembershipStatus.ISMEMBER;
    await transaction.save(); // Save the updated transaction

    return transaction; // Return the updated transaction
  } catch (error) {
    console.error('Error updating statusProgress:', error);
    throw new Error('Failed to update statusProgress');
  }
}

export async function updateNoKartuByPlateNumber(
  plateNumber: string,
  noKartu: string
) {
  try {
    const noPolisi = plateNumber;
    // Find the existing record by plate number
    const existingDumpData = await dumpDataMember.findOne({
      where: { noPolisi }
    });

    // If the record does not exist, throw an error
    if (!existingDumpData) {
      throw new Error(`Record with plate number ${plateNumber} not found.`);
    }

    // Update the NoKartu field
    existingDumpData.NoKartu = noKartu;

    // Save the updated record
    const updatedDumpData = await existingDumpData.save();

    // Return the updated record
    return updatedDumpData;
  } catch (error: any) {
    // Handle errors
    throw new Error(`Error updating NoKartu: ${error.message}`);
  }
}
