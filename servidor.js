app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Verificar se o arquivo foi enviado corretamente
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
const port = process.env.PORT || 3000;
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
