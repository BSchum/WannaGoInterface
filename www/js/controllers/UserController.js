app.controller('UserController', function ($scope, $location, $state,$http,$ionicPopup,profileServices) {
    console.log(localStorage.getItem('token'));
    console.log($state.current.name);
    if($state.current.name =="login") {
        if(localStorage.getItem('token')!= null){
                $state.go('settings');
        }
    }
    $scope.signin = function(){
        $http({
            url:"api/public/user/register/"+$scope.choice,
            method:"PUT",
            data:{
                username:$scope.user.username,
                email:$scope.user.email,
                password:$scope.user.password,
                date:$scope.user.date
            }
        }).then(function(response){
            console.log(response);
            $state.go('login');
        });
    }
    $scope.changePassword = function(){

    }
    $scope.disconnect = function(){
        console.log("disconnect");
        localStorage.removeItem('token');
        $state.go('login');
    }
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
                    $state.go('settings');
                }
                else{
                    console.log("Raté");
                    console.log(response.data);
                }
            });  
    };

    $scope.getUserInformation = function(){
        
        profileServices.get().success(function(data){
            $scope.username = data.username;
            $scope.date = data.date;
            $scope.email = data.email;
            console.log(data.date);
        });
    };

    $scope.connectWithFb = function(){
        $http({
            url:"api/public/user/authentification-facebook",
            method:"GET"
        }).then(function(response){
            window.open("/api/public/user/authentification-facebook","_system","")
        });
    };
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