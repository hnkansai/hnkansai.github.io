
$(document).ready(function(){
  var upcomingEvents = [];
  var nextEvent;
  $.ajax({
    type: "GET",
    url: "http://api.doorkeeper.jp/groups/hnkansai/events",
    data: {},
    dataType: "jsonp",
    crossDomain: true,
    success: function(data){
      var today = new Date();
      for (var i in data) {
        if(new Date(data[i].event.starts_at) >= today)
        upcomingEvents.push(data[i])
      }

     upcomingEvents.sort(function(a,b){
      return Math.abs(1 - new Date(a.event.starts_at) / today) - Math.abs(1 - new Date(b.event.starts_at) / today)
      });
     nextEvent = upcomingEvents[1];
    }
  });



  
});
