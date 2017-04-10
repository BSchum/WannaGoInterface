app.controller('UserController', function ($scope, $location, $state,$http) {
    $scope.check = false;
    $scope.navBar = false;
    $scope.connect = function(user) {
      $http({
          url:"api/public/user/authentification",
          method:"POST",
          data:{
            username:$scope.user.username,
            password:$scope.user.password
          }
      }).then(function(response){
          if(response.data.success){
              localStorage.setItem('token',response.data.token); 
                if(localStorage.getItem('token')!= null){
                    $state.go('home');
                }
          }
          else{
              console.log("Raté");
              console.log(response.data);
              $scope.check = true;
              $scope.navBar = true;

          }
      });  
    };
});