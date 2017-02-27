// importScripts('Tween.js');

function KeyFrames() {
	this.keyFrames = new Array();
	this.currKeyFrame = 0;
}

//moves to the next keyframe after completion
KeyFrames.prototype.update = function(time, params) {
	var keyFrame = this.keyFrames[this.currKeyFrame];
	if (time > keyFrame.startTime && keyFrame.runOnce) {
		keyFrame.runOnce = false;
		if (this.currKeyFrame < this.keyFrames.length - 1) {
			this.currKeyFrame += 1;
		}
		keyFrame.start(function(){
			//completion handler
			// alert("Done");
		}, params);
		
	}
}

KeyFrames.prototype.push = function(keyFrame) {
	this.keyFrames.push(keyFrame);
}

function KeyFrame(endParams, updateFns, easing, duration, startTime) {
	this.endParams = endParams;
	this.updateFns = updateFns;
	this.easing = easing;
	this.duration = duration;
	this.startTime = startTime;
	this.runOnce = true;
}


KeyFrame.prototype.start = function(completion, params) {
	//initialize Tween with current params so it incriments the UI from
	// alert("Starting");
	this.tween = new TWEEN.Tween(params)
	.easing(this.easing);
	var tweenParams = JSON.parse(JSON.stringify(params));
	for (var param in this.endParams) {
	  tweenParams[param] = this.endParams[param];
	}
	var updateFns = this.updateFns;
	this.tween.onUpdate(function() {
		updateFns();
		// for (var update in this.updateFns) {
			// update.setValue(this.updateFns[update]);
		// }
	})
	.to(tweenParams, this.duration)
	.onComplete(function() {
		completion();
	})
	.start();
}

