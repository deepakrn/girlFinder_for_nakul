
$(document).ready(
blueimp.Gallery(
    document.getElementById('images').getElementsByTagName('a'),
    {
        container: '#blueimp-gallery-carousel',
        carousel: true,
        slideshowInterval: 8000,
    }
)

);

$("#responseForm").submit(function(e){
	e.preventDefault();
	var formData = JSON.stringify($("#responseForm").serializeArray());

	$.ajax({
	  type: "POST",
	  url: "../submit",
	  data: formData,
	  success: function(res){
	  	alert(res.response)
	  },
	  dataType: "json",
	  contentType : "application/json"
	});

})

