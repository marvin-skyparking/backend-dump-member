import { Request, Response } from 'express';
import * as TransactionService from '../services/transaction.service';
import { IPaginatePayload } from '../interfaces/pagination.interface';
import { BadRequest, NotFound, OK, ServerError } from '../utils/response/common.response';
import { dumpDataPayload } from '../model/dumpData.model';
import { addMonths, startOfMonth, setDate } from 'date-fns';
import { insertDumpData } from '../services/dumpData.service';
import { getCodeProduct } from '../utils/helper.utils';
import { decryptData, encryptData } from '../utils/encrypt.utils';
import { deleteFile } from '../utils/file.utils';


// Define type for the file fields
export async function createTransaction(req: Request, res: Response): Promise<Response> {
    try {
        // Extract encryptedPayload from request body
        const encryptedPayload: string = req.body.encryptedPayload;

        if (!encryptedPayload) {
            return res.status(400).json({ status: false, message: 'Missing encryptedPayload in request body.' });
        }

        // Decrypt the payload
        const decryptedPayload = decryptData(encryptedPayload);

        // Parse the decrypted payload into JSON
        const {
            fullname,
            phonenumber,
            membershipStatus,
            email,
            vehicletype,
            NoCard,
            PlateNumber,
            locationCode,
            isActive,
            createdBy,
            updatedBy,
            deletedOn,
            deletedBy,
            statusProgress
        } = JSON.parse(decryptedPayload);

        
        // Initialize file variables
        let licensePlate: string | null = null;
        let stnk: string | null = null;
        let paymentFile: string | null = null;

        // Check if req.files is defined and is an object
        if (req.files && typeof req.files === 'object') {
            const files = req.files as { [key: string]: Express.Multer.File[] };

            // Extract file names if they exist
            licensePlate = files.licensePlate ? files.licensePlate[0]?.filename || null : null;
            stnk = files.stnk ? files.stnk[0]?.filename || null : null;
            paymentFile = files.paymentFile ? files.paymentFile[0]?.filename || null : null;
        }

        // Validate required fields based on membershipStatus
        if (membershipStatus === 'new') {
            if (!stnk || !PlateNumber || !paymentFile) {
                return BadRequest(res, 'Untuk Member Baru Silahkan Upload Foto STNK, PLAT NOMOR & Bukti Bayar.');
            }
        } else if (membershipStatus === 'extend') {
            if (!paymentFile || !NoCard) {
                return BadRequest(res, 'Untuk Perpanjangan Silahkan Nomor Kartu & Upload Bukti Bayar');
            }
        } else {
            return BadRequest(res, 'Invalid membership status.');
        }

        // Prepare transaction data
        const transactionData = {
            fullname,
            phonenumber,
            membershipStatus,
            email,
            vehicletype,
            NoCard,
            PlateNumber,
            licensePlate,
            stnk,
            paymentFile,
            locationCode,
            isActive,
            createdBy,
            updatedBy,
            deletedOn,
            deletedBy,
            statusProgress
        };

        // Create transaction
        const transaction = await TransactionService.createTransaction(transactionData);

        // Calculate TGLAKHIR
        const nextMonth = addMonths(new Date(), 1);
        const TGLAKHIR = setDate(startOfMonth(nextMonth), 6);

        // Prepare dumpData payload
        const dumpMember = {
            nama: fullname,
            noPolisi: PlateNumber,
            idProdukPass: vehicletype,
            TGL_AKHIR: TGLAKHIR,
            idGrup: "UPH",
            NoKartu: NoCard,
            Payment: "BAYAR",
            FAKTIF: 1,
            FUPDATE: 1,
            CodeProduct: getCodeProduct(vehicletype),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert dump data
        await insertDumpData(dumpMember);

        // Encrypt response data
        const encryptedResponse = encryptData(transaction);

        // Return success response with encrypted data
        return OK(res, 'Data Transaction Created Successfully', encryptedResponse);
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

        // Extract data from request body
        const { fullname, phonenumber, membershipStatus, email, vehicletype, NoCard, PlateNumber, locationCode, isActive, createdBy, updatedBy, deletedOn, deletedBy, statusProgress } = req.body;

        // Extract files from req.files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Fetch the existing transaction to get old file paths
        const existingTransaction = await TransactionService.getTransactionById(id);
        if (!existingTransaction) {
            return NotFound(res, 'Transaction not found');
        }

          // Delete old files if they exist
          if (existingTransaction.licensePlate) deleteFile(existingTransaction.licensePlate);
          if (existingTransaction.stnk) deleteFile(existingTransaction.stnk);
          if (existingTransaction.paymentFile) deleteFile(existingTransaction.paymentFile);
  

        // Get new file paths
        const licensePlate = files['licensePlate'] ? files['licensePlate'][0].path : existingTransaction.licensePlate;
        const stnk = files['stnk'] ? files['stnk'][0].path : existingTransaction.stnk;
        const paymentFile = files['paymentFile'] ? files['paymentFile'][0].path : existingTransaction.paymentFile;

        const updatedData = {
            fullname,
            phonenumber,
            membershipStatus,
            email,
            vehicletype,
            NoCard,
            PlateNumber,
            licensePlate,
            stnk,
            paymentFile,
            locationCode,
            isActive,
            createdBy,
            updatedBy,
            deletedOn,
            deletedBy,
            statusProgress
        };

        // Update the transaction
        const [updatedCount, updatedRows] = await TransactionService.updateTransaction(id, updatedData);

        if (updatedCount === 0) {
            return NotFound(res, 'Transaction not found');
        }

        return OK(res, 'Data Transaction Updated Successfully', updatedRows[0]);
    } catch (error: any) {
        console.error('Error updating transaction:', error);
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

export async function getTransactionMetrics(req: Request, res: Response) {
    try {
      const [newMembersCount, takeCount, doneCount, progressCount,countAllTransactions, addDataLastMonthCount] = await Promise.all([
        TransactionService.countNewMembers(),
        TransactionService.countStatusProgressTake(),
        TransactionService.countStatusProgressDone(),
        TransactionService.countStatusProgressProgress(),
        TransactionService.countAllTransactions(),
        TransactionService.countStatusProgressAddDataLastMonth()
      ]);
  
      res.status(200).json({
        newMembersCount,
        takeCount,
        doneCount,
        progressCount,
        countAllTransactions,
        addDataLastMonthCount
      });
    } catch (error:any) {
      return ServerError(req, res, error?.message, error);
    }
  }