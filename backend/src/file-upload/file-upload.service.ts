import { Injectable } from '@nestjs/common';
import { v2, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class FileUploadService {
    constructor() {
        v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }

    async uploadFile(file: Express.Multer.File) {
        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const cloudinaryStream = v2.uploader.upload_stream(
                { resource_type: 'auto' }, 
                (error, result) => {
                    if(error) {
                        console.log(error);
                        reject(error as UploadApiErrorResponse);
                    }

                    resolve(result as UploadApiResponse)
                }
            )

            cloudinaryStream.end(file.buffer);
        })

        return uploadResult;
    }

    async deleteFile(fileUrl: string) {
        const publicId = fileUrl.split("/").pop().split(".")[0];
        const deleteResult = await v2.uploader.destroy(publicId).catch((error) => {
            throw new Error("file delete failed");
        })

        return deleteResult;
    }
}
