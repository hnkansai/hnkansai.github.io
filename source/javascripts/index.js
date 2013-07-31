
$(document).ready(function(){
  $.ajax({
    type: "GET",
    url: "http://api.doorkeeper.jp/groups/hnkansai/events",
    data: {},
    dataType: "jsonp",
    crossDomain: true,
    success: function(data){
      console.log(data);
    }
    });
});
