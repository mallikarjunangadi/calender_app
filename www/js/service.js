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

.factory("myFactoryObj", function()  {
  var userDetails = {};

  function set(obj) { 
    userDetails = obj; 
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






.factory("serverFactory", function($http, $q)  {
   var data;

   function serverToServer(doc2send, Url) {
    var deferred = $q.defer();  
    console.log(doc2send);
  
    var req =              
    {  
      method: 'POST', 
   //   url: "http://192.168.0.13:3000/addEvents",
   // url: "http://calenderappevents.azurewebsites.net/addEvents",
      url: Url,
      data: jQuery.param(doc2send), 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }   
          
     $http(req).
     success(function(data, status, headers, config) {
     console.log(data);
   //  localStorageFactory.submit('myCalenderEvents', data[0]);
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