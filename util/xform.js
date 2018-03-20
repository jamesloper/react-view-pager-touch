const __el = document.createElement('div').style;
const xform = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'].find(v => v in __el);
export default xform;