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
  const workbook = new excel.stream.xlsx.WorkbookWriter({filename: getNameFile(report, address) });
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

module.exports = { getData, getColumnList, IterateOnAllBlockNo, createExcel, createDividedExcel }