import express from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para armazenamento na memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'your-redirect-uri';
const REFRESH_TOKEN = 'your-refresh-token';
const FOLDER_ID = 'your-folder-id';

// Configuração do Google Drive
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Verificar se o arquivo foi enviado corretamente
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const fileMetadata = {
      name: req.file.originalname,
      parents: [FOLDER_ID],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: Buffer.from(req.file.buffer), // Use o buffer do arquivo diretamente
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    res.status(200).send(`File uploaded successfully! File ID: ${file.data.id}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
