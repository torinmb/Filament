function ColorTracker(tracker1, tracker2) {
    this.tracker1 = tracker1 ? tracker1  : new ColorTracking(0.1, 0.8);
    this.tracker2 = tracker2 ? tracker2  : new ColorTracking(0.1, 0.8);
}

ColorTracker.prototype.update = function() {
    this.tracker1.update();
    this.tracker2.update();
}

ColorTracker.prototype.getColor = function(intensity, peak) {

    var red1 = this.tracker1.red;
    var green1 = this.tracker1.green;
    var blue1 = this.tracker1.blue;
    var red2 = 255 - this.tracker2.red;
    var green2 = 255 - this.tracker2.green;
    var blue2 = 255 - this.tracker2.blue;

    var shift2 = intensity / peak;
    var shift1 = 1 - shift2;

    var r = red1 * shift1 + red2 * shift2;
    var g = green1 * shift1 + green2 * shift2;
    var b = blue1 * shift1 + blue2 * shift2;
    var alpha = Math.min(255 * shift2, 255);
    return new THREE.Color(r/255, g/255, b/255, alpha/255);
}

function ColorTracking(deltaMin, deltaMax, redStart, greenStart, blueStart) {    
    this.deltaMin = deltaMin;
    this.deltaMax = deltaMax;
    this.incrRed = true;
    this.incrBlue = false;
    this.incrGreen = false;
    this.red = redStart ? redStart: Math.random(125, 255);
    this.green = greenStart ? greenStart: Math.random(0, 125);
    this.blue = blueStart ? blueStart: Math.random(67, 200);
    this.dr = Math.random(this.deltaMin, this.deltaMax);
    this.dg = Math.random(this.deltaMin, this.deltaMax);
    this.db = Math.random(this.deltaMin, this.deltaMax);
}
    
ColorTracking.prototype.pickRandomDeltas = function() {
    this.dr = Math.random(this.deltaMin, this.deltaMax);
    this.dg = Math.random(this.deltaMin, this.deltaMax);
    this.db = Math.random(this.deltaMin, this.deltaMax);
};
    
//call each frame to slowly change colors over time
ColorTracking.prototype.update = function() {
    if (this.red + this.blue + this.green < 255) {
        this.incrRed = true;
        this.incrBlue = true;
        this.incrGreen = true;
        this.pickRandomDeltas();
        
    } else if (this.red + this.blue + this.green > (255 * 2)) {
        this.incrRed = false;
        this.incrBlue = false;
        this.incrGreen = false; 
        this.pickRandomDeltas();
    }
    
    if (this.red > 255) {
        this.incrRed = false;
        this.dr = Math.random(this.deltaMin, this.deltaMax);
    }
    if (this.blue > 255) {
        this.incrBlue = false;
        this.db = Math.random(this.deltaMin, this.deltaMax);
    }
    if (this.green > 255) {
        this.incrGreen = false;
        this.dg = Math.random(this.deltaMin, this.deltaMax);
    }
    if (this.red < 0) this.incrRed = true;
    if (this.blue < 0) this.incrBlue = true;
    if (this.green < 0) this.incrGreen = true;    
    
    if (this.incrRed) this.red += this.dr;
        else this.red -= this.dr;
    if (this.incrBlue) this.blue += this.db;
        else this.blue -= this.db;
    if (this.incrGreen) this.green += this.dg;
        else this.green -= this.dg;
};

ColorTracking.prototype.pickRandomColor = function () {
    this.red = Math.random(0, 255);
    this.green = Math.random(0, 255);
    this.blue = Math.random(0, 255);    
};
