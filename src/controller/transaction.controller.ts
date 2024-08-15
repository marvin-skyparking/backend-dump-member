import { Request, Response } from 'express';
import * as TransactionService from '../services/transaction.service';
import { IPaginatePayload } from '../interfaces/pagination.interface';
import multer from 'multer';
import path from 'path';
import { BadRequest, NotFound, OK, ServerError } from '../utils/response/common.response';
import { TransactionCreationAttributes } from '../model/dataTransaksi.model';




// Define type for the file fields
export async function createTransaction(req: Request, res: Response): Promise<Response> {
    try {
        const {
            fullname,
            phonenumber,
            membershipStatus,
            email,
            vehicletype,
            NoCard,
            PlateNumber,
            locationCode,
            isActive, // Ensure this is included
            createdBy,
            updatedBy,
            deletedOn,
            deletedBy,
            statusProgress // Ensure this is included
        } = req.body;

        // Initialize file variables
        let licensePlate: string | null = null;
        let stnk: string | null = null;

        // Check if req.files is defined and is an object
        if (req.files && typeof req.files === 'object') {
            const files = req.files as { [key: string]: Express.Multer.File[] };

            // Extract file names if they exist
            licensePlate = files.licensePlate ? files.licensePlate[0]?.filename || null : null;
            stnk = files.stnk ? files.stnk[0]?.filename || null : null;
        }

        // Prepare transaction data
        const transactionData: TransactionCreationAttributes = {
            fullname,
            phonenumber,
            membershipStatus,
            email,
            vehicletype,
            NoCard,
            PlateNumber,
            licensePlate,
            stnk,
            locationCode,
            isActive, // Ensure this is included
            createdBy,
            updatedBy,
            deletedOn,
            deletedBy,
            statusProgress // Ensure this is included
        };

        // Create transaction
        const transaction = await TransactionService.createTransaction(transactionData);

        // Return success response
        return OK(res, 'Data Transaction Created Successfully', transaction);
    } catch (error: any) {
        // Return error response
        return ServerError(req, res, error?.message || 'Failed to create transaction', error);
    }
}


// Get all transactions with pagination and search
export async function getAllTransactions(req: Request, res: Response): Promise<Response> {
  try {
      // Convert query parameters to the IPaginatePayload type
      const payload: IPaginatePayload = {
          page: parseInt(req.query.page as string, 10) || 1,
          limit: parseInt(req.query.limit as string, 10) || 10,
          search: req.query.search as string || '',
          isDropdown: req.query.isDropdown === 'true'
      };

      // Call the service to get transactions
      const { rows, count } = await TransactionService.getAllTransactions(payload);

      // Calculate currentPage
      const currentPage = payload.page;

      // Return response with transactions, totalCount, and currentPage
      return OK(res, 'Data Transactions Fetched Successfully', { transactions: rows, totalCount: count, currentPage });
  } catch (error: any) {
      // Return server error if something goes wrong
      return ServerError(req, res, error?.message, error);
  }
}
// Get a transaction by ID
export async function getTransactionById(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10); // Convert ID to number
        const transaction = await TransactionService.getTransactionById(id);
        if (!transaction) {
            return NotFound(res, 'Transaction not found');
        }
        return OK(res, 'Data Transaction Fetched Successfully', transaction);
    } catch (error: any) {
      return ServerError(req, res, error?.message, error);
    }
}

// Update a transaction by ID
export async function updateTransaction(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10); // Convert ID to number
        const [updatedCount, updatedRows] = await TransactionService.updateTransaction(id, req.body);
        if (updatedCount === 0) {
            return NotFound(res, 'Transaction not found');
        }
        return OK(res, 'Data Transaction Updated Successfully', updatedRows[0]);
    } catch (error: any) {
      return ServerError(req, res, error?.message, error);
    }
}

// Delete a transaction by ID
export async function deleteTransaction(req: Request, res: Response): Promise<Response> {
    try {
        const id = parseInt(req.params.id, 10); // Convert ID to number
        const deletedCount = await TransactionService.deleteTransaction(id);
        if (deletedCount === 0) {
            return NotFound(res, 'Transaction not found');
        }
        return OK(res, 'Data Transaction Deleted Successfully');
    } catch (error: any) {
      return ServerError(req, res, error?.message, error);
    }
}

// Fetch membership status
export async function fetchMembershipStatus(req: Request, res: Response): Promise<Response> {
    try {
        const { email, phoneNumber } = req.query as { email: string; phoneNumber: string };
        const status = await TransactionService.fetchMembershipStatus(email, phoneNumber);
        if (!status) {
            return NotFound(res, 'Membership status not found');
        }
        return OK(res, 'Membership Status Fetched Successfully', { membershipStatus: status });
    } catch (error: any) {
      return ServerError(req, res, error?.message, error);
    }
}
