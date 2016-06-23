$(document).ready(function(){

  $(".upload-submit").click(function(){
    // console.log("formsub");
    var form = $(".new-asset")[0];
    console.log(form);
    var formData = new FormData(form);
     $.ajax({
          url: '/upload-files',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (data) {
              console.log(data);
          },
          error: function (err) {
              console.log(err);
          }
      });
  });

});