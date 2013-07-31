
$(document).ready(function(){
  
  $.ajax({
    type: "GET",
    url: "http://api.doorkeeper.jp/groups/hnkansai/events",
    data: {},
    dataType: "jsonp",
    crossDomain: true,
    success: function(data){
      var upcomingEvents = [];
      var nextEvent;
      var today = new Date();
      for (var i in data) {
        if(new Date(data[i].event.starts_at) >= today)
        upcomingEvents.push(data[i].event)
      }
      upcomingEvents.sort(function(a,b){
        return Math.abs(1 - new Date(a.starts_at) / today) - Math.abs(1 - new Date(b.starts_at) / today)
      });
     nextEvent = upcomingEvents[1];

    var formattedDate = formatDate(new Date(nextEvent.starts_at));
     $('#event-details').html('<a href="http://hnkansai.doorkeeper.jp/events/'+nextEvent.id +'">'+nextEvent.title + ", " + formattedDate+'</a>');
    
    }
  });


function formatDate(date){

  var months = new Array("January", "February", "March", 
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December");


  var dayOfMonth = date.getDate();
  var month = date.getMonth();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var suffix = "";
  var am_pm;

  //add the proper suffix (st, nd, rd) to the numerical day of the month
  switch(dayOfMonth) {
    case dayOfMonth == 1:
    case dayOfMonth == 21: 
    case dayOfMonth == 31:
     suffix = "st";
     break;
    case dayOfMonth == 2:
    case dayOfMonth == 22:
     suffix = "nd";
     break;
    case dayOfMonth == 3: 
    case dayOfMonth == 23:
     suffix = "rd";
     break;
    default:
    suffix = "th";
  }

  //format the time into 12 hour format with proper AM PM
  if (hour < 12)
     {
     am_pm = "AM";
     }
  else
     {
     am_pm = "PM";
     }

  if (hour == 0){
      hour = 12;
     }
  if (hour > 12){
      hour = hour - 12;
     }

return months[month] +" "+ dayOfMonth + suffix + ", " + hour + ":" + minutes + " " + am_pm;

}


  
});
