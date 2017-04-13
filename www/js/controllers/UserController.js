app.controller('UserController', function ($scope, $location, $state,$http,$ionicPopup,profileServices, $cordovaOauth, $localStorage) {
    console.log(localStorage.getItem('token'));
    console.log($state.current.name);
    /*if($state.current.name =="login") {
        if(localStorage.getItem('token')!= null){
                $state.go('profile');
        }
    }*/

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
                    $state.go('profile');
                }
                else{
                    console.log("Raté");
                    console.log(response.data);
                }
            });
    };
    $scope.getUserInformation = function(){
        profileServices.get().success(function(data){
            $scope.username = data.profile.username;
            $scope.date = data.profile.date;
            $scope.email = data.profile.email;
        });
    }

    $scope.connectWithFb = function(){
      $cordovaOauth.facebook("290350911389056", ["email"]).then(function(result) {
        $localStorage.accessToken = result.access_token;
        $location.path("/profile");
      }, function(error) {
        alert("There was a problem signing in!  See the console for logs");
        console.log(error);
      });
    }
});

app.factory('profileServices',function($http){

    function get(){
        return $http({
            url:"api/prive/user/information",
            method:"GET",
            headers:{
                Authorization:localStorage.getItem('token')
            }
        });
    }

    return {
        get: get
    }
});
