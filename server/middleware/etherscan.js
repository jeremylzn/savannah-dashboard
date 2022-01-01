const axios = require('axios');


let getData = async (report, address) => {
    const url = `${process.env.API_URL}&action=${report}&address=${address}&startblock=&endblock=&sort=asc&apikey=${process.env.API_KEY}`
    console.log(url)
    response = await axios.get(url);
    return response.data;
}

let getColumnList = (report) => {
    let column = []
    switch(report) {
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
            { header: "Value", key: "value", width: 65 },
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

module.exports = { getData, getColumnList }