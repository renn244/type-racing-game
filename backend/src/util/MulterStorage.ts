import * as crypto from 'crypto';
import * as multer from "multer";

export const multerStrorage = (dest: string='uploads') => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
           cb(null, dest)
        },
        filename: (req, file, cb) => {
            const randomId = crypto.randomBytes(10).toString('hex')
            cb(null, `${randomId}_${file.originalname}`) 
        }
    })

    return storage
}