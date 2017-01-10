angular.module('starter.services', [])

.factory("myFactory", function()  {
  var userDetails = {};

  function set(lang, lat, address) {
    userDetails.lang = lang;
    userDetails.lat = lat;
    userDetails.address = address; 

     console.log('entered set factory')
  }

  function get() { 
     return userDetails;
  }

  return {
      set : set,
      get : get 
  }
})  


.factory("localStorageFactory", function(localStorageService)  {
 
  function submit(key, val) {
   return localStorageService.set(key, val);
  }

  function getItem(key) {
   return localStorageService.get(key);
  }

  function removeItem(key) {
   return localStorageService.remove(key);
  }

  function clearAll() {
   return localStorageService.clearAll();
  }

  return {
      submit : submit,
      getItem : getItem,
      removeItem: removeItem,
      clearAll: clearAll
       
  }
})  

.factory("compareEventsService", function(localStorageFactory, $rootScope)  {
  $rootScope.diffEvents = [];

  function compareEvents(data) {
 
    var localJson = localStorageFactory.getItem('oldJson');
    console.log(localJson);
     for(var k=0; k<data.length; k++) {
       var obj = data[k];
       var strDate = (new Date(obj.Date)).toString()
       console.log(obj);
       if(localJson[obj.Date] == undefined){
         console.log('some new event pushed');
          if($rootScope.diffEvents.indexOf(strDate) == -1){
             $rootScope.diffEvents.push(strDate);
          }
       } else {
          var localObjArr = localJson[obj.Date].events;
          var serverObjID = obj.ID;   

           var i = 0;
           for(i=0; i<localObjArr.length; i++){
             var localeventId = localObjArr[i].eventId;

             if(localeventId == serverObjID){
               break;
             }
           }  
            
           if(i == localObjArr.length){
              console.log('some event edited');
              if($rootScope.diffEvents.indexOf(strDate) == -1){
                $rootScope.diffEvents.push(strDate);
              }
              
              continue;
           }
       }
     }
     console.log($rootScope.diffEvents);
     if($rootScope.diffEvents.length == 0) { 
           var newJson = localStorageFactory.getItem('myCalenderEvents');
           localStorageFactory.submit('oldJson', newJson);
     }
   }
   
    return {
      compareEvents:compareEvents
    }
})  

.factory("serverFactory", function($http, $q, compareEventsService, localStorageFactory, $state)  {
  
   function serverToServer(doc2send, Url) {
   var jsonLocal = localStorageFactory.getItem('myCalenderEvents');
     
    var deferred = $q.defer();  
    console.log(doc2send);
  
    var req =              
    {  
      method: 'POST', 
      url: Url,
      data: jQuery.param(doc2send), 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }   
          
     $http(req).
     success(function(data, status, headers, config) {
        
        if(angular.isString(data)){
          alert(data);  
          $state.go('calenderView');
        }
/*        
        for (var key in data) {
             var oldObj = data[key];
             var replacedKey = key.replace(/_/g, ' ');
             data[replacedKey] = oldObj;
             delete data[key];
         }
*/
         localStorageFactory.submit('myCalenderEvents', data);
         console.log(data);
       

         deferred.resolve(data);
         console.log(status); 
    }).
     error(function(data, status, headers, config) { 
      console.log(data); 
      console.log('error '+status);
      deferred.reject(data);
    });

    return deferred.promise;
   }

   return {
      serverToServer : serverToServer
  }
 
})  