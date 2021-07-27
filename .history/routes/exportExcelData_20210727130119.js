const xlsx = require('xlsx');
const path = require('path');
const workSheetName = '';
const filePath  = './public/outputs/';
// const workSheetColumnNames = [
//     "Datum",
//     "E-Mail",
// ]

const exportExcelData = (data, workSheetColumnNames) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data,
    ];

    console.log(workSheetData);
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = async (workSheetColumnNames, dbCollection, filename) => {
    this.workSheetName = dbCollection;
    this.filePath += filename + '.xlsx';
    const dataUnit = await dbCollection.find({});
    console.log(Array.from(dataUnit));
    const data = dataUnit.map(unit => {
        return [unit.date, unit.email];
    });
    exportExcelData(data, workSheetColumnNames);
}


module.exports = { exportUsersToExcel };

// module.exports = function() {
    // this.exportData = {
    //   exportData: exportUsersToExcel(
    //     workSheetColumnNames,
    //     test,
    //     filename
    //   ),
    // };
// };