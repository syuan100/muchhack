// Form Functions
// - Hiding and showing forms based on selections
$(document).ready(function(){

  $(".context").show();

  $("select.category").change(function(){
    var category = $("select.category option:selected").attr("val");
    $(".hidden").hide();

    switch(category){
      case "icon":
        console.log("hi");
        $(".context").show();
        break;
      case "term":
        $(".definition").show();
        break;
      case "font":
        console.log("font");
        break;
      case "logo":
        
        break;
      case "powerpoint":
        $(".preview-image").show();
        break;
      case "digram":
        
        break;
      case "persona":
        $(".definition").show();
        break;
      default:
        console.log("default");
        break;
    }
  });

});