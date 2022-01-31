(async function ($) {
    "use strict"; // Start of use strict

    const response = await get("address")
    const rows = await response.json()
    console.log(rows)
    controlTableCreation(rows)

})(jQuery); // End of use strict

let controlTableCreation = (rows) => {
    var t = $('#dataTable').DataTable();
    for (let row of rows) {
        t.row.add([row['address'], row['type'], row['is_ours'], row['name_tag'], row['classification'], row['first_date'] ? row['first_date'] : "", row['last_date'] ? row['last_date'] : "", row['onDatabase'] ? row['onDatabase'] : "", '<button class="btn btn-mini btn-primary pull-right">Edit</button>']).draw();
    }
}