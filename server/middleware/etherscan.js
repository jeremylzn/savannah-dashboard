const axios = require('axios');
const excel = require('exceljs');
const utils = require('./utils')
const fs = require('fs');
const XLSX = require('xlsx');
const xlsxPopulate = require('xlsx-populate')

let IterateOnAllBlockNo = async (report, address, start, end) => {
  console.log('Address => ' + address)
  let pattern = "startblock="
  let result = [];
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
      if (result.length) utils.removeFirstItems(response.data.result, 2)
      result.push(...response.data.result);
      status = response.data.status
      lastResultNo = response.data.result.length
      console.log("Lenght of last result : " + (lastResultNo).toString())
      console.log("Lenght of global result : " + (result.length).toString())
      console.log("Status : " + (status).toString())
      console.log("Message : " + (response.data.message).toString())
    }
  } else {
    while (lastResultNo >= 9998) {
      console.log(pattern)
      if (result.length) {
        lastBlockNo = result[result.length - 1]["blockNumber"]
        pattern = `startblock=${lastBlockNo}`
      }
      response = await getData(report, address, pattern);
      if (result.length) utils.removeFirstItems(response.data.result, 2)
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

async function createExcel(headers, rows, report, address, reportType) {
  const workbook = new excel.stream.xlsx.WorkbookWriter({});
  const sheet = workbook.addWorksheet('My Worksheet');
  sheet.columns = headers;
  for (let i = 0; i < rows.length; i++) {
    let timestamp = rows[i]['timeStamp'];
    if (reportType == 'txlist'){ rows[i]['fee'] = (rows[i]['gasPrice'] * rows[i]['gasUsed'] / 1000000000000000000).toString()}
    rows[i]['datetime'] = utils.timeConverter(timestamp);
    rows[i]['adjustedValue'] =  ('tokenDecimal' in rows[i]) ? (rows[i]['value'] / utils.getNumberToDivide(rows[i]['tokenDecimal'])).toString() : (rows[i]['value'] / 1000000000000000000 ).toString()
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

async function createExistingExcel(rows, sheet, cell, buffer, reportType) {
  // console.log('REPORT TYPE =>  ' +  reportType)

  workbook = await xlsxPopulate.fromDataAsync(buffer);
  // Make edits.
  worksheet = workbook.sheet(sheet)


  // console.log(cell)
  cellOfHeader = utils.prevCell(cell)
  cellToModify = cell

  // console.log('cellOfHeader : ' +  cellOfHeader)
  // console.log('cellToModify : ' +  cellToModify)
  // console.log('length rows : ' +  rows.length)

  for (let i = 0; i < rows.length; i++) {
    // console.log(rows[i])
    cellOfHeader = utils.prevCell(cell)
    cellToModify = (!i) ?  cell[0] + (utils.extractNumberByCell(cellToModify)[1]) : cell[0] + (utils.extractNumberByCell(cellToModify)[1] + 1)
    // console.log("new cellOfHeader : " + cellOfHeader)
    // console.log("new cellToModify : " + cellToModify)

    headers = utils.getHeaders(reportType)
    for (let item of headers) {
        // console.log("(HEADER) : " + item['header'] +  " => (VALUE) : " + rows[i][item['key']]);
        if(item['key'] == 'datetime'){
          rows[i][item['key']] = utils.timeConverter(rows[i]['timeStamp']);
          value = rows[i][item['key']];
          worksheet.cell(cellOfHeader).value(item['header']);
          worksheet.cell(cellToModify).value(value);
        } else if (item['key'] == 'adjustedValue'){
          // Checking if tokenDecimal exist in the reponse
          value =  ('tokenDecimal' in rows[i]) ? (rows[i]['value'] / utils.getNumberToDivide(rows[i]['tokenDecimal'])).toString() : (rows[i]['value'] / 1000000000000000000 ).toString()
          worksheet.cell(cellOfHeader).value(item['header']);
          worksheet.cell(cellToModify).value(value);
        } else if (item['key'] == 'fee'){
          value = (rows[i]['gasPrice'] * rows[i]['gasUsed'] / 1000000000000000000).toString();
          worksheet.cell(cellOfHeader).value(item['header']);
          worksheet.cell(cellToModify).value(value);
        } else {
          worksheet.cell(cellOfHeader).value(item['header']);
          worksheet.cell(cellToModify).value(rows[i][item['key']]);
        }

        
        cellOfHeader = utils.nextLetter(cellOfHeader[0]) + (utils.extractNumberByCell(cellOfHeader)[1])
        cellToModify = utils.nextLetter(cellToModify[0]) + (utils.extractNumberByCell(cellToModify)[1])
        // console.log("new cellOfHeader : " + cellOfHeader)
        // console.log("new cellToModify : " + cellToModify)
    }
  }

  // Get the output
  return workbook.outputAsync();  
}

async function createDividedExcel(headers, rows, reportType) {
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

    if (reportType == 'txlist'){
      rows[i]['fee'] = (rows[i]['gasPrice'] * rows[i]['gasUsed'] / 1000000000000000000).toString();
    }

    let timestamp = rows[i]['timeStamp'];
    rows[i]['datetime'] = utils.timeConverter(timestamp);
    rows[i]['adjustedValue'] =  ('tokenDecimal' in rows[i]) ? (rows[i]['value'] / utils.getNumberToDivide(rows[i]['tokenDecimal'])).toString() : (rows[i]['value'] / 1000000000000000000 ).toString()
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
        { header: "timeStamp", key: "timeStamp", width: 15 },
        { header: "datetime", key: "datetime", width: 10 },
        { header: "from", key: "from", width: 65 },
        { header: "to", key: "to", width: 65 },
        { header: "contractAddress", key: "contractAddress", width: 65 },
        { header: "value", key: "value", width: 65 },
        { header: "Adjusted Value", key: "Adjusted Value", width: 65 },
        { header: "txreceipt_status", key: "txreceipt_status", width: 15 },
        { header: "isError", key: "isError", width: 5 },
        { header: "transactionIndex", key: "transactionIndex", width: 15 },
        { header: "blockHash", key: "blockHash", width: 65 },
        { header: "nonce", key: "nonce", width: 10 },
        { header: "gas", key: "gas", width: 10 },
        { header: "gasPrice", key: "gasPrice", width: 15 },
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
        { header: "timeStamp", key: "timeStamp", width: 15 },
        { header: "datetime", key: "datetime", width: 10 },
        { header: "from", key: "from", width: 65 },
        { header: "to", key: "to", width: 65 },
        { header: "contractAddress", key: "contractAddress", width: 65 },
        { header: "value", key: "value", width: 65 },
        { header: "Adjusted Value", key: "Adjusted Value", width: 65 },
        { header: "tokenName", key: "tokenName", width: 15 },
        { header: "tokenSymbol", key: "tokenSymbol", width: 15 },
        { header: "tokenDecimal", key: "tokenDecimal", width: 15 },
        { header: "transactionIndex", key: "transactionIndex", width: 15 },
        { header: "blockHash", key: "blockHash", width: 65 },
        { header: "nonce", key: "nonce", width: 10 },
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



module.exports = { getData, getColumnList, IterateOnAllBlockNo, createExcel, createDividedExcel, createExistingExcel }