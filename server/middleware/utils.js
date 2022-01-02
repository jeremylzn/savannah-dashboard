
const Web3 = require('web3');
const EthDater = require('ethereum-block-by-date');

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

async function getBlockNoByDate(start, end) {
    console.log("getBlockNoByDate")
    console.log(start)
    console.log(end)

    const provider = new Web3.providers.HttpProvider("http://nginx:qp30CnrjDFu4z8@34.251.89.147:8546");
    const web3 = new Web3(provider);
    const dater = new EthDater(web3);

    const from = await getBlockNo(start, dater)
    const to = await getBlockNo(end, dater, false)

    console.log(from)
    console.log(to)
    return [from['block'], to['block']]

}

async function getBlockNo(date, dater, to=true) {
    return await dater.getDate(
        date, // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        to // Block after, optional. Search for the nearest block before or after the given date. By default true.
    );
}

function prevLetter(letter) {
    if (letter === 'a'){ return 'a'; }
    if (letter === 'A'){ return 'A'; }
    return String.fromCharCode(letter.charCodeAt(0) - 1);
}

function nextLetter(letter) {
    if (letter === 'z'){ return 'z'; }
    if (letter === 'Z'){ return 'Z'; }
    return String.fromCharCode(letter.charCodeAt(0) + 1);
}

function prevCell(cell) {
    currentNumber = extractNumberByCell(cell)
    prevNumber = (currentNumber[1] > 1) ? currentNumber[1]-1 : currentNumber[1]
    return cell[0] + prevNumber
}

let extractNumberByCell = (string) => {
    var matches = string.match(/(\d+)/);
  
    if (matches) {
      new_string = string.replace(matches[0], "")
      var n = new_string.charCodeAt(0) - 64;
      console.log([parseInt(n), parseInt(matches[0])])
      return [parseInt(n), parseInt(matches[0])];
    }
}

module.exports = { timeConverter, getBlockNoByDate, prevLetter, nextLetter, extractNumberByCell, prevCell }