(function ($) {
    "use strict"; // Start of use strict

    // Submit get data
    $("#getDataSubmit").on('click', function (e) {
        console.log("clicked")
        let form = creationFormObject($('#getDataForm').serializeArray())
        console.log(form)
        

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
