export const PrecacheOperationResult = function(succeeded) {
    var _succeeded = succeeded;

    this.getSucceeded = function() {
        return _succeeded;
    };
};

export default PrecacheOperationResult;
