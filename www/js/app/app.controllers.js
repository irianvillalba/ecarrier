angular.module('your_app_name.app.controllers', [])


.controller('AppCtrl', function($scope, AuthService) {

  //this will represent our logged user
  var user = {
    about: "Design Lead of Project Fi. Love adventures, green tea, and the color pink.",
    name: "Brynn Evans",
    picture: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
    _id: 0,
    followers: 345,
    following: 58
  };

  //save our logged user on the localStorage
  AuthService.saveUser(user);
  $scope.loggedUser = user;
})


.controller('ProfileCtrl', function($scope, $stateParams, PostService, $ionicHistory, $state, $ionicScrollDelegate) {

  $scope.$on('$ionicView.afterEnter', function() {
    $ionicScrollDelegate.$getByHandle('profile-scroll').resize();
  });

  var userId = $stateParams.userId;

  $scope.myProfile = $scope.loggedUser._id == userId;
  $scope.posts = [];
  $scope.likes = [];
  $scope.user = {};

  PostService.getUserPosts(userId).then(function(data){
    $scope.posts = data;
  });

  PostService.getUserDetails(userId).then(function(data){
    $scope.user = data;
  });

  PostService.getUserLikes(userId).then(function(data){
    $scope.likes = data;
  });

  $scope.getUserLikes = function(userId){
    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.likes', {userId: userId});
  };

  $scope.getUserPosts = function(userId){
    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.posts', {userId: userId});
  };

})


.controller('ProductCtrl', function($scope, $stateParams, ShopService, $ionicPopup, $ionicLoading) {
  var productId = $stateParams.productId;

  ShopService.getProduct(productId).then(function(product){
    $scope.product = product;
  });

  // show add to cart popup on button click
  $scope.showAddToCartPopup = function(product) {
    $scope.data = {};
    $scope.data.product = product;
    $scope.data.productOption = 1;
    $scope.data.productQuantity = 1;

    var myPopup = $ionicPopup.show({
      cssClass: 'add-to-cart-popup',
      templateUrl: 'views/app/shop/partials/add-to-cart-popup.html',
      title: 'Add to Cart',
      scope: $scope,
      buttons: [
        { text: '', type: 'close-popup ion-ios-close-outline' },
        {
          text: 'Add to cart',
          onTap: function(e) {
            return $scope.data;
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if(res)
      {
        $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adding to cart</p>', duration: 1000 });
        ShopService.addProductToCart(res.product);
        console.log('Item added to cart!', res);
      }
      else {
        console.log('Popup closed');
      }
    });
  };
})


.controller('PostCardCtrl', function($scope, PostService, $ionicPopup, $state) {
  var commentsPopup = {};

  $scope.navigateToUserProfile = function(user){
    commentsPopup.close();
    $state.go('app.profile.posts', {userId: user._id});
  };

  $scope.showComments = function(post) {
    PostService.getPostComments(post)
    .then(function(data){
      post.comments_list = data;
      commentsPopup = $ionicPopup.show({
  			cssClass: 'popup-outer comments-view',
  			templateUrl: 'views/app/partials/comments.html',
  			scope: angular.extend($scope, {current_post: post}),
  			title: post.comments+' Commentários',
  			buttons: [
  				{ text: '', type: 'close-popup ion-ios-close-outline' }
  			]
  		});
    });
	};
})

.controller('FeedCtrl', function($scope, PostService, $ionicPopup, $state) {
  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    PostService.getFeed(1)
    .then(function(data){
      $scope.totalPages = data.totalPages;
      $scope.posts = data.posts;

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getNewData = function() {
    //do something to load your new data here
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getFeed($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.totalPages;
      $scope.posts = $scope.posts.concat(data.posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.doRefresh();

})


.controller('ShopCtrl', function($scope, ShopService, $ionicModal) {
  $scope.products = [];
  $scope.popular_products = [];

  ShopService.getProducts().then(function(products){
    $scope.products = products;
  });



  ShopService.getProducts().then(function(products){
    $scope.popular_products = products.slice(0, 2);
  });
    
    $scope.userValor= {
        min:5,
        max:100,
        value:50
    }
    
$ionicModal.fromTemplateUrl('views/app/shop/pagamento.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.pagamento_modal = modal;
  });
    
    $scope.showPagamento = function(){
        $scope.pagamento_modal.show();
    }
})


.controller('ShoppingCartCtrl', function($scope, ShopService, $ionicActionSheet, _) {
  $scope.products = ShopService.getCartProducts();

  $scope.removeProductFromCart = function(product) {
    $ionicActionSheet.show({
      destructiveText: 'Remove from cart',
      cancelText: 'Cancel',
      cancel: function() {
        return true;
      },
      destructiveButtonClicked: function() {
        ShopService.removeProductFromCart(product);
        $scope.products = ShopService.getCartProducts();
        return true;
      }
    });
  };

  $scope.getSubtotal = function() {
    return _.reduce($scope.products, function(memo, product){ return memo + product.price; }, 0);
  };

})


.controller('CheckoutCtrl', function($scope, $ionicModal) {
  
})

.controller('SettingsCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });
    
  $ionicModal.fromTemplateUrl('views/app/profile/senha.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.alterar_senha_modal = modal;
  });
    
  $ionicModal.fromTemplateUrl('views/app/legal/ajuda.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.ajuda_modal = modal;
  });

  $scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };
    
  $scope.showAlterarSenha = function() {
    $scope.alterar_senha_modal.show();
  };

  $scope.showAjuda = function() {
    $scope.ajuda_modal.show();
  };
    
    
})


.controller('NovaMsgCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  
  // Load the data  
  $scope.autoExpand = function(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
    		var scrollHeight = element.scrollHeight -60; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height =  scrollHeight + "px";    
    };
  
  function expand() {
    $scope.autoExpand('TextArea');
  }
    
   /* var options = {
        date: new Date(),
        mode: 'date'
    };

    function onSuccess(date) {
        alert('Selected date: ' + date);
    }

    function onError(error) { // Android only
        alert('Error: ' + error);
    }

    datePicker.show(options, onSuccess, onError);*/
    
    
}])

.controller('dataCtrl', function($scope, $http, ionicDatePicker){
    
        $scope.datePickerDias;
    
        $scope.datePicker = function(val){            
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              console.log('Return value from the datepicker popup is : ' + val, new Date(val));
              $scope.datePickerDias = new Date(val);
            },
              inputDate: new Date(),
              titleLabel: 'Selecione uma data',
              setLabel: 'Fixar',
              todayLabel: 'Hoje',
              closeLabel: 'Fechar',
              mondayFirst: false,
              weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
              monthsList: ["Jan", "Fev", "Mar", "Abril", "Maio", "Jun", "Jul", "Ago", "Sete", "Out", "Nov", "Dez"],
              templateType: 'popup',
              from: new Date(),
              to: new Date(2018, 31, 12),
              showTodayButton: false,
              dateFormat: 'dd MMMM yyyy',
              closeOnSelect: true,
              disableWeekdays: []
          };
          ionicDatePicker.openDatePicker(ipObj1);
        };       
    
})  

.controller('imgController', function($scope, $cordovaImagePicker, $ionicPlatform, Camera){
    
   /* $scope.getImageSaveContact = function() {       
        // Image picker will load images according to these settings
    var options = {
       maximumImagesCount: 10,
       width: 800,
       height: 800,
       quality: 80
      };

      $cordovaImagePicker.getPictures()
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
        }, function(error) {
          // error getting photos
        });
    };*/
    
    $scope.takePicture = function() {
      
    Camera.getPicture().then(function(imageURI) {
              console.log(imageURI);
            }, function(err) {
              console.err(err);

      }, function(err) {

        // Ruh-roh, something bad happened

      }, cameraOptions);
    }
})

;
