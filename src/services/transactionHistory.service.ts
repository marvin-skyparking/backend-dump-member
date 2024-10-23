import TransactionHistory, {
  TransactionHistoryAttributes
} from '../model/transactionHistoy.model';

// Function to create a new transaction history entry
export async function createTransactionHistory(
  data: TransactionHistoryAttributes
): Promise<TransactionHistory> {
  try {
    const transaction = await TransactionHistory.create(data);
    return transaction;
  } catch (error) {
    throw new Error(`Error creating transaction: ${error}`);
  }
}
