/*
 MMM-Moisture
*/

Module.register("MMM-Moisture", {

  requiresVersion: "2.1.0",

  // Default module config.
  defaults: {
    endpoint: 'http://hass.home.lan/api/states/sensor.palm_moisture',
    threshold: 35,
    updateInterval: 60 * 1000 // every minute
  },

  // Define required scripts.
  getStyles: function () {
    return ["MMM-Moisture.css"];
  },

  // Define start sequence.
  start: function () {
    Log.info("Starting module: " + this.name);

    this.loaded = false;
    this.updateSensor();
  },

  scheduleUpdate: function () {
    var self = this;
    setTimeout(function () {
      self.updateSensor();
    }, this.config.updateInterval);
  },

  updateSensor: function () {
    Log.info(this.name + ": Getting sensor data.");
    var self = this;
    var sensorRequest = new XMLHttpRequest();
    sensorRequest.open("GET", this.config.endpoint, true);
    sensorRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self.processSensor(JSON.parse(this.response));
        } else {
          Log.error(self.name + ": Could not load sensor.");
        }
        self.scheduleUpdate();
      }
    };
    sensorRequest.send();
  },

  processSensor: function (data) {
    if (!data || !data.state) {
      Log.error(self.name + ": got invalid data.");
      return;
    }
    this.value = data.state;
    this.loaded = true;
    this.updateDom();
  },

  getDom: function () {
    var wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (this.value <= this.config.threshold) {
      wrapper.className = "moisture-low";
    }

    return wrapper;
  }


});
