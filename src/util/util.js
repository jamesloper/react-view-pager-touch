const __el = document.createElement('div').style;
const xform = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'].find(v => v in __el);

const clamp = (val, min, max) => {
	if (val < min) return min;
	if (val > max) return max;
	return val;
};

const easeOutCubic = (t) => (--t) * t * t + 1;
const range = (n) => Array.apply(null, {length: n}).map(Number.call, Number);


export { clamp, xform, range, easeOutCubic };