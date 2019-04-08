$(function(){
	Galaxian();
});

function Galaxian() {
	this.enemy_width = 40;
	this.enemy_indent_x = 40;
	this.enemy_indent_y = 40;
	this.enemy_amount_y = 3;
	this.enemy_amount_x = 10;

	this.screen_width = $('#space').width();
	this.screen_height = $('#space').height();
	this.enemies_line_width = this.enemy_amount_x * (this.enemy_width + this.enemy_indent_x);
	this.enemy_pos_left_start = (this.screen_width - this.enemies_line_width) / 2;
	this.enemy_pos_top_start = 40;
	this.space = $('#space');
	this.aircraft = $('#aircraft');
	this.bullet_is_fly = false;
	var keys = {};
	this.is_fire_key_pressed = false;
	this.enemies = new Array;
	this.bullets = new Array;
	this.kill_enemies = new Array;
	this.timer = 0;
	
	this.timerId = setInterval(function() {
		aircraft();
		this.timer+=30;
	}, 30);

	create_enemies();
	
	function create_enemies() {
		var enemy = '';
		var index = 1;

		var pos_top = this.enemy_pos_top_start;
		var pos_left = this.enemy_pos_left_start;
		
		for (var y = 1; y <= this.enemy_amount_y; y++) {
			for (var x = 1; x <= this.enemy_amount_x; x++) {
				var id = 'enemy-' + index;
				
				enemy = '<div class="enemy" id="'+id+'"';
				enemy += ' style="top: ' + pos_top + 'px;';
				enemy += ' left: ' + pos_left + 'px"';
				enemy += '</div>';

				$('.enemy-territory').append(enemy);
				this.enemies[index] = {'top':pos_top, 'left':pos_left};
				
				pos_left += (this.enemy_width + this.enemy_indent_x);
				index++;
			}
			
			pos_left = this.enemy_pos_left_start;
			pos_top += this.enemy_indent_y;
		}
	}
	
	function aircraft() {
		$('.counter').text(this.kill_enemies.length);
		
		$(document).keydown(function(e) {
			var code = e.which;

			if (typeof(keys.code) == 'undefined') {
				if (code == 32 && !this.is_fire_key_pressed && $('.bullet').length == 0) {
					create_bullet();
					console.log('fire');
					this.is_fire_key_pressed = true;
				}

				keys[code] = 1;
			}
		});

		$(document).keyup(function(e) {
			var code =  e.which;
			
			if (code == 32) {
				this.is_fire_key_pressed = false;
			}

			if (typeof(keys.code) == 'undefined') {
				delete(keys[code]);
			}
		});

		aircraft_move();
		aircraft_bullet_move();
		
		
		function aircraft_move() {
			this.pos_top = this.new_pos_top = this.aircraft.position().top;
			this.pos_left = this.new_pos_left = this.aircraft.position().left;


			if(typeof(keys[65]) !== 'undefined') {//left
				this.aircraft.animate({left: this.pos_left - 5}, 0);
			} else if(typeof(keys[68]) !== 'undefined') {//right
				this.aircraft.animate({left: this.pos_left + 5}, 0);
			}
		}

		function create_bullet() {
			var bullet_pos_top = this.aircraft.position().top;
			var bullet_pos_left = this.aircraft.position().left + 18;
			
			var ballet_id = this.bullets.length + 1;
			
			this.bullet_html = '<div class="bullet" id="'+ballet_id+'" style="top: '
				+ bullet_pos_top +'px; left: ' + bullet_pos_left + 'px"></div>';
			this.space.append(this.bullet_html);
			
			this.bullets.push($('#'+ ballet_id));
		}

		function aircraft_bullet_move() {
			
			if (this.kill_enemies.length > 0) {
				this.kill_enemies.forEach(function(num_id, i, t) {
					if (num_id &&  this.timer > 100) {
						$('#enemy-' + num_id).remove();
						this.timer = 0;
						delete(this.kill_enemies[i]);
					}
				});
			}
			
			if ($('.bullet').length == 0) {
				return false;
			}
			
			this.bullets.forEach(function(item, bullet_index) {
				var bullet_pos_y = item.position().top;
				var bullet_pos_x = item.position().left;
				
				if (bullet_pos_y > 0) {
					this.enemies.forEach(function(item, index) {
						
						if (item && (bullet_pos_y <= item.top && bullet_pos_y >= item.top - 21)
							&& (bullet_pos_x >= item.left && bullet_pos_x <= item.left + 34)) {
							$('#' + 'enemy-' + index).addClass('killed-enemy');
							console.log('defeat');
							this.kill_enemies.push(index);
							this.timer = 0;
							this.enemies[index] = null;
							
							this.bullets[bullet_index].remove();
							delete(this.bullets[bullet_index]);
						}
					});
					
					if (typeof(item) !== 'undefined') {
						item.animate({top: bullet_pos_y - 10}, 0);
					}
					
					//this.bullet.animate({left: this.bullet_pos_x}, 0);
				} else {
					item.remove();
				}
			});
		}
	}
}