
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

 $.ajax({
    type: "GET",
    url:  "https://gdata.youtube.com/feeds/api/users/UCbxKJC9zZJ9C7YDYuZ3m59Q/uploads?alt=json-in-script&callback=?",
    data: {},
    dataType: "jsonp",
    crossDomain: true,
    success: function(data){
      console.log(data);
  }

});

(function() {
    function createPlayer(jqe, video, options) {
        var ifr = $('iframe', jqe);
        if (ifr.length === 0) {
            ifr = $('<iframe scrolling="no">');
            ifr.addClass('player');
        }
        var src = 'http://www.youtube.com/embed/' + video.id;
        if (options.playopts) {
            src += '?';
            for (var k in options.playopts) {
                src += k + '=' + options.playopts[k] + '&';
            }
            src += '_a=b';
        }
        ifr.attr('src', src);
        jqe.append(ifr);
    }

    function createCarousel(jqe, videos, options) {
        var car = $('div.carousel', jqe);
        if (car.length === 0) {
            car = $('<div>');
            car.addClass('carousel');
            jqe.append(car);

        }
        $.each(videos, function(i, video) {

            options.thumbnail(car, video, options);
        });
    }

    function createThumbnail(jqe, video, options) {

        var imgurl = video.thumbnails[0].url;
        var img = $('img[src="' + imgurl + '"]');
        var desc;
        var container;
        if (img.length !== 0) return;
        img = $('<img align="left">');
        img.addClass('thumbnail');
        jqe.append(img);
        img.attr('src', imgurl);
        img.attr('title', video.title);
        img.click(function() {
            options.player(options.maindiv, video, $.extend(true, {}, options, {
                playopts: {
                    autoplay: 1
                }
            }));
        });
        desk = $('<p class="yt-descript">' + video.title + '</p>');
        jqe.append(desk);
        desk.click(function() {
            options.player(options.maindiv, video, $.extend(true, {}, options, {
                playopts: {
                    autoplay: 1
                }
            }));
        });
    }

    var defoptions = {
        autoplay: false,
        user: null,
        carousel: createCarousel,
        player: createPlayer,
        thumbnail: createThumbnail,
        loaded: function() {},
        playopts: {
            autoplay: 0,
            egm: 1,
            autohide: 1,
            fs: 1,
            showinfo: 1
        }
    };


    $.fn.extend({
        youTubeChannel: function(options) {
            var md = $(this);
            md.addClass('youtube');
            md.addClass('youtube-channel');
            var allopts = $.extend(true, {}, defoptions, options);
            allopts.maindiv = md;
            $.getJSON('http://gdata.youtube.com/feeds/api/users/' + allopts.user + '/uploads?alt=json-in-script&format=5&callback=?', null, function(data) {
                var feed = data.feed;
                var videos = [];
                $.each(feed.entry, function(i, entry) {

                    var video = {
                        title: entry.title.$t,
                        id: entry.id.$t.match('[^/]*$'),
                        thumbnails: entry.media$group.media$thumbnail
                    };
                    videos.push(video);
                });
                allopts.allvideos = videos;
                allopts.carousel(md, videos, allopts);
                allopts.player(md, videos[0], allopts);
                allopts.loaded(videos, allopts);
            });
        }
    });

})();

$(function() {
    $('#player').youTubeChannel({
        user: 'UCbxKJC9zZJ9C7YDYuZ3m59Q'
    });
});

});



