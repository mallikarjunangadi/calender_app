angular.module('starter.controller', [])

.controller('event1Ctrl', function($scope, $http, $ionicHistory, myFactory, $state, $rootScope, localStorageFactory, myFactoryObj){
  $scope.$on('$ionicView.beforeEnter', function(event, data) { 

   console.log($rootScope.myEventDate);
  
   var jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
   var jsonObj = jsonCalObj[$rootScope.myEventDate]; 
   
   if(jsonObj == undefined){ $state.go('calenderView')}
   console.log(jsonObj);

   $scope.eventData = jsonObj.events; 
   $scope.eventDate = jsonObj.eventDate;
 
 })   

   $scope.addEvents = function(){
     $state.go('addEvents');
   }

   $scope.showFullEvent = function(index, eventObj) {
     $rootScope.hideEditnDeleteBtn = false;
     console.log('index of item: '+index);
     eventObj.eventDate = $scope.eventDate
     eventObj.index = index;
     //myFactoryObj.set(eventObj);
     $rootScope.fullEventObj = eventObj;
     $state.go('showFullEvent');
   }

   $scope.goBack = function(){
      $state.go('calenderView');
    // $ionicHistory.goBack();
   }  
})

   .controller('MapCtrl', function($scope, $state, $ionicLoading, $compile, myFactory, $ionicHistory) {

     $scope.$on('$ionicView.beforeEnter', function(event, data) { 
  
        var longLat = myFactory.get();
        var long = longLat.lang;
        var lat = longLat.lat;
        var address = longLat.address;
      console.log('entered befre view');

      function initialize() {
        
        var myLatlng = new google.maps.LatLng(lat, long);
        console.log(longLat);
        var mapOptions = {
          center: myLatlng,  
          zoom: 16, 
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

     
        $scope.map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

            console.log("map Ctrl");
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>"+address+"</a></div>";
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
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
     }); 

     $scope.goBack = function(){
       $ionicHistory.goBack();
   }
    })

 .controller('calCtrl', function($scope, $http, $state, $q, myFactoryObj, localStorageFactory, localStorageService, $rootScope){

   $scope.$on('$ionicView.beforeEnter', function(event, data) { 
     $scope.onezoneDatepicker.highlights = [];  
      
      for(var key in jsonCalObj) {
        var d = new Date(key);       // pushing calender key Dates to hightlights to highlight color 
          $scope.onezoneDatepicker.highlights.push({date:d});
      }

      displayMonthEvents($rootScope.todayDate);
   })

   $scope.onezoneDatepicker = {
    date: new Date(), // MANDATORY                     
    mondayFirst: false,                    
    disablePastDays: false,
    disableSwipe: false,
    disableWeekend: false,
    showDatepicker: false,
    showTodayButton: true,
    calendarMode: true,
    hideCancelButton: false,
    hideSetButton: false,
    highlights: [],
    callback: function(value){ 
        console.log(value);
        displayMonthEvents(value);
        dateSelected(value);
        $rootScope.todayDate = value;
    }
  }; 

      var jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
      if(jsonCalObj == null) {  
        localStorageFactory.submit('myCalenderEvents', {});
        jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
        console.log('created key myCalenderEvents')
      }
    
    $rootScope.todayDate = new Date();

    var promise = loadFromServer();
    promise.then(function(value){
      console.log(value);
      displayMonthEvents($rootScope.todayDate);
    })

  $rootScope.latLng = {};

 // if(angular.equals({}, $rootScope.latLng)){ console.log('LatLng: empty');}
 
/*
   var bool = localStorageFactory.clearAll;
   if(bool) {
     console.log('Loacl Storage cleared.......')
   }
   
   var bool = localStorageFactory.removeItem('myCalenderEvents');
   if(!bool) {
     console.log('removed....');
   } else {
     console.log('Not removed.......')
   }
*/

   $scope.showFullEvent = function(index, eventObj) {
     $rootScope.hideEditnDeleteBtn = true;
     console.log('index of item: '+index);
     eventObj.index = index;
     $rootScope.fullEventObj = eventObj;
     $state.go('showFullEvent');
   }
 
    function dateSelected(value) {
       var str= value.toString().substr(4,11);
       $rootScope.myEventDate = str; 
       console.log(str);
          
       var jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
       var keyArr = [];

       for(var key in jsonCalObj) {
         keyArr.push(key);
       }

       if(keyArr.indexOf(str) > -1) {
        $state.go('event1');  
       } else {
         $state.go('emptyEventPage'); 
       }      
   }

   function loadFromServer(){      
    var deferred = $q.defer();  
    var req =      
    { 
      method: 'POST', 
        url: "http://192.168.0.13:3000/getEvents",
     // url: "http://calenderappevents.azurewebsites.net/getEvents",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }   
    $http(req).
     success(function(data, status, headers, config) {
      console.log(data); 
      for(var key in data) {
        var oldObj = data[key];
        var replacedKey = key.replace(/_/g, ' ');
        data[replacedKey] = oldObj;
        delete data[key];
      }
      localStorageFactory.submit('myCalenderEvents', data);
      deferred.resolve('success');
      console.log(status);
    }). 
    error(function(data, status, headers, config) { 
     console.log(data); 
     console.log('error '+status); 
     deferred.reject('fail');
    });
    return deferred.promise; 
   };

  function displayMonthEvents(today) {
      var jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
      var keyArr2 = [];

      for(var key in jsonCalObj) {
         keyArr2.push(key);
       }
      
      console.log(jsonCalObj);
      console.log(keyArr2);
      console.log(today);

      var thisMonth = today.toString().substr(4,3);
      var thisYear = today.toString().substr(11,4);
      console.log("---"+thisMonth+"---"+thisYear+"---") 
   
      $scope.monthEventsArr = [];
      for(var i=0; i<keyArr2.length; i++) {
       if(keyArr2[i].startsWith(thisMonth) && keyArr2[i].endsWith(thisYear)) { //to check this month and year
         console.log(keyArr2[i]);
         var tempArr = jsonCalObj[keyArr2[i]].events;
         var tempDate = jsonCalObj[keyArr2[i]].eventDate;//

         for(var j=0; j<tempArr.length; j++) {
           tempArr[j].eventDate = tempDate;//
           $scope.monthEventsArr.push(tempArr[j]);
         }
       }
     }
     console.log($scope.monthEventsArr);
   }
  


}) 

.controller('addEventsCtrl', function($scope, $http, $ionicHistory, $state, $rootScope, ionicTimePicker, myFactory, localStorageService, localStorageFactory, myFactoryObj){
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
   
      $scope.editingObj = myFactoryObj.get(); //retrieve obj to edit
      $scope.eventObj = {};
      $scope.endTimeVisibility = false;  
     
      $scope.isEditingObjUndefined =  angular.equals({}, $scope.editingObj);
      console.log("editingObj object is empty? "+$scope.isEditingObjUndefined)

      if(!$scope.isEditingObjUndefined) {
        $scope.eventObj = $scope.editingObj;
        $scope.endTimeVisibility = true;  

       } else {
          $scope.eventObj = {eventDate:""};
          $scope.eventObj.eventDate = $rootScope.myEventDate;
       }

      console.log($scope.editingObj);
 });


    $scope.goBack = function(){ 
       //$state.go('calenderView');
       $ionicHistory.goBack();
    }  

 $scope.startTimePick = function() {
  var Obj = {
    callback: function (val) {    
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        $scope.startValue = val;

       if( $scope.endValue < val) {
         val = $scope.endValue;
       }

        console.log("start value: "+val);
        var selectedTime = new Date(val * 1000);
      
        var startHours = selectedTime.getUTCHours(); 
        var startMinutes = selectedTime.getUTCMinutes();

        if(startMinutes<10) {
          startMinutes = "0"+startMinutes;
        }
        
        if(startHours<10) {
          startHours = "0"+startHours;
        }

        startTime = "";
        if(startHours > 12) {
          startTime = startHours-12 +":"+ startMinutes+" PM"
        } else {
          startTime = startHours +":"+ startMinutes+" AM"
        }

        document.getElementById('startText').value = startTime; 
        $scope.eventObj.eventStartTime = startTime;  
        $scope.endTimeVisibility = true;  
      }
    },
      format: 12,
      step: 1,
      setLabel: 'Set',
      closeLabel: 'Close'  
  };

  ionicTimePicker.openTimePicker(Obj);

 }

$scope.endTimePick = function() {
  $scope.time; 
  var Obj = {
    callback: function (val) {      
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        console.log("end value: "+val);
        $scope.endValue = val;

       if( $scope.startValue > val) {
         val = $scope.startValue;
       }

        var selectedTime = new Date(val * 1000);

        var endHours = selectedTime.getUTCHours(); 
        var endMinutes = selectedTime.getUTCMinutes();

        if(endMinutes<10) {
          endMinutes = "0"+endMinutes;
        }
        if(endHours<10) {
          endHours = "0"+endHours;
        }

        endTime = "";
        if(endHours > 12) {
          endTime = endHours-12 +":"+ endMinutes+" PM"
        } else {
          endTime = endHours +":"+ endMinutes+" AM"
        }

        document.getElementById('endText').value = endTime;
         $scope.eventObj.eventEndTime = endTime;     
      }
    },
      format: 12,
      step: 1,
      setLabel: 'Set',
      closeLabel: 'Close'  
   };

  ionicTimePicker.openTimePicker(Obj);
 }

//  console.log($scope.eventObj.eventDate);
//var obj = myFactoryObj.get();
//$scope.eventObj.eventDate = obj.eventDateValue;

$scope.gPlace;

  $scope.disableTap = function(){
    console.log('entered disableTap...')
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function(){
        document.getElementById('searchBar').blur();
    });
  };

 $scope.eventsArr = [];
 $scope.latt; 
 $scope.longi;
 $scope.address;

$scope.save = function(){

  $scope.visibility = true;
  $scope.addDisable = false;
  $scope.saveDisable = true;

  if(!$scope.isEditingObjUndefined){
    //console.log('undefined......');  

     $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
     $scope.jsonObj = $scope.jsonCalObj[$scope.eventObj.eventDate];     

     $scope.jsonObj.events.splice($scope.editingObj.index, 1);

     $scope.jsonCalObj[$scope.eventObj.eventDate] = $scope.jsonObj;
     localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj);

    console.log('This event deleted...')
  };

    console.log($rootScope.latLng)
    console.log($rootScope.latLng.lat+" long: "+$rootScope.latLng.lng)
   
  var isEmpty = angular.equals({}, $rootScope.latLng); 
   
  if(!isEmpty ) {
    console.log('entered if this function...');
    $scope.latt = $rootScope.latLng.lat;
    $scope.longi = $rootScope.latLng.lng;
    $scope.address = $rootScope.latLng.address;

    $rootScope.latLng = {};
  } else {
    console.log('entered else...')
    $scope.latt = $scope.eventObj.lat;
    $scope.longi = $scope.eventObj.long;
    $scope.address = $scope.eventObj.address;
  }

  console.log($scope.eventObj);
  $scope.eventsArr.push({eventDate:$scope.eventObj.eventDate, eventName:$scope.eventObj.eventName, eventStartTime:$scope.eventObj.eventStartTime, eventEndTime:$scope.eventObj.eventEndTime, eventTask:$scope.eventObj.eventTask, lat:$scope.latt, long:$scope.longi, address:$scope.address})
  
  console.log($scope.eventsArr);
}

$scope.add = function() {
  $scope.addDisable = true;
  $scope.saveDisable = false;

  $scope.eventObj.eventName = "";
  document.getElementById('startText').value = null;
  document.getElementById('endText').value = null;
  document.getElementById('location').value = null;
  $scope.eventObj.eventTask = "";

}

$scope.finish = function(){
  $scope.saveDisable = false; 
  $scope.visibility = false;

  $scope.eventObj.eventName = "";
  document.getElementById('startText').value = null;
  document.getElementById('endText').value = null;
  document.getElementById('location').value = null;
  $scope.eventObj.eventTask = "";
 
  $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
  $scope.jsonObj = $scope.jsonCalObj[$scope.eventObj.eventDate];

  console.log($scope.jsonObj);

  if($scope.jsonObj != undefined) {
     for(var i=0; i < $scope.eventsArr.length; i++) {
      $scope.jsonObj.events.push($scope.eventsArr[i]);
      console.log($scope.eventsArr[i]);  
      serverToServer($scope.eventsArr[i]);  
     }

    $scope.jsonCalObj[$scope.eventObj.eventDate] = $scope.jsonObj;
    console.log($scope.jsonObj);
    localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj);     
        
  } else {
     var myEventReadyObj = {};
     myEventReadyObj.eventDate = $scope.eventObj.eventDate;
     myEventReadyObj.events = $scope.eventsArr;

    $scope.jsonCalObj[$scope.eventObj.eventDate] = myEventReadyObj;
     localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj)
     console.log(myEventReadyObj);
     serverToServer(myEventReadyObj);  

   }
   
   $state.go('event1');
}


$scope.$on('$ionicView.beforeLeave', function(event, data) { 
  $scope.eventsArr = [];
 // myFactoryObj.set({});
  console.log('before leave: array eventsArr cleared')
});

 if(localStorageService.isSupported) {
   console.log('local storage supported');
  }

 function serverToServer(obj) {
  console.log(obj);

  /*var doc2send =
  {  
   name : 'My calender Event',         
   eventObj : JSON.stringify(obj)        
  }*/  

var doc2send = {myObj:JSON.stringify(obj)};

console.log(doc2send);
   
  var req =              
  {  
    method: 'POST', 
    url: "http://192.168.0.13:3000/addEvents",
   // url: "http://calenderappevents.azurewebsites.net/addEvents",
    data: jQuery.param(doc2send), 
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }   
          
    $http(req).
    success(function(data, status, headers, config) {
     console.log(data);
   //  localStorageFactory.submit('myCalenderEvents', data[0]);
     console.log(status); 
  }).
    error(function(data, status, headers, config) { 
    console.log(data); 
    console.log('error '+status);
  });
 }


})

.controller('emptyEventsPageCtrl', function($scope, $ionicHistory, $state, $rootScope){
   $scope.goBack = function(){
       $ionicHistory.goBack();
   }

   $scope.addEvents = function() {
     $state.go('addEvents')
   }
})
  
.controller('showFullEventCtrl', function($scope, $rootScope, $http, $ionicHistory, $state, myFactoryObj, myFactory, localStorageFactory){
  $scope.$on('$ionicView.beforeEnter', function(){
  
    $scope.fullEvent = $rootScope.fullEventObj
    console.log('showFullEventCtrl');
   // $rootScope.fullEventObj = {};
    console.log($scope.fullEvent)
 });

 $scope.editEvent = function() {
   myFactoryObj.set($scope.fullEvent);
   console.log($scope.fullEvent);
   $state.go('addEvents');
 } 

  $scope.map = function(long, lat, address){
    myFactory.set(long, lat, address);
    $state.go('map2');
  }

  $scope.deleteEvent = function(){
    console.log($scope.fullEvent.index);

     $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
     $scope.jsonObj = $scope.jsonCalObj[$scope.fullEvent.eventDate];     

     $scope.jsonObj.events.splice($scope.fullEvent.index, 1);
        
     var remainingEvents = $scope.jsonObj.events.length; 
     if(remainingEvents == 0) {
       delete $scope.jsonCalObj[$scope.fullEvent.eventDate];
       localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj);
       serverToServer($scope.fullEvent.eventDate, $scope.fullEvent.index, 0); 
       $state.go('calenderView'); 
     } else{
       $scope.jsonCalObj[$scope.fullEvent.eventDate] = $scope.jsonObj;
       localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj); 
       serverToServer($scope.fullEvent.eventDate, $scope.fullEvent.index, remainingEvents); 
       $ionicHistory.goBack();
     }
  }

  function serverToServer(date, index, len) {
 // console.log(JSON.stringify(obj));

  var doc2send =
  {  
   eDate : date,         
   eIndex : index,
   eLength: len
  }  
   
  var req =            
  {  
    method: 'POST', 
    url: "http://192.168.0.13:3000/deleteEvents",
   //url: "http://calenderappevents.azurewebsites.net/addEvents",
    data: jQuery.param(doc2send), 
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }   
          
    $http(req).
    success(function(data, status, headers, config) {
     console.log(data);
     console.log(status); 
  }).
    error(function(data, status, headers, config) { 
    console.log(data); 
    console.log('error '+status);
  });
 }

 $scope.goBack = function(){
       myFactoryObj.set({});
       $ionicHistory.goBack();
   }
})  