$(document).ready(function(){
  var assetUris = $(".asset_uri a, .preview_uri a");

  for(var i=0; i<assetUris.length; i++){
    var currentText = $(assetUris[i]).attr("href");
    var newText = currentText.split("public/")[1];
    $(assetUris[i]).attr("href", newText);
    $(assetUris[i]).text(newText);
  }

  $(".asset .delete-button").click(function(){
    var assetId = $($(this).parents(".asset")).find(".asset_id span").text();
    var assetName = $($(this).parents(".asset")).find(".name span").text();

    $(".confirmation-dialog .id").text(assetId);
    $(".confirmation-dialog .name").text(assetName);
    $(".confirmation-dialog").show();

  });

  $(".confirmation-dialog .deny").click(function(){
    $(".confirmation-dialog").hide();
  });

  $(".confirmation-dialog .confirm").click(function(){
    var asset_id = $(".confirmation-dialog .id").text();
    console.log(asset_id);
    var data = {};
    data.id = asset_id;

    $.ajax({
        url: '/delete-asset',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            window.location.reload();
        },
        error: function (err) {
            window.location.reload();   
        }
    });
  });

});