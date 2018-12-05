let xform = 'transform';
if (typeof document !== 'undefined') {
	const __el = document.createElement('div').style;
	xform = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'].find(v => v in __el);
}

let isIos = true;
if (typeof navigator !== 'undefined') {
	isIos = !!navigator.userAgent.match('iPhone OS');
}

const clamp = (val, min, max) => {
	if (val < min) return min;
	if (val > max) return max;
	return val;
};

const easeOutCubic = (t) => (--t) * t * t + 1;

export { clamp, xform, easeOutCubic, isIos };