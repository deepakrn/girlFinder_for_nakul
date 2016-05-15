
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

var app = angular.module('girlFinder', ['ngResource']);
$("#blueimp-gallery-carousel").click();