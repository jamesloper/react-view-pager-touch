const FLICK_SPEED = .25; // pixels per ms
const MEASURE_INTERVAL = 40; // ms

const weightAverageVelocity = (lastV, newV, elapsedTime) => {
	const newWeight = Math.min(elapsedTime, MEASURE_INTERVAL) / MEASURE_INTERVAL;
	const oldWeight = (1 - newWeight);

	let weightedOld = (lastV * oldWeight) || 0;
	let weightedNew = (newV * newWeight);
	return weightedOld + weightedNew;
};

class PanResponder {
	constructor() {
		return this;
	}

	initializeTouch(e) {
		this.originX = Math.round(e.touches[0].screenX);
		this.originY = Math.round(e.touches[0].screenY);

		// Initialize velocity tracker
		this.vx = 0;
		this.sx = 0;
		this.lastTime = Date.now();
		this.lastX = this.originX;
		this.touch = true;
	}

	_logVelocity() {
		// Get instantaneous velocity
		const now = Date.now();
		const elapsedTime = (now - this.lastTime);

		if (elapsedTime > 0) {
			const vx = (this.x - this.lastX) / elapsedTime;
			this.vx = weightAverageVelocity(this.vx, vx, elapsedTime);
			// Save data for velocity tracker
			this.lastTime = now;
			this.lastX = this.x;
		}
	}

	trackMovement(e) {
		// Update new position
		this.x = Math.round(e.touches[0].screenX);
		this.y = Math.round(e.touches[0].screenY);
		this._logVelocity();

		// Get distance travelled
		this.dx = (this.x - this.originX);
		this.dy = (this.y - this.originY);
		this.absX = Math.abs(this.dx);
		this.absY = Math.abs(this.dy);

		return this;
	}

	getReleaseVelocity() {
		this._logVelocity();
		this.touch = false;
		this.sx = Math.abs(this.vx);
		this.flick = (this.sx >= FLICK_SPEED);
		return this;
	}
}

export default new PanResponder();