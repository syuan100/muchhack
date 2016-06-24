$(document).ready(function(){

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  if(getParameterByName("success") === "true") {
    $(".success").show();
  } else if (getParameterByName("success") === "false") {
    $(".error").show();
  }

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
              success();
          },
          error: function (err) {
              error();
          }
      });
  });

  var success = function(){
    window.location.href = "/?success=true";
  };

  var error = function(){
    window.location.href = "/?success=false";
  };

});