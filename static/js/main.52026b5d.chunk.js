(this.webpackJsonpwebsite=this.webpackJsonpwebsite||[]).push([[0],{36:function(e,t,n){},37:function(e,t,n){},38:function(e,t,n){"use strict";n.r(t);var r=n(24),c=n.n(r),s=n(1),i=n.n(s),a=n(8),l=n(15),o=n(16),u=n(9),h=n(18),d=n(17),j=n(10),b=n(7),f=n(0);function p(){var e=window.innerHeight,t=window.innerWidth;e=Math.floor(e/50),t=Math.floor(t/50);var n=Object(j.a)(Array(e)).map((function(e){return Array(t).fill(0)})),r=Math.floor(Math.random()*e),c=Math.floor(Math.random()*t);return n[r][c]=-1,n}var m=function(e){Object(h.a)(n,e);var t=Object(d.a)(n);function n(e){var r;Object(l.a)(this,n),(r=t.call(this,e)).updateDim=r.updateDim.bind(Object(u.a)(r)),r.changeDir=r.changeDir.bind(Object(u.a)(r));var c=p();return r.state={row:c.length,col:c[0].length,len:3,pos:[0,0],vel:[0,1],arr:c,move:!0,buff:null},r}return Object(o.a)(n,[{key:"randomPos",value:function(){var e,t,n=Object(j.a)(this.state.arr),r=this.state.row,c=this.state.col;do{e=Math.floor(Math.random()*r),t=Math.floor(Math.random()*c)}while(n[e][t]);n[e][t]=-1,this.setState({arr:n})}},{key:"updateDim",value:function(){var e=p();this.setState({row:e.length,col:e[0].length,arr:e})}},{key:"changeDir",value:function(e){var t,n=e.key.toLowerCase(),r=this.state.vel;if("arrowleft"===n||"a"===n)t=[0,-1];else if("arrowright"===n||"d"===n)t=[0,1];else if("arrowup"===n||"w"===n)t=[-1,0];else{if("arrowdown"!==n&&"s"!==n)return;t=[1,0]}r[0]+t[0]&&r[0]!==t[0]&&(this.state.move?this.setState({vel:t,move:!1}):this.setState({buff:t}))}},{key:"componentDidMount",value:function(){var e=this;this.timerID=setInterval((function(){return e.move()}),100),document.title="Snake",document.addEventListener("keydown",this.changeDir,!1),this.updateDim(),window.addEventListener("resize",this.updateDim)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timerID),document.removeEventListener("keydown",this.changeDir,!1),window.removeEventListener("resize",this.updateDim)}},{key:"move",value:function(){var e=Object(a.a)(this.state.pos,2),t=e[0],n=e[1],r=Object(a.a)(this.state.vel,2),c=r[0],s=r[1],i=this.state,l=i.row,o=i.col,u=this.state.arr.map((function(e){return e.map((function(e){return e>0?e-1:e}))}));if(n=(n+s+o)%o,u[t=(t+c+l)%l][n]>0){var h=u[t][n];this.setState({len:this.state.len-h}),u=u.map((function(e){return e.map((function(e){return e>h?e-h:-(e<0)}))}))}else u[t][n]<0&&(this.setState({len:this.state.len+1}),this.randomPos(),u=this.state.arr.map((function(e){return e.map((function(e){return e>0?e+1:-(e<0)}))})));u[t][n]=this.state.len;var d=this.state.buff;d&&this.setState({buff:null,vel:d}),this.setState({move:!d,pos:[t,n],arr:u})}},{key:"render",value:function(){return Object(f.jsxs)("header",{className:"App-header",children:[Object(f.jsx)("table",{style:{height:"85vh",width:"95vw"},children:Object(f.jsx)("tbody",{children:this.state.arr.map((function(e,t){return Object(f.jsx)("tr",{children:e.map((function(e,n){return Object(f.jsx)("td",{bgcolor:e>0?"white":e<0?"red":"black",style:{cursor:"default"},children:Object(f.jsx)("div",{children:"\xa0"})},"".concat(t,"-").concat(n))}))},t.toString())}))})}),Object(f.jsx)(b.b,{to:"/",style:{marginBottom:"20px"},children:Object(f.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}}]),n}(i.a.Component);function v(e){var t=Array(e).fill(" ");return t.map((function(e){return Object(j.a)(t)}))}function O(e,t){return null===e||null===t?e===t:e[0]===t[0]&&e[1]===t[1]}function x(e,t){return e.some((function(e){return O(e,t)}))}function y(e){var t=e.run,n=e.set,r=e.arr;return Object(f.jsxs)("div",{children:[Object(f.jsx)("button",{className:"custom",type:"button",onClick:t("run"),children:"\u25b6"}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:t("back"),children:"\xa0\u276e\xa0"}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:t("fore"),children:"\xa0\u276f\xa0"}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:function(){return n({pointer:null,tape:[],cell:0})},children:"\u2716"}),Object(f.jsx)("br",{}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:function(){var e=r.length+1;r.forEach((function(e){return e.push(" ")})),r.push(Array(e).fill(" ")),n({size:e,grid:r})},children:"\u2795\ufe0e"}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:function(){var e=r.length-1;e&&(r.pop(),r.forEach((function(e){return e.pop()})),n({size:e,grid:r}))},children:"\u2796\ufe0e"}),Object(f.jsx)("button",{className:"custom",type:"button",onClick:function(){navigator.clipboard.writeText(r.map((function(e){return e.join("")})).join("\n"))},children:"\ud83d\udce5\ufe0e"}),Object(f.jsx)(b.b,{to:"/",children:Object(f.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}var k=function(e){Object(h.a)(n,e);var t=Object(d.a)(n);function n(e){var r;Object(l.a)(this,n);return(r=t.call(this,e)).changeText=r.changeText.bind(Object(u.a)(r)),r.state={grid:v(5),size:5,tape:[],cell:0,select:null,pointer:null,breaks:[]},r}return Object(o.a)(n,[{key:"runCode",value:function(e){return function(){if(this.state.grid.every((function(e){return!e.includes("*")})))return alert("No halt instruction detected!"),void this.setState({select:null});if(null!==this.state.pointer||(this.func=function(e){var t=e.length,n=e[0].length,r=[{end:!1,pos:[0,0],vel:[0,1],tape:[0],cell:0}],c=0;return function(){var s=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=r[r.length-1];if(s&&c?c-=1:s||i.end||(c+=1),c<r.length)return r[c];var l=i,o=l.tape,u=l.cell,h=l.end,d=Object(a.a)(i.pos,2),b=d[0],f=d[1],p=Object(a.a)(i.vel,2),m=p[0],v=p[1],O=e[b][f];if(o=Object(j.a)(o),"\\"===O){var x=[v,m];m=x[0],v=x[1]}else if("/"===O){var y=[-v,-m];m=y[0],v=y[1]}else if("<"===O&&u)u-=1;else if(">"===O)(u+=1)===o.length&&o.push(0);else if("-"===O)o[u]^=1;else if("+"!==O||o[u])"*"===O&&(h=!0);else{var k=[b+m,f+v];b=k[0],f=k[1]}return i={pos:[b=(b+m+t)%t,f=(f+v+n)%n],vel:[m,v],tape:o,cell:u,end:h},r.push(i),i}}(this.state.grid),"run"===e)){var t;if(this.setState({select:null}),"run"===e)do{t=this.func()}while(!x(this.state.breaks,t.pos)&&!t.end);else"fore"===e?t=this.func():"back"===e&&(t=this.func(!0));var n=t,r=n.pos,c=n.end,s=n.tape,i=n.cell;this.setState({pointer:c?null:r,tape:s,cell:i})}else this.setState({pointer:[0,0],select:null,tape:[0],cell:0})}.bind(this)}},{key:"changeText",value:function(e){var t=this.state,n=t.select,r=t.breaks;if(null!==n){var c,s=this.state.grid,i=Object(a.a)(n,2),l=i[0],o=i[1];if("b"===e.key.toLowerCase())return x(r,n)?r=r.filter((function(e){return!O(e,n)})):r.push(n),void this.setState({breaks:r});if(1===e.key.length)c=e.key;else{if("Backspace"!==e.key&&"Delete"!==e.key){if(e.key.includes("Arrow")){e.key.includes("Left")?o-=1:e.key.includes("Right")?o+=1:e.key.includes("Up")?l-=1:l+=1;var u=this.state.size;return l=(l+u)%u,o=(o+u)%u,void this.setState({select:[l,o]})}return}c=" "}s[l][o]=c,this.setState({grid:s})}}},{key:"changeColor",value:function(e){return function(){var t=this.state.select;t=O(t,e)?null:e,this.setState({select:t})}}},{key:"chooseColor",value:function(e){var t=this.state,n=t.select,r=t.pointer,c=t.breaks;return O(n,e)?"grey":O(r,e)?"red":x(c,e)?"yellow":"white"}},{key:"componentDidMount",value:function(){document.title="Interpreter",document.addEventListener("keydown",this.changeText,!1)}},{key:"componentWillUnmount",value:function(){document.removeEventListener("keydown",this.changeText,!1)}},{key:"tile",value:function(e,t,n){var r=[t,n];return Object(f.jsx)("td",{onClick:this.changeColor(r).bind(this),bgcolor:this.chooseColor(r),children:Object(f.jsxs)("div",{children:["\xa0",e,"\xa0"]})},"".concat(t,"-").concat(n))}},{key:"render",value:function(){var e=this;return Object(f.jsxs)("header",{className:"App-header",children:[Object(f.jsx)("div",{className:"split left",children:Object(f.jsx)("div",{className:"centered",children:Object(f.jsx)("table",{children:Object(f.jsx)("tbody",{children:this.state.grid.map((function(t,n){return Object(f.jsx)("tr",{children:t.map((function(t,r){return e.tile(t,n,r)}))},n.toString())}))})})})}),Object(f.jsx)("div",{className:"split right",children:Object(f.jsxs)("div",{className:"centered",children:[Object(f.jsx)("code",{children:"Instructions:"}),Object(f.jsxs)("ul",{style:{fontSize:"75%",textAlign:"left"},children:[Object(f.jsx)("li",{children:"Click to select/unselect"}),Object(f.jsx)("li",{children:"Type to change selected cell"}),Object(f.jsxs)("li",{children:["Commands located\xa0",Object(f.jsx)("a",{href:"https://esolangs.org/wiki/Back",children:"here"})]})]}),Object(f.jsx)(y,{run:function(t){return e.runCode(t)},set:function(t){return e.setState(t)},arr:this.state.grid}),Object(f.jsx)("br",{}),Object(f.jsx)("code",{children:"Output:"}),Object(f.jsx)("br",{}),Object(f.jsxs)("div",{className:"output",children:[Object(f.jsx)("code",{children:"\xa0"}),this.state.tape.map((function(t,n){var r=e.state.cell===n?"red":"white";return Object(f.jsxs)("code",{style:{color:r},children:[t,"\xa0"]},n.toString())}))]})]})})]})}}]),n}(i.a.Component);function g(){return document.title="Home",Object(f.jsxs)("header",{className:"App-header",children:[Object(f.jsx)("h1",{className:"logo",children:"Bangyen"}),Object(f.jsxs)("div",{children:[Object(f.jsx)(b.b,{to:"/back",children:Object(f.jsx)("button",{className:"custom",type:"button",children:"Interpreter"})}),Object(f.jsx)(b.b,{to:"/snake",children:Object(f.jsx)("button",{className:"custom",type:"button",children:"Snake"})}),Object(f.jsx)("form",{action:"https://github.com/bangyen",style:{display:"inline-block"},children:Object(f.jsx)("input",{type:"submit",value:"GitHub",className:"custom"})})]})]})}function w(){return document.title="404",Object(f.jsxs)("header",{className:"App-header",children:[Object(f.jsx)("h1",{children:"404 Error"}),Object(f.jsx)(b.b,{to:"/",style:{marginBottom:"20px"},children:Object(f.jsx)("button",{className:"custom",type:"button",children:"??\ufe0e"})})]})}n(36),n(37);var N=n(2);function S(){return Object(f.jsx)(b.a,{basename:"/",children:Object(f.jsx)("div",{children:Object(f.jsxs)(N.c,{children:[Object(f.jsx)(N.a,{exact:!0,path:"/back",children:Object(f.jsx)(k,{})}),Object(f.jsx)(N.a,{exact:!0,path:"/snake",children:Object(f.jsx)(m,{})}),Object(f.jsx)(N.a,{exact:!0,path:"/",children:Object(f.jsx)(g,{})}),Object(f.jsx)(N.a,{children:Object(f.jsx)(w,{})})]})})})}c.a.render(Object(f.jsx)(i.a.StrictMode,{children:Object(f.jsx)(S,{})}),document.getElementById("root"))}},[[38,1,2]]]);
//# sourceMappingURL=main.52026b5d.chunk.js.map