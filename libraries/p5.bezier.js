/*! For license information please see p5.bezier.min.js.LICENSE.txt */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.initBezier=e():t.initBezier=e()}(this,(()=>(()=>{"use strict";var t={d:(e,n)=>{for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{default:()=>m});var n={1:.1,2:.02,3:.001,4:5e-4,5:2e-4},i=[1],o={};function r(t){return i[t]}function s(t,e){return 0===e||e===t?1:o[t][e]}!function(t){for(var e=i.length;e<=t;e++)i[e]=e*i[e-1]}(161),function(t){for(var e=2;e<=t;e++){o[e]={};for(var n=1;n<e;n++)o[e][n]=r(e)/(r(n)*r(e-n))}}(161);var h=function(t,e,n){if(n||2===arguments.length)for(var i,o=0,r=e.length;o<r;o++)!i&&o in e||(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return t.concat(i||Array.prototype.slice.call(e))};function a(t,e){return"WebGLRenderingContext"===t.constructor.name||e?3:2}function c(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(4===n){var i=t[0]-t[2],o=t[1]-t[3];return Math.sqrt(i*i+o*o)}if(6===n){i=t[0]-t[3],o=t[1]-t[4];var r=t[2]-t[5];return Math.sqrt(i*i+o*o+r*r)}return 0}function u(t){t.canvas._doFill&&t.ctx.fill(),t.canvas._doStroke&&t.ctx.stroke()}var l=function(){function t(t){this.m=Math.pow(2,31)-1,this.a=1103515245,this.c=12345,this.state=t}return t.prototype.r=function(){return this.state=(this.a*this.state+this.c)%this.m,this.state/this.m},t.prototype.next=function(t,e){return Math.floor(this.r()*(e-t+1))+t},t}();function p(t,e){void 0===e&&(e=!1);var n=160-(e?3:0);if(t.length<=n)return f(t);var i=t.length-n,o=new l(1234),r=new Set;return h([],new Array(i),!0).map((function(t,e){for(var i=o.next(5+e,n-5+e);r.has(i);)i=o.next(5+e,n-5+e);r.add(i)})),f(t.filter((function(t,e){return!r.has(e)})))}function f(t){return t.map((function(t){return t.slice()}))}function v(t){var e=t.length;if(0===e)return[];var n=t[0],i=t[e-1];if(1===e)return f([n]);var o=t[1],r=t[e-2];return f([[2*i[0]-r[0],2*i[1]-r[1]],[2*n[0]-o[0],2*n[1]-o[1]],n])}var d=function(t,e,n){if(n||2===arguments.length)for(var i,o=0,r=e.length;o<r;o++)!i&&o in e||(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return t.concat(i||Array.prototype.slice.call(e))};function b(t,e,n,i){for(var o=new Array(i).fill(0),r=1-n,h=0;h<=e;h++)for(var a=s(e,h)*Math.pow(r,e-h)*Math.pow(n,h),c=0;c<i;c++)o[c]+=a*t[h][c];return o}window.console.log("[p5.bezier] ".concat("0.7.0"));var x=function(){function t(t){if(this.b={canvas:null,ctx:null,dimension:2,useP5:!0,beginPath:function(){},moveTo:function(){},lineTo:function(){},closePath:function(){}},this.b.canvas=t,this.b.ctx=this.b.canvas.drawingContext,"undefined"!=typeof p5&&t instanceof p5.Graphics)this.b.useP5=!0,this.b.dimension=a(this.b.ctx,!1);else{if(!("undefined"!=typeof p5&&t instanceof p5.Renderer||t.drawingContext))throw new Error("[p5.bezier] Canvas is not supported");this.b.useP5=!1,"undefined"!=typeof p5&&("undefined"==typeof p5||t instanceof p5.Renderer)||window.console.warn("[p5.bezier] Support beyond p5.js is not tested"),this.b.dimension=a(this.b.ctx,t.isP3D)}var e;(e=this.b).useP5?(e.beginPath=e.canvas.beginShape,e.moveTo=e.canvas.vertex,e.lineTo=e.canvas.vertex,e.closePath=e.canvas.endShape):e.ctx instanceof WebGLRenderingContext?(e.beginPath=function(){},e.moveTo=function(t,n,i){return void 0===i&&(i=0),e.ctx.vertexAttrib3f(0,t,n,i)},e.lineTo=function(t,n,i){return void 0===i&&(i=0),e.ctx.vertexAttrib3f(0,t,n,i)},e.closePath=function(){}):(e.beginPath=e.ctx.beginPath.bind(e.ctx),e.moveTo=e.ctx.moveTo.bind(e.ctx),e.lineTo=e.ctx.lineTo.bind(e.ctx),e.closePath=e.ctx.closePath.bind(e.ctx))}return t.prototype.draw=function(t,e,i){var o,r;void 0===e&&(e="OPEN"),void 0===i&&(i=3);var s="CLOSE"===e?d(d([],p(t,!0),!0),v(t),!0):p(t);return this.b.beginPath(),(o=this.b).moveTo.apply(o,s[0]),function(t,e,i){for(var o=e.length-1,r=n[i],s=0;s<=1;s+=r){var h=b(e,o,s,t.dimension);t.lineTo.apply(t,h)}}(this.b,s,i),(r=this.b).lineTo.apply(r,s[s.length-1]),this.b.useP5?this.b.closePath(e):"CLOSE"===e&&this.b.closePath(),u(this.b),s},t.prototype.new=function(t,e,i){return void 0===e&&(e="OPEN"),void 0===i&&(i=3),new y(t,e,n[i],this.b)},t}();var y=function(){function t(t,e,n,i,o){var r;void 0===o&&(o=null),this.controlPoints=p(t,"CLOSE"===e),"CLOSE"===e?((r=this.controlPoints).push.apply(r,v(this.controlPoints)),this.closeType="CLOSE"):this.closeType="OPEN",this.dimension=i.dimension,this.increment=n,this.vertexList=[],this.p=this.controlPoints.length,this.n=this.p-1,this.b=i,null===o?this._buildVertexList():this.vertexList=d([],o,!0)}return t.prototype._buildVertexList=function(){this.vertexList=[];for(var t=0;t<=1;t+=this.increment){var e=b(this.controlPoints,this.n,t,this.dimension);this.vertexList.push(e)}return this._addVertex(this.controlPoints[this.controlPoints.length-1]),this.dimension=this.vertexList[0].length,this.vertexList},t.prototype._addVertex=function(t){var e;(e=this.b).lineTo.apply(e,t)},t.prototype._distVertex=function(t,e){return 3===this.dimension&&3===t.length&&3===e.length?c(t[0],t[1],t[2],e[0],e[1],e[2]):2===this.dimension?c(t[0],t[1],e[0],e[1]):0},t.prototype.draw=function(t){t?this._dashedCurve(t):this._solidCurve()},t.prototype._solidCurve=function(){var t=this;this.b.beginPath(),this.vertexList.map((function(e){return t._addVertex(e)})),"CLOSE"===this.closeType&&this.b.closePath(),this.b.useP5?this.b.closePath(this.closeType):"CLOSE"===this.closeType&&this.b.closePath(),u(this.b)},t.prototype._dashedCurve=function(t){var e,n,i,o,r;this.increment>.001&&(this.increment=.001,window.console.warn("[p5.bezier] Smoothness set to 3 for a dashed curve"));var s,h,a,c,l,p=t.map(Math.abs),f=p[0],v=p[1],d=!0,b=this.vertexList[0],x=1,y=b,m=0,P=f;for(this.b.ctx.save(),this.b.ctx.fillStyle="rgba(0, 0, 0, 0)",this.b.beginPath(),(e=this.b).moveTo.apply(e,b);x<this.vertexList.length;){var g=this.vertexList[x];for(m=this._distVertex(b,g);m>=P;)h=g,a=P/m,c=void 0,l=void 0,c=(s=y).length,l=h.length,y=2===c&&2===l?[s[0]+(h[0]-s[0])*a,s[1]+(h[1]-s[1])*a]:3===c&&3===l?[s[0]+(h[0]-s[0])*a,s[1]+(h[1]-s[1])*a,s[2]+(h[2]-s[2])*a]:h,d?(n=this.b).lineTo.apply(n,y):(i=this.b).moveTo.apply(i,y),m-=P,P=(d=!d)?f:v;d?(o=this.b).lineTo.apply(o,g):(r=this.b).moveTo.apply(r,g),P-=this._distVertex(y,g),y=b=g,x++}u(this.b),this.b.ctx.restore()},t.prototype.update=function(t){if(t.length!==this.controlPoints.length)throw new Error("[p5.bezier] The number of control points changed");this.controlPoints.every((function(e,n){return e===t[n]}))||(this.controlPoints=t,this._buildVertexList())},t.prototype.move=function(e,n,i,o,r){if(void 0===i&&(i=null),void 0===o&&(o=!0),null===i&&3===this.dimension)throw new Error("[p5.bezier] X, Y, and Z are needed to move a 3D curve");var s=[e,n];null!==i&&s.push(i);var h=this.vertexList.map((function(t){return t.slice()})),a=new t(this.controlPoints,this.closeType,this.increment,this.b,h);return a.vertexList=a.vertexList.map((function(t){return t.map((function(t,e){return t+s[e]}))})),o&&a.draw(r),a},t.prototype.shortest=function(t,e,n){var i=this;void 0===n&&(n=0);var o=[0,0,0],r=Number.POSITIVE_INFINITY;return this.vertexList.map((function(s){var h=i._distVertex(s,[t,e,n]);r>h&&(r=h,o=d([],s,!0))})),o},t}();const m=function(t){return new x(t)};return e=e.default})()));
//# sourceMappingURL=p5.bezier.min.js.map