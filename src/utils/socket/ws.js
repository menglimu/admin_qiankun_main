/* eslint-disable */

import Sock from "./socket.js";
const EventEmitter = require("events");

function urlTemplate(template, data) {
  let tpl = template;
  if (!data || (data && Object.keys(data).length === 0)) return tpl;
  Object.keys(data).forEach(key => {
    tpl = tpl.replace(new RegExp("{\\s*(" + key + ")\\s*}", "gim"), function($1, $2) {
      if ($2 === key) return data[key];
    });
  });
  return tpl;
}
class WS extends EventEmitter {
  constructor(opts) {
    super();
    this.opts = opts || {};
    this.init();
  }
  init() {
    if (this.ws) this.ws.close();

    const { host = window.VUE_APP_SOCKET_URL, url = "", data = {}, debug = false } = this.opts;

    const path = data && Object.keys(data).length ? urlTemplate(url, data) : url;

    if (/^wss?:\/\/.*$/g.test(path)) {
      this.url = path;
    } else {
      if (/^https?:\/\/.*$/g.test(path)) {
        this.url = path.replace(/^http/, "ws");
      } else {
        this.url = window.location.protocol.replace(/^http/, "ws") + "//" + host + path;
      }
    }

    const onopen = evt => {
      this.emit("open", evt);
    };
    const onmessage = (data, evt) => {
      this.emit("message", data, evt);
    };
    const onclose = evt => {
      this.emit("close", evt);
    };
    const onerror = evt => {
      this.emit("error", evt);
    };
    this.ws = new Sock({
      url: this.url,
      onopen,
      onmessage,
      onclose,
      onerror,
      debug
    });

    return this.ws;
  }
  close() {
    this.ws && this.ws.close();
  }
  send(data) {
    if (!data) return false;
    this.ws.send(data);
  }
}

export default WS;
