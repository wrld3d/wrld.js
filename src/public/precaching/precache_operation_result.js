var PrecacheOperationResult = function(succeeded) {
    var _succeeded = succeeded;

    this.succeeded = function() {
        return _succeeded;
    };
};

module.exports = PrecacheOperationResult;
