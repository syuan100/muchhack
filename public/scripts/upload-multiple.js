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
    uploadMultiple: false,
    addRemoveLinks: true,
    success: function(file, success){
      addFormToFile(success);
    }
  };

  var $ogAssetForm = $($(".new-asset")[0]).clone();
  var $ogUpdateForm = $($(".updating-asset")[0]).clone();

  function addFormToFile(success){
    var $assetForm = $ogAssetForm.clone();
    var $updateForm = $ogUpdateForm.clone();
    var $previewBox = $(".dz-preview:not(.appended)");
    var numOfAlteredFiles = $(".new-asset.appended").length;

    $assetForm.addClass("appended").removeClass("invisible");
    $updateForm.addClass("appended").removeClass("invisible").addClass('hidden');
    $assetForm.attr("data-path", success.files[0].path);
    $previewBox.addClass("appended");
    $previewBox.append($assetForm);
    $previewBox.append($updateForm);

    $.each($(".new-asset.appended"), function(i,e){
      $(e).attr("id", Math.random().toString(36).substr(2, 9));
    });

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

    $(".new-asset-button").off();
    $(".new-asset-button").click(function(){
      var $currentAssetForm = $(this).parents(".dz-preview").find(".new-asset");
      var $currentUpdateForm = $(this).parents(".dz-preview").find(".updating-asset");
      $currentAssetForm.show();
      $currentUpdateForm.hide();
    });

    $(".updating-asset-button").off();
    $(".updating-asset-button").click(function(){
      var $currentAssetForm = $(this).parents(".dz-preview").find(".new-asset");
      var $currentUpdateForm = $(this).parents(".dz-preview").find(".updating-asset");
      $currentAssetForm.hide();
      $currentUpdateForm.show();
    });

    $.ajax({
    url: "/get-tags",
    success: function(data){
      currentTags = data.data;

      $.each($('.asset-tags'), function(i,item){
        $(item)
          .textext({
            plugins : 'tags autocomplete'
        })
        .bind('getSuggestions', function(e, data)
        {
            var list = currentTags,
                textext = $(e.target).textext()[0],
                query = (data ? data.query : '') || '';

            $(this).trigger(
                'setSuggestions',
                { result : textext.itemManager().filter(list, query) }
            );
        });
        $(item).removeClass("asset-tags").addClass("asset-tags-textext");
      });
    }
  });

  $(".search-assets").off();

  $(".search-assets").on("input", function(){
    var inputVal = $(this).val();
    console.log("searching");
    $.ajax({
      url: "/ajax-search?search=" + inputVal,
      type: "GET",
      success: function(data){
        console.log(data);
      }
    });
  });
}



  $(".upload-submit").click(function(){
    var $filesToUpload = $(".new-asset.appended");
    $.each($filesToUpload, function(i,e){
      var formData = new FormData(e);
      formData.append("assetid", $(e).attr("id"));
      formData.append("assetpath", $(e).attr("data-path"));
      formData.append("thumbnail", $(e).parents(".dz-preview").find(".dz-image img").attr("src"));
      debugger;
      $.ajax({
          url: '/multiple-upload-files',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function (data) {
              console.log("successfully uploaded");
              success(data.id);
          },
          error: function (err) {
              console.log("error");
              error();
          }
      });
    });

    $(this).hide();
    $(".submitted").show();
  });

  $(".upload-more").click(function(){
    window.location.reload();
  });

  $(".home").click(function(){
    window.location.href = "/";
  });

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

  var successNumber = 0;
  var errorNumber = 0;

  var success = function(id){
    $(".new-asset.appended#" + id).hide();
    $(".new-asset.appended#" + id).after($("<div class='success-message'>Successfully uploaded. <a href='edit/" + id + "'>Edit Asset</div>"));
    // window.location.href = "/?success=true";
  };

  var error = function(){
    $(".new-asset.appended#" + id).hide();
    $(".new-asset.appended#" + id).after($("<div class='error-message'>Unable to upload.</div>"));
    // window.location.href = "/?success=false";
  };

});