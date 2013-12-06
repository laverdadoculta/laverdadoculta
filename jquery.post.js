var relatedTitles = new Array();
var relatedTitlesNum = 0;
var relatedUrls = new Array();

function related_results_labels(json) {
for (var i = 0; i < json.feed.entry.length; i++) {
var entry = json.feed.entry[i];
relatedTitles[relatedTitlesNum] = entry.title.$t;
for (var k = 0; k < entry.link.length; k++) {
if (entry.link[k].rel == 'alternate') {
relatedUrls[relatedTitlesNum] = entry.link[k].href;
relatedTitlesNum++;
break;
}
}
}
}

function removeRelatedDuplicates() {
var tmp = new Array(0);
var tmp2 = new Array(0);
for(var i = 0; i < relatedUrls.length; i++) {
if(!contains(tmp, relatedUrls[i])) {
tmp.length += 1;
tmp[tmp.length - 1] = relatedUrls[i];
tmp2.length += 1;
tmp2[tmp2.length - 1] = relatedTitles[i];
}
}
relatedTitles = tmp2;
relatedUrls = tmp;
}

function contains(a, e) {
for(var j = 0; j < a.length; j++) if (a[j]==e) return true;
return false;
}

function printRelatedLabels() {
var cuantosPosts = 0;
var r = Math.floor((relatedTitles.length - 1) * Math.random());
var i = 0;
var dirURL = document.URL;
document.write('<ul>');
while (i < relatedTitles.length && i < 20) {
if (relatedUrls[r] != dirURL) {
document.write('<li><a href="' + relatedUrls[r] + '" title="Noticia relacionada: '
+ relatedTitles[r] + '">' + relatedTitles[r] + '</a></li>');
}
if (r < relatedTitles.length - 1) {
r++;
} else {
r = 0;
}
i++;
cuantosPosts++;
if (cuantosPosts == 6) {
break;
}
}
document.write('</ul>');
}

var jsCommentPages=function(){var $activePage,$activeTab,init=function(){$(".comments-tab").each(function(){var $tab=$(this);$tab.click(selectPage).addClass("js-inactive-tab");switch($tab.attr("id")){case"blogger-comments":$tab.prepend("<img src='http://4.bp.blogspot.com/-D3CLTtnh96M/Uf6ElWGbhQI/AAAAAAAAVaU/Zd8cBjxouSo/s1600/blogger-icon.png'>");break;case"fb-comments":$tab.prepend("<img src='http://3.bp.blogspot.com/-RBYDycGwaJQ/Uf6ElhJ5MKI/AAAAAAAAVaY/lQ5PTdjsf0s/s1600/facebook-icon.png'>");break;}
$tab=null;});getTweetCounts();var $default=$(".js-default-tab:first"),strDefault="#blogger-comments";if($default.length>0){strDefault="#"+$default.attr("id");}
$activeTab=$(strDefault);$activeTab.removeClass("js-inactive-tab");$activePage=$(strDefault+"-page");$activePage.show();},getTweetCounts=function(){$(".js-page-tweet-count").each(function(){var $count=$(this);$.getJSON("http://urls.api.twitter.com/1/urls/count.json?callback=?",{url:$count.attr("href")},function(json){$count.text(json.count);$count=null;});});},selectPage=function(){$activeTab.addClass("js-inactive-tab");$activeTab=$(this);$activeTab.removeClass("js-inactive-tab");$activePage.hide();$activePage=$("#"+$activeTab.attr("id")+"-page");$activePage.show();};$("head").append("<link id='js-comments-pages-styles' rel='stylesheet' type='text/css' href='http://laverdadoculta.googlecode.com/svn/trunk/commentpages/jsCommentPages.css'/>");$("document").ready(init);}();