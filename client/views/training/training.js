Template.training.helpers({
  levelId: function() {
    console.log(Router.current().params.query.id);
    return Router.current().params.query.id;
  }  
});

Template.training.rendered = function() {
  function render(obj) {
    var templateScript = $("#templateHeader").html();
    var template = Handlebars.compile(templateScript);        
    var output = template(obj);
    console.log(output);
    $('#header').html(output);
    var world = obj.drawWorld(obj.world);
    $('#worldContainer').html(world);
  }

  var defaults = {
    worldName : "Space Miner",
    explorerName : "Ninja Coder",
    numberOfLives : 1,
    enableEnemyRespawn : true,
    sprites: {
      tile: "plasma.png",
      enemy: "brainBlue.png",
      coin: "blue.png",
      gem: "pinkGem.png",
      player: "dark.png"
    },
    world: [
      ['e', 'g', 'c', 'c', 'c', 'e', 'g', 'c', 'c', 'c', 'e', 'g', 'c', 'c', 'c', 'c', 'c', 'c', 'g'],
      ['c', 'c', 't', 't', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 't', 't', 't', 'c', 't', 'c'],
      ['c', 'c', 't', 't', 'c', 't', 'g', 't', 't', 't', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
      ['c', 'c', 't', 't', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
      ['c', 'c', 't', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
      ['c', 'c', 'g', 't', 'c', 't', 'c', 'c', 'c', 'g', 't', 't', 'c', 'c', 't', 't', 't', 't', 'c'],
      ['c', 'c', 't', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 'g', 't', 'c'],
      ['c', 'c', 't', 't', 'c', 'c', 'g', 'c', 'c', 'c', 't', 't', 'c', 't', 't', 't', 't', 't', 'c'],
      ['c', 'c', 'c', 't', 'c', 't', 't', 't', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
      ['c', 'c', 't', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 'c', 'c', 't', 'c'],
      ['c', 'c', 'c', 'c', 'c', 't', 'c', 'c', 'c', 'c', 't', 't', 'c', 'c', 'c', 't', 'c', 't', 'c'],
      ['c', 'c', 'p', 't', 'c', 'c', 'c', 'c', 'c', 'c', 'e', 't', 'c', 'c', 'c', 't', 'g', 't', 'g'],
    ],
      drawWorldCell: function(cell, rowNum, cellNum) {
      var spritesMap = {
      t : 'tile',
      p : 'player',
      e : 'enemy',
      g : 'gem',
      c : 'coin'
      };
      var spriteName = this.sprites[spritesMap[cell]];
    if (!spriteName) {
      spriteName = defaults.sprites[spritesMap[cell]];
    }
    var file = spritesMap[cell] + '/' + spriteName;
    return '<span class="worldCell" data-coords="' + rowNum + ':' + cellNum + '" style="background-image: url(http://supersonic-box-14-130414.use1.nitrousbox.com/images/spriteParts/' + file + ');"></span>';
    },
    drawWorldRow: function(row, rowNum) {
      var rowHtml = "<div class='worldRow'>";
      var that = this;
      row.forEach(function(cell, cellNum) {
        rowHtml += that.drawWorldCell(cell, rowNum, cellNum);
      });
      return rowHtml + '</div>\n';
    },
      drawWorld: function(world) {
        var worldHtml = '';
        var that = this;
        if (!_.isArray(world)) throw "world must be a valid array";
        if (world.length === 0) {
          world = defaults.world;
        }
        var worldCopy = JSON.parse(JSON.stringify(defaults.world));

        function copyRow(rowSource, rowTarget) {
          rowSource.forEach(function(cell, index) {
            rowTarget[index] = cell;
          });
        }
        if (_.isArray(world[0])) {
          world.forEach(function(row, rowIndex) {
            copyRow(row, worldCopy[rowIndex]);
          });
        } else {
          copyRow(world, worldCopy[0]);
        }
        // Now assure left and right borders are all tiles
        worldCopy.forEach(function(row) {
          row.push('t');
          row.unshift('t');
        });
        // And, the top and bottom rows are all tiles
        var borderRow = 'ttttttttttttttttttttt'.split('');
        worldCopy.push(borderRow);
        worldCopy.unshift(borderRow);

        worldCopy.forEach(function(row, rowNum) {
          worldHtml += that.drawWorldRow(row, rowNum);
        });
        return worldHtml;
      }
  };

  function toggleGrid() {
    $('.worldCell').toggleClass('worldCellBorder');
  }

  function toggleCoords() {
    $('.worldCell').toggleClass('worldCellCoords');
  }

  //render(defaults);
  $('#toggleGrid').click(toggleGrid);
  $('#toggleCoords').click(toggleCoords);

  // todo don't know if this is used
  /*
  function renderWorldMap() {
    var rows = 14;
    var cols = 21;

    var world = '';

    for(var rowNum = 0; rowNum < 14; rowNum++) {
      world += "<div class='worldRow'>";
      for(var colNum = 0; colNum < cols; colNum++) {
        world += "<span class='worldCell' data-coords='" + rowNum + "," + colNum + "'>&nbsp;</span>";
      }
      world += "</div>";
    }

    $('#worldMap').html(world);
  }
  */
}