angular.module('starter.controller', [])

.controller('event1Ctrl', function($scope, $http, $ionicHistory, myFactory, $state, $rootScope, localStorageFactory, myFactoryObj){
  $scope.$on('$ionicView.beforeEnter', function(event, data) { 

   console.log($rootScope.myEventDate);
  
   $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
   $scope.jsonObj = $scope.jsonCalObj[$rootScope.myEventDate]; 
   
   console.log($scope.jsonObj);

   $scope.eventData = $scope.jsonObj.events; 
   $scope.eventDate = $scope.jsonObj.eventDate;
 
 })   

/*    $http.get('json/calender.json').then(function(res){

      console.log(res.data);
      var jsonData = res.data; 

     var key = Object.keys(jsonData)[0];
          console.log(key);
          
          $scope.eventData = jsonData[key].schedule;
          console.log($scope.eventData);

          $scope.eventDate = jsonData[key].eventDate;
          console.log($scope.eventName);

          console.log(jsonData[key].eventDate);
          
       console.log($scope.eventData[0].eventEndTime);
    })
// 
*/

   $scope.map = function(long, lat, address){
       myFactory.set(long, lat, address);
        $state.go('map2');
   }

   $scope.addEvents = function(){
     $state.go('addEvents');
   }

   $scope.showFullEvent = function(index, eventObj) {
     console.log('index of item: '+index);
     eventObj.eventDate = $scope.eventDate
     eventObj.index = index;
     myFactoryObj.set(eventObj);
     $state.go('showFullEvent');
   }

   $scope.goBack = function(){
    //  $state.go('calenderView');
    $ionicHistory.goBack();
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

 .controller('calCtrl', function($scope, $state, myFactoryObj, localStorageFactory, localStorageService, $rootScope){

   $scope.$on('$ionicView.beforeEnter', function(event, data) { 
   $scope.onezoneDatepicker.highlights = [];
    var jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
   //   $scope.jsonCalObj = jsonCalObj;
      
      for(var key in jsonCalObj) {
        var d = new Date(key);
      //  $scope.highlights.push({date:d})
          $scope.onezoneDatepicker.highlights.push({date:d})
      //  $scope.keyArr.push(key);
      }

      displayMonthEvents($rootScope.tdayDate);
     
   })
 
     var tday = new Date();
     $rootScope.tdayDate = tday;
     displayMonthEvents(tday);

   function displayMonthEvents(today) {
      $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
      $scope.keyArr2 = [];

      for(var key in $scope.jsonCalObj) {
        $scope.keyArr2.push(key);
       }
       console.log($scope.keyArr);
     
 
     console.log(today);
     var thisMonth = today.toString().substr(4,3);
     var thisYear = today.toString().substr(11,4);
     console.log("---"+thisMonth+"---"+thisYear+"---") 
   
     $scope.monthEventsArr = [];
     for(var i=0; i<$scope.keyArr2.length; i++) {
       if($scope.keyArr2[i].startsWith(thisMonth) && $scope.keyArr2[i].endsWith(thisYear)) {
         console.log($scope.keyArr2[i]);
         var tempArr = $scope.jsonCalObj[$scope.keyArr2[i]].events;
         var monthDate = $scope.jsonCalObj[$scope.keyArr2[i]].eventDate;
         for(var j=0; j<tempArr.length; j++) {
           tempArr[j].eventDate = monthDate;
           $scope.monthEventsArr.push(tempArr[j]);
         }
       }
     }
     console.log($scope.monthEventsArr);
   }

    $scope.onezoneDatepicker = {
    date: new Date(), // MANDATORY                     
    mondayFirst: false,                
 //   months: months,                    
 //   daysOfTheWeek: daysOfTheWeek,     
 //   startDate: startDate,             
 //   endDate: endDate,                    
    disablePastDays: false,
    disableSwipe: false,
    disableWeekend: false,
 //  disableDates: disableDates,
 //   disableDaysOfWeek: disableDaysOfWeek,
    showDatepicker: false,
    showTodayButton: true,
    calendarMode: true,
    hideCancelButton: false,
    hideSetButton: false,
 //   highlights: highlights,
    callback: function(value){ 
        console.log(value);
        displayMonthEvents(value);
        dateSelected(value);
        $rootScope.tdayDate = value;
    }
  }; 

  $rootScope.latLng = {};

  if(Object.keys($rootScope.latLng).length === 0) { console.log('LatLng: empty');}

  $scope.onezoneDatepicker.highlights = [];

 // $scope.highlights = $scope.onezoneDatepicker.highlights;

   function dateSelected(value) {
       var str= value.toString().substr(4,11);
       $rootScope.myEventDate = str; 
       console.log(str);
          
       $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents'); 
       $scope.keyArr = [];

       for(var key in $scope.jsonCalObj) {
        $scope.keyArr.push(key);
       }

       if($scope.keyArr.indexOf(str) > -1) {
        $state.go('event1');  
       } else {
         $state.go('emptyEventPage'); 
       }      
   }
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
     console.log('index of item: '+index);
     eventObj.index = index;
     myFactoryObj.set(eventObj);
     $state.go('showFullEvent');
   }
 
   
}) 

.controller('addEventsCtrl', function($scope, $ionicHistory, $state, $rootScope, ionicTimePicker, myFactory, localStorageService, localStorageFactory, myFactoryObj){
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
   
      $scope.fullEvent = myFactoryObj.get(); //retrieve obj to edit
      $scope.eventObj = {};
      $scope.endTimeVisibility = false;  
     
      $scope.isFullEventObjUndefined = Object.keys($scope.fullEvent).length === 0;
      console.log("fullEvent object is empty? "+Object.keys($scope.fullEvent).length === 0)

      if(!$scope.isFullEventObjUndefined) {
        $scope.eventObj = $scope.fullEvent;
        $scope.endTimeVisibility = true;  

       } else {
          $scope.eventObj = {eventDate:""};
          $scope.eventObj.eventDate = $rootScope.myEventDate;
       }

      console.log($scope.fullEvent);

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
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
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

  if(!$scope.isFullEventObjUndefined){
    console.log('undefined......');  

     $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
     $scope.jsonObj = $scope.jsonCalObj[$scope.eventObj.eventDate];     

     $scope.jsonObj.events.splice($scope.fullEvent.index, 1);

     $scope.jsonCalObj[$scope.eventObj.eventDate] = $scope.jsonObj;
     localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj);

    console.log('This event deleted...')
  };

    console.log($rootScope.latLng)
    console.log($rootScope.latLng.lat+" long: "+$rootScope.latLng.lng)
   
  var isEmpty = Object.keys($rootScope.latLng).length === 0; 
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
  $scope.eventsArr.push({eventName:$scope.eventObj.eventName, eventStartTime:$scope.eventObj.eventStartTime, eventEndTime:$scope.eventObj.eventEndTime, eventTask:$scope.eventObj.eventTask, lat:$scope.latt, long:$scope.longi, address:$scope.address})
  
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
  console.log($scope.jsonCalObj);

  if($scope.jsonCalObj == null) {  
    localStorageFactory.submit('myCalenderEvents', {});
    $scope.jsonCalObj = localStorageFactory.getItem('myCalenderEvents');
    console.log('created key myCalenderEvents')
   }

  $scope.jsonObj = $scope.jsonCalObj[$scope.eventObj.eventDate];

  console.log($scope.jsonObj);

  if($scope.jsonObj != undefined) {
     for(var i=0; i < $scope.eventsArr.length; i++) {
      $scope.jsonObj.events.push($scope.eventsArr[i]);  
     }

    $scope.jsonCalObj[$scope.eventObj.eventDate] = $scope.jsonObj;
    localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj); 
        
  } else {
     var myEventReadyObj = {};
     myEventReadyObj.eventDate = $scope.eventObj.eventDate;
     myEventReadyObj.events = $scope.eventsArr;

    $scope.jsonCalObj[$scope.eventObj.eventDate] = myEventReadyObj;
     localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj)  

   }
  
  $state.go('event1');
}


$scope.$on('$ionicView.beforeLeave', function(event, data) { 
  $scope.eventsArr = [];
  myFactoryObj.set({});
  console.log('before leave: array eventsArr cleared')
});

 if(localStorageService.isSupported) {
   console.log('local storage supported');
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
  
.controller('showFullEventCtrl', function($scope, $ionicHistory, $state, myFactoryObj, myFactory, localStorageFactory){
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.fullEvent = myFactoryObj.get();
   console.log('showFullEventCtrl');
 })

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
     if($scope.jsonObj.events.length == 0) {
       delete $scope.jsonCalObj[$scope.fullEvent.eventDate];
       localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj); 
       $state.go('calenderView'); 
     } else{
       $scope.jsonCalObj[$scope.fullEvent.eventDate] = $scope.jsonObj;
       localStorageFactory.submit('myCalenderEvents', $scope.jsonCalObj);  
       $ionicHistory.goBack();
     }
     
     

    
  }

 $scope.goBack = function(){
       myFactoryObj.set({});
       $ionicHistory.goBack();
   }
})  