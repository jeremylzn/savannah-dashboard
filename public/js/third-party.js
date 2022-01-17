let post = function(url, data) {
    return fetch(url, {method: "POST", body: data});
}

let getNameFile = (report, address, divided=false, end_date = false) => {
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
    if (end_date) final += '_Until_' + end_date
    return (divided) ? final + '.zip' : final + '.xlsx'
}