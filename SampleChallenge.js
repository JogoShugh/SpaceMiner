function pickUpGems(startX, startY) {
  var count = 0;
  game.player.move(startX + ' ' + startY);
 
  function getThoseGems() {
    if (count <= 5) {      
      game.player.move(count * 3 + ' 0', '11 d', '1 r', '11 u', getThoseGems);
    } else {
      count = 0;
      game.player.move(startX + ' ' + startY);
      alert('Done!');
    }
    count++;    
  }
  
  getThoseGems();
}
 
pickUpGems(0, 0);
