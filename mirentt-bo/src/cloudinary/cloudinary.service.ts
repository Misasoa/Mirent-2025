import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'mirent-vehicles',
                    resource_type: 'image',
                },
                (error, result: UploadApiResponse | undefined) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else if (result) {
                        resolve(result.secure_url);
                    } else {
                        reject(new Error('Upload failed: no result'));
                    }
                },
            );

            // Convert buffer to stream and pipe to cloudinary
            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
        }
    }
}
