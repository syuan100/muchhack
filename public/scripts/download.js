$(document).ready(function(){
  var assetUris = $(".asset_uri a, .preview_uri a");

  for(var i=0; i<assetUris.length; i++){
    var currentText = $(assetUris[i]).attr("href");
    var newText = currentText.split("public/")[1];
    $(assetUris[i]).attr("href", newText);
    $(assetUris[i]).text(newText);
  }

});