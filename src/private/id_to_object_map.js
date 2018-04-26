var IdToObjectMap = function() {
    var _objects = {};

    this.insertObject = function(id, object) {
        _objects[id] = object;
        return id;
    };

    this.removeObjectById = function(id) {
        var object = _objects[id];
        delete _objects[id];
        return object;
    };

    this.idForObject = function(object) {
        for (var id in _objects) {
            if (_objects[id] === object) {
                return id;
            }
        }
        return null;
    };

    this.getObjectById = function(id) {
        return _objects[id];
    };

    this.forEachItem = function(func) {
        for (var id in _objects) {
            var object = _objects[id];
            func(id, object);
        }
    };
};

module.exports = IdToObjectMap;
