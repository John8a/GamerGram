const xlsx = require('xlsx');
const path = require('path');
const Abonennten = require('../models/abonnements');
const workSheetName = 'Abonnenten';
const filePath  = '../outputs/abonements.xlsx';
const workSheetColumnNames = [
    "Datum",
    "E-Mail",
]

const exportExcelData = (data, workSheetColumnNames) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data,
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = async (workSheetColumnNames) => {
    const users = await Abonennten.find();
    const data = users.map(user => {
        return [user.date, user.email];
    });
    exportExcelData(data, workSheetColumnNames);
}

module.exports = exportUsersToExcel;