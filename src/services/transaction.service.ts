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
