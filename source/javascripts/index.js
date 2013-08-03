//= require fancybox
//= require fancybox-media

$(document).ready(function(){

   


    var photoSets = new Object();
    var photoArray = new Object();



  //Flickr API calls
  var listData= {
    format: 'json',
    method: 'flickr.photosets.getList',
    user_id: '99688089@N06',
    api_key: '72a77248081016485a20c2b18c9c50ee'
  }
  var fetchPhotoSets = callFlickr(listData,function(data){
    var sets = data.photosets.photoset;
      for(var i=0;i<sets.length;i++){
        var photoSetId = sets[i].id;
        var photoSetTitle = sets[i].title._content;
        var containerDiv = $('<div/>').attr("id", photoSetTitle).attr({
                                                      class: "photo-set",
                                                      'data-id': photoSetId
                                                    });
        var primaryImgSrc = "http://farm"+sets[i].farm+".staticflickr.com/"+sets[i].server+"/"+sets[i].primary+"_"+sets[i].secret+"_n.jpg"
        var primaryImg = $('<img/>').attr("src", primaryImgSrc);
        var primaryImgLrg =  "http://farm"+sets[i].farm+".staticflickr.com/"+sets[i].server+"/"+sets[i].primary+"_"+sets[i].secret+"_z.jpg"
        var title = $('<h3/>').append(photoSetTitle);
       
        var a = $('<a/>').attr({
          class: 'fancybox',
          rel: photoSetId,
          href: primaryImgLrg
        });

        a.append(primaryImg);

        containerDiv.append(title);
        containerDiv.append(a);
        
        $('#galleries').append(containerDiv);
        photoSets[i] = photoSetId;
     }
     setTimeOut(lazyLoadPhotos(), 2000);
   });

    var date = new Date();
    var today = date.toISOString(); 
  //Doorkeeper API Call to fetch current events
  $.ajax({
    type: "GET",
    url: "http://api.doorkeeper.jp/groups/hnkansai/events?sort=starts_at&since="+today,
    data: {},
    dataType: "jsonp",
    crossDomain: true,
    success: function(data){
      console.log(data);
      var upcomingEvents = [];
      var nextEvent;
      for (var i in data) {
    
      upcomingEvents.push(data[i].event);
      nextEvent = upcomingEvents[1];
    }
    var formattedDate = formatDate(new Date(nextEvent.starts_at));
     $('#event-details').html('<a href="http://hnkansai.doorkeeper.jp/events/'+nextEvent.id +'">'+nextEvent.title + ", " + formattedDate+'</a>');
  }
  });




function lazyLoadPhotos(){    
  for (var id in photoSets){
    if (photoSets.hasOwnProperty(id)){
      var photoData = {
        format: 'json',
        method: 'flickr.photosets.getPhotos',
        user_id: '99688089@N06',
        photoset_id: photoSets[id],
        api_key: '72a77248081016485a20c2b18c9c50ee'
      }
           
      callFlickr(photoData,function(data){
       
        console.log(data);
        var photos = data.photoset.photo
        var galleryDiv = $('*[data-id="'+data.photoset.id+'"]');
        console.log(galleryDiv);
        for(var j=1;j<photos.length;j++){
          var imgSrc = "http://farm"+photos[j].farm+".staticflickr.com/"+photos[j].server+"/"+photos[j].id+"_"+photos[j].secret+"_z.jpg"
           var a = $('<a/>').attr({
            class: 'fancybox',
            rel: data.photoset.id,
            href: imgSrc
          });
            galleryDiv.append(a);

        }
      });
    }
  }
}


function callFlickr(data, callback){
   $.ajax({
      type: "GET",
      url: "http://api.flickr.com/services/rest/",
      data: data,
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      success: function(data){
        callback(data);
      },
      error: function(){
        alert('there was a problem');
      }
 });
}


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



/*
Found this on jsfiddle and modified it to suit my needs. Here is the creator -

Copyright 2011 : Simone Gianni <simoneg@apache.org>
Released under The Apache License 2.0 
http://www.apache.org/licenses/LICENSE-2.0

*/
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
          jqe.prepend(ifr);
      }

      function createCarousel(jqe, videos, options) {
          var car = $('div.carousel', jqe);
          if (car.length === 0) {
              car = $('<div>');
              car.addClass('carousel');
              var carouselWrap = $('<div/>');
              carouselWrap.addClass('carousel-wrap');
              carouselWrap.append(car)
              jqe.append(carouselWrap);

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
          var mycontainer = $('<div/>');
          mycontainer.addClass('thumb-container');  
          if (img.length !== 0) return;
          img = $('<img/>');
          img.addClass('thumbnail');
          mycontainer.append(img);
          img.attr('src', imgurl);
          img.attr('title', video.title);
          desk = $('<p class="yt-descript">' + video.title + '</p>');
          mycontainer.append(desk);
          jqe.append(mycontainer);
          
          mycontainer.click(function() {
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
          loaded: function() {
            var thumbs = $('.thumb-container').length;
            var thumbWidth = $('.thumb-container:first').width() + 40;
            var containerWidth = thumbs * thumbWidth;
            var windowWidth = $(window).width();
       
            $('.carousel').width(containerWidth);
          },
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


  $(".fancybox").fancybox({
  
  });

  $('.organizer').hover(function(){  
        $(".caption", this).fadeIn('fast');  
    }, function() {  
        $(".caption", this).fadeOut('fast'); 
    });



});


