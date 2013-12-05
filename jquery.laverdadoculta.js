(function($) {                                          // Compliant with jquery.noConflict()
$.fn.jCarouselLite = function(o) {
    o = $.extend({
        btnPrev: null,
        btnNext: null,
        btnGo: null,
        mouseWheel: false,
        auto: null,
        speed: 200,
        easing: null,
        vertical: false,
        circular: true,
        visible: 3,
        start: 0,
        scroll: 1,
        beforeStart: null,
        afterEnd: null
    }, o || {});

    return this.each(function() {                           // Returns the element collection. Chainable.

        var running = false, animCss=o.vertical?"top":"left", sizeCss=o.vertical?"height":"width";
        var div = $(this), ul = $("ul:first", div), tLi = $(".car", ul), tl = tLi.size(), v = o.visible;

        if(o.circular) {
            ul.prepend(tLi.slice(tl-v-1+1).clone())
              .append(tLi.slice(0,v).clone());
            o.start += v;
        }

        var li = $(".car", ul), itemLength = li.size(), curr = o.start;
        div.css("visibility", "visible");

        li.css({overflow: "hidden", float: o.vertical ? "none" : "left"});
        ul.css({ padding: "0", position: "relative", "list-style-type": "none", "z-index": "1"});
        //div.css({overflow: "hidden", position: "relative", "z-index": "2", left: "29px"});
		div.css({overflow: "hidden", "z-index": "2"});

        var liSize = o.vertical ? height(li) : width(li);   // Full li size(incl margin)-Used for animation
        var ulSize = liSize * itemLength;                   // size of full ul(total length, not just for the visible items)
        var divSize = liSize * v;                           // size of entire div(total length for just the visible items)

        li.css({width: li.width()});
        ul.css(sizeCss, ulSize+"px").css(animCss, -(curr*liSize));

        div.css(sizeCss, divSize+"px");                     // Width of the DIV. length of visible images

        if(o.btnPrev)
            $(o.btnPrev).click(function() {
                return go(curr-o.scroll);
            });

        if(o.btnNext)
            $(o.btnNext).click(function() {
                return go(curr+o.scroll);
            });

        if(o.btnGo)
            $.each(o.btnGo, function(i, val) {
                $(val).click(function() {
                    return go(o.circular ? o.visible+i : i);
                });
            });

        if(o.mouseWheel && div.mousewheel)
            div.mousewheel(function(e, d) {
                return d>0 ? go(curr-o.scroll) : go(curr+o.scroll);
            });

        if(o.auto)
            setInterval(function() {
                go(curr+o.scroll);
            }, o.auto+o.speed);

        function vis() {
            return li.slice(curr).slice(0,v);
        };

        function go(to) {
            if(!running) {

                if(o.beforeStart)
                    o.beforeStart.call(this, vis());

                if(o.circular) {            // If circular we are in first or last, then goto the other end
                    if(to<=o.start-v-1) {           // If first, then goto last
                        ul.css(animCss, -((itemLength-(v*2))*liSize)+"px");
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be lesser depending on the number of elements.
                        curr = to==o.start-v-1 ? itemLength-(v*2)-1 : itemLength-(v*2)-o.scroll;
                    } else if(to>=itemLength-v+1) { // If last, then goto first
                        ul.css(animCss, -( (v) * liSize ) + "px" );
                        // If "scroll" > 1, then the "to" might not be equal to the condition; it can be greater depending on the number of elements.
                        curr = to==itemLength-v+1 ? v+1 : v+o.scroll;
                    } else curr = to;
                } else {                    // If non-circular and to points to first or last, we just return.
                    if(to<0 || to>itemLength-v) return;
                    else curr = to;
                }                           // If neither overrides it, the curr will still be "to" and we can proceed.

                running = true;

                ul.animate(
                    animCss == "left" ? { left: -(curr*liSize) } : { top: -(curr*liSize) } , o.speed, o.easing,
                    function() {
                        if(o.afterEnd)
                            o.afterEnd.call(this, vis());
                        running = false;
                    }
                );
                // Disable buttons when the carousel reaches the last/first, and enable when not
                if(!o.circular) {
                    $(o.btnPrev + "," + o.btnNext).removeClass("disabled");
                    $( (curr-o.scroll<0 && o.btnPrev)
                        ||
                       (curr+o.scroll > itemLength-v && o.btnNext)
                        ||
                       []
                     ).addClass("disabled");
                }

            }
            return false;
        };
    });
};

function css(el, prop) {
    return parseInt($.css(el[0], prop)) || 0;
};
function width(el) {
    return  el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
};
function height(el) {
    return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
};

})(jQuery);

(function(a){a.fn.slides=function(b){return b=a.extend({},a.fn.slides.option,b),this.each(function(){function w(g,h,i){if(!p&&o){p=!0,b.animationStart(n+1);switch(g){case"next":l=n,k=n+1,k=e===k?0:k,r=f*2,g=-f*2,n=k;break;case"prev":l=n,k=n-1,k=k===-1?e-1:k,r=0,g=0,n=k;break;case"pagination":k=parseInt(i,10),l=a("."+b.paginationClass+" li."+b.currentClass+" a",c).attr("href").match("[^#/]+$"),k>l?(r=f*2,g=-f*2):(r=0,g=0),n=k}h==="fade"?b.crossfade?d.children(":eq("+k+")",c).css({zIndex:10}).fadeIn(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+l+")",c).css({display:"none",zIndex:0}),d.children(":eq("+k+")",c).css({zIndex:0}),b.animationComplete(k+1),p=!1)}):d.children(":eq("+l+")",c).fadeOut(b.fadeSpeed,b.fadeEasing,function(){b.autoHeight?d.animate({height:d.children(":eq("+k+")",c).outerHeight()},b.autoHeightSpeed,function(){d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing)}):d.children(":eq("+k+")",c).fadeIn(b.fadeSpeed,b.fadeEasing,function(){a.browser.msie&&a(this).get(0).style.removeAttribute("filter")}),b.animationComplete(k+1),p=!1}):(d.children(":eq("+k+")").css({left:r,display:"block"}),b.autoHeight?d.animate({left:g,height:d.children(":eq("+k+")").outerHeight()},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1}):d.animate({left:g},b.slideSpeed,b.slideEasing,function(){d.css({left:-f}),d.children(":eq("+k+")").css({left:f,zIndex:5}),d.children(":eq("+l+")").css({left:f,display:"none",zIndex:0}),b.animationComplete(k+1),p=!1})),b.pagination&&(a("."+b.paginationClass+" li."+b.currentClass,c).removeClass(b.currentClass),a("."+b.paginationClass+" li:eq("+k+")",c).addClass(b.currentClass))}}function x(){clearInterval(c.data("interval"))}function y(){b.pause?(clearTimeout(c.data("pause")),clearInterval(c.data("interval")),u=setTimeout(function(){clearTimeout(c.data("pause")),v=setInterval(function(){w("next",i)},b.play),c.data("interval",v)},b.pause),c.data("pause",u)):x()}a("."+b.container,a(this)).children().wrapAll('<div class="slides_control"/>');var c=a(this),d=a(".slides_control",c),e=d.children().size(),f=d.children().outerWidth(),g=d.children().outerHeight(),h=b.start-1,i=b.effect.indexOf(",")<0?b.effect:b.effect.replace(" ","").split(",")[0],j=b.effect.indexOf(",")<0?i:b.effect.replace(" ","").split(",")[1],k=0,l=0,m=0,n=0,o,p,q,r,s,t,u,v;if(e<2)return a("."+b.container,a(this)).fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()}),a("."+b.next+", ."+b.prev).fadeOut(0),!1;if(e<2)return;h<0&&(h=0),h>e&&(h=e-1),b.start&&(n=h),b.randomize&&d.randomize(),a("."+b.container,c).css({overflow:"hidden",position:"relative"}),d.children().css({position:"absolute",top:0,left:d.children().outerWidth(),zIndex:0,display:"none"}),d.css({position:"relative",width:f*3,height:g,left:-f}),a("."+b.container,c).css({display:"block"}),b.autoHeight&&(d.children().css({height:"auto"}),d.animate({height:d.children(":eq("+h+")").outerHeight()},b.autoHeightSpeed));if(b.preload&&d.find("img:eq("+h+")").length){a("."+b.container,c).css({background:"url("+b.preloadImage+") no-repeat 50% 50%"});var z=d.find("img:eq("+h+")").attr("src")+"?"+(new Date).getTime();a("img",c).parent().attr("class")!="slides_control"?t=d.children(":eq(0)")[0].tagName.toLowerCase():t=d.find("img:eq("+h+")"),d.find("img:eq("+h+")").attr("src",z).load(function(){d.find(t+":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){a(this).css({zIndex:5}),a("."+b.container,c).css({background:""}),o=!0,b.slidesLoaded()})})}else d.children(":eq("+h+")").fadeIn(b.fadeSpeed,b.fadeEasing,function(){o=!0,b.slidesLoaded()});b.bigTarget&&(d.children().css({cursor:"pointer"}),d.children().click(function(){return w("next",i),!1})),b.hoverPause&&b.play&&(d.bind("mouseover",function(){x()}),d.bind("mouseleave",function(){y()})),b.generateNextPrev&&(a("."+b.container,c).after('<a href="#" class="'+b.prev+'">Prev</a>'),a("."+b.prev,c).after('<a href="#" class="'+b.next+'">Next</a>')),a("."+b.next,c).click(function(a){a.preventDefault(),b.play&&y(),w("next",i)}),a("."+b.prev,c).click(function(a){a.preventDefault(),b.play&&y(),w("prev",i)}),b.generatePagination?(b.prependPagination?c.prepend("<ul class="+b.paginationClass+"></ul>"):c.append("<ul class="+b.paginationClass+"></ul>"),d.children().each(function(){a("."+b.paginationClass,c).append('<li><a href="#'+m+'">'+(m+1)+"</a></li>"),m++})):a("."+b.paginationClass+" li a",c).each(function(){a(this).attr("href","#"+m),m++}),a("."+b.paginationClass+" li:eq("+h+")",c).addClass(b.currentClass),a("."+b.paginationClass+" li a",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$"),n!=q&&w("pagination",j,q),!1}),a("a.link",c).click(function(){return b.play&&y(),q=a(this).attr("href").match("[^#/]+$")-1,n!=q&&w("pagination",j,q),!1}),b.play&&(v=setInterval(function(){w("next",i)},b.play),c.data("interval",v))})},a.fn.slides.option={preload:!1,preloadImage:"/img/loading.gif",container:"slides_container",generateNextPrev:!1,next:"next",prev:"prev",pagination:!0,generatePagination:!0,prependPagination:!1,paginationClass:"pagination",currentClass:"current",fadeSpeed:350,fadeEasing:"",slideSpeed:350,slideEasing:"",start:1,effect:"slide",crossfade:!1,randomize:!1,play:0,pause:0,hoverPause:!1,autoHeight:!1,autoHeightSpeed:350,bigTarget:!1,animationStart:function(){},animationComplete:function(){},slidesLoaded:function(){}},a.fn.randomize=function(b){function c(){return Math.round(Math.random())-.5}return a(this).each(function(){var d=a(this),e=d.children(),f=e.length;if(f>1){e.hide();var g=[];for(i=0;i<f;i++)g[g.length]=i;g=g.sort(c),a.each(g,function(a,c){var f=e.eq(c),g=f.clone(!0);g.show().appendTo(d),b!==undefined&&b(f,g),f.remove()})}})}})(jQuery)

//** Tab Content script v2.0- Â© Dynamic Drive DHTML code library (http://www.dynamicdrive.com)
//** Updated Oct 7th, 07 to version 2.0. Contains numerous improvements:
//   -Added Auto Mode: Script auto rotates the tabs based on an interval, until a tab is explicitly selected
//   -Ability to expand/contract arbitrary DIVs on the page as the tabbed content is expanded/ contracted
//   -Ability to dynamically select a tab either based on its position within its peers, or its ID attribute (give the target tab one 1st)
//   -Ability to set where the CSS classname "selected" get assigned- either to the target tab's link ("A"), or its parent container
//** Updated Feb 18th, 08 to version 2.1: Adds a "tabinstance.cycleit(dir)" method to cycle forward or backward between tabs dynamically
//** Updated April 8th, 08 to version 2.2: Adds support for expanding a tab using a URL parameter (ie: http://mysite.com/tabcontent.htm?tabinterfaceid=0) 

////NO NEED TO EDIT BELOW////////////////////////

function ddtabcontent(tabinterfaceid){
	this.tabinterfaceid=tabinterfaceid //ID of Tab Menu main container
	this.tabs=document.getElementById(tabinterfaceid).getElementsByTagName("a") //Get all tab links within container
	this.enabletabpersistence=true
	this.hottabspositions=[] //Array to store position of tabs that have a "rel" attr defined, relative to all tab links, within container
	this.currentTabIndex=0 //Index of currently selected hot tab (tab with sub content) within hottabspositions[] array
	this.subcontentids=[] //Array to store ids of the sub contents ("rel" attr values)
	this.revcontentids=[] //Array to store ids of arbitrary contents to expand/contact as well ("rev" attr values)
	this.selectedClassTarget="link" //keyword to indicate which target element to assign "selected" CSS class ("linkparent" or "link")
}

ddtabcontent.getCookie=function(Name){ 
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
		return document.cookie.match(re)[0].split("=")[1] //return its value
	return ""
}

ddtabcontent.setCookie=function(name, value){
	document.cookie = name+"="+value+";path=/" //cookie value is domain wide (path=/)
}

ddtabcontent.prototype={

	expandit:function(tabid_or_position){ //PUBLIC function to select a tab either by its ID or position(int) within its peers
		this.cancelautorun() //stop auto cycling of tabs (if running)
		var tabref=""
		try{
			if (typeof tabid_or_position=="string" && document.getElementById(tabid_or_position).getAttribute("rel")) //if specified tab contains "rel" attr
				tabref=document.getElementById(tabid_or_position)
			else if (parseInt(tabid_or_position)!=NaN && this.tabs[tabid_or_position].getAttribute("rel")) //if specified tab contains "rel" attr
				tabref=this.tabs[tabid_or_position]
		}
		catch(err){alert("Invalid Tab ID or position entered!")}
		if (tabref!="") //if a valid tab is found based on function parameter
			this.expandtab(tabref) //expand this tab
	},

	cycleit:function(dir, autorun){ //PUBLIC function to move foward or backwards through each hot tab (tabinstance.cycleit('foward/back') )
		if (dir=="next"){
			var currentTabIndex=(this.currentTabIndex<this.hottabspositions.length-1)? this.currentTabIndex+1 : 0
		}
		else if (dir=="prev"){
			var currentTabIndex=(this.currentTabIndex>0)? this.currentTabIndex-1 : this.hottabspositions.length-1
		}
		if (typeof autorun=="undefined") //if cycleit() is being called by user, versus autorun() function
			this.cancelautorun() //stop auto cycling of tabs (if running)
		this.expandtab(this.tabs[this.hottabspositions[currentTabIndex]])
	},

	setpersist:function(bool){ //PUBLIC function to toggle persistence feature
			this.enabletabpersistence=bool
	},

	setselectedClassTarget:function(objstr){ //PUBLIC function to set which target element to assign "selected" CSS class ("linkparent" or "link")
		this.selectedClassTarget=objstr || "link"
	},

	getselectedClassTarget:function(tabref){ //Returns target element to assign "selected" CSS class to
		return (this.selectedClassTarget==("linkparent".toLowerCase()))? tabref.parentNode : tabref
	},

	urlparamselect:function(tabinterfaceid){
		var result=window.location.search.match(new RegExp(tabinterfaceid+"=(\\d+)", "i")) //check for "?tabinterfaceid=2" in URL
		return (result==null)? null : parseInt(RegExp.$1) //returns null or index, where index (int) is the selected tab's index
	},

	expandtab:function(tabref){
		var subcontentid=tabref.getAttribute("rel") //Get id of subcontent to expand
		//Get "rev" attr as a string of IDs in the format ",john,george,trey,etc," to easily search through
		var associatedrevids=(tabref.getAttribute("rev"))? ","+tabref.getAttribute("rev").replace(/\s+/, "")+"," : ""
		this.expandsubcontent(subcontentid)
		this.expandrevcontent(associatedrevids)
		for (var i=0; i<this.tabs.length; i++){ //Loop through all tabs, and assign only the selected tab the CSS class "selected"
			this.getselectedClassTarget(this.tabs[i]).className=(this.tabs[i].getAttribute("rel")==subcontentid)? "selected" : ""
		}
		if (this.enabletabpersistence) //if persistence enabled, save selected tab position(int) relative to its peers
			ddtabcontent.setCookie(this.tabinterfaceid, tabref.tabposition)
		this.setcurrenttabindex(tabref.tabposition) //remember position of selected tab within hottabspositions[] array
	},

	expandsubcontent:function(subcontentid){
		for (var i=0; i<this.subcontentids.length; i++){
			var subcontent=document.getElementById(this.subcontentids[i]) //cache current subcontent obj (in for loop)
			subcontent.style.display=(subcontent.id==subcontentid)? "block" : "none" //"show" or hide sub content based on matching id attr value
		}
	},

	expandrevcontent:function(associatedrevids){
		var allrevids=this.revcontentids
		for (var i=0; i<allrevids.length; i++){ //Loop through rev attributes for all tabs in this tab interface
			//if any values stored within associatedrevids matches one within allrevids, expand that DIV, otherwise, contract it
			document.getElementById(allrevids[i]).style.display=(associatedrevids.indexOf(","+allrevids[i]+",")!=-1)? "block" : "none"
		}
	},

	setcurrenttabindex:function(tabposition){ //store current position of tab (within hottabspositions[] array)
		for (var i=0; i<this.hottabspositions.length; i++){
			if (tabposition==this.hottabspositions[i]){
				this.currentTabIndex=i
				break
			}
		}
	},

	autorun:function(){ //function to auto cycle through and select tabs based on a set interval
		this.cycleit('next', true)
	},

	cancelautorun:function(){
		if (typeof this.autoruntimer!="undefined")
			clearInterval(this.autoruntimer)
	},

	init:function(automodeperiod){
		var persistedtab=ddtabcontent.getCookie(this.tabinterfaceid) //get position of persisted tab (applicable if persistence is enabled)
		var selectedtab=-1 //Currently selected tab index (-1 meaning none)
		var selectedtabfromurl=this.urlparamselect(this.tabinterfaceid) //returns null or index from: tabcontent.htm?tabinterfaceid=index
		this.automodeperiod=automodeperiod || 0
		for (var i=0; i<this.tabs.length; i++){
			this.tabs[i].tabposition=i //remember position of tab relative to its peers
			if (this.tabs[i].getAttribute("rel")){
				var tabinstance=this
				this.hottabspositions[this.hottabspositions.length]=i //store position of "hot" tab ("rel" attr defined) relative to its peers
				this.subcontentids[this.subcontentids.length]=this.tabs[i].getAttribute("rel") //store id of sub content ("rel" attr value)
				this.tabs[i].onclick=function(){
					tabinstance.expandtab(this)
					tabinstance.cancelautorun() //stop auto cycling of tabs (if running)
					return false
				}
				if (this.tabs[i].getAttribute("rev")){ //if "rev" attr defined, store each value within "rev" as an array element
					this.revcontentids=this.revcontentids.concat(this.tabs[i].getAttribute("rev").split(/\s*,\s*/))
				}
				if (selectedtabfromurl==i || this.enabletabpersistence && selectedtab==-1 && parseInt(persistedtab)==i || !this.enabletabpersistence && selectedtab==-1 && this.getselectedClassTarget(this.tabs[i]).className=="selected"){
					selectedtab=i //Selected tab index, if found
				}
			}
		} //END for loop
		if (selectedtab!=-1) //if a valid default selected tab index is found
			this.expandtab(this.tabs[selectedtab]) //expand selected tab (either from URL parameter, persistent feature, or class="selected" class)
		else //if no valid default selected index found
			this.expandtab(this.tabs[this.hottabspositions[0]]) //Just select first tab that contains a "rel" attr
		if (parseInt(this.automodeperiod)>500 && this.hottabspositions.length>1){
			this.autoruntimer=setInterval(function(){tabinstance.autorun()}, this.automodeperiod)
		}
	} //END int() function

} //END Prototype assignment

function removeHtmlTag(e,t){var n=e.split("<");for(var r=0;r<n.length;r++){if(n[r].indexOf(">")!=-1){n[r]=n[r].substring(n[r].indexOf(">")+1,n[r].length)}}n=n.join("");n=n.substring(0,t-1);return n}function showrecentposts1(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;if(numposts1<=e.feed.entry.length){maxpost=numposts1}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";var w='<div class="col_teaser"><a href="'+o+'"><img class="teaser_img" src="'+img[t]+'"/></a><h3 class="posttitle"><a href="'+o+'">'+r+'</a></h3><div class="clear"></div></div>';document.write(w);j++}}function showrecentposts2(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;if(numposts2<=e.feed.entry.length){maxpost=numposts2}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";if(t==0){var w='<div class="featuredPost"><img class="aligncenter ftimg" alt="'+r+'" src="'+img[t]+'" title="'+r+'"/><h3 class="posttitle"> <a href="'+o+'">'+r+"</a></h3><p>"+removeHtmlTag(f,summaryPost)+'...</p><span class="postmeta">'+y+" | "+i+" </span></div>";document.write(w)}if(t>0&&t<maxpost){var w='<div class="featuredPost lastPost"><h3 class="posttitle"> <a href="'+o+'">'+r+"</a></h3><p>"+removeHtmlTag(f,summaryPost)+'...</p><span class="postmeta">'+y+" | "+i+" </span></div>";document.write(w)}j++}}function showrecentposts3(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;if(numposts3<=e.feed.entry.length){maxpost=numposts3}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";var w='<div class="featuredPost"><h3 class="posttitle"><a href="'+o+'">'+r+"</a></h3><p>"+removeHtmlTag(f,summaryPost)+'...</p><span class="postmeta">'+y+" | "+i+" </span></div>";document.write(w);j++}}function showrecentposts4(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;if(numposts4<=e.feed.entry.length){maxpost=numposts4}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";var w='<li class="car"><div class="thumb"><img class="alignnone" width="130" height="120" src="'+img[t]+'"/></div><a href="'+o+'">'+r+"</a></li>";document.write(w);j++}}function showrecentposts5(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;document.write('<div class="slides">');if(numposts5<=e.feed.entry.length){maxpost=numposts5}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";var w='<div class="featuredPost"><h3 class="posttitle"><a href="'+o+'">'+r+'</a></h3><p><img class="alignleft" width="120" height="90" alt="'+r+'" src="'+img[t]+'" title="'+r+'"/>'+removeHtmlTag(f,summaryPost)+'...</p><div class="clear"></div><span class="postmeta">'+y+" | "+i+" </span></div>";document.write(w);j++}document.write("</div>")}function showrecentposts6(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;if(numposts6<=e.feed.entry.length){maxpost=numposts6}else{maxpost=e.feed.entry.length}for(var t=0;t<maxpost;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]=imgr[j];s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]=d;var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";if(maxpost==0)break;else{if(t==0){var w='<div class="tableft border_right_20"><div class="featuredPost lastPost"><img width="300" height="225" alt="'+r+'" src="'+img[t]+'" title="'+r+'" class="aligncenter"/><h3 class="posttitle"><a href="'+o+'">'+r+"</a></h3><p>"+removeHtmlTag(f,summaryPost)+'...</p><span class="postmeta">'+y+" | "+i+" </span></div></div>";document.write(w)}if(t==1){document.write('<div class="tabright">')}if(t>0&&t<maxpost){var w='<div class="featuredPost"><h3 class="posttitle"><a href="'+o+'">'+r+'</a></h3><p><img src="'+img[t]+'" width="60" height="50" class="alignright"/>'+removeHtmlTag(f,summaryPost)+'...</p><div class="clear"></div><span class="postmeta">'+y+" | "+i+" </span></div>";document.write(w)}}j++}document.write("</div>")}function showrecentposts(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0;img=new Array;for(var t=0;t<numposts;t++){var n=e.feed.entry[t];var r=n.title.$t;var i;var o;if(t==e.feed.entry.length)break;for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="alternate"){o=n.link[u].href;break}}for(var u=0;u<n.link.length;u++){if(n.link[u].rel=="replies"&&n.link[u].type=="text/html"){i=n.link[u].title.split(" ")[0];break}}if("content"in n){var f=n.content.$t}else if("summary"in n){var f=n.summary.$t}else var f="";postdate=n.published.$t;if(j>imgr.length-1)j=0;img[t]="";s=f;a=s.indexOf("<img");b=s.indexOf('src="',a);c=s.indexOf('"',b+5);d=s.substr(b+5,c-b-5);if(a!=-1&&b!=-1&&c!=-1&&d!="")img[t]='<img width="256" height="341" class="alignnone" src="'+d+'"/>';var l=[1,2,3,4,5,6,7,8,9,10,11,12];var h=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];var p=postdate.split("-")[2].substring(0,2);var v=postdate.split("-")[1];var m=postdate.split("-")[0];for(var g=0;g<l.length;g++){if(parseInt(v)==l[g]){v=h[g];break}}var y=p+" "+v+" "+m;i='<a href="'+o+'">'+i+" comentarios</a>";var w='<li><a class="pad" href="'+o+'">'+r+'</a><span class="block">'+y+" | "+i+"</span></li>";document.write(w);j++}}function showrecentcomments(e){for(var t=0;t<6;t++){var n=e.feed.entry[t];var r;if(t==e.feed.entry.length)break;for(var i=0;i<n.link.length;i++){if(n.link[i].rel=="alternate"){r=n.link[i].href;break}}r=r.replace("#","#comment-");var s=r.split("#");s=s[0];var o=s.split("/");o=o[5];o=o.split(".html");o=o[0];var u=o.replace(/-/g," ");u=u.link(s);if("content"in n){var a=n.content.$t}else if("summary"in n){var a=n.summary.$t}else var a="";var f=/<\S[^>]*>>/g;a=a.replace(f,"");if(t==0){document.write("<li>")}else{document.write("<li>")}document.write('<a href="'+r+'"><strong>'+n.author[0].name.$t+"</strong></a> dice: ");if(a.length<100){document.write('<a target="_blank" href="'+r+'">'+a+"</a>")}else{a=a.substring(0,100);var l=a.lastIndexOf(" ");a=a.substring(0,l);document.write('<a target="_blank" href="'+r+'">'+a+"...</a>")}}document.write("</li>")}(function(e){e(document).ready(function(){e("#mediabar .container").jCarouselLite({scroll:2,speed:1e3,visible:4,start:0,circular:true,btnPrev:"#previous_button",btnNext:"#next_button"});e("#slides").slides({autoHeight:true});e("span[rel]").overlay({effect:"apple"});e("ul.tabs").tabs("div.panes > div");e(".scrollable").scrollable({mousewheel:true})})})(jQuery);imgr=new Array;imgr[0]="http://4.bp.blogspot.com/-sCQy7v-L2bo/T3OYPnm7LuI/AAAAAAAABl4/cbteumcrZSU/s1600/noimage.png";showRandomImg=true;aBold=true;summaryPost=132;summaryTitle=70;numposts=6;numposts1=4;numposts2=3;numposts3=3;numposts4=8;numposts5=3;numposts6=4