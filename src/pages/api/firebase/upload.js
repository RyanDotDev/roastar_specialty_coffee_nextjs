import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default async function uploadFileToFirebase(file) {
  try {
    const fileData = fs.readFileSync(file.filepath)
    const fileName = `${uuidv4()}-${file.originalFilename}`;
    const fileUpload = storage.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        cacheControl: 'public, max-age=31536000'
      },
    });

    return await new Promise((resolve, reject) => {
      stream.on('error', (err) => reject({ error: err.message }));
      stream.on('finish', async () => {
        await fileUpload.makePublic();
        const downloadUrl = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
        resolve({ downloadUrl });
      });

      stream.end(fileData);
    });
  } catch (err) {
    return { error: err.message }
  }
}