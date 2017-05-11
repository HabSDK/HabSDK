'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HabSDKSocket = function () {
  function HabSDKSocket(url) {
    _classCallCheck(this, HabSDKSocket);

    this.url = url;
    this.sock = null;
    this.reconnect = null;
    this.connected = false;

    this.rx_callbacks = [];
    this.connect();
  }

  // Boolean of whether websocket is connected or not


  _createClass(HabSDKSocket, [{
    key: 'connected',
    value: function connected() {
      return this.connected;
    }

    // Internal helper function for websocket data push

  }, {
    key: 'push',
    value: function push(uri, data) {
      this.sock.send(JSON.stringify({ 'uri': uri, 'data': data }));
    }

    // Set callback for server-commanded reload
    // cb(data) - callback for server-commanded reload

  }, {
    key: 'on_reloadCommand',
    value: function on_reloadCommand(cb) {
      this.rx_callbacks['command_reload'] = cb;
    }

    // Set callback for new leaderboard broadcast
    // cd(data) - callback for leaderboard data
    // WARNING: Clears request_leaderboard callback

  }, {
    key: 'on_leaderboard',
    value: function on_leaderboard(cb) {
      this.rx_callbacks['leaderboard'] = cb;
    }

    // Submit request for leaderboard
    // cb(data) - callback for leaderboard response data
    // WARNING: Clears on_leaderboard callback

  }, {
    key: 'request_leaderboard',
    value: function request_leaderboard(cb) {
      if (!this.connected) {
        setTimeout(this.request_leaderboard.bind(this, cb), 100);
        return;
      }
      this.rx_callbacks['leaderboard'] = cb;
      this.push('get:leaderboard', null);
    }

    // Submit user map for analysis
    // user - name of user (string)
    // map - user map data (object)
    // cb(data) - callback for scoring response data

  }, {
    key: 'submit_map',
    value: function submit_map(user, map, cb) {
      if (!this.connected) {
        setTimeout(this.submit_map.bind(this, user, map, cb), 100);
        return;
      }
      this.rx_callbacks['map_result'] = cb;
      this.push('post:user_map', { 'user': user, 'map_data': map, 'timestamp': new Date().toISOString() });
    }

    // Submit user map for leaderboard
    // user - name of user (string)
    // map - user map data (object)
    // cb(data) - callback for scoring response data

  }, {
    key: 'submit_score',
    value: function submit_score(user, map, cb) {
      if (!this.connected) {
        setTimeout(this.submit_map.bind(this, user, map, cb), 100);
        return;
      }
      this.rx_callbacks['map_result'] = cb;
      this.push('post:user_score', { 'user': user, 'map_data': map, 'timestamp': new Date().toISOString() });
    }

    // Request user map from previously submitted / high score
    // user - name of user (string)
    // timestamp - Date() of user map (Date())
    // cb(data) - callback for user map data

  }, {
    key: 'request_user_map',
    value: function request_user_map(user, timestamp, cb) {
      if (!this.connected) {
        setTimeout(this.request_user_map.bind(this, user, timestamp, cb), 100);
        return;
      }
      this.rx_callbacks['user_map'] = cb;
      this.push('get:user_map', { 'user': user, 'timestamp': timestamp.toISOString() });
    }

    // Make connection to websocket
    // cb() - optional callback for successful connection

  }, {
    key: 'connect',
    value: function connect(cb) {
      if ("WebSocket" in window) {
        if (this.sock != null) {
          return;
        }

        if (typeof MozWebSocket != "undefined") {
          this.sock = new MozWebSocket(this.url);
        } else {
          this.sock = new WebSocket(this.url);
        }

        try {
          this.sock.onopen = function () {
            window.clearInterval(this.reconnect);
            this.reconnect = null;
            this.connected = true;
            if (cb != null) {
              cb();
            };
          }.bind(this);

          this.sock.onmessage = function (msg) {
            var message = JSON.parse(msg.data);
            //console.log(message);
            if (typeof this.rx_callbacks[message.uri] != "undefined") {
              this.rx_callbacks[message.uri](message.data);
              delete this.rx_callbacks[message.uri];
            }
          }.bind(this);

          this.sock.onclose = function () {
            this.connected = false;
            this.sock.close();
            this.sock = null;

            if (!this.reconnect) {
              this.reconnect = setInterval(this.connect.bind(this), 500);
            }
          }.bind(this);
        } catch (exception) {
          console.log("Websocket Error" + exception);
        }
      } else {
        console.log("Websockets not supported in your browser!");
      }
    }
  }]);

  return HabSDKSocket;
}();
