
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

module.exports = { timeConverter, getBlockNoByDate }