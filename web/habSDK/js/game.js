var game = new Phaser.Game(1024, 600, Phaser.CANVAS, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, isoFloor, cursorPos, cursor, menu,upButton,downButton,selectedCube,spriteResources,menuItems;

function saveModel() {
  //var layoutStruct = new HabLayout();
            
  isoGroup.children.forEach(function(sprite) {
    console.log(sprite);
    var sprite_type = sprite.key.split("_")[0];
    console.log(sprite_type);
    console.log(sprite.key);
    console.log(sprite.position);
    console.log(sprite.rotation);

  });
}

var modelToVisualMap = {};
var visualToModelMap = {};

BasicGame.Boot.prototype =
    {
        preload: function () {
            this.getResources();
            game.load.image('tile', './resources/sprites/cube.png');
            game.time.advancedTiming = true;
            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game));
            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);
            // In order to have the camera move, we need to increase the size of our world bounds.
            //game.world.setBounds(0, 0, 2048, 1024);
        },
        create: function () {
            // Create a group for our tiles.
            isoFloor = game.add.group();
            isoGroup = game.add.group();

            // Let's make a load of tiles on a grid.
            this.loadModel(null);
            //this.spawnTiles();
            this.createMenu();
            this.handleKeyPress();
            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();
            game.stage.backgroundColor = "#4488AA";
        },

        getResources: function(){
            spriteResources = new Object();
            $.ajax({
                url: "resources/object_types.json",
                dataType: "json",
                success: function(response) {
                    $.each(response, function(index, object_type) {
                        spriteResources[object_type.name]=[];
                        for (var i = 1; i <=4; i++) {
                            var name = object_type.name + '_' + i;
                            game.load.image(name, './resources/sprites/' + name + '.png');

                            spriteResources[object_type.name]=spriteResources[object_type.name ].concat([name])
                        }
                    })}
            });
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
                    //var targetHeight = tile.isoZ+2;
                    //game.add.tween(tile).to({ isoZ: targetHeight }, 150, Phaser.Easing.Quadratic.InOut, true);
                }

                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    //var targetHeight = tile.isoZ-2;
                    //game.add.tween(tile).to({ isoZ: targetHeight }, 600, Phaser.Easing.Quadratic.InOut, true);
                }
                if (tile == selectedCube){
                    //tile.tint = 0x86bfda;
                    tile.alpha = 0.4;
                } else {
                    //tile.tint = 0xffffff;
                    tile.alpha = 1;
                }
            });
            game.iso.topologicalSort(isoGroup);
            //game.camera.follow(selectedCube,new Phaser.Rectangle(100,100,824,568));
        },
        render: function () {
            //game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
            var colour = "#a7aebe";

            game.debug.text(game.time.fps || '--', 2, 14, colour);

            var object = modelToVisualMap[selectedCube];
            if (object == null) game.debug.text("No cube selected :/", 2, 40, colour);
            else game.debug.text(object.object_type_name+" : "+object.position, 2, 40, colour);

            menuItems.forEach(function(item){
                game.debug.body(item,'rgba(255, 255, 0, 0.1)');
            });
        },
        spawnTiles: function () {
            for (var xx = 0; xx < 30*40; xx += 30) {
                for (var yy = 0; yy < 30*40; yy += 30) {
                    this.createFloor('tile',xx,yy,0);
                }
            }
        },
        loadModel: (layout) => {
            //var objects = layout.get_objects();
            var block = new HabObject();
            block.object_type_name = "block2x1";
            var objects = [
                block,    
            ];
            objects.forEach(object => add_existing_object(object));            
        },

        add_new_object: (object_type_name) => {
            var object = new HabObject()
            object.object_type_name = object_type_name;
            this.add_existing_object(object);
        },
        add_existing_object: (object) => {
            var tile = createNewSprite(object.object_type_name,object.x,object.y,object.z);
            this.modelToVisualMap[object] = tile;
            this.visualToModelMap[tile] = object;
        },
        createNewSprite: function(type,x,y,z){
            // Create a tile using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            var tile = game.add.isoSprite(x, y, z, type, 0, isoGroup);
            tile.anchor.set(0.5, 0);
            tile.inputEnabled = true;
            tile.alpha = 0.8;
            tile.events.onInputDown.add(function(s){
                selectedCube = tile;
            });
            selectedCube = tile;
            return tile;
        },
        createFloor: function(type,x,y,z){
            // Create a tile using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            var tile = game.add.isoSprite(x, y, z, type, 0, isoFloor);
            tile.anchor.set(0.5, 0);
            tile.alpha = 1.0;
            return tile;
        },
        createButton: function(x,y,width,height,colour,event){
            var graphics = game.add.graphics(0, 0);
            graphics.beginFill(colour,1.0);
            graphics.drawRect(x,y,width,height);
            graphics.inputEnabled = true;
            graphics.text = "BUTTON";
            graphics.input.useHandCursor = true;
            graphics.events.onInputUp.add(event, this);
            return graphics;
        },
        createBackground: function(x,y,width,height,colour){
            var graphics = game.add.graphics(0, 0);
            graphics.beginFill(colour,1.0);
            graphics.drawRect(x,y,width,height);
            return graphics;
        },
        createSelectedItem: () => {
            selected_item_infomation = game.add.graphics(20, 20);
            selected_item_infomation.beginFill(0xffffff,1.0);
            selected_item_infomation.drawRect(20,20,100,100);
            selected_item_infomation.drawRect
            return graphics
        },
        createMenu: function(){
            //  The platforms group contains the ground and the 2 ledges we can jump on
            menuItems = []
            var background = this.createBackground(1024-100, 0, 100, 600,'0xffffff');
            background.alpha = 0.3;

            // var cubeSprite = menuItems.create(50-10,70,'tile');
            // cubeSprite.inputEnabled = true;
            // cubeSprite.events.onInputDown.add(function(){this.createNewSprite('tile',0,0,5);}, this);
            var i = 0;
            for (var key in spriteResources){
                var localKey = key;
                var sprite = game.add.sprite(0,70+100*i,localKey+'_1');
                menuItems.push(sprite);
                var _this = this;
                var maxDimension = Math.max(sprite.height,sprite.width);
                var scaleFactor = maxDimension/100;

                sprite.scale.set(1/scaleFactor);
                //sprite.tint = Math.random() * 0xffffff;'//rgb('+(i*64)%256+','+(i*64+85)%256+','+(i*64+170)%256+')';
                sprite.inputEnabled = true;
                //  Check the pixel data of the sprite
                sprite.input.pixelPerfectOver = true;

                //  Enable the hand cursor
                sprite.input.useHandCursor = true;
                sprite.events.onInputDown.add(function(sp){
                    var createdComponent = _this.add_new_object(sp.key,0,0,30);
                    createdComponent.tint = sp.tint;
                    }, this);
                i++;
            }

            //  Allow dragging - the 'true' parameter will make the sprite snap to the center
            menuItems.forEach(function(item){item.x = 1024-85});
            this.createButton(1024-100, 600-50, 100, 50,'0xffffff',function(sprite){
                //menuItems.y=Math.max(-spriteResources.length*50,menuItems.y-20);
                menuItems.forEach(function(item){item.y-=20});
            });
            this.createButton(1024-100, 0, 100, 50,'0xffffff',function(sprite){
                //menuItems.y=Math.min(0,menuItems.y+20);
                menuItems.forEach(function(item){item.y+=20});
            });
        },


        handleKeyPress: function (){
            var back = function moveBack () {
                selectedCube.isoX -=30;
            }
            var left = function moveLeft () {
                selectedCube.isoY += 30;
            }
            var right = function moveRight () {
                selectedCube.isoY -= 30;
            }
            var forward = function moveForward () {
                selectedCube.isoX +=30;
            }
            var up = function moveUp () {
                selectedCube.isoZ +=30;
            }
            var down = function moveDown () {
                selectedCube.isoZ -=30;
            }
            var rotate = function rot () {
                var num = selectedCube.key.charAt(selectedCube.key.length-1);
                var baseString = selectedCube.key.slice(0, selectedCube.key.length-1);
                var oldCube = selectedCube;
                this.createNewSprite(baseString+(parseInt(num)%4+1),selectedCube.isoX,selectedCube.isoY,selectedCube.isoZ);
                oldCube.destroy();
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
            var rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
            rKey.onDown.add(rotate, this);
        }
    };

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
