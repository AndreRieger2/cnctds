const test = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
});
console.log('Spreadsheet metadata:', test.data);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
