(function($) {
    "use strict"; // Start of use strict
  
    // Submit get data
    $("#getDataSubmit").on('click', function(e) {
        console.log("clicked")
        let data = $('#getDataForm').serializeArray()
        console.log(data)
    });
  
  })(jQuery); // End of use strict
  