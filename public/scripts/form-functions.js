// Form Functions
// - Hiding and showing forms based on selections
$(document).ready(function(){

  $(".context").show();

  $("select.category").change(function(){
    console.log("change");
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

  var currentTags;

  $.ajax({
    url: "/get-tags",
    success: function(data){
      currentTags = data.data;

      $('#assettags')
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
    }
  });

});