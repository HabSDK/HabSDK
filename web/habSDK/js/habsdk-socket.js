class HabSDKSocket {
  constructor(url) {
    this.url = url;
    this.sock = null;
    this.reconnect = null;
    this.connected = false;

    this.rx_callbacks = [];
    this.connect();
  }
  
  // Boolean of whether websocket is connected or not
  connected() {
    return this.connected;
  }

  // Internal helper function for websocket data push
  push(uri, data) {
    this.sock.send(JSON.stringify({'uri':uri,'data':data}));
  }

  // Set callback for server-commanded reload
  // cb(data) - callback for server-commanded reload
  on_reloadCommand(cb) {
    this.rx_callbacks['command_reload'] = cb;
  }

  // Submit request for leaderboard
  // cb(data) - callback for leaderboard response data
  request_leaderboard(cb) {
    if(!this.connected)
    {
      setTimeout(this.request_leaderboard.bind(this,cb),100);
      return;
    }
    this.rx_callbacks['leaderboard'] = cb;
    this.push('get:leaderboard',null);
  }
 
  // Submit user map for analysis and scoring
  // user - name of user (string)
  // map - user map data (object)
  // cb(data) - callback for scoring response data
  submit_map(user, map, cb) {
    if(!this.connected)
    {
      setTimeout(this.submit_map.bind(this,user,map,cb),100);
      return;
    }
    this.rx_callbacks['map_result'] = cb;
    this.push('post:user_map',{'user':user, 'map_data':map, 'timestamp':(new Date()).toISOString()});
  }

  // Request user map from previously submitted / high score
  // user - name of user (string)
  // timestamp - Date() of user map (Date())
  // cb(data) - callback for user map data
  request_user_map(user, timestamp, cb) {
    if(!this.connected)
    {
      setTimeout(this.request_user_map.bind(this,user,timestamp,cb),100);
      return;
    }
    this.rx_callbacks['user_map'] = cb;
    this.push('get:user_map',{'user':user,'timestamp':timestamp.toISOString()});
  }


  // Make connection to websocket
  // cb() - optional callback for successful connection
  connect(cb) {
    if("WebSocket" in window)
    {
      if(this.sock != null)
      {
        return;
      }
  
      if (typeof MozWebSocket != "undefined")
      {
        this.sock = new MozWebSocket(this.url);
      }
      else
      {
        this.sock = new WebSocket(this.url);
      }
  
      try
      {
        this.sock.onopen = function()
        {
          window.clearInterval(this.reconnect);
          this.reconnect = null;
          this.connected = true;
          if (cb != null) { cb() };
        }.bind(this);
  
        this.sock.onmessage = function(msg)
        {
          var message = JSON.parse(msg.data);
          //console.log(message);
          if(typeof this.rx_callbacks[message.uri] != "undefined")
          {
            this.rx_callbacks[message.uri](message.data);
            delete this.rx_callbacks[message.uri];
          }
        }.bind(this);
  
        this.sock.onclose = function()
        {
          this.connected = false;
          this.sock.close();
          this.sock = null;

          if(!this.reconnect)
          {
            this.reconnect = setInterval(this.connect.bind(this),500);
          }
        }.bind(this);
      }
      catch(exception)
      {
        console.log("Websocket Error" + exception);  
      }
    }
    else
    {
      console.log("Websockets not supported in your browser!");
    }
  }
}
