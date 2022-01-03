const axios = require('axios');
const excel = require('exceljs');
const utils = require('./utils')
const fs = require('fs');
const XLSX = require('xlsx');
const xlsxPopulate = require('xlsx-populate')

let IterateOnAllBlockNo = async (report, address, start, end) => {
  let pattern = "startblock="
  let result = []
  let lastBlockNo;
  let lastResultNo = 10000;
  let status = 1


  if (start && end) {
    fromToList = await utils.getBlockNoByDate(start, end)
    console.log(fromToList)
    pattern = `startblock=${fromToList[0]}&endblock=${fromToList[1]}`
    while (lastResultNo >= 10000) {
      console.log(pattern)
      if (result.length) {
        lastBlockNo = result[result.length - 1]["blockNumber"]
        pattern = `startblock=${lastBlockNo}&endblock=${fromToList[1]}`
      }
      response = await getData(report, address, pattern);
      result.push(...response.data.result);
      status = response.data.status
      lastResultNo = response.data.result.length
      console.log("Lenght of last result : " + (lastResultNo).toString())
      console.log("Lenght of global result : " + (result.length).toString())
      console.log("Status : " + (status).toString())
      console.log("Message : " + (response.data.message).toString())
    }
  } else {
    while (lastResultNo >= 10000) {
      console.log(pattern)
      if (result.length) {
        lastBlockNo = result[result.length - 1]["blockNumber"]
        pattern = `startblock=${lastBlockNo}`
      }
      response = await getData(report, address, pattern);
      result.push(...response.data.result);
      status = response.data.status
      lastResultNo = response.data.result.length
      console.log("Lenght of last result : " + (lastResultNo).toString())
      console.log("Lenght of global result : " + (result.length).toString())
      console.log("Status : " + (status).toString())
      console.log("Message : " + (response.data.message).toString())

    }
  }


  // response = await getData(report, address, pattern);
  // result.push(...response.data.result);
  return result;
}

async function createExcel(headers, rows, report, address) {
  const workbook = new excel.stream.xlsx.WorkbookWriter({});
  const sheet = workbook.addWorksheet('My Worksheet');
  sheet.columns = headers;
  for (let i = 0; i < rows.length; i++) {
    let timestamp = rows[i]['timeStamp'];
    rows[i]['datetime'] = utils.timeConverter(timestamp);
    rows[i]['valueNew'] = rows[i]['value'] / 1000000000000000000;
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

async function createExistingExcel(rows, sheet, cell, buffer) {

  workbook = await xlsxPopulate.fromDataAsync(buffer);
  // Make edits.
  worksheet = workbook.sheet(sheet)


  console.log(cell)
  cellOfHeader = utils.prevCell(cell)
  cellToModify = cell

  console.log('cellOfHeader : ' +  cellOfHeader)
  console.log('cellToModify : ' +  cellToModify)
  console.log('length rows : ' +  rows.length)

  for (let i = 0; i < rows.length; i++) {
    console.log(rows[i])
    cellOfHeader = utils.prevCell(cell)
    cellToModify = (!i) ?  cell[0] + (utils.extractNumberByCell(cellToModify)[1]) : cell[0] + (utils.extractNumberByCell(cellToModify)[1] + 1)
    console.log("new cellOfHeader : " + cellOfHeader)
    console.log("new cellToModify : " + cellToModify)
    var allHeaders = Object.keys(rows[i])
    allHeaders.push('valueNew')

    for (let j in allHeaders) {
      console.log("row[i][worksheet.cell(cellOfHeader).value()] (VALUE) : " + rows[i][worksheet.cell(cellOfHeader).value()])
      console.log("worksheet.cell(cellOfHeader).value() (KEY) : " + worksheet.cell(cellOfHeader).value())

      if (allHeaders.includes(worksheet.cell(cellOfHeader).value())){
        allHeaders = allHeaders.filter(function(e) { return e !== worksheet.cell(cellOfHeader).value() })
      } else {
        worksheet.cell(cellOfHeader).value(allHeaders[0])
        allHeaders = allHeaders.filter(function(e) { return e !== allHeaders[0] })
      }
      


      if(worksheet.cell(cellOfHeader).value() == 'datetime'){
        rows[i]['datetime'] = utils.timeConverter(rows[i]['timeStamp']);
        value = rows[i]['datetime']
        worksheet.cell(cellToModify).value(value);
      } else if (worksheet.cell(cellOfHeader).value() == 'valueNew'){
        value = (rows[i]['value'] / 1000000000000000000).toString();
        worksheet.cell(cellToModify).value(value);
      } else {
        value = rows[i][worksheet.cell(cellOfHeader).value()]
        worksheet.cell(cellToModify).value(value);
      }



      cellOfHeader = utils.nextLetter(cellOfHeader[0]) + (utils.extractNumberByCell(cellOfHeader)[1])
      cellToModify = utils.nextLetter(cellToModify[0]) + (utils.extractNumberByCell(cellToModify)[1])
      console.log("new cellOfHeader : " + cellOfHeader)
      console.log("new cellToModify : " + cellToModify)
    }
  }

  // Get the output
  return workbook.outputAsync();  
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
    rows[i]['valueNew'] = rows[i]['value'] / 1000000000000000000;
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
        { header: "hash", key: "hash", width: 65 },
        { header: "blockNumber", key: "blockNumber", width: 10 },
        { header: "datetime", key: "datetime", width: 10 },
        { header: "from", key: "from", width: 65 },
        { header: "to", key: "to", width: 65 },
        { header: "contractAddress", key: "contractAddress", width: 65 },
        { header: "timeStamp", key: "timeStamp", width: 15 },
        { header: "nonce", key: "nonce", width: 10 },
        { header: "blockHash", key: "blockHash", width: 65 },
        { header: "transactionIndex", key: "transactionIndex", width: 15 },
        { header: "value", key: "value", width: 65 },
        { header: "valueNew", key: "valueNew", width: 65 },
        { header: "gas", key: "gas", width: 10 },
        { header: "gasPrice", key: "gasPrice", width: 15 },
        { header: "isError", key: "isError", width: 5 },
        { header: "txreceipt_status", key: "txreceipt_status", width: 15 },
        { header: "input", key: "input", width: 10 },
        { header: "cumulativeGasUsed", key: "cumulativeGasUsed", width: 15 },
        { header: "GasUsed", key: "GasUsed", width: 10 },
        { header: "confirmations", key: "confirmations", width: 15 },
      ];
      break;
    case 'tokentx':
      column = [
        { header: "hash", key: "hash", width: 65 },
        { header: "blockNumber", key: "blockNumber", width: 10 },
        { header: "datetime", key: "datetime", width: 10 },
        { header: "from", key: "from", width: 65 },
        { header: "to", key: "to", width: 65 },
        { header: "contractAddress", key: "contractAddress", width: 65 },
        { header: "timeStamp", key: "timeStamp", width: 15 },
        { header: "nonce", key: "nonce", width: 10 },
        { header: "value", key: "value", width: 65 },
        { header: "valueNew", key: "valueNew", width: 65 },
        { header: "blockHash", key: "blockHash", width: 65 },
        { header: "tokenName", key: "tokenName", width: 15 },
        { header: "tokenSymbol", key: "tokenSymbol", width: 15 },
        { header: "tokenDecimal", key: "tokenDecimal", width: 15 },
        { header: "transactionIndex", key: "transactionIndex", width: 15 },
        { header: "gas", key: "gas", width: 10 },
        { header: "gasPrice", key: "gasPrice", width: 10 },
        { header: "gasUsed", key: "gasUsed", width: 10 },
        { header: "cumulativeGasUsed", key: "cumulativeGasUsed", width: 15 },
        { header: "input", key: "input", width: 10 },
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



module.exports = { getData, getColumnList, IterateOnAllBlockNo, createExcel, createDividedExcel, createExistingExcel }