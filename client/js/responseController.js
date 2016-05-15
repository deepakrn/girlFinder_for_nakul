app.controller('responseController', ['$scope', '$resource', function ($scope, $resource) {
  var responseObject = $resource('/profile');
  console.log('responseObject:'+responseObject); 

  $scope.createResponseObject = function () {
    var response = new responseObject($scope.response);
    response.$save(function (result) {
      if(result){ 
        window.location="../";
      }    
    });
  }
  
  var FetchResponse = $resource('/profile');
  $scope.fetchResponse= function () {
    var fetchResponse = new FetchResponse();
    fetchResponse.$find
  }

  $scope.init = function (user, response) {
    if(response){
      $scope.response = response
    } else {
      $scope.response = {};
      $scope.response.id = user.id;
    }
  }
}]);