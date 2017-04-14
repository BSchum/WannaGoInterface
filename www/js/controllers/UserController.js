app.controller('UserController', function ($scope, $location, $state,$http,$ionicPopup,profileServices, $cordovaOauth, $localStorage) {
  console.log(localStorage.getItem('token'));
  console.log($state.current.name);
  if ($state.current.name == "login") {
    if (localStorage.getItem('token') != null) {
      $state.go('home');
    }
  }
  $scope.signin = function () {
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/public/user/register/" + $scope.choice,
      method: "PUT",
      data: {
        username: $scope.user.username,
        email: $scope.user.email,
        password: $scope.user.password,
        date: $scope.user.date
      }
    }).then(function (response) {
      console.log(response);
      $state.go('login');
    });
  }
  $scope.changePassword = function () {
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/private/user/password",
      method: "POST",
      data: {
        password: $scope.nwPassword
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(function (data) {
        console.log(data);

      });
  }
  $scope.verifyBeforeChangePass = function () {// VERIFIER LE MOT DE PASSE AVANT DE CHANGER
  };
  $scope.goToPass = function () {
    $state.go('pass');
  };

  $scope.disconnect = function () {
    console.log("disconnect");
    localStorage.removeItem('token');
    console.log(localStorage.getItem('token'));
    $state.go('login');
  }
  $scope.getUserInformation = function () {
    profileServices.get().success(function (data) {
      $scope.username = data.username;
      $scope.date = data.date;
      $scope.email = data.email;
      console.log("profile { Username :" + $scope.username + ", date :" + $scope.date + ", email :" + $scope.email + "}");
    });
  };
  $scope.connect = function (user) {
    $scope.disconnect();
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/public/user/authentification",
      method: "POST",
      data: {
        username: $scope.user.username,
        password: $scope.user.password
      }
    })
      .then(function (response) {
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          $scope.getUserInformation();
          $state.go("home");
        }
        else {
          console.log("Raté");
          console.log(response.data);
        }
      });
  };

  $scope.connectWithFb = function () {
    $cordovaOauth.facebook("290350911389056", ["email"]).then(function (result) {
      $localStorage.accessToken = result.access_token;
      $location.path("/profile");
    }, function (error) {
      console.log(error);
    });
  };
});

app.factory('profileServices',function($http){

    function get(){
        return $http({
            url:"https://iwannagoapi.herokuapp.com/api/prive/user/information",
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
