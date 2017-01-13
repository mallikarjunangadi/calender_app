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

.factory("compareEventsService", function($rootScope)  {
  $rootScope.diffEvents = [];
 
  function compareEvents(data) {
  
    var localReadStatus = window.localStorage.getItem('jsonReadStatus');      
        
        if(localReadStatus === ""){
          console.log('empty');
          localReadStatus = {};
        } else {
          localReadStatus = JSON.parse(localReadStatus);       
        }

    var localJson = window.localStorage.getItem('myCalenderEvents');
    if(localJson != ""){
      localJson = JSON.parse(localJson);
    } else {
      localJson = {};
    }

     for(var k=0; k<data.length; k++) {
       var obj = data[k];

       if(localJson[obj.Date] == undefined){
         localReadStatus[obj.Date] = "unread";
         console.log('some new event added');
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
              localReadStatus[obj.Date] = "unread";
              console.log('some event edited');
              continue;
           }
       }
     }
    
      for(var key in localReadStatus) {
        if(localReadStatus[key] === "unread" ){
           var strDate = (new Date(key)).toString()
           if($rootScope.diffEvents.indexOf(strDate) == -1){
              $rootScope.diffEvents.push(strDate);
           }
        }  
      }

       window.localStorage.setItem('jsonReadStatus', JSON.stringify(localReadStatus));
   }
   
    return {
      compareEvents:compareEvents
    }
})  



.factory("serverFactory", function($http, $q, $rootScope)  {
  
   function serverToServer(doc2send, Url) {
     doc2send.OrgId = $rootScope.AppUserInformation.OrgId;
     
    var deferred = $q.defer();  
    var req =              
    {  
      method: 'POST', 
      url: Url,
      data: jQuery.param(doc2send), 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }   
          
     $http(req).
     success(function(data, status, headers, config) {
         deferred.resolve(data);
         console.log(status); 
    }).
     error(function(data, status, headers, config) { 
      console.log('error '+status);
      deferred.reject(data);
    });

    return deferred.promise;
   }

   return {
      serverToServer : serverToServer
  }
 
})  