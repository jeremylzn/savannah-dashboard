(async function ($) {
    "use strict"; // Start of use strict

    const response = await get("address")
    const rows = await response.json()
    console.log(rows)
    controlTableCreation(rows)

})(jQuery); // End of use strict

let controlTableCreation = (rows) => {
    var t = $('#dataTable').DataTable();

    // let tbodyRef = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    for (let row of rows) {
        t.row.add([row['address'], row['eoa_contract'], row['is_ours'], row['name_tag'], row['classification'], row['first_date'] ? row['first_date'] : "", row['last_date'] ? row['last_date'] : "", row['onDatabase'] ? row['onDatabase'] : "", '<button class="btn btn-mini btn-primary pull-right">Edit</button>']).draw();
        // console.log(row)
        // // Insert a row at the end of table
        // var newRow = tbodyRef.insertRow();
        // for (let key of ['address', 'eoa_contract', 'is_ours', 'name_tag', 'classification', 'first_date', 'last_date', 'onDatabase']) {
        //     // Insert a cell at the end of the row
        //     var newCell = newRow.insertCell();
        //     var data = (row[key]) ? document.createTextNode(row[key]) : document.createTextNode("");
        //     // Append a text node to the cell
        //     newCell.appendChild(data);
        //     // console.log(key, yourobject[key]);
        //   }

        // var newCell = newRow.insertCell();
        // var data = document.createTextNode(row[key]);
        // newCell.appendChild(data);

    }
    // $('#dataTable').DataTable();
}