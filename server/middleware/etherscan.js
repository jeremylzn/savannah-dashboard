const axios = require('axios');
const excel = require('exceljs');
const utils = require('./utils')


let IterateOnAllBlockNo = async (report, address) => {
  let pattern = "startblock="
  let result = []
  let lastBlockNo;
  let lastResultNo = 10000;
  let status = 1
  // while (lastResultNo >=10000){
  //     console.log(pattern)
  //     if (result.length){
  //         lastBlockNo = result[result.length - 1]["blockNumber"]
  //         pattern = `startblock=${lastBlockNo}`
  //     }
  //     response = await getData(report, address, pattern);
  //     result.push(...response.data.result);
  //     status = response.data.status
  //     lastResultNo = response.data.result.length
  //     console.log("Lenght of last result : " + (lastResultNo).toString())
  //     console.log("Lenght of result : " + (result.length).toString())
  //     console.log("Status : " + (status).toString())
  //     console.log("Message : " + (response.data.message).toString())

  // }


  response = await getData(report, address, pattern);
  result.push(...response.data.result);
  return result;
}

async function createExcel(headers, rows, report, address) {
  const workbook = new excel.stream.xlsx.WorkbookWriter({});
  const sheet = workbook.addWorksheet('My Worksheet');
  sheet.columns = headers;
  for (let i = 0; i < rows.length; i++) {
    let timestamp = rows[i]['timeStamp'];
    rows[i]['datetime'] = utils.timeConverter(timestamp);
    rows[i]['value_new'] = rows[i]['value'] / 1000000000000000000;
    sheet.addRow(rows[i]);
  }
  sheet.commit();
  return new Promise((resolve, reject) => {
    workbook.commit().then(() => {
      const stream = (workbook).stream;
      const result = stream.read();
      resolve(result);
    }).catch((e) => {
      reject(e);
    });
  });
}

async function createExistingExcel(headers, rows, filename, sheet, cell) {

  //  // console.log(file[''].data)
  // const newWorkbook = new excel.stream.xlsx.WorkbookWriter({});
  // const newWorksheet = newWorkbook.addWorksheet(sheet);
  // // const newWorkbook = new excel.Workbook(); 
  // // const newWorksheet = newWorkbook.addWorksheet(sheet);

  // const oldWorkbook = new excel.Workbook(); 
  // await oldWorkbook.xlsx.readFile(filename)
  // const oldWorksheet = oldWorkbook.getWorksheet(sheet);

  // console.log(oldWorkbook)
  // console.log(oldWorksheet)

  // newWorksheet.model = Object.assign(oldWorksheet.model, {
  //   mergeCells: oldWorksheet.model.merges
  // });


  console.log(filename)
  console.log(sheet)
  // console.log(file[''].data)
  // var workbook = new excel.Workbook(); 
  // await workbook.xlsx.readFile(filename)
  // worksheet.columns = headers;
  // const worksheet = workbook.getWorksheet(sheet);
  // var cellToNumber = extractNumber(cell) 
  // var colNum = cellToNumber[0]
  // var rowNum = cellToNumber[1]

  // console.log("----------------")
  // console.log(newWorkbook)
  // console.log(newWorksheet)
  // console.log(extractNumber(cell))
  // console.log("----------------")

  // const sheet = workbook.addWorksheet('My Worksheet');
  // sheet.columns = headers;
  // for (let i = 0; i < rows.length; i++) {

  //   let timestamp = rows[i]['timeStamp'];
  //   rows[i]['datetime'] = utils.timeConverter(timestamp);
  //   rows[i]['value_new'] = rows[i]['value'] / 1000000000000000000;

  //   var row = worksheet.getRow(rowNum);

  //   for (let key in rows[i]) {
  //     row.getCell(colNum).value = rows[i][key]; // A5's value set to 5
  //     rowNum ++
  //     colNum ++
  //   }

  // }


  var sourceWorkbook= new excel.Workbook();
  var sourceWorksheet;

  var targetWorkbook = new excel.stream.xlsx.WorkbookWriter({});
  var targetSheet = targetWorkbook.addWorksheet();

  sourceWorkbook.xlsx.readFile(filename).then(function(){
      sourceWorksheet= sourceWorkbook.getWorksheet(1);
      sourceWorksheet.eachRow((row, rowNumber) => {
          var newRow = targetSheet.getRow(rowNumber);
          row.eachCell((cell, colNumber) => {
              var newCell = newRow.getCell(colNumber)
              for(var prop in cell)
              {
                  newCell[prop] = cell[prop];
              }
          })
    })
  });

  // for (let i = 0; i < rows.length; i++) {
  //   let timestamp = rows[i]['timeStamp'];
  //   rows[i]['datetime'] = utils.timeConverter(timestamp);
  //   rows[i]['value_new'] = rows[i]['value'] / 1000000000000000000;

  //   for (let i = 0; i < colNum; i++) {
  //     rows[i] = {...{}, ...rows[i]};
  //   }

  //   newWorksheet.addRow(rows[i]);
  // }
  // newWorksheet.commit();
  return new Promise((resolve, reject) => {
    targetWorkbook.commit().then(() => {
      const stream = (targetWorkbook).stream;
      console.log(stream)
      const result = stream.read();
      resolve(result);
    }).catch((e) => {
      reject(e);
    });
  });
  // const stream = (workbook).stream;
  // return stream.read();
}

async function createDividedExcel(headers, rows) {
  let ExcelList = [];
  let flagNewExcel = false;
  let lineCounter;
  let i;
  var workbook = new excel.stream.xlsx.WorkbookWriter({});
  var sheet = workbook.addWorksheet('My Worksheet');
  sheet.columns = headers;

  for (i = 0, lineCounter = 0; i < rows.length; i++, lineCounter++) {

    if (lineCounter > 20000 && lineCounter < 25000 && i < rows.length - 1 && new Date(rows[i]['timeStamp'] * 1000).getDate() !== new Date(rows[i + 1]['timeStamp'] * 1000).getDate()) {
      flagNewExcel = true;
      lineCounter = 0;
    }




    let timestamp = rows[i]['timeStamp'];
    rows[i]['datetime'] = utils.timeConverter(timestamp);
    rows[i]['value_new'] = rows[i]['value'] / 1000000000000000000;
    sheet.addRow(rows[i]);

    if (flagNewExcel) {


      sheet.commit();

      ExcelList.push(workbook)

      workbook = new excel.stream.xlsx.WorkbookWriter({});
      sheet = workbook.addWorksheet('My Worksheet');
      sheet.columns = headers;
      flagNewExcel = false;

    }

  }

  sheet.commit();
  ExcelList.push(workbook)
  for (let index in ExcelList) {
    ExcelList[index] = await new Promise((resolve, reject) => {
      ExcelList[index].commit().then(() => {
        const stream = (ExcelList[index]).stream;
        const result = stream.read();
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    });
  }
  return ExcelList
}

let getData = async (report, address, startBlock) => {
  let url = `${process.env.API_URL}&action=${report}&address=${address}&${startBlock}&endblock=&sort=asc&apikey=${process.env.API_KEY}`
  console.log(url)
  response = await axios.get(url);
  return response;
}

let getColumnList = (report) => {
  let column = []
  switch (report) {
    case 'txlist':
      column = [
        { header: "Txhash", key: "hash", width: 65 },
        { header: "Blockno", key: "blockNumber", width: 10 },
        { header: "DateTime", key: "datetime", width: 10 },
        { header: "From", key: "from", width: 65 },
        { header: "To", key: "to", width: 65 },
        { header: "ContractAddress", key: "contractAddress", width: 65 },
        { header: "UnixTimestamp", key: "timeStamp", width: 15 },
        { header: "Nonce", key: "nonce", width: 10 },
        { header: "BlockHash", key: "blockHash", width: 65 },
        { header: "TransactionIndex", key: "transactionIndex", width: 15 },
        { header: "ValueOrigin", key: "value", width: 65 },
        { header: "Value", key: "value_new", width: 65 },
        { header: "Gas", key: "gas", width: 10 },
        { header: "GasPrice", key: "gasPrice", width: 15 },
        { header: "Error", key: "isError", width: 5 },
        { header: "Txreceipt_status", key: "txreceipt_status", width: 15 },
        { header: "Input", key: "input", width: 10 },
        { header: "CumulativeGasUsed", key: "cumulativeGasUsed", width: 15 },
        { header: "gasUsed", key: "GasUsed", width: 10 },
        { header: "confirmations", key: "confirmations", width: 15 },
      ];
      break;
    case 'tokentx':
      column = [
        { header: "Hash", key: "hash", width: 65 },
        { header: "Blockno", key: "blockNumber", width: 10 },
        { header: "DateTime", key: "datetime", width: 10 },
        { header: "From", key: "from", width: 65 },
        { header: "To", key: "to", width: 65 },
        { header: "ContractAddress", key: "contractAddress", width: 65 },
        { header: "UnixTimestamp", key: "timeStamp", width: 15 },
        { header: "Nonce", key: "nonce", width: 10 },
        { header: "ValueOrigin", key: "value", width: 65 },
        { header: "Value", key: "value_new", width: 65 },
        { header: "BlockHash", key: "blockHash", width: 65 },
        { header: "TokenName", key: "tokenName", width: 15 },
        { header: "TokenSymbol", key: "tokenSymbol", width: 15 },
        { header: "TokenDecimal", key: "tokenDecimal", width: 15 },
        { header: "TransactionIndex", key: "transactionIndex", width: 15 },
        { header: "Gas", key: "gas", width: 10 },
        { header: "GasPrice", key: "gasPrice", width: 10 },
        { header: "GasUsed", key: "gasUsed", width: 10 },
        { header: "CumulativeGasUsed", key: "cumulativeGasUsed", width: 15 },
        { header: "Input", key: "input", width: 10 },
        { header: "confirmations", key: "confirmations", width: 15 },
      ];
      break;
    default:
      console.log("wrong report")
  }
  return column
}

let getNameFile = (report, address) => {
  let name;
  switch (report) {
    case 'txlist':
      name = 'Transactions'
      break;
    case 'tokentx':
      name = 'ERC-20'
      break;
    default:
      console.log("wrong report")
  }
  return name + '_' + address + '.xlsx'
}

let extractNumber = (string) => {
  var matches = string.match(/(\d+)/);
  
  if (matches) {
    new_string = string.replace(matches[0], "")
    console.log(new_string)
    var n = new_string.charCodeAt(0) - 64;
    console.log([parseInt(n), parseInt(matches[0])])
    return [parseInt(n), parseInt(matches[0])];
  }
}

module.exports = { getData, getColumnList, IterateOnAllBlockNo, createExcel, createDividedExcel, createExistingExcel }