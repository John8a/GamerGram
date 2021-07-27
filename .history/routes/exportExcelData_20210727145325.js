const xlsx = require('xlsx');
const path = require('path');
var workSheetName = '';
var filePath  = './public/outputs/';
var workSheetColumnNames = [];

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
    seed();
}

const exportUsersToExcel = async (dataUnit, dbCollection, filename) => {
    workSheetName = dbCollection.collection.name;
    dbCollection.schema.eachPath(path => workSheetColumnNames.push(path));
    workSheetColumnNames = workSheetColumnNames.filter((e) => e != "_id");
    filePath += filename + '.xlsx';
    console.log("-------");
    console.log(workSheetName);
    console.log(workSheetColumnNames);
    console.log("-------");

    const data = dataUnit.map(unit => {
        const entries = [];
        var object = unit.toJSON();
        for (var key of Object.keys(object)) {
            if(key != "_id") {
                entries.push(object[key]);
            }
        }
        return entries;
    });

    exportExcelData(data, workSheetColumnNames);
}

function seed() {
    filePath = "./public/outputs/";
    workSheetColumnNames = [];
    workSheetName = [];
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