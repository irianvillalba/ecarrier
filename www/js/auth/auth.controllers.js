angular.module('your_app_name.auth.controllers', [])

.controller('AuthCtrl', function($scope){

})

.controller('WelcomeCtrl', function($scope, $ionicModal, show_hidden_actions, $state){

	$scope.show_hidden_actions = show_hidden_actions;

	$scope.toggleHiddenActions = function(){
		$scope.show_hidden_actions = !$scope.show_hidden_actions;
	};

	$scope.facebookSignIn = function(){
		console.log("doing facebbok sign in");
		$state.go('app.profile.posts');
	};

	$scope.googleSignIn = function(){
		console.log("doing google sign in");
		$state.go('app.profile.posts');
	};

	$scope.twitterSignIn = function(){
		console.log("doing twitter sign in");
		$state.go('app.profile.posts');
	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('LogInCtrl', function($scope, $state, $http, $ionicPopup, localStorage){
	$scope.doLogIn = function(){
        var req = {
            method: 'POST',
            url: rotas.perfil.login,
            data: {
                "usuario": $scope.user
            }
        }

        $http(req).then(sucesso);

        function sucesso(s) {
            if (typeof(s.data.id_perfil) == 'undefined') {
                $ionicPopup.alert({
                    title: 'E Carrier',
                    template: s.data
                })
            } else {
                localStorage.setObject('usuario', s.data);
                $state.go('app.profile.posts');
            }
        }


	};
})

.controller('CadastroCtrl', function($scope, $state, $http, $ionicPopup){

	$scope.doSignUp = function(){

        var req = {
            method: 'POST',
            url: rotas.perfil.cadastro,
            data: {
                "usuario": $scope.user,
                "situacao": 'cadastro'
            }
        }

        $http(req).then(sucesso);

        function sucesso(s) {
            $ionicPopup.alert({
                title: 'E Carrier',
                template: s.data
            }).then(function(res) {
                    if (s.data == 'cadastrado com sucesso')
                        $state.go('auth.login');
                });

        }

	};

})

.controller('ForgotPasswordCtrl', function($scope, $state){
	$scope.requestNewPassword = function() {
    console.log("requesting new password");
		$state.go('app.profile.posts');
  };
})

;
