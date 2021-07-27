const xlsx = require('xlsx');
const path = require('path');
var workSheetName = '';
var filePath  = './public/outputs/';
const workSheetColumnNames = [];

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
    workSheetName = dbCollection.collection.name;
    dbCollection.schema.eachPath(path => workSheetColumnNames.push(path));
    filePath += filename + '.xlsx';
    console.log("-------");
    console.log(workSheetName);
    console.log(workSheetColumnNames);
    console.log("-------");

    const data = dataUnit.map(unit => {
        const entries = [];
        unit.toJSON.forEach(element => {
            console.log(element);
        });
        return [unit.date, unit.email];
    });

    // console.log(data);
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