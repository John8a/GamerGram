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

const exportUsersToExcel = async (dataUnit, dbCollection, filename) => {
    this.workSheetName = dbCollection.collection.name;
    this.filePath += filename + '.xlsx';

    console.log("-------");
    console.log(workSheetName);
    console.log("-------");
    // console.log(dbCollection.schema.paths);
    // var p = Object.keys(dataUnit[0].toJSON());
    // console.log(p);


    // const data = dataUnit.map(unit => {
    //     return [unit.date, unit.email];
    // });
    // exportExcelData(data, workSheetColumnNames);
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