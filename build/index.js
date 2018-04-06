module.exports=function(e){var t={};function i(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=e,i.c=t,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=3)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=document.createElement("div").style,n=["transform","webkitTransform","OTransform","MozTransform","msTransform"].find(function(e){return e in r});t.clamp=function(e,t,i){return e<t?t:e>i?i:e},t.xform=n,t.range=function(e){return Array.apply(null,{length:e}).map(Number.call,Number)},t.easeOutCubic=function(e){return--e*e*e+1}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}();var n=function(){function e(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this}return r(e,[{key:"initialize",value:function(e){this.originX=e.touches[0].screenX,this.originY=e.touches[0].screenY,this.locked=!1,this.vx=0,this.sx=0,this.lastTime=Date.now(),this.lastX=this.originX,this.touch=!0}},{key:"track",value:function(e){return this.x=e.touches[0].screenX,this.y=e.touches[0].screenY,this._logVelocity(),this.dx=this.x-this.originX,this.dy=this.y-this.originY,this.absX=Math.abs(this.dx),this.absY=Math.abs(this.dy),this.locked||(!e.cancelable||this.absY>10?this.locked="y":this.absX>10&&(this.locked="h")),"h"===this.locked&&e.preventDefault(),this}},{key:"release",value:function(){return this._logVelocity(),this.touch=!1,this.sx=Math.abs(this.vx),this.flick=this.sx>=.25,this}},{key:"_logVelocity",value:function(){var e=Date.now(),t=e-this.lastTime;if(t>0){var i=(this.x-this.lastX)/t;this.vx=function(e,t,i){var r=Math.min(i,50)/50;return(e*(1-r)||0)+t*r}(this.vx,i,t),this.lastTime=e,this.lastX=this.x}}}]),e}();t.default=new n,t.FLICK_SPEED=.25,t.SNAP_DURATION=300},function(e,t){e.exports=require("react")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),n=i(2),a=c(n),s=i(1),o=c(s),u=i(0);function c(e){return e&&e.__esModule?e:{default:e}}var l=!!navigator.userAgent.match("iPhone OS"),h=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.scrollTo=i.scrollTo.bind(i),i.coastToPage=i.coastToPage.bind(i),i.renderPage=i.renderPage.bind(i),i.touchStart=i.touchStart.bind(i),i.touchMove=i.touchMove.bind(i),i.touchEnd=i.touchEnd.bind(i),i.domReady=i.domReady.bind(i),i.state={width:0},i.travelingToPage=e.currentPage,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.Component),r(t,[{key:"componentWillReceiveProps",value:function(e){e.currentPage!==this.travelingToPage&&this.coastToPage(e.currentPage,!1,!1)}},{key:"componentDidMount",value:function(){this.el.addEventListener("touchstart",this.touchStart),this.el.addEventListener("touchmove",this.touchMove),this.el.addEventListener("touchend",this.touchEnd)}},{key:"render",value:function(){var e=this,t=this.props,i=t.id,r=t.className,n=t.items;return a.default.createElement("div",{id:i,className:"viewpager "+r,ref:this.domReady},a.default.createElement("div",{className:"over",id:"over-left",ref:function(t){return e.overLeft=t}}),a.default.createElement("div",{className:"over",id:"over-right",ref:function(t){return e.overRight=t}}),a.default.createElement("div",{className:"viewpager-canvas",ref:function(t){return e.canvas=t}},n.map(this.renderPage)))}},{key:"domReady",value:function(e){var t=this;if(e){var i=this.props,r=i.items,n=i.minPage,a=i.currentPage,s=e.clientWidth;this.el=e,this.minX=n*s,this.maxX=(r.length-1)*s,this.travelingToPage=a,this.setState({width:s},function(){t.scrollTo(a*s)})}}},{key:"renderPage",value:function(e,t){var i=this.props,r=i.renderItem;i.items;return a.default.createElement("div",{key:t,className:"viewpager-view"},r(e,t))}},{key:"scrollTo",value:function(e){var t=this.state.width;if(e<this.minX||e>this.maxX)if(l)e<this.minX&&(e-=(e-this.minX)/2),e>this.maxX&&(e-=(e-this.maxX)/2);else if(e<this.minX){var i=-(e-this.minX);e=this.minX,this.overLeft.style[u.xform]="scaleX("+i/t+")",this.overLeft.classList.remove("easex")}else if(e>this.maxX){var r=e-this.maxX;e=this.maxX,this.overRight.style[u.xform]="scaleX("+r/t+")",this.overRight.classList.remove("easex")}this.x=Math.round(e),this.canvas.style[u.xform]="translate3d("+-1*this.x+"px,0,0)"}},{key:"touchStart",value:function(e){this.startX=this.x,o.default.initialize(e)}},{key:"touchMove",value:function(e){var t=o.default.track(e),i=t.dx;"h"===t.locked&&this.scrollTo(this.startX-i)}},{key:"touchEnd",value:function(){var e=o.default.release(),t=e.vx,i=e.flick,r=e.locked,n=this.state.width;if("h"===r){if(i){var a=this.travelingToPage-Math.sign(t);this.coastToPage(a,!0,!0)}else{var s=Math.round(this.x/n);this.coastToPage(s,!1,!0)}l||(this.overLeft.classList.add("easex"),this.overLeft.style[u.xform]="scaleX(0)",this.overRight.classList.add("easex"),this.overRight.style[u.xform]="scaleX(0)")}}},{key:"coastToPage",value:function(e,t,i){var r=this,n=this.props,a=n.minPage,c=n.onPageSelected,l=n.currentPage,h=n.items,f=this.state.width;this.travelingToPage=(0,u.clamp)(e,a,h.length-1);var v=this.x,d=this.travelingToPage*f,m=d-v,g=Date.now(),p=s.SNAP_DURATION;t&&(p=Math.abs(m/o.default.sx));requestAnimationFrame(function e(){if(!o.default.touch){var t=Date.now()-g;if(t>=p)r.scrollTo(d),i&&c({position:r.travelingToPage,previous:l,offset:Math.sign(r.travelingToPage-l),item:h[r.travelingToPage]});else{var n=m*(0,u.easeOutCubic)(t/p);r.scrollTo(v+n),requestAnimationFrame(e)}}})}}]),t}();h.defaultProps={items:[],currentPage:0,minPage:0,className:""},t.default=h}]);