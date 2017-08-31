var Vector3 = function(x, y, z) {
    if (typeof(x) === "number") {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
    }
    else {
        this.x = x.x || x[0];
        this.y = x.y || x[1];
        this.z = x.z || x[2] || 0.0;
    }

    this.toPoint = function() {
        return L.point(this.x, this.y);
    };
};

var Vector4 = function(x, y, z, w) {
    if (typeof(x) === "number") {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
        this.w = w || 1.0;
    }
    else {
        this.x = x.x || x[0];
        this.y = x.y || x[1];
        this.z = x.z || x[2] || 0.0;
        this.w = x.w || x[3] || 1.0;
    }
};

var space = {
    Vector3: Vector3,
    Vector4: Vector4
};

module.exports = space;