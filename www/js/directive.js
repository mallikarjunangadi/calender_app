angular.module('starter.directive', [])

 .directive('googleplace', function($rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: []
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {

             var place = scope.gPlace.getPlace();
              if (place && place.geometry) {
          
               var data = {
                 lat: place.geometry.location.lat(),
                 lng: place.geometry.location.lng(),
                 address:element.val()
               };

               $rootScope.latLng = {};
               $rootScope.latLng = data;
              } 
              
               scope.$apply(function() {
                   model.$setViewValue(element.val());                
               });
            });
        }
    };
});