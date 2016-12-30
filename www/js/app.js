// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controller', 'starter.filter', 'starter.directive', 'ionic-timepicker', 'starter.services', 'onezone-datepicker', 'ion-floating-menu', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('event', {
    url: '/event',
    templateUrl: 'templates/event.html'
  })
  
   .state('event1', {
    url: '/event1',
    templateUrl: 'templates/event1.html'
  })

  .state('map2', {
    url: '/map',
    templateUrl: 'templates/map.html'
  })

  .state('calenderView', {
    url: '/calenderView',
    templateUrl: 'templates/calenderView.html'
  })

  .state('addEvents', {
    url: '/addEvents',
    templateUrl: 'templates/addEvents.html'
  })
/*
  .state('emptyEventPage', {
    url: '/emptyEventPage',
    templateUrl: 'templates/emptyEventPage.html'
  })
*/
  .state('showFullEvent', {
    url: '/showFullEvent',
    templateUrl: 'templates/showFullEvent.html'
  })
 
   
  $urlRouterProvider.otherwise('/calenderView'); 
})

.directive('textarea', function() {

  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            var height = element[0].scrollHeight; 
            element.css("height", element[0].scrollHeight + "px");
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
});
