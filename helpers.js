var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var container;
var particle;
var camera;
var scene;
var renderer;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var particles = []; 
var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
particleImage.src = '//codecloud.cdn.speedyrails.net/sites/5a0c60c56e6f6401f51f0000/image/png/1512576570739/ParticleSmoke.png'; 

window.onload = function() {
    
    
    setTimeout(function (){snowInit ();},1000);
    function snowInit() {
    	container = document.createElement('div');
    	document.body.appendChild(container);
    	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    	camera.position.z = 1000;
    	scene = new THREE.Scene();
    	scene.add(camera);
    		
    	renderer = new THREE.CanvasRenderer();
    	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    	var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
    		
    	for (var i = 0; i < 500; i++) {
    		particle = new Particle3D( material);
    		particle.position.x = Math.random() * 2000 - 1000;
    		particle.position.y = Math.random() * 2000 - 1000;
    		particle.position.z = Math.random() * 2000 - 1000;
    		particle.scale.x = particle.scale.y =  1;
    		scene.add( particle );
    		
    		particles.push(particle); 
    	}
    	container.appendChild( renderer.domElement );
    
    	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    	
    	setInterval( loop, 1000 / 60 );
    	
    }
    
    function onDocumentMouseMove( event ) {
    	mouseX = event.clientX - windowHalfX;
    	mouseY = event.clientY - windowHalfY;
    }
    function onDocumentTouchStart( event ) {
    	if ( event.touches.length == 1 ) {
    		event.preventDefault();
    		mouseX = event.touches[ 0 ].pageX - windowHalfX;
    		mouseY = event.touches[ 0 ].pageY - windowHalfY;
    	}
    }
    function onDocumentTouchMove( event ) {
    	if ( event.touches.length == 1 ) {
    		event.preventDefault();
    		mouseX = event.touches[ 0 ].pageX - windowHalfX;
    		mouseY = event.touches[ 0 ].pageY - windowHalfY;
    	}
    }
    //
    function loop() {
    for(var i = 0; i<particles.length; i++)
    	{
    		var particle = particles[i]; 
    		particle.updatePhysics(); 
    
    		with(particle.position)
    		{
    			if(y<-1000) y+=2000; 
    			if(x>1000) x-=2000; 
    			else if(x<-1000) x+=2000; 
    			if(z>1000) z-=2000; 
    			else if(z<-1000) z+=2000; 
    		}				
    	}
    
    	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    	camera.lookAt(scene.position); 
    	renderer.render( scene, camera );
    	
    }
};

function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="//kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    $('.open_menu').click(function(e){
        e.preventDefault();
        $('body').addClass('no_scroll');
        $('.mobile_menu_container').addClass('active_menu')
    });
    $('#close_menu').click(function(e){
        e.preventDefault();
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu');
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show();
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.submenu_expander').click(function(e){
		e.preventDefault()
		if ($(this).hasClass('open') == false){
        	$('.open').next().slideToggle();
        	$('.open').find('img').toggle();
        	$('.open').toggleClass('open')
		}
		$(this).next().slideToggle();
		$(this).find('img').toggle();
		$(this).toggleClass('open')
	})
	
	$('html').click(function() {
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu')
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show()
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.mobile_menu_container, .open_menu').click(function(event){
        event.stopPropagation();
    });
    
    $('#option_selector').change(function(){
        window.location = $(this).val();
    });
    
	
	
	
    // halloweenBats({});
}

function show_content(){
    var scrolled = 0;
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
    var d = new Date();
    var n = d.getDay();
    var today_hours = getTodaysHours();
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours)
    $.each( getPropertyHours(), function(i,v){
        if(v.is_closed == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                $('.hours_today').text("Closed Today")
            }
        }
        if(v.is_holiday == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                console.log(v)
                var open_time = new Date (v.open_time);
                var close_time = new Date (v.close_time);
                v.open_time = convert_hour(open_time);
                v.close_time = convert_hour(close_time);
                v.h = v.open_time+ " - " + v.close_time;
                $('#hours_home').text(v.h)
            }
        }
    })
    
    var events = getEventsList();
    var news_exist = false;
    var contests_exist = false;
    $.each(events, function(i, v){
        if(($.inArray("news", v.tags) != -1) && showOnWeb(v)){
            news_exist = true;
        }
        if(($.inArray("contests", v.tags) != -1) && showOnWeb(v)){
            contests_exist = true;
        }
    })
    if (news_exist == false){
        $('.news_link').hide()
        $('option.news_link').remove()
        $('.plan_visit').css('width', '33.33333%')
    }
    if (contests_exist == false){
        $('.contest_link').hide()
        $('option.contest_link').remove()
        $('.spec_offer').css('width', '50%')
    }
    
    $('#stores_container').scroll(function(){
        if( $(this).scrollTop() == 0){
            $('#store_scroll_up').css('display', 'none')
        }
        else{
            $('#store_scroll_up').css('display', 'block')
        }
        if($('#stores_container')[0].scrollHeight == ($('#stores_container').scrollTop() + $('#stores_container').height()) ){
            $('#store_scroll_down').css('display', 'none')
        }
        else{
            $('#store_scroll_down').css('display', 'block')
        }
    })
    
    $('#stores_container').hover(
        function() {
            $('body').addClass("no_scroll");
        }, function() {
            $('body').removeClass( "no_scroll" );
        }
    );
    
    $('#store_scroll_down').click(function(e){
        e.preventDefault();
        scrolled = scrolled + 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    
    $('#store_scroll_up').click(function(e){
        e.preventDefault();
        scrolled = scrolled - 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    renderHomeHours('#home_hours_container3', '#home_hours_template3', getTodaysHours())
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        $('.main_row .col-md-6').addClass('full_width')
        var visible_row = 0
        var cat_id = $(this).attr('data-id');
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.hide();
        $('#no_promo_in_category').hide();
        $('.store_initial').hide();
        $('#cat_name_header').text($(this).text());
        $('#cat_name_header').css('display', 'block');
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
                visible_row++;
            }
        });
        if(visible_row == 0){
            $('#no_promo_in_category').show();
        }
        
        e.preventDefault();
    });
    $('.show_all_stores').click(function(e){
        $('.main_row .col-md-6').removeClass('full_width')
        $('#no_promo_in_category').hide();
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.show();
        $.each($('.store_initial'), function(i, val){
           if ($(val).text().length > 0){
               $(val).show();
           } 
        });
        $('#cat_name_header').hide();
        e.preventDefault();
    });
    
}

function show_pin(param){
	store_id = $(param).attr('store_id');
	if($("#"+store_id).is(":visible")){
		$("."+store_id).hide();				
		$("#"+store_id).hide();
		$("#no_pin_"+store_id).show();
		$("#show_pin_"+store_id).hide();
		$("#m_no_pin_"+store_id).show();
		$("#m_show_pin_"+store_id).hide();
	}else{
		$(".marker").hide();
		$("#"+store_id).show();
		$("#"+store_id).click();
		$("#no_pin_"+store_id).hide();
		$("#show_pin_"+store_id).show();
		$("#m_no_pin_"+store_id).hide();
		$("#m_show_pin_"+store_id).show();
	}
	$('.stores_table').hide()
	
	return false;
}
function drop_pin(id, map){

    var coords = map.get_coords(id);
    var height = parseInt(coords["height"])
    var width = parseInt(coords["width"])
    var x_offset = (parseInt(width) / 2);
    var y_offset = (parseInt(height) /2);
    
    map.setMarks([{ xy: [coords["x"] - 15 + x_offset, coords["y"] - 55 + y_offset],
              attrs: {
                        src:  '//codecloud.cdn.speedyrails.net/sites/57f7f01f6e6f647835890000/image/png/1463000912000/pin2.png'     // image for marker
                      }
        }
        ])
        // map.setViewBox(id);
        map.selectRegion(id);
}
    
function get_day(id){
    switch(id) {
        case 0:
            return ("Sun");
            break;
        case 1:
            return ("Mon");
            break;
        case 2:
            return ("Tue");
            break;
        case 3:
            return ("Wed");
            break;
        case 4:
            return ("Thu");
            break;
        case 5:
            return ("Fri");
            break;
        case 6:
            return ("Sat");
            break;
    }
}


function convert_hour(d){
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "PM"
    } else {
        i = "AM"
    }
    return h+":"+m+i;
}



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function get_month (id){
    var month = "";
    switch(id) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "Jun";
            break;
        case 6:
            month = "Jul";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
            
    }
    return month;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function sortByWebDate(a, b){
       
    var aDate = a.show_on_web_date;
    var bDate = b.show_on_web_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}

function dateToString(dateString){
    var datePart = dateString.split('T');
    var dateItem = datePart[0].split('-');
    var dateFormat = new Date(dateItem[0], dateItem[1]-1, dateItem[2]);
  
    return dateFormat.toDateString();
}

function sortByDate(a, b){
       
    var aDate = a.publish_date;
    var bDate = b.publish_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}

function load_more(num){
    var n = parseInt(num);
    for(i = n; i < n + 3; i++){
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    var posts = getBlogDataBySlug('').posts;
    var total_posts = posts.length;
    if(i >= total_posts){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function getAssetURL(id){
    var store_id = id;
    var store_assets = "https://billingsbridge.mallmaverick.com/api/v4/billings/stores/" + store_id + "/store_files.json"
    var store_front_image_url = "";    
    $.ajax({
        url: store_assets,
        dataType: 'json',
        async: false,
        success: function(data) {
            if(data.store_files.length > 0){
                store_front_image_url = data.store_files[0].url;
            }
        },
        error: function (data){
            store_front_image_url = "";
        }
    });
    
    return store_front_image_url;
}

function halloweenBats (options) {
	var Bat,
		bats = [],
		$body= $('body'),
		innerWidth = $body.innerWidth(),
		innerHeight = $body.innerHeight(),
		counter,
		defaults = {
			image: 'https://raw.githubusercontent.com/Artimon/jquery-halloween-bats/master/bats.png', // Path to the image.
			zIndex: 10000, // The z-index you need.
			amount: 9, // Bat amount.
			width: 35, // Image width.
			height: 20, // Animation frame height.
			frames: 4, // Amount of animation frames.
			speed: 20, // Higher value = faster.
			flickering: 15 // Higher value = slower.
		};

	options = $.extend({}, defaults, options);

	Bat = function () {
		var self = this,
			$bat = $('<div class="halloweenBat"/>'),
			x,
			y,
			tx,
			ty,
			dx,
			dy,
			frame;

		/**
		 * @param {string} direction
		 * @returns {number}
		 */
		self.randomPosition = function (direction) {
			var screenLength,
				imageLength;

			if (direction === 'horizontal') {
				screenLength = innerWidth;
				imageLength = options.width;
			}
			else {
				screenLength = innerHeight;
				imageLength = options.height;
			}

			return Math.random() * (screenLength - imageLength);
		};

		self.applyPosition = function () {
			$bat.css({
				left: x + 'px',
				top: y + 'px'
			});
		};

		self.move = function () {
			var left,
				top,
				length,
				dLeft,
				dTop,
				ddLeft,
				ddTop;

			left = tx - x;
			top = ty - y;

			length = Math.sqrt(left * left + top * top);
			length = Math.max(1, length);

			dLeft = options.speed * (left / length);
			dTop = options.speed * (top / length);

			ddLeft = (dLeft - dx) / options.flickering;
			ddTop = (dTop - dy) / options.flickering;

			dx += ddLeft;
			dy += ddTop;

			x += dx;
			y += dy;

			x = Math.max(0, Math.min(x, innerWidth - options.width));
			y = Math.max(0, Math.min(y, innerHeight - options.height));

			self.applyPosition();

			if (Math.random() > 0.95 ) {
				tx = self.randomPosition('horizontal');
				ty = self.randomPosition('vertical');
			}
		};

		self.animate = function () {
			frame += 1;

			if (frame >= options.frames) {
				frame -= options.frames;
			}

			$bat.css(
				'backgroundPosition',
				'0 ' + (frame * -options.height) + 'px'
			);
		};


		x = self.randomPosition('horizontal');
		y = self.randomPosition('vertical');
		tx = self.randomPosition('horizontal');
		ty = self.randomPosition('vertical');
		dx = -5 + Math.random() * 10;
		dy = -5 + Math.random() * 10;

		frame = Math.random() * options.frames;
		frame = Math.round(frame);

		$body.append($bat);
		$bat.css({
			position: 'absolute',
			left: x + 'px',
			top: y + 'px',
			zIndex: options.zIndex,
			width: options.width + 'px',
			height: options.height + 'px',
			backgroundImage: 'url(' + options.image + ')',
			backgroundRepeat: 'no-repeat'
		});

		window.setInterval(self.move, 40);
		window.setInterval(self.animate, 200);
	};

	for (counter = 0; counter < options.amount; ++counter) {
		bats.push(new Bat());
	}

	$(window).resize(function() {
		innerWidth = $body.innerWidth();
		innerHeight = $body.innerHeight();
	});
};
