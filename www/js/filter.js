angular.module('starter.filter', [])

.filter('epochToDate', function(){
   return function(epoch){       
    var time = "";
     var selectedTime = new Date(epoch * 1000);
     var Hours = selectedTime.getUTCHours();
     var Minutes = selectedTime.getUTCMinutes();

        if(Minutes < 10) {
           Minutes = "0"+Minutes;
        }

        if (Hours > 12) {
             time = Hours-12 + ":" + Minutes + " PM"
        } else if (Hours == 12) {
             time = 12 + ":" + Minutes + " PM"
        } else {
             time = Hours + ":" + Minutes + " AM"
        }
           
      return time;     
   }

})