var PrecacheOperationResult = function(succeeded) {
    var _succeeded = succeeded;

    this.getSucceeded = function() {
        return _succeeded;
    };
};

module.exports = PrecacheOperationResult;
