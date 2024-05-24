app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).send('No file uploaded');
        }

        console.log('Form data received:', req.body);

        const formData = req.body;
        const nomeCompleto = formData.Nome;
        if (!nomeCompleto) {
            console.error('Nome completo não fornecido');
            return res.status(400).send('Nome completo não fornecido');
        }

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);

        const fileMetadata = {
            name: nomeCompleto,
            parents: [FOLDER_ID],
        };
        const media = {
            mimeType: req.file.mimetype,
            body: bufferStream,
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        const sheetData = [
            formData.Nome,
            formData.Email,
            formData.Telefone,
            formData.Data,
            formData.Sexo,
            formData.Lider,
            formData.Cidade,
            file.data.id
        ];

        console.log('Sheet data to append:', sheetData);

        // Teste básico para verificar o acesso à planilha
        const test = await sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID,
        });
        console.log('Spreadsheet metadata:', test.data);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Inscrições!A1', // Ajuste para o intervalo adequado
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [sheetData],
            },
        });

        res.redirect('/success.html');
    } catch (error) {
        console.error('Error uploading file:', error.message);
        if (error.response && error.response.data) {
            console.error('Google API error details:', error.response.data);
            if (error.response.status === 401) {
                console.error('Authentication error. Please check your OAuth2 credentials.');
            }
        }
        res.status(500).send('Error uploading file');
    }
});
