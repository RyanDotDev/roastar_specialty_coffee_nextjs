import { bucket } from './firebase';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  }
}

export default async function handler(req, res) {
  upload.single('file')(req, res, async (err) => {  // Handle single file upload
    if (err) {
      console.error('Error in multer:', err);
      return res.status(500).json({ error: 'Failed to upload file', details: err });
    }

    const { originalname, mimetype, buffer } = req.file;  // Get file info

    try {
      const sanitisedFilename = originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileRef = bucket.file(`resume/${sanitisedFilename}`);

      // Save file buffer to Firebase Storage
      await fileRef.save(buffer, {
        contentType: mimetype,
        resumable: false,
      });

      // Get signed URL for the uploaded file
      const [downloadUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-17-2026',  // Set an expiry date for the signed URL
      });

      return res.status(200).json({ downloadUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  });
}