/** Template helper functions **/
window.templateStatus = {};

function loadTemplate(url, varname){
    $.ajax({
	url: url
	,success: function(data){ window.templateStatus[varname] = Handlebars.compile(data); }
    });
}

function isTemplateLoaded(varname){
    return window.templateStatus[varname] !== undefined;
}

function getTemplate(varname){
    if(window.templateStatus[varname] === undefined){ throw "Template "+varname+" has not been loaded"; }
    return window.templateStatus[varname];
}

/** Panelly UI stuff */
$(document).ready(function(){
    $('.panel-button').on('click', function(){
	$(this).next().toggle();
	$(this).find('.panel-button-icon').toggleClass("icon-chevron-down");
	$(this).find('.panel-button-icon').toggleClass("icon-chevron-up");
    });
});

/** Form stuff **/
function form_error(form_id, message){
    $('#'+form_id+" .error").remove();
    $('#'+form_id).append("<div class='error'>"+message+"</div>");
}

/* Stars for reviews */
function generateStars(i){
    i = Math.round(i * 2) / 2
    var a = '';
    var j; 
    for(j = 0; j < Math.floor(i); j++){
        a += "<span class='icon-star'></span>";
    }
    if(j - i !== 0){
        a += "<span class='icon-star-half-full'></span>";
        i = j + 1; 
    }
    for(j = i; j < 5; j++){
        a += "<span class='icon-star-empty'></span>";
    }
    return a;
}

/** Toilet Listings **/
var numToiletsLoaded = 0; 
var toiletsLoading = false;
loadTemplate("/static/handlebars/toilet.html", "toilet");
function loadToiletListings(div_id, i, filters){
    console.log(name);
    if(name === undefined) console.log("undef name");
    if(toiletsLoading) return; 
    if(!isTemplateLoaded("toilet")){
	setTimeout("loadToiletListings('"+div_id+"', '"+i+"' );", 50);
	return;
    }
    template = getTemplate("toilet");
    toiletsLoading = true;

   //Appendable parameters to send to tapi
   var params = {
      // This is not correct right now, keep this FAULT in mind. numToiletsLoaded + i = "0+undefined"
      noun: "toilet", verb: "retrieve", data: {start : numToiletsLoaded, end : numToiletsLoaded + i },
	   callback: function(data){
	      console.log("Callbaaaack");
         for(o in data){
		      console.log(data[o]);
		      var params = {};
		      params.pk = data[o].t[0].pk;
		      params.stars = generateStars(data[o].ranking);
		      params.date = data[o].t[0].fields.date.slice(0, 10);
		      params.name = data[o].t[0].fields.name;
		      params.num_reviews = data[o].count;
		      $('#'+div_id).append(template(params));
         }
         loading = false;
         numToiletsLoaded += i;
   }};
   
   params.data.creator = 1;
   
   tapi(params);
}
