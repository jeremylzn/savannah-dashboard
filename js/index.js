(function ($) {
    "use strict"; // Start of use strict

    // Submit get data
    $("#getDataSubmit").on('click', async function (e) {
        console.log("clicked")
        let form = creationFormObject($('#getDataForm').serializeArray())
        console.log(form)

        await post("excel", form).then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
        });


    });

    $('.radio').change(function () {
        $('.radio').not(this).prop('checked', false);
    });

})(jQuery); // End of use strict

let creationFormObject = (form) => {
    let object = form.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {});
    Object.keys(object).forEach(key => {
        if (object[key] === "") {
            delete object[key];
        }
    });
    return object
}
