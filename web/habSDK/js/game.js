var game = new Phaser.Game(1024, 600, Phaser.CANVAS, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor, menu,upButton,downButton,selectedCube,spriteResources;

BasicGame.Boot.prototype =
    {
        preload: function () {
            spriteResources = [];
            object_types = [] // load this from server?
            // $.ajax({
            // url: "resources/object_types.json",
            // dataType: "json",
            // success: function(response) {
            //     $.each(response, function(index, object_type) {
            //         for (dir in [0, 1, 2, 3]) {
            //             var name = object_type.name + '_' + dir;
            //             game.load.image(name, './resources/sprites/' + name + '.png');
            //
            //             spriteResources = [name];//spriteResources.concat([name]);
            //         }
            //     })}
            // });
            for (var i = 0; i<16; i++){
                game.load.image('tile'+i,'./resources/sprites/cube.png');
                spriteResources = spriteResources.concat(['tile'+i]);
            }
            game.load.image('tile', './resources/sprites/cube.png');

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
            this.createMenu();
            this.handleKeyPress();

            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();

            game.stage.backgroundColor = "#4488AA";

            //game.input.keyboard.addCallbacks(this, null, null, keyPress);
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);

            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            isoGroup.forEach(function (tile) {
                //var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                var inBounds = (tile == selectedCube);
                // If it does, do a little animation and tint change.
                if (!tile.selected && inBounds) {
                    tile.selected = true;
                    var targetHeight = tile.isoZ+2;
                    game.add.tween(tile).to({ isoZ: targetHeight }, 150, Phaser.Easing.Quadratic.InOut, true);
                }

                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    var targetHeight = tile.isoZ-2;
                    game.add.tween(tile).to({ isoZ: targetHeight }, 600, Phaser.Easing.Quadratic.InOut, true);
                }
                if (tile.selected){
                    //tile.tint = 0x86bfda;
                    tile.alpha = 1;
                } else {
                    //tile.tint = 0xffffff;
                    tile.alpha = 0.4;
                }
            });
        },
        render: function () {
            //game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
            game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
            game.debug.geom(menu,'rgba(100, 100, 100, 0.3)');
        },
        spawnTiles: function () {

            for (var xx = 0; xx < 512; xx += 20) {
                for (var yy = 0; yy < 512; yy += 20) {
                    this.createNewSprite('tile',xx,yy,0);
                }
            }
        },
        createNewSprite: function(type,x,y,z){
            // Create a tile using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            var tile = game.add.isoSprite(x, y, z, type, 0, isoGroup);
            tile.anchor.set(0.5, 0);
            tile.inputEnabled = true;
            tile.alpha = 0.4;
            tile.events.onInputDown.add(function(s){
                console.log('clicked');
                selectedCube = s;
            });
            selectedCube = tile;
            return tile;
        },
        createButton: function(x,y,width,height,colour,event){
            var graphics = game.add.graphics(0, 0);
            graphics.beginFill(colour);
            graphics.drawRect(x,y,width,height);
            graphics.inputEnabled = true;
            graphics.input.useHandCursor = true;
            graphics.events.onInputUp.add(event, this);
        },
        createMenu: function(){
            menu = new Phaser.Rectangle(1024-100, 0, 100, 600); //new Phaser.Rectangle(50,768,1024-50,0);

            //upButton.events.onInputDown.add(function(){menuItems.x++});
            //  The platforms group contains the ground and the 2 ledges we can jump on
            var menuItems = game.add.group();
            this.createButton(1024-100, 600-50, 100, 50,'0xffffff',function(){menuItems.y=Math.max(-spriteResources.length*50,menuItems.y-20)});
            this.createButton(1024-100, 0, 100, 50,'0xffffff',function(){menuItems.y=Math.min(0,menuItems.y+20)});
            //
            var cubeSprite = menuItems.create(50-10,70,'tile');
            cubeSprite.inputEnabled = true;
            cubeSprite.events.onInputDown.add(function(){this.createNewSprite('tile',0,0,5);}, this);
            var i = 0;
            spriteResources.forEach(function(element) {
                var sprite = menuItems.create(50-10,120+50*i,element);
                sprite.inputEnabled = true;
                sprite.tint = Math.random() * 0xffffff;'//rgb('+(i*64)%256+','+(i*64+85)%256+','+(i*64+170)%256+')';
                sprite.events.onInputDown.add(function(){
                    console.log("clicked");
                    var createdComponent = BasicGame.Boot.prototype.createNewSprite(element,0,0,5);
                    createdComponent.tint = sprite.tint;
                    }, this);
                i++;
            });

            //  Allow dragging - the 'true' parameter will make the sprite snap to the center
            //sprite.input.enableDrag(true);
            //menuItems.addChild(menu);
            menuItems.x = 1024-100;
        },


        handleKeyPress: function (){
            var back = function moveBack () {
                selectedCube.isoY -=20;
                selectedCube.isoX -=20;
            }
            var left = function moveLeft () {
                selectedCube.isoX -= 20;
            }
            var right = function moveRight () {
                selectedCube.isoY -= 20;
            }
            var forward = function moveForward () {
                selectedCube.isoX +=20;
                selectedCube.isoY +=20;
            }
            var up = function moveUp () {
                selectedCube.isoZ +=20;
            }
            var down = function moveDown () {
                selectedCube.isoZ -=20;
            }
            var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
            upKey.onDown.add(back, this);
            var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            downKey.onDown.add(forward, this);
            var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            leftKey.onDown.add(left, this);
            var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
            rightKey.onDown.add(right, this);
            var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
            wKey.onDown.add(back, this);
            var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
            sKey.onDown.add(forward, this);
            var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
            aKey.onDown.add(left, this);
            var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
            dKey.onDown.add(right, this);
            var qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            qKey.onDown.add(up, this);
            var eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
            eKey.onDown.add(down, this);

        }
    };

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
