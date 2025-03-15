// THIS CODE IS NO LONGER IN USE

/* import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer'; 

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export const config = {
  api: {
    bodyParser: false, // Completely disable Next.js body parser
  },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await runMiddleware(req, res, upload.single('file'));

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;
    console.log(`Uploading file to bucket: ${storage.name}`);
    const fileUpload = storage.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        cacheControl: 'public, max-age=31536000',
      },
    });

    stream.on('error', (streamError) => {
      console.error('Error uploading file:', streamError);
      return res.status(500).json({ message: 'File upload failed', error: streamError.message });
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
      console.log('File uploaded successfully:', publicUrl);
      return res.status(200).json({ downloadUrl: publicUrl });
    });

    stream.end(file.buffer);
  } catch (uploadError) {
    console.error('Error handling file upload:', uploadError);
    return res.status(500).json({ message: 'Internal server error', error: uploadError.message });
  }
}
*/