// src/services/excelService.ts
import {
  IPaginatePayload,
  IPaginateResult
} from '../interfaces/pagination.interface'; // Adjust the import according to your file structure
import xlsx from 'xlsx';
import { Model, Op } from 'sequelize';

export interface ExcelRow {
  dateinsert: string | number; // Allow dateinsert to be either a string or a number
  description: string;
  nominal: number;
}

// Assume you have a Transaction model set up (example with Sequelize or other ORM)
import MutationData from '../model/mutationData.model';

export async function processAndInsertExcelData(buffer: Buffer): Promise<void> {
  try {
    // Load the workbook from the buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    // Select the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON format
    const jsonData: ExcelRow[] = xlsx.utils.sheet_to_json(sheet, { raw: true });

    // Insert each row of data into the database
    for (const row of jsonData) {
      let date: Date;

      // Check if dateinsert is a string
      if (typeof row.dateinsert === 'string') {
        // Parse the date from the string format 'MM/DD/YYYY'
        const [month, day, year] = row.dateinsert.split('/').map(Number);
        date = new Date(year, month - 1, day); // Create a Date object (months are 0-indexed)
      } else if (typeof row.dateinsert === 'number') {
        // Convert Excel date number to JavaScript Date object
        const excelBaseDate = new Date(1900, 0, 1); // Excel base date is January 1, 1900
        date = new Date(
          excelBaseDate.getTime() + (row.dateinsert - 1) * 86400000
        ); // Add days to base date
      } else {
        throw new Error(`Unexpected date format: ${row.dateinsert}`);
      }

      await MutationData.create({
        dateinsert: date, // Insert the Date object directly
        description: row.description,
        nominal: parseFloat(row.nominal.toString().replace(/,/g, ''))
      });
    }
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error('Failed to process and insert data from Excel file');
  }
}

export async function getPaginatedResults(
  page: number,
  limit: number,
  search: string
): Promise<IPaginateResult> {
  const skip = (page - 1) * limit;
  const take = limit;

  const queryOptions: any = {
    offset: skip,
    limit: take
  };

  // Add search filters if applicable
  if (search) {
    queryOptions.where = {
      description: {
        [Op.like]: `%${search}%` // Search in the description field
      }
    };
  }

  // Fetch data from the database
  const results = await MutationData.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(results.count / limit);

  return {
    totalData: results.count, // Total number of records
    totalFiltered: results.rows.length, // Number of records on current page
    data: results.rows, // The actual data fetched
    totalPages
  };
}
