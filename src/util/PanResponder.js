const FLICK_SPEED = .25; // pixels per ms
const CUTOFF_INTERVAL = 50; // ms
const SNAP_DURATION = 300;

const weightAverageVelocity = (lastV, newV, elapsedTime) => {
	const newWeight = Math.min(elapsedTime, CUTOFF_INTERVAL) / CUTOFF_INTERVAL;
	const oldWeight = 1 - newWeight;

	let weightedOld = (lastV * oldWeight) || 0;
	let weightedNew = (newV * newWeight);
	return weightedOld + weightedNew;
};

class PanResponder {
	constructor() {
		return this;
	}

	initialize(e) {
		this.originX = e.touches[0].screenX;
		this.originY = e.touches[0].screenY;

		// Initialize tracker
		this.locked = false;
		this.vx = 0;
		this.sx = 0;
		this.lastTime = Date.now();
		this.lastX = this.originX;
		this.touch = true;
	}

	track(e) {
		// Update new position
		this.x = e.touches[0].screenX;
		this.y = e.touches[0].screenY;
		this._logVelocity();

		// Get distance travelled
		this.dx = this.x - this.originX;
		this.dy = this.y - this.originY;
		this.absX = Math.abs(this.dx);
		this.absY = Math.abs(this.dy);

		if (!this.locked) {
			if (!e.cancelable || this.absY > 10) {
				this.locked = 'y';
			} else if (this.absX > 10) {
				this.locked = 'h';
			}
		}

		if (this.locked === 'h') e.preventDefault();

		return this;
	}

	release() {
		this._logVelocity();
		this.touch = false;
		this.sx = Math.abs(this.vx);
		this.flick = this.sx >= FLICK_SPEED;
		return this;
	}

	_logVelocity() {
		// Get instantaneous velocity
		const now = Date.now();
		const elapsedTime = now - this.lastTime;

		if (elapsedTime > 0) {
			const vx = (this.x - this.lastX) / elapsedTime;
			this.vx = weightAverageVelocity(this.vx, vx, elapsedTime);
			// Save data for velocity tracker
			this.lastTime = now;
			this.lastX = this.x;
		}
	}
}

export default new PanResponder();
export { FLICK_SPEED, SNAP_DURATION };