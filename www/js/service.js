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
