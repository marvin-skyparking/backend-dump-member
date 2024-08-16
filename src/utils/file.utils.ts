import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from the file system.
 * @param filePath - The path to the file to be deleted.
 */
export function deleteFile(filePath: string | null) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully:', filePath);
            }
        });
    }
}
