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

  Dropzone.options.myAwesomeDropzone = {
    uploadMultiple: true,
    addRemoveLinks: true,
    success: function(file, success){
      addFormToFile(file);
    }
  };

  var $ogAssetForm = $($(".new-asset")[0]).clone();

  function addFormToFile(file){
    var $assetForm = $ogAssetForm.clone();
    var $previewBox = $(".dz-preview:not(.appended)");
    var numOfAlteredFiles = $(".new-asset.appended").length;

    $assetForm.removeClass("invisible");
    $previewBox.addClass("appended");
    $previewBox.append($assetForm);

    formListeners();
  }

  function formListeners(){
    $("select.category").off();
    $("select.category").change(function(){
      var $parent = $($(this).parents(".new-asset"));
      var category = $(this).find("option:selected").attr("val");
      $parent.find(".hidden").hide();

      switch(category){
        case "icon":
          $parent.find(".context").show();
          break;
        case "term":
          $parent.find(".definition").show();
          break;
        case "font":
          console.log("font");
          break;
        case "logo":
          
          break;
        case "powerpoint":
          $parent.find(".preview-image").show();
          break;
        case "digram":
          
          break;
        case "persona":
          $parent.find(".definition").show();
          break;
        default:
          break;
      }
    });
  }

  // $(".upload-submit").click(function(){
  //   // console.log("formsub");
  //   var form = $(".new-asset")[0];
  //   console.log(form);
  //   var formData = new FormData(form);
  //   debugger;
  //    $.ajax({
  //         url: '/upload-files',
  //         type: 'POST',
  //         data: formData,
  //         processData: false,
  //         contentType: false,
  //         success: function (data) {
  //             success();
  //         },
  //         error: function (err) {
  //             error();
  //         }
  //     });
  // });

  var success = function(){
    window.location.href = "/?success=true";
  };

  var error = function(){
    window.location.href = "/?success=false";
  };

});