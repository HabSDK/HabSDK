var game = new Phaser.Game(1024, 600, Phaser.CANVAS, 'test', null, true, false);

var BasicGame = function (game) { };
var habsdk_socket = new HabSDKSocket("wss://habsdk.co/api/");

BasicGame.Boot = function (game) { };

var isoGroup, isoFloor,toolTips, cursorPos, cursor, menu,upButton,downButton,selectedCube,spriteResources,menuItems;

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
            toolTips = [];
            // Create a group for our tiles.
            isoFloor = game.add.group();
            isoGroup = game.add.group();

            // Let's make a load of tiles on a grid.
            this.loadModel(null);
            this.spawnTiles();
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
                        object_types = response;
                        spriteResources[object_type.name]=[];
                        console.log("Registering "+object_type.name+" as object type.");
                        for (var i = 1; i <=4; i++) {
                            var name = object_type.name + '_' + i;
                            game.load.image(name, './resources/sprites/' + name + '.png');
                            spriteResources[object_type.name]=spriteResources[object_type.name].concat([name])
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
                if (tile == selectedCube) {
                    //tile.tint = 0x86bfda;
                    tile.alpha = 0.4;
                } else {
                    //tile.tint = 0xffffff;
                    tile.alpha = 1;
                }
            });
            game.iso.topologicalSort(isoGroup);
            toolTips.forEach(function (tip) {
                tip.x = tip.sprite.x - 200;
                tip.y = tip.sprite.y;
            });
            _this = this;

            isoFloor.forEach(function (tile) {
                var cube = visualToModelMap[selectedCube];
                if (cube != undefined) {
                    var lim = cube.get_limits();
                    //lim.min_point.x;
                    //console.log(_this.transform_model_to_visual(obj.x) , tile.isoX)
                    if (_this.transform_model_to_visual(lim.min_point).x > tile.isoX &&
                        _this.transform_model_to_visual(lim.max_point).x <= tile.isoX &&
                        _this.transform_model_to_visual(lim.min_point).y > tile.isoY &&
                        _this.transform_model_to_visual(lim.max_point).y <= tile.isoY) {
                        tile.selected = true;
                        tile.tint = 0x86bfda;
                    }
                    else{
                        tile.selected = false;
                        tile.tint = 0xffffff;
                    }

                }
            });
            if (selectedCube!=null) {
                game.camera.follow(selectedCube, new Phaser.Rectangle(100, 100, 824, 568));
            }
        },
        render: function () {
            //game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
            var colour = "#a7aebe";

            game.debug.text(game.time.fps || '--', 2, 14, colour);
            var object = visualToModelMap[selectedCube];
            if (object == null) game.debug.text("No cube selected :/", 2, 40, colour);
            else
            {
                game.debug.text(object.object_type_name, 2, 40, colour)
                game.debug.text("Position: "+object.position, 2, 60, colour);
                game.debug.text("Rotation: "+(object.rotation*90)+"°", 2, 80, colour);
            }
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
        loadModel: function(layout) {
            //var objects = layout.get_objects();
            var block = new HabObject();
            block.object_type_name = "block2x1";
            var objects = [
                block,
            ];
            objects.forEach(object => this.add_existing_object(object));
        },
        add_new_object: function(object_type_name, position) {
            console.log("Adding new object "+object_type_name);
            var object = new HabObject()
            object.object_type_name = object_type_name;
            object.position = position;
            this.add_existing_object(object);
        },
        add_existing_object: function(object) {
            console.log("Adding existing object "+object.object_type_name);
            var sprite_id = object.object_type_name+"_"+(object.rotation+1);
            var visual_position = this.transform_model_to_visual(object.position);
            var new_visual = this.createNewSprite(sprite_id,visual_position, this.get_object_offset(object));
            modelToVisualMap[object] = new_visual;
            visualToModelMap[new_visual] = object;
        },
        delete_existing_object: function(object) {
            console.log("Deleting existing object "+object.object_type_name+" to p:"+object.position+" r:"+object.rotation);
            var visual = modelToVisualMap[object];
            delete visualToModelMap[visual];
            delete modelToVisualMap[object];
            visual.destroy();
        },
        update_object: function(object) {
            console.log("Updating object "+object.object_type_name+" to p:"+object.position+" r:"+object.rotation);
            var visual = modelToVisualMap[object];
            delete visualToModelMap[visual];
            visual.destroy();
            var sprite_id = object.object_type_name+"_"+(object.rotation+1);
            var visual_position = this.transform_model_to_visual(object.position);
            var new_visual = this.createNewSprite(sprite_id, visual_position, this.get_object_offset(object));
            modelToVisualMap[object] = new_visual;
            visualToModelMap[new_visual] = object;
        },
        get_object_offset: function(object){
            var limits = object.get_object_type().limits;
            var x_offset = Math.max(limits.x, limits.y) * 0.1;
            if (object.rotation == 0 || object.rotation == 2) x_offset *= -1;
            var offset = new Point2D(x_offset, 0);
            console.log("offset:"+offset);
            return offset;
        },
        transform_model_to_visual: function(model_point){
            var visual_x = (40 - model_point.x) * 30;
            var visual_y = (40 - model_point.y) * 30;
            var visual_z = model_point.z * 30;
            return new Point3D(visual_x, visual_y, visual_z);
        },
        transform_visual_to_model: function(visual_point){
            var model_x = 40 + (visual_point.x / 30);
            var model_y = 40 + (visual_point.y / 30);
            var model_z = visual_point.z / 30;
            return new Point3D(model_x, model_y, model_z);
        },
        createNewSprite: function(type,point, sprite_offset){
            // Create a tile using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            var tile = game.add.isoSprite(point.x, point.y, point.z, type, 0, isoGroup);
            console.log("tile is of size: "+new Point2D(tile.x, tile.y))
            tile.anchor.set(sprite_offset.x, sprite_offset.y);
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


                var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

                var localKey = key;
                var sprite = game.add.sprite(0,70+100*i,localKey+"_1");
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
                     var pnt = new Point3D(20,20,3);
                    if (selectedCube != null)
                        pnt = visualToModelMap[selectedCube].position;
                    var createdComponent = _this.add_new_object(sp.key.substring(0, sp.key.length-2), pnt);
                    }, this);
                var tooltip = game.add.text(sprite.x-200,sprite.y,key,style);
                sprite.tooltip = tooltip;
                tooltip.sprite = sprite;
                tooltip.alpha = 0;
                toolTips.push(tooltip);
                sprite.events.onInputOver.add(function(sp){
                    sp.tooltip.alpha = 1.0;
                });
                sprite.events.onInputOut.add(function(sp){
                    sp.tooltip.alpha = 0.0;
                });
                //  Create the title after the sprite has been created
                var text = game.add.text(0,70+100*i,key,style)
                text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

                //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
                text.setTextBounds(0, 0, 100, 100);
                menuItems.push(text);
                i++;
            }

            //  Allow dragging - the 'true' parameter will make the sprite snap to the center
            menuItems.forEach(function(item){item.x = 1024-85});
            this.createButton(1024-100, 600-50, 100, 50,'0xffffff',function(sprite){
                //menuItems.y=Math.max(-spriteResources.length*50,menuItems.y-20);
                menuItems.forEach(function(item){item.y-=50});
            });
            this.createButton(1024-100, 0, 100, 50,'0xffffff',function(sprite){
                //menuItems.y=Math.min(0,menuItems.y+20);
                menuItems.forEach(function(item){item.y+=50});
            });
        },


        handleKeyPress: function (){
            var back = function moveBack () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.x += 1;
                this.update_object(object);
            }
            var left = function moveLeft () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.y -= 1;
                this.update_object(object);
            }
            var right = function moveRight () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.y += 1;
                this.update_object(object);
            }
            var forward = function moveForward () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.x -= 1;
                this.update_object(object);
            }
            var up = function moveUp () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.z += 1;
                this.update_object(object);
            }
            var down = function moveDown () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                object.position.z -= 1;
                this.update_object(object);
            }
            var copyIt = function copyObj () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                this.add_new_object(object, object.position);
            }
            var deleteIt = function deleteObj () {
                if (selectedCube == null) return;
                var object = visualToModelMap[selectedCube];
                this.delete_existing_object(object);
            }
            var rotate = function rot () {
                var object = visualToModelMap[selectedCube];
                object.rotation += 1;
                if (object.rotation > 3) object.rotation = 0;
                this.update_object(object);
            }
            var submitIt = function submit (){
            var map_data = new HabLayout();
            var room_type = new HabRoomType();
            room_type.name = "root";
            var poly = new Polygon();
            poly.points = [new Point2D(0,0), new Point2D(40,0), new Point2D(40,40), new Point2D(0,40)];
            room_type.floor_plan = poly;
            Object.keys(visualToModelMap).forEach(visual => room_type.objects.push(visualToModelMap[visual]));
            map_data.room_types[room_type.name] = (room_type);
            var room = new HabRoom();
            room.position = new Point2D(0,0,0);
            room.room_type_name = room_type.name;
            map_data.rooms.push(room);
            console.log("submitting");
            console.log(map_data);
            habsdk_socket.submit_map("test-user", map_data, function(data) { console.log(data); });
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
            var delKey = game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
            delKey.onDown.add(deleteIt, this);
            var fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
            fKey.onDown.add(copyIt, this);
            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.G);
            spaceKey.onDown.add(submitIt, this);
        },
    };

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
