
const Web3 = require('web3');
const EthDater = require('ethereum-block-by-date');

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

async function getBlockNoByDate(start, end) {
    console.log("getBlockNoByDate")
    console.log(start)
    console.log(end)

    // const provider = new Web3.providers.HttpProvider("http://nginx:qp30CnrjDFu4z8@34.251.89.147:8546");
    const provider = new Web3.providers.HttpProvider("http://lemon:zfT5PAbec9LLdjus@34.242.73.161:8547");
    const web3 = new Web3(provider);
    const dater = new EthDater(web3);

    const from = await getBlockNo(start, dater)
    const to = await getBlockNo(end, dater, false)

    console.log(from)
    console.log(to)
    return [from['block'], to['block']]

}

async function getBlockNo(date, dater, to = true) {
    return await dater.getDate(
        date, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        to // Block after, optional. Search for the nearest block before or after the given date. By default true.
    );
}

function prevLetter(letter) {
    if (letter === 'a') { return 'a'; }
    if (letter === 'A') { return 'A'; }
    return String.fromCharCode(letter.charCodeAt(0) - 1);
}

function nextLetter(letter) {
    if (letter === 'z') { return 'z'; }
    if (letter === 'Z') { return 'Z'; }
    return String.fromCharCode(letter.charCodeAt(0) + 1);
}

function prevCell(cell) {
    currentNumber = extractNumberByCell(cell)
    prevNumber = (currentNumber[1] > 1) ? currentNumber[1] - 1 : currentNumber[1]
    return cell[0] + prevNumber
}

let extractNumberByCell = (string) => {
    var matches = string.match(/(\d+)/);

    if (matches) {
        new_string = string.replace(matches[0], "")
        var n = new_string.charCodeAt(0) - 64;
        //   console.log([parseInt(n), parseInt(matches[0])])
        return [parseInt(n), parseInt(matches[0])];
    }
}

function removeFirstItems(arr, item) {
    for (var i = 0; i < item; i++) {
        arr.shift();
    }
}

function getNumberToDivide(numberOfZero) {
    x = "1"
    for (var i = 0; i < numberOfZero; i++) x += "0"
    return Number(x)
}

let getHeaders = (report) => {
    let column = []
    switch (report) {
        case 'txlist':
            column = [
                { header: "Hash", key: "hash", width: 65 },
                { header: "Block Number", key: "blockNumber", width: 10 },
                { header: "TimeStamp", key: "timeStamp", width: 15 },
                { header: "Date Time", key: "datetime", width: 10 },
                { header: "From", key: "from", width: 65 },
                { header: "To", key: "to", width: 65 },
                { header: "Contract Address", key: "contractAddress", width: 65 },
                { header: "Adjusted Value", key: "adjustedValue", width: 15 },
                { header: "Fee (in ETH)", key: "fee", width: 15 },
                { header: "is Error", key: "isError", width: 5 },
                { header: "Txreceipt Status", key: "txreceipt_status", width: 15 },
                { header: "Value", key: "value", width: 65 },
                { header: "Gas", key: "gas", width: 10 },
                { header: "Gas Price", key: "gasPrice", width: 15 },
                { header: "Gas Used", key: "gasUsed", width: 10 },
                { header: "Transaction Index", key: "transactionIndex", width: 15 },
                { header: "Block Hash", key: "blockHash", width: 65 },
                { header: "Nonce", key: "nonce", width: 10 },
                { header: "Input", key: "input", width: 10 },
                { header: "Cumulative Gas Used", key: "cumulativeGasUsed", width: 15 },
                { header: "Confirmations", key: "confirmations", width: 15 },
            ];
            break;
        case 'tokentx':
            column = [
                { header: "Hash", key: "hash", width: 65 },
                { header: "TimeStamp", key: "timeStamp", width: 15 },
                { header: "Date Time", key: "datetime", width: 10 },
                { header: "From", key: "from", width: 65 },
                { header: "To", key: "to", width: 65 },
                { header: "Contract Address", key: "contractAddress", width: 65 },
                { header: "Adjusted Value", key: "adjustedValue", width: 15 },
                { header: "Token Name", key: "tokenName", width: 15 },
                { header: "Token Symbol", key: "tokenSymbol", width: 15 },
                { header: "Block Number", key: "blockNumber", width: 10 },
                { header: "Value", key: "value", width: 65 },
                { header: "Token Decimal", key: "tokenDecimal", width: 15 },
                { header: "Transaction Index", key: "transactionIndex", width: 15 },
                { header: "Block Hash", key: "blockHash", width: 65 },
                { header: "Nonce", key: "nonce", width: 10 },
                { header: "Gas", key: "gas", width: 10 },
                { header: "Gas Price", key: "gasPrice", width: 15 },
                { header: "Gas Used", key: "gasUsed", width: 10 },
                { header: "Cumulative Gas Used", key: "cumulativeGasUsed", width: 15 },
                { header: "Input", key: "input", width: 10 },
                { header: "Confirmations", key: "confirmations", width: 15 }
            ];
            break;
        default:
            console.log("wrong report")
    }
    return column
}

let getNameFile = (report, address, divided = false, counter_divided = false, end_date = false) => {
    let name;
    let final;
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
    final = name + '_' + address
    if (divided) final += '_Part_' + counter_divided
    if (end_date) final += '_Until_' + end_date
    return final + '.xlsx'
}

module.exports = {
    timeConverter, getBlockNoByDate, prevLetter, nextLetter, extractNumberByCell, prevCell, removeFirstItems,
    getHeaders, getNumberToDivide, getNameFile
}