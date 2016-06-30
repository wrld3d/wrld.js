var CallbackCollection = function() {

    var _callbacks = [];

    this.addCallback = function(callback) {
        _callbacks.push(callback);
    };

    this.removeCallback = function(callback) {
        _callbacks.splice(_callbacks.indexOf(callback), 1);
    };

    this.executeCallbacks = function() {
        var args = arguments;
        _callbacks.forEach(function(callback) {
            callback.apply(this, args);
        });
    };
};

module.exports = CallbackCollection;