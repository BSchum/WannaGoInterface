app.controller('UserController', function ($scope, $location, $state,$http,$ionicPopup,profileServices) {
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
        $http({
            url:"api/public/user/authentification-facebook",
            method:"GET"
        }).then(function(response){
            window.open("https://www.facebook.com/login.php?skip_api_login=1&api_key=290350911389056&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.8%2Fdialog%2Foauth%3Fredirect_uri%3Dhttp%253A%252F%252Flocalhost%253A4500%252Fapi%252Fpublic%252Fuser%252Fauthentification-facebook%252Fcallback%26scope%3Demail%252Cuser_photos%26response_type%3Dcode%26client_id%3D290350911389056%26ret%3Dlogin%26logger_id%3Dcc3dca07-3558-fa26-2166-769d695384d4&cancel_url=http%3A%2F%2Flocalhost%3A4500%2Fapi%2Fpublic%2Fuser%2Fauthentification-facebook%2Fcallback%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%23_%3D_&display=page&locale=fr_FR&logger_id=cc3dca07-3558-fa26-2166-769d695384d4","_system","");
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