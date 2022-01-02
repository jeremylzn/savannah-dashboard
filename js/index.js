(function ($) {
    "use strict"; // Start of use strict

    const fileSelector = document.getElementById('upload-file');
    var fileList;
    var loadingDiv = document.getElementById('loading');

    // Submit get data
    $("#getDataSubmit").on('click', async function (e) {
        loadingDiv.style.visibility = 'visible';
        console.log("clicked")
        let form = creationFormObject($('#getDataForm').serializeArray())
        console.log(form)

        var form_data = new FormData()
        for ( var key in form ) {
            form_data.append(key, form[key]);
        }


        if(fileList){
            form_data.append('files', fileList[0])          
        }

        await post("excel", form_data).then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(url => {
            loadingDiv.style.visibility = 'hidden';
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
        });




    });

    $('.radio').change(function () {
        $('.radio').not(this).prop('checked', false);
    });

    fileSelector.addEventListener('change', (event) => {
      fileList = event.target.files;
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
