import { IPaginatePayload } from '../interfaces/pagination.interface';
import Transaction, { TransactionAttributes, TransactionCreationAttributes } from '../model/dataTransaksi.model';
import { Op } from 'sequelize';

// Create a new transaction
export async function createTransaction(data: TransactionCreationAttributes): Promise<Transaction> {
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

export async function getAllTransactions(payload: IPaginatePayload = {}): Promise<{ rows: Transaction[], count: number }> {
  try {
      const { page = 1, limit = 10, search = '' } = payload;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Build search condition using LIKE instead of ILIKE
      const searchCondition = search ? {
          [Op.or]: [
              { email: { [Op.like]: `%${search}%` } },
              { phonenumber: { [Op.like]: `%${search}%` } },
              { fullname: { [Op.like]: `%${search}%` } },
          ]
      } : {};

      // Fetch transactions with pagination and search
      const { count, rows } = await Transaction.findAndCountAll({
          where: searchCondition,
          limit,
          offset,
      });

      return { rows, count };
  } catch (error: any) {
      console.error('Error details:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

// Get a transaction by ID
export async function getTransactionById(id: number): Promise<Transaction | null> {
    try {
        return await Transaction.findByPk(id);
    } catch (error) {
        throw new Error('Failed to fetch transaction');
    }
}

// Update a transaction by ID
export async function updateTransaction(id: number, data: Partial<TransactionAttributes>): Promise<[number, Transaction[]]> {
    try {
        return await Transaction.update(data, {
            where: { id },
            returning: true,
        });
    } catch (error) {
        throw new Error('Failed to update transaction');
    }
}

// Delete a transaction by ID
export async function deleteTransaction(id: number): Promise<number> {
    try {
        return await Transaction.destroy({
            where: { id },
        });
    } catch (error) {
        throw new Error('Failed to delete transaction');
    }
}

// Example utility function to check membership status
export async function fetchMembershipStatus(email: string, phoneNumber: string): Promise<string | null> {
    try {
        const transaction = await Transaction.findOne({
            where: {
                email,
                phonenumber: phoneNumber,
            },
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
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                }
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
        console.error('Error counting statusProgress "add data" in the last month:', error);
        throw new Error('Failed to count statusProgress "add data" in the last month');
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