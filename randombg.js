function randombg(){
  var random= Math.floor(Math.random() * 6) + 0;
  var bigSize = ["url('assets/img/Backgrounds/forest_daytime_background.png')",
                 "url('assets/img/Backgrounds/grass_daytime_background.jpg')",
                 "url('assets/img/Backgrounds/ocean_daytime_background.jpg')",
                 "url('assets/img/Backgrounds/mountain_daytime_background.jpg')",
                 "url('assets/img/Backgrounds/snow_daytime_background.jpg')",
                 "url('assets/img/Backgrounds/indoor_background.jpg')"];
document.getElementById("battle-scence").style.backgroundImage=bigSize[random];

}