const xlsx = require('xlsx');
const path = require('path');
const workSheetName = 'Abonnenten';
const fileName  = './abonements.xlsx';

const exportExcelData = (data, workSheetColumnNames) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = (users, workSheetColumnNames) => {
    const data = users.map(user => {
        return [user.date, user.email];
    });
    exportExcel(data, workSheetColumnNames);
}

module.exports = exportUsersToExcel;