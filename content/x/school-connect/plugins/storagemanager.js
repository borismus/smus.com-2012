// Wrapper around localStorage
var StorageManager = function(url, sorter) {
  this._array = [];
  this._isLoaded = false;
  if (sorter == undefined) {
    this._sorter = function(a) {return a;};
  } else {
    this._sorter = sorter;
  }
  
  this.download(url);
};
StorageManager.POLL = null;

// Gets an object with a specified ID
StorageManager.prototype.get = function(id, cb) {
  if (!this._isLoaded) {
    // Try again later
    setTimeout(function() {
      arguments.callee(id, cb);
    }, 100);
    return;
  }
  // Iterate through array and get the object with the id
  $.each(this._array, function(index, item) {
    if (item.id == id) {
      cb(item);
      return false;
    }
  });
};

// Gets the underlying array
StorageManager.prototype.array = function(cb) {
  if (!this._isLoaded) {
    // Try again later
    setTimeout(function() {
      arguments.callee(cb);
    }, 100);
    return;
  }
  cb(this._array);
};

// Each
StorageManager.prototype.each = function(action) {
  if (!this._isLoaded) {
    // Try again later
    setTimeout(function() {
      arguments.callee(action);
    }, 100);
  }
  $.each(this._array, action);
};

// Downloads the array from JSON data
StorageManager.prototype.download = function(url) {
  var that = this;
  $.getJSON(url, function(data) {
    that._array = that._sorter(data.data);
    that._isLoaded = true;
  });
};

// Save an object locally
StorageManager.prototype.add = function(object) {
  object.id = this._array.length;
  this._array.push(object);
  this._array = this._sorter(this._array);
};
