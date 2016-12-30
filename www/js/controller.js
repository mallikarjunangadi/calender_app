angular.module('starter.controller', []).controller('event1Ctrl', function($scope, $http, $ionicHistory, myFactory, $state, $rootScope, localStorageFactory) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {

        console.log($rootScope.myEventDate);
        var jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        var jsonObj = jsonCalObj[$rootScope.myEventDate];
      
        if(angular.isUndefined(jsonObj)) {
          $scope.eventData = [];
        } else {
           $scope.eventData = jsonObj.events;
           $scope.eventDate = jsonObj.eventDate;
        }
    })
    
    $scope.addEvents = function() {
        $state.go('addEvents');
    }
    $scope.showFullEvent = function(eventObj) {
        $rootScope.hideEditnDeleteBtn = false;
       
        $rootScope.fullEventObj = eventObj;
        $state.go('showFullEvent');
    }
    $scope.goBack = function() {
        $state.go('calenderView');
        // $ionicHistory.goBack();
    }
}).controller('MapCtrl', function($scope, $state, $ionicLoading, $compile, myFactory, $ionicHistory) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
        var longLat = myFactory.get();
        var long = longLat.lang;
        var lat = longLat.lat;
        var address = longLat.address;
        console.log('entered befre view');
        function initialize() {
            var myLatlng = new google.maps.LatLng(lat,long);
            console.log(longLat);
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("eventMap"),mapOptions);
            console.log("map Ctrl");
            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>" + address + "</a></div>";
            var compiled = $compile(contentString)($scope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: $scope.map,
                title: 'My location'
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open($scope.map, marker);
            });
            //$scope.map = map;
        }
        ionic.Platform.ready(initialize);
        $scope.centerOnMe = function() {
            if (!$scope.map) {
                return;
            }
            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });
            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        }
        ;
        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        }
        ;
    });
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
}).controller('calCtrl', function($scope, $http, $state, $q, serverFactory, localStorageFactory, localStorageService, $rootScope) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
       loadEvents();
    });

    var todayDate = new Date();
    $rootScope.latLng = {};
    $rootScope.editingObj = {};

    $scope.onezoneDatepicker = {
        date: new Date(),
        // MANDATORY                     
        mondayFirst: false,
        disablePastDays: false,
        disableSwipe: false,
        disableWeekend: false,
        showDatepicker: true,
        showTodayButton: true,
        calendarMode: true,
        hideCancelButton: false,
        hideSetButton: false,
        highlights: [],
        callback: function(value) {
            console.log(value);
            $rootScope.displayMonthEvents(value);
            dateSelected(value);
            todayDate = value;
        }
    };
   
    console.log($scope.onezoneDatepicker.date);
    
    var jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
    //first time create new key in local storage if not exists
    if (jsonCalObj == null) {
        localStorageFactory.submit('myCalenderEvents', {});
        jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        console.log('created key myCalenderEvents')
    }

    loadEvents();   

    $scope.showFullEvent = function showFullEvent(eventObj) {
        $rootScope.hideEditnDeleteBtn = true;
        $rootScope.fullEventObj = eventObj;
        $state.go('showFullEvent');
    }

    function loadEvents() {
     //   var promise = serverFactory.serverToServer('', "http://192.168.0.13:3000/getEvents");
        var promise = serverFactory.serverToServer('', "http://calenderappevents.azurewebsites.net/getEvents");
        promise.then(function(data) {
           console.log(data);
           pushToHighlights();  
           $rootScope.displayMonthEvents(todayDate);
        });
    }
     
    function pushToHighlights() {
        $scope.onezoneDatepicker.highlights = [];
        console.log('entered push to highlights');
        var jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        for (var key in jsonCalObj) {
            var d = new Date(key);
            // pushing calender key Dates to hightlights to highlight color 
            $scope.onezoneDatepicker.highlights.push({
                date: d
            });
        }
    } 

    function dateSelected(value) {
        var str = value.toString().substr(4, 11);
        $rootScope.myEventDate = str;
        console.log(str);
        $state.go('event1');
    }

    $rootScope.displayMonthEvents = function displayMonthEvents(today) {
        var jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        var keyArr2 = [];
        for (var key in jsonCalObj) {
            keyArr2.push(key);
        }
        console.log(jsonCalObj);
        var thisMonth = today.toString().substr(4, 3);
        var thisYear = today.toString().substr(11, 4);
        console.log("---" + thisMonth + "---" + thisYear + "---")
        $scope.monthEventsArr = [];
        keyArr2.sort();
   
        for (var i = 0; i < keyArr2.length; i++) {
            if (keyArr2[i].startsWith(thisMonth) && keyArr2[i].endsWith(thisYear)) {
                //to check this month and year
                console.log(keyArr2[i]);
                var tempArr = jsonCalObj[keyArr2[i]].events;
                console.log(tempArr);

                for (var j = 0; j < tempArr.length; j++) {
                    $scope.monthEventsArr.push(tempArr[j]);
                }
            }
        }
        console.log($scope.monthEventsArr);
    }
})

 .controller('addEventsCtrl', function($scope, $http, $q, $filter, $ionicHistory, $state, loadFromServerFactory, $rootScope, ionicTimePicker, serverFactory, localStorageService, localStorageFactory) {
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
        $scope.editingObj = $rootScope.editingObj;
        //retrieve obj to edit
        $scope.eventObj = {};
        $scope.endTimeVisibility = false;
        $scope.isEditingObjUndefined = angular.equals({}, $scope.editingObj);
        console.log("editingObj object is empty? " + $scope.isEditingObjUndefined)
        if (!$scope.isEditingObjUndefined) {
            $scope.eventObj = $scope.editingObj;
            $scope.endTimeVisibility = true;
            $rootScope.myEventDate = $scope.editingObj.eventDate;
            $rootScope.editingObj = {};
        } else {
            $scope.eventObj = {
                eventDate: ""
            };
            $scope.eventObj.eventDate = $rootScope.myEventDate;
        }
        console.log($scope.eventObj);
    });

    $scope.goBack = function() {
        $ionicHistory.goBack();
    }

   function timePicker() {
       var deferred = $q.defer();
        var Obj = {
            callback: function(val) {
                if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                    deferred.reject('error');
                } else {
                    console.log("time value: " + val);
                    deferred.resolve(val);
                }
            },
            format: 12,
            step: 1,
            setLabel: 'Set',
            closeLabel: 'Close'
        };
        
        ionicTimePicker.openTimePicker(Obj);
       return deferred.promise;
    }

  $scope.startTimePick = function startTimePicker() {
    var promise = timePicker();
     promise.then( function(val){
         $scope.startValue = val;
           if ($scope.endValue < val) {
              val = $scope.endValue;
           }
           
         var timeString = $filter('epochToDate')(val);
     //    document.getElementById('startText').value = timeString;
         $scope.eventObj.eventStartTime = timeString;
         $scope.endTimeVisibility = true;   
     });
  }    

  $scope.endTimePick = function endTimePicker() {
    var promise = timePicker();
     promise.then( function(val){
         $scope.endValue = val;
           if ($scope.startValue > val) {
               val = $scope.startValue;
           }

         var timeString = $filter('epochToDate')(val);
     //    document.getElementById('endText').value = timeString;
         $scope.eventObj.eventEndTime = timeString;   
     });
  }  

 //   $scope.gPlace;
    $scope.disableTap = function() {
        console.log('entered disableTap...')
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('searchBar').blur();
        });
    };
 
    var eventsArr = [];  
    var latt, longi, address;

    $scope.save = function() {   
        console.log($rootScope.latLng);
   
        var isLatLngEmpty = angular.equals({}, $rootScope.latLng);
        if (!isLatLngEmpty) {
            console.log('LatLng obj is not empty...');
            latt = $rootScope.latLng.lat;
            longi = $rootScope.latLng.lng;
            address = $rootScope.latLng.address;
            $rootScope.latLng = {};
        } else {
            console.log('entered else...')
            latt = $scope.eventObj.lat;
            longi = $scope.eventObj.long;
            address = $scope.eventObj.address;
        }
        console.log($scope.eventObj);
        var uniq = 'uniqId' + (new Date()).getTime();
          
        eventsArr[0] = {
            eventDate: $scope.eventObj.eventDate,
            eventName: $scope.eventObj.eventName,
            eventStartTime: $scope.eventObj.eventStartTime,
            eventEndTime: $scope.eventObj.eventEndTime,
            eventTask: $scope.eventObj.eventTask,
            lat: latt,
            long: longi,
            address: address,
            uniqId: uniq
        }
         
        console.log(eventsArr[0]);
      
        if (!$scope.isEditingObjUndefined) {
             var doc2send = {
               myObj: JSON.stringify(eventsArr[0]), 
               uId:$scope.editingObj.uniqId
             };
          //   var promise = serverFactory.serverToServer(doc2send, "http://192.168.0.13:3000/editEvents");
           var promise = serverFactory.serverToServer(doc2send, "http://calenderappevents.azurewebsites.net/editEvents");
             promise.then(function(value) {
                console.log(value);
                $state.go('event1');
             }) 
         } else {
         //    var promise = serverFactory.serverToServer(eventsArr[0] , "http://192.168.0.13:3000/addEvents");
           var promise = serverFactory.serverToServer(eventsArr[0], "http://calenderappevents.azurewebsites.net/addEvents");
             promise.then(function(value) {
               console.log(value);
               $state.go('event1');
             }) 
         }
    }

}).controller('emptyEventsPageCtrl', function($scope, $ionicHistory, $state, $rootScope) {
    $scope.goBack = function() {
        $ionicHistory.goBack();
    }
    $scope.addEvents = function() {
        $state.go('addEvents')
    }
}).controller('showFullEventCtrl', function($scope, $rootScope, $http, $ionicHistory, $state, serverFactory, myFactory, localStorageFactory) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.fullEvent = $rootScope.fullEventObj
        console.log('showFullEventCtrl');
        console.log($scope.fullEvent)
        floatButtonAdjust();
    });


    function floatButtonAdjust() {
       var itemHeight = document.getElementById('eNameItem').style.height;
       console.log(itemHeight);
       var btnHeight =  document.getElementById('floatBtn').style.top;
       console.log(btnHeight);
    }

    $scope.editEvent = function() {
        $rootScope.editingObj = $scope.fullEvent;
        console.log($scope.fullEvent);
        $state.go('addEvents');
    }
    $scope.map = function(long, lat, address) {
        myFactory.set(long, lat, address);
        $state.go('map2');
    }
    $scope.deleteEvent = function() {
        $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        $scope.jsonObj = $scope.jsonCalObj[$scope.fullEvent.eventDate];
        console.log($scope.jsonCalObj);

        var remainingEvents = $scope.jsonObj.events.length;
        if (remainingEvents == 1) {
            console.log('last event..');
            var doc2send = {
              eDate: $scope.fullEvent.eventDate,
              eId: $scope.fullEvent.uniqId
            };
        //   var promise = serverFactory.serverToServer(doc2send, "http://192.168.0.13:3000/deleteEvents");
          var promise = serverFactory.serverToServer(doc2send, "http://calenderappevents.azurewebsites.net/deleteEvents");
            promise.then(function(value) {
              console.log(value);
              $state.go('calenderView');
            })
        } else {
            console.log('not last event..');
            var doc2send = {
              eDate: $scope.fullEvent.eventDate,
              eId: $scope.fullEvent.uniqId
            };
        //    var promise = serverFactory.serverToServer(doc2send, "http://192.168.0.13:3000/deleteEvents");
          var promise = serverFactory.serverToServer(doc2send, "http://calenderappevents.azurewebsites.net/deleteEvents");
            promise.then(function(value) {
              console.log(value);
              $ionicHistory.goBack();
            })   
        }
    }
 
    $scope.goBack = function() {
        $rootScope.editingObj = {};
        $ionicHistory.goBack();
    }
})
