/** Template helper functions **/
window.templateStatus = {};

function loadTemplate(url, varname) {
    $.ajax({
        url: url,
        success: function (data) {
            window.templateStatus[varname] = Handlebars.compile(data);
        }
    });
}

function isTemplateLoaded(varname) {
    return window.templateStatus[varname] !== undefined;
}

function getTemplate(varname) {
    if (window.templateStatus[varname] === undefined) {
        throw "Template " + varname + " has not been loaded";
    }
    return window.templateStatus[varname];
}

function toggle_panel(panelButton){

    panelButton.find('.panel-button-icon').toggleClass("icon-chevron-down");
    panelButton.find('.panel-button-icon').toggleClass("icon-chevron-up");
}
/** Panelly UI stuff */
function bind_panels() {
    $('.panel-button').each(function () {
        if (!$(this).data('panelbound')) {
            $(this).on('click', function () {
                if (!$(this).next().is(":visible")) {
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - 100
                    }, 500);
                }
		toggle_panel($(this));
		$(this).next().toggle();
            });
            $(this).data('panelbound', true);
        }
    });
}

$(document).ready(function () { bind_panels(); });

/** Form stuff **/
function form_error(form_id, message) {
    $('#' + form_id + " .error").remove();
    $('#' + form_id).append("<div class='error'>" + message + "</div>");
}

/* Stars for reviews */
function generateStars(i) {
    i = Math.round(i * 2) / 2
    var a = '';
    var j;
    for (j = 0; j < Math.floor(i); j++) {
        a += "<span class='icon-star'></span>";
    }
    if (j - i !== 0) {
        a += "<span class='icon-star-half-full'></span>";
        i = j + 1;
    }
    for (j = i; j < 5; j++) {
        a += "<span class='icon-star-empty'></span>";
    }
    return a;
}


/** Toilet Listings **/

//Returns a django-compatible filter to only select toilets within
// a dist-mile-sided square centered on (lat, lng)
function toiletFilterByDistance(lat, lng, dist){
    var sb = squareBounds(lat, lng, dist);
    var xmin, xmax, ymin, ymax;

    var smallLeft = (sb.x_left < sb.x_right);
    xmin = smallLeft ? sb_x.left : sb.x_right;
    xmax = smallLeft ? sb.x_right : sb.x_left;

    var smallBottom = (sb.y_bottom < sb.y_top);
    ymin = smallBottom ? sb_y.bottom : sb.y_top;
    ymax = smallBottom ? sb.y_top : sb.y_bottom;

    return {
	current_lat: lat
	,current_lng: lng
	,filters: { lat__gt: xmin, lat__lt: xmax, lng__gt: ymin, lng__lt: ymax }
    };
}

//Returns a sorting comparison function that will sort toilets by 
// distance from (lat, lng). Also sets .distance property for each toilet
function toiletSortByDistance(lat, lng){
    function dist(d){
	if(d.distance !== undefined) return d.distance;
	d.distance = distance_from_current(lat,
					   lng,
					   d.fields.lat,
					   d.fields.lng);
	return d.distance;
    }
    return function(data){
	data.sort(function(d1, d2){
            if(dist(d1) === dist(d2)) return 0;
            return dist(d1) < dist(d2) ? -1 : 1;
	});
	return data; 
    }
}


//Returns a function that will retrieve toilets from the server. 
//  (Compatible with bsScrollLoad)
//  - queryCallback is passed the data retrieved from the server
//  - start is the first toilet to retrieve and end is the last. 
//Note that sortFn is expected to set the distance for each toilet
// in the data. Weird but efficient (prevents two passes & separates concerns).
// (toiletSortByDistance is the only example of a sorting function for now). 
function getToiletListings(filter, sortFn){
    return function (queryCallback, start, end){
	console.log("getToiletListings");
	var params = {
            noun: "toilet",
            verb: "retrieve",
            data: { start: start, end: end, filters: filter },
            callback: function (data) {
		if(sortFn !== undefined) sortFn(data);
		for (o in data) {
                    var params = {};
                    params.pk = data[o].pk;
                    params.stars = generateStars(data[o].fields.rating);
                    params.date = data[o].fields.date.slice(0, 10);
                    params.name = data[o].fields.name;
                    params.num_reviews = data[o].fields.numberOfReviews;
		    params.distance = data[o].distance + " mi";
		    data[o] = params;
		}
		queryCallback(data);
            }
	};
	//append filter arguments to params.data
	if (filter !== undefined) jQuery.extend(params.data, filter);
	console.log(params.data);
	tapi(params);
    }
}

/** Reviews **/
function formatReviewData(rD){
    reviewData = rD;
    reviewData.fields.stars = generateStars(reviewData.fields.rank);
    reviewData.fields.date = reviewData.fields.date.slice(0, 10);
    reviewData.fields.pk = reviewData.pk;
    reviewData.fields.content = filter_content(reviewData.fields.content);
    return reviewData.fields;
}
function getReviews (sortby, filters, bindFn){
    var topReview = {rank: 0, content: ''};
    return function(queryCallback, start, end){
	tapi({noun: "review", verb: "retrieve"
	      , data: { sortby: sortby, filters : filters
			, start : start, end : end},
              callback: function(data){
		  console.log("GetReviews data: ", start, end, data);
		  for(o in data){
		      console.log("GetReviews item: ", data[o], data.length);
                      if(topReview.rank < data[o].fields.rank){
			  topReview = data[o].fields;
                      }
                      console.log(data[o].fields.user);
		      data[o] = formatReviewData(data[o]);
		  }
		  $('#review-top-comment').html('"' + topReview.content.slice(0, 50) +'..."');		     

		  if(bindFn !== undefined) bindFn(); 
		  queryCallback(data);
              }});
    }
}


/** Live Searching **/

//Timer to be used for livesearching. Prevent constant queries
var delay = (function(){
    var timer = 0;
    return function(callback,time_ms){
        clearTimeout (timer);
        timer = setTimeout(callback,time_ms);
    };
})();

//This is sort of a janky way to fix the bugs we faced when doing searches
//toiletsLoading isn't reset properly and numToiletsLoaded is incrementing each call
//causing no results to be returned
function searchReset() {
    toiletsLoading = false;
    numToiletsLoaded = 0;
}
