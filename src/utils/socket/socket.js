/* eslint-disable */
function WS(opts) {
  const ext = function() {
    let target = arguments[0] || {};
    let i = 1;
    let length = arguments.length;
    let deep = false;
    let options;
    let name;
    let src;
    let copy;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    if (length === i) {
      target = this;
      --i;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (typeof copy === "object" || Array.isArray(copy)) && !copy.nodeType) {
            const clone = src && (typeof src === "object" || Array.isArray(src)) ? src : Array.isArray(copy) ? [] : {};
            target[name] = ext(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  opts = ext(
    {
      url: "",
      protocols: [],
      reconnect: true,
      reconnectInterval: 1000,
      reconnectDecay: 1.5,
      timeoutInterval: 10000,
      onopen: function() {},
      onclose: function() {},
      onmessage: function() {},
      onerror: function() {},
      onconnecting: function() {},
      debug: false
    },
    opts || {}
  );
  if (/^wss?:\/\/.*$/g.test(opts.url)) {
    this.url = opts.url;
  } else {
    if (/^https?:\/\/.*$/g.test(opts.url)) {
      this.url = opts.url.replace(/^http/, "ws");
    } else if (opts.url.indexOf("/") === 0) {
      this.url = window.location.protocol.replace(/^http/, "ws") + "//" + window.location.host + opts.url;
    } else {
      this.url = window.location.href.replace(/^http/, "ws");
      this.url = this.url.substring(0, this.url.lastIndexOf("/") + 1) + opts.url;
    }
  }
  this.protocols = opts.protocols;
  this.readyState = WS.CONNECTING;

  const self = this;
  let ws = null;
  let reconnectAttempts = 0;
  let forcedClose = false;
  let timedOut = false;

  const defaultTarget = "SockJS";
  if ("target" in opts && opts.target === "SockJS") {
    this.target = defaultTarget;
  } else {
    if ("WebSocket" in window) {
      this.target = "WebSocket";
    } else if ("MozWebSocket" in window) {
      this.target = "MozWebSocket";
    } else {
      this.target = defaultTarget;
    }
  }

  function getTargetWS() {
    if (self.target === defaultTarget) {
      // return new window[defaultTarget](self.url.replace(/^ws/, 'http'), null, {
      //   protocols_whitelist: ['jsonp-polling']
      // })
      console.log("Websocket is not supported in your browser");
    }
    return new window[self.target](self.url, self.protocols);
  }

  function connect(reconnectAttempt) {
    ws = getTargetWS();
    if (!reconnectAttempt) {
      opts.onconnecting();
    }
    if (opts.debug) {
      console.log("WebSocket", "attempt-connect", self.url);
    }

    const localWs = ws;
    const timeout = setTimeout(function() {
      if (opts.debug) {
        console.log("WebSocket", "connection-timeout", self.url);
      }
      timedOut = true;
      localWs.close();
      timedOut = false;
    }, opts.timeoutInterval);

    ws.onopen = function(event) {
      clearTimeout(timeout);
      if (opts.debug) {
        console.log("WebSocket", "onopen", self.url);
      }
      self.readyState = WS.OPEN;
      reconnectAttempt = false;
      reconnectAttempts = 0;
      opts.onopen(event);
    };

    ws.onclose = function(event) {
      clearTimeout(timeout);
      ws = null;
      if ((event.code && !opts.reconnect) || forcedClose) {
        self.readyState = WS.CLOSED;
        if (opts.debug) {
          console.log("WebSocket", "onclose", self.url, event.code);
        }
        opts.onclose(event);
      } else {
        self.readyState = WS.CONNECTING;
        opts.onconnecting();
        if (!reconnectAttempt && !timedOut) {
          if (opts.debug) {
            console.log("WebSocket", "onclose", self.url, event.code);
          }
          opts.onclose(event);
        }
        if (!reconnectAttempt && self.target !== defaultTarget && !event.code) {
          self.target = defaultTarget;
          connect(false);
        } else {
          setTimeout(function() {
            reconnectAttempts++;
            connect(true);
          }, opts.reconnectInterval * Math.pow(opts.reconnectDecay, reconnectAttempts));
        }
      }
    };
    ws.onmessage = function(event) {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        data = {
          data: event.data
        };
      }
      if (opts.debug) {
        console.log("WebSocket", "onmessage", self.url, data);
      }
      opts.onmessage(data, event);
    };
    ws.onerror = function(event) {
      if (opts.debug) {
        console.log("WebSocket", "onerror", self.url, event);
      }
      opts.onerror(event);
    };
  }
  connect(false);

  this.send = function(data) {
    if (ws) {
      if (opts.debug) {
        console.log("WebSocket", "send", self.url, data);
      }
      const type = typeof data;
      if (type === "undefined") {
        data = "null";
      } else if (type !== "string") {
        data = JSON.stringify(data);
      }
      return ws.send(data);
    } else {
      console.log("INVALID_STATE_ERR : Pausing to reconnect websocket");
    }
  };

  this.close = function() {
    forcedClose = true;
    this.refresh();
  };

  /**
   * Additional public API method to refresh the connection if still open (close, re-open).
   * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
   */
  this.refresh = function() {
    if (ws) {
      ws.close();
    }
  };
}
WS.CONNECTING = 0;
WS.OPEN = 1;
WS.CLOSING = 2;
WS.CLOSED = 3;
WS.prototype.CONNECTING = 0;
WS.prototype.OPEN = 1;
WS.prototype.CLOSING = 2;
WS.prototype.CLOSED = 3;

export default WS;
