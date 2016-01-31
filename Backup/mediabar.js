	(function($) {
		$(document).ready(function() { 
			
							$("#mediabar .container").jCarouselLite({
										scroll: 2,
					speed: 1000,	
					visible: 4,
					start: 0,
					circular: true,
					btnPrev: "#previous_button",
					btnNext: "#next_button"
				});
						
			$('#slides').slides({
								autoHeight: true
			});
			
			$("span[rel]").overlay({effect: 'apple'});
			$("ul.tabs").tabs("div.panes > div");
			$(".scrollable").scrollable({ mousewheel: true });				
			
		});
	})(jQuery);