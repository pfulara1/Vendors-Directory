var myapp= angular.module('app',['ngMap','locator']);

myapp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){

$locationProvider.html5Mode(true);

$routeProvider.when('/',{
   templateUrl:'views/index.html',
   controller:'IndexController'

}).
when('/contact',{
  templateUrl:'views/contact.html'
}).
when('/addshop',{
  templateUrl:'views/addshop.html',
  controller:'AddShopController'
}).otherwise({
  redirectTo:'/home'
});
}]);


//scope is genrally a binding part between html view and javascript controller
myapp.controller('IndexController',['$scope','$http', function($scope,$http){

$scope.getLocation = function(){
    var options = {enableHighAccuracy: true};
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.latitude = position.coords.latitude;
          $scope.longitude= position.coords.longitude;
          $scope.formdata._location= position.coords.latitude+ ":" + position.coords.longitude;
        },options);
    }
    else {
         alert("Geolocation is not supported by this browser.");
    }
};

$scope.postData = function() {
  $http.post('/',$scope.formdata).then(function(response) {
            if(response.data.length!=0){
            $scope.data=response.data;
            $scope.error="";
          }
            else {
            $scope.error="Damn! We are sorry no vendors found for this search request.";
            $scope.data="";
            }
        }, function(response) {
            $scope.error="Damn! We are sorry no vendors found for this search request.";
            $scope.data="";
        });
};

}]);

myapp.controller('AddShopController',['$scope','$http' ,'location', function($scope,$http,$location){
    location.get(angular.noop, angular.noop);
     $scope.isModalVisible = false;

     $scope.toggleModal = function() {
       $scope.isModalVisible = !$scope.isModalVisible;
     };
    $scope.$watch('pickedLocation', $scope.toggleModal);
}]);
