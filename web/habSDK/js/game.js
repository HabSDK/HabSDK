var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor;

BasicGame.Boot.prototype =
    {
        preload: function () {

            object_types = [] // load this from server?
            $.ajax({
            url: "resources/object_types.json",
            dataType: "json",
            success: function(response) {
                $.each(response, function(index, object_type) {
                    for (dir in [0, 1, 2, 3]) {
                        game.load.image('tile', './resources/sprites/' + object_type.name + '_' + dir + '.png');
                    }
                })}
            });

            game.load.image('tile', './resources/sprites/rocket_tiny.png');

            game.time.advancedTiming = true;

            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game));

            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);



        },
        create: function () {

            // Create a group for our tiles.
            isoGroup = game.add.group();

            // Let's make a load of tiles on a grid.
            this.spawnTiles();

            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();

            game.stage.backgroundColor = "#4488AA";
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);

            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            isoGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                // If it does, do a little animation and tint change.
                if (!tile.selected && inBounds) {
                    tile.selected = true;
                    tile.tint = 0x86bfda;
                    game.add.tween(tile).to({ isoZ: 400 }, 150, Phaser.Easing.Quadratic.InOut, true);
                }
                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    tile.tint = 0xffffff;
                    game.add.tween(tile).to({ isoZ: 0 }, 600, Phaser.Easing.Quadratic.InOut, true);
                }
            });
        },
        render: function () {
            //game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
            game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        },
        spawnTiles: function () {
            var tile;
            for (var xx = 0; xx < 512; xx += 20) {
                for (var yy = 0; yy < 512; yy += 20) {
                    // Create a tile using the new game.add.isoSprite factory method at the specified position.
                    // The last parameter is the group you want to add it to (just like game.add.sprite)
                    tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
                    tile.anchor.set(0.5, 0);
                }
            }
        }
    };

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
