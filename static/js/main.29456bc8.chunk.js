(this.webpackJsonpwebsite=this.webpackJsonpwebsite||[]).push([[0],{38:function(e,t,n){},39:function(e,t,n){},40:function(e,t,n){},41:function(e,t,n){"use strict";n.r(t);var r=n(26),s=n.n(r),a=n(1),i=n.n(a),c=n(3),l=n(2),o=n(5),u=n(8),h=n(0);function d(e,t){return Object(h.jsx)("button",{className:"custom",type:"button",onClick:t,title:"click here",children:e})}function j(e){var t=e.split("\n").map((function(e){return e.length})),n=Math.max.apply(Math,Object(o.a)(t)),r=t.length;return r<15&&(r=15),n<65&&(n=65),[r,n]}function b(e){var t=e.pos,n=e.vel,r=e.old,s=e.size,a=void 0===s?r:s,i=e.wrap,c=void 0===i||i,l=Object(u.a)(n,2),o=l[0],h=l[1];return o+=Math.floor(t/r),h+=t%r,c?(o=(o+a)%a,h=(h+a)%a):(o=f(o,a),h=f(h,a)),o*a+h}function f(e,t){return e>=t?e=t-1:e<0&&(e=0),e}var p=n(6),v=n(12),O=n(13),g=n(7),m=n(15),x=n(14),y=function(e){Object(m.a)(n,e);var t=Object(x.a)(n);function n(e){var r;Object(v.a)(this,n),(r=t.call(this,e)).changeColor=r.changeColor.bind(Object(g.a)(r)),r.changeText=r.changeText.bind(Object(g.a)(r)),r.changeSize=r.changeSize.bind(Object(g.a)(r)),r.changeGrid=r.changeGrid.bind(Object(g.a)(r));return r.state=Object(p.a)(Object(p.a)({},r.props.start),{},{grid:" ".repeat(25),size:5,select:null,pos:null,breaks:[],text:!1,edit:!1}),r}return Object(O.a)(n,[{key:"componentDidMount",value:function(){document.title=this.props.name+" Interpreter | Bangyen",document.addEventListener("keydown",this.changeText,!1)}},{key:"componentWillUnmount",value:function(){document.removeEventListener("keydown",this.changeText,!1)}},{key:"runCode",value:function(e){return function(){if(this.state.edit&&this.clean(),null===this.state.pos){var t=this.state,n=t.grid,r=t.size,s=this.props,a=s.run,i=s.start;if(this.func=a(n,r),"run"!==e)return void this.setState(Object(p.a)(Object(p.a)({},i),{},{select:null}))}var c;if(this.setState({select:null}),"run"===e)do{c=this.func()}while(!this.state.breaks.includes(c.pos)&&!c.end);else"next"===e?c=this.func():"prev"===e&&(c=this.func(!0));this.setState(c)}.bind(this)}},{key:"changeText",value:function(e){var t=this.state,n=t.select,r=t.breaks,s=t.text;if(null!==n&&!s){var a,i=this.state.grid,c=i.length;if("b"===e.key.toLowerCase())return r.includes(n)?r=r.filter((function(e){return e!==n})):r.push(n),void this.setState({breaks:r});if(1===e.key.length)a=e.key;else{var l;if("Backspace"!==e.key&&"Delete"!==e.key)return e.key.includes("Arrow")?(e.key.includes("Left")?l=[0,-1]:e.key.includes("Right")?l=[0,1]:e.key.includes("Up")?l=[-1,0]:e.key.includes("Down")&&(l=[1,0]),n=b({pos:n,old:c,vel:l}),void this.setState({select:n})):void 0;a=" "}i=i.substring(0,n)+a+i.substring(n+1),this.setState({grid:i})}}},{key:"changeColor",value:function(e){return function(){var t=this.state.select;t=t===e?null:e,this.setState({select:t})}.bind(this)}},{key:"chooseColor",value:function(e){var t=this.state,n=t.select,r=t.pos,s=t.breaks;return e===n?"grey":e===r?"red":s.includes(e)?"yellow":"white"}},{key:"changeGrid",value:function(e){var t=e.target.value;this.setState({grid:t,edit:!0})}},{key:"clean",value:function(){for(var e=this.state.grid.split("\n").map((function(e){return e.trimEnd()})).filter((function(e){return""!==e})),t=Math.max.apply(Math,[e.length].concat(Object(o.a)(e.map((function(e){return e.length})))));e.length<t;)e.push("");e=e.map((function(e){var n=e.length;return n<t?e+=" ".repeat(t-n):e=e.substring(0,t),e})),this.setState(Object(p.a)(Object(p.a)({},this.props.start),{},{grid:e.join(""),size:t,pos:null,text:!1,edit:!1}))}},{key:"getTable",value:function(){var e=this.state,t=e.grid,n=e.size,r=e.edit;if(this.state.text){var s="";if(r)s=t;else if(t===" ".repeat(n*n))s="Input program here...";else for(var a=" ".repeat(n),i=Object(o.a)(Array(n).keys()).map((function(e){return t.substring(n*e,n*(e+1))})).filter((function(e){return e!==a})),c=i.length,l=0;l<c;l++)s+=i[l].trimEnd(),l+1!==c&&(s+="\n");var d=j(s),b=Object(u.a)(d,2),f=b[0],p=b[1];return Object(h.jsx)("form",{children:Object(h.jsx)("label",{children:Object(h.jsx)("textarea",{value:s,onChange:this.changeGrid,onPaste:this.changeGrid,rows:f,cols:p})})})}for(var v,O=Object(o.a)(Array(n)).map((function(e){return Array(n)})),g=0;g<n;g++)for(var m=0;m<n;m++)v=n*g+m,O[g][m]=Object(h.jsx)("td",{className:"cell select",onClick:this.changeColor(v),bgcolor:this.chooseColor(v),children:Object(h.jsxs)("div",{children:["\xa0",t[v],"\xa0"]})},"".concat(v));return Object(h.jsx)("table",{className:"grid",children:Object(h.jsx)("tbody",{children:O.map((function(e,t){return Object(h.jsx)("tr",{children:e},t.toString())}))})})}},{key:"getInfo",value:function(){var e=this.props,t=e.name,n=e.link;return n="https://esolangs.org/wiki/"+(n||t),Object(h.jsxs)("ul",{style:{fontSize:"75%",textAlign:"left"},children:[Object(h.jsx)("li",{children:"Click to select/unselect"}),Object(h.jsx)("li",{children:"Type to change selected cell"}),Object(h.jsx)("li",{children:"Press (b) to use breakpoints"}),Object(h.jsxs)("li",{children:[t," commands located\xa0",Object(h.jsx)("a",{href:n,children:"here"})]})]})}},{key:"changeSize",value:function(e){var t=this.state,n=t.grid,r=t.size,s=t.select,a=t.text;return function(){if(e&&!a){var t="";null!==s&&(s=b({pos:s,vel:[0,0],old:r,size:e,wrap:!1}));for(var i=0;i<e;i++)for(var c=0;c<e;c++)t+=i<r&&c<r?n[r*i+c]:" ";console.log(t),this.setState(Object(p.a)(Object(p.a)({},this.props.start),{},{grid:t,size:e,pos:null,select:s}))}}.bind(this)}},{key:"getButtons",value:function(){var e=this,t=this.state,n=t.size,r=t.text,s=t.edit;return Object(h.jsxs)("div",{children:[d("\u25b6",this.runCode("run")),d("\xa0\u276e\xa0",this.runCode("prev")),d("\xa0\u276f\xa0",this.runCode("next")),d("\u2716",(function(){e.state.text||e.setState(Object(p.a)(Object(p.a)({},e.props.start),{},{pos:null}))})),Object(h.jsx)("br",{}),d("\u2795\ufe0e",this.changeSize(n+1)),d("\u2796\ufe0e",this.changeSize(n-1)),d("\ud83d\udce5\ufe0e",(function(){s?e.clean():e.setState({text:!r})})),Object(h.jsx)(c.b,{to:"/",children:Object(h.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}},{key:"getTape",value:function(){var e=this;if(!this.props.tape)return null;var t=this.state.tape.map((function(t,n){var r=e.state.cell===n?"red":"white";return Object(h.jsxs)("code",{style:{color:r},children:["\xa0",t]},n.toString())}));return Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Tape:",t]})})}},{key:"getOutput",value:function(){return this.props.out?Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Output:",""===this.state.out?"":" ",this.state.out]})}):null}},{key:"getRegister",value:function(){return this.props.reg?Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Register: ",this.state.acc]})}):null}},{key:"render",value:function(){return Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsx)("div",{className:"split left",children:Object(h.jsx)("div",{className:"centered",children:this.getTable()})}),Object(h.jsx)("div",{className:"split right",children:Object(h.jsxs)("div",{className:"centered",children:[Object(h.jsx)("code",{children:"Instructions:"}),this.getInfo(),this.getButtons(),Object(h.jsx)("br",{}),this.getTape(),this.getOutput(),this.getRegister()]})})]})}}]),n}(i.a.Component);function k(){var e={pos:0,end:!1,tape:[0],cell:0},t=function(e){return function(t,n){t.includes("*")||alert("No halt instruction detected!");var r=[0,1],s=[e],a=0;function i(e){return b({pos:e,vel:r,old:n})}return function(){var n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],c=s[s.length-1];if(n?a&&(a-=1):c.end?s=[e]:a+=1,a<s.length)return s[a];var l=c,h=l.tape,d=l.cell,j=l.end,b=l.pos,f=t[b],p=r,v=Object(u.a)(p,2),O=v[0],g=v[1];if(h=Object(o.a)(h),"\\"===f)r=[g,O];else if("/"===f)r=[-g,-O];else if("<"===f&&d)d-=1;else if(">"===f)(d+=1)===h.length&&h.push(0);else if("-"===f)h[d]^=1;else if("+"!==f||h[d])"*"===f&&(j=!0,b=null);else do{b=i(b),f=t[b]}while(!"\\/<>-+*".includes(f));return null!==b&&(b=i(b)),c={pos:b,tape:h,cell:d,end:j},s.push(c),c}}}(e);return Object(h.jsx)(y,{name:"Back",start:e,run:t,tape:!0})}var w=n(20),S=function(e){Object(m.a)(n,e);var t=Object(x.a)(n);function n(e){var r;return Object(v.a)(this,n),(r=t.call(this,e)).state=Object(p.a)(Object(p.a)({},r.props.start),{},{value:"",code:"",end:!0}),r.func=function(){return r.state},r.handleChange=r.handleChange.bind(Object(g.a)(r)),r}return Object(O.a)(n,[{key:"componentDidMount",value:function(){document.title=this.props.name+" Interpreter | Bangyen"}},{key:"runCode",value:function(e){return function(){var t;if("run"===e)do{t=this.func()}while(!t.end);else t="prev"===e?this.func(!0):this.func();this.setState(t)}.bind(this)}},{key:"handleChange",value:function(e){var t=e.target.value;if(t!==this.state.value){var n=this.props.run(t),r=n.run,s=n.code;this.func=r,this.setState(Object(p.a)(Object(p.a)({},this.props.start),{},{value:t,code:s}))}}},{key:"getProgram",value:function(){var e=this,t=this.state.code,n=Object(o.a)(t).map((function(t,n){var r=e.state.ind===n?"red":"white";return Object(h.jsx)("code",{style:{color:r},children:t},n.toString())})),r="Program:";return n.length&&(r+=" "),Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:[r,n]})})}},{key:"getTape",value:function(){var e=this;if(!this.props.tape)return null;var t=this.state.tape.map((function(t,n){var r=e.state.ptr===n?"red":"white";return Object(h.jsxs)("code",{style:{color:r},children:["\xa0",t]},n.toString())}));return Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Tape:",t]})})}},{key:"getOutput",value:function(){return this.props.out?Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Output:",""===this.state.out?"":" ",this.state.out]})}):null}},{key:"getRegister",value:function(){return this.props.reg?Object(h.jsx)("div",{className:"output",children:Object(h.jsxs)("code",{children:["Register: ",this.state.acc]})}):null}},{key:"render",value:function(){var e=this.props,t=e.name,n=e.link,r=j(this.state.value),s=Object(u.a)(r,2),a=s[0],i=s[1];return Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsx)("div",{className:"split left",children:Object(h.jsxs)("div",{className:"centered",children:[Object(h.jsxs)("code",{children:[t+" ","(",Object(h.jsx)("a",{href:"https://esolangs.org/wiki/"+(n||t),children:"Commands"}),")"]}),Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),Object(h.jsx)("form",{children:Object(h.jsx)("label",{children:Object(h.jsx)("textarea",{value:this.state.value,onChange:this.handleChange,onPaste:this.handleChange,rows:a,cols:i})})}),d("\u25b6",this.runCode("run")),d("\xa0\u276e\xa0",this.runCode("prev")),d("\xa0\u276f\xa0",this.runCode("next")),Object(h.jsx)(c.b,{to:"/",children:Object(h.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}),Object(h.jsx)("div",{className:"split right",children:Object(h.jsxs)("div",{className:"centered",children:[this.getProgram(),this.getTape(),this.getOutput(),this.getRegister()]})})]})}}]),n}(i.a.Component);function N(){var e={tape:[0],acc:0,ind:0,ptr:0,out:"",end:!1},t=function(e){return function(t){var n,r="",s=Object(w.a)(t);try{for(s.s();!(n=s.n()).done;){var a=n.value;"><!,.".includes(a)&&(r+=a)}}catch(u){s.e(u)}finally{s.f()}var i=r.length,c=[e],l=0;return{run:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=c[c.length-1],n=r[l%i],s=t.end;if(e?l&&(l-=1):(l+=1)%i===0?s=!0:t.end&&(s=!1),l<c.length)return c[l];var a=t,u=a.tape,h=a.acc,d=a.ptr,j=a.out,b=l%i;if(u=Object(o.a)(u),">"===n)(d+=1)===u.length&&u.push(0);else if("<"===n)h+=u[d],d=0;else if("!"===n)u[d]-=h-1,u[d]<0&&(u[d]=0),h=0,d=0;else if(","===n){for(var f="";!f.length;)f=prompt("Input: ");h=f.charCodeAt(0)}else h>0&&(j+=String.fromCharCode(h-1));return t={tape:u,acc:h,ind:b,ptr:d,out:j,end:s},c.push(t),t},code:r}}}(e);return Object(h.jsx)(S,{name:"Suffolk",start:e,run:t,tape:!0,out:!0,reg:!0})}function C(){var e={tape:[1],ind:0,ptr:0,end:!1},t=function(e){return function(t){var n,r="",s=Object(w.a)(t);try{for(s.s();!(n=s.n()).done;){var a=n.value;"+-><".includes(a)&&(r+=a)}}catch(u){s.e(u)}finally{s.f()}var i=r.length,c=[e],l=0;return{run:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=c[c.length-1],s=n,a=s.tape,u=s.ptr,h=s.end,d=r[l%i];if(t?l&&(l-=1):(l+=1)%i===0?h=!0:n.end&&(a[u]?h=!1:(c=[e],l=0)),l<c.length)return c[l];var j=l%i;return a=Object(o.a)(a),"+"===d?a[u]+=1:a[u]&&("-"===d?a[u]-=1:">"===d?(u+=1)===a.length&&a.push(1):u&&(u-=1)),n={tape:a,ind:j,ptr:u,end:h},c.push(n),n},code:r}}}(e);return Object(h.jsx)(S,{name:"Stun Step",link:"Stun_Step",start:e,run:t,tape:!0})}function D(e){function t(t){alert(t+" start location detected!");var n={end:!0};return e.pos=null,function(){return n}}function n(e,t,n){var r=Math.abs(e-t);return Math.floor(r/n)+r%n}function r(e,t){var r=t.length,s=[];for(var a in t)"@"===t[a]&&s.push(a);return s.sort(function(e,t){return function(r,s){return n(e,r,t)-n(e,s,t)}}(e,r)),s.length>1?s[1]:e}var s="^v<>",a=[[-1,0],[1,0],[0,-1],[0,1]];return function(n,i){e.pos=null;var c=a[0],l=[e],o=0;if(!n.includes("!"))return t("No");for(var u in n)if("!"===n[u]){if(null!==e.pos)return t("Additional");e.pos=u}function h(e){return b({pos:e,vel:c,old:i})}return function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],u=l[l.length-1];if(t?o&&(o-=1):u.end?l=[e]:o+=1,o<l.length)return l[o];var d=u,j=d.pos,b=d.end,f=d.out,p=d.acc,v=n[j];if(s.includes(v))c=a[s.indexOf(v)];else if("|"===v)c=[-c[0],-c[1]];else if("@"===v)j=r(j,n),(j-=i)<0&&(j+=i*i);else if(+v)p=+v;else if("+"===v)p+=1;else if("-"===v)p-=1;else if("*"===v)p*=2;else if("s"===v)p*=p;else if("/"===v)p=Math.floor(p/2);else if("~"===v)f+=String.fromCharCode(p);else if("?"===v){var O=4*Math.random();c=a[Math.floor(O)]}else"."===v&&(j=null,b=!0);return null!==j&&"@"!==v&&(j=h(j)),u={pos:j,end:b,out:f,acc:p},l.push(u),u}}}function M(){var e={pos:null,end:!1,out:"",acc:0},t=D(e);return Object(h.jsx)(y,{name:"WII2D",start:e,run:t,out:!0,reg:!0})}function I(){var e=window.innerHeight,t=window.innerWidth;e=Math.floor(e/50),t=Math.floor(t/50);var n=Object(o.a)(Array(e)).map((function(e){return Array(t).fill(0)})),r=Math.floor(Math.random()*e),s=Math.floor(Math.random()*t);return n[r][s]=-1,n}var z=function(e){Object(m.a)(n,e);var t=Object(x.a)(n);function n(e){var r;Object(v.a)(this,n),(r=t.call(this,e)).updateDim=r.updateDim.bind(Object(g.a)(r)),r.changeDir=r.changeDir.bind(Object(g.a)(r));var s=I();return r.state={row:s.length,col:s[0].length,len:3,pos:[0,0],vel:[0,1],move:!0,buff:null,arr:s},r}return Object(O.a)(n,[{key:"randomPos",value:function(){var e,t,n=Object(o.a)(this.state.arr),r=this.state.row,s=this.state.col;do{e=Math.floor(Math.random()*r),t=Math.floor(Math.random()*s)}while(n[e][t]);n[e][t]=-1,this.setState({arr:n})}},{key:"updateDim",value:function(){var e=I();this.setState({row:e.length,col:e[0].length,arr:e})}},{key:"changeDir",value:function(e){var t,n=e.key.toLowerCase(),r=this.state.vel;if("arrowleft"===n||"a"===n)t=[0,-1];else if("arrowright"===n||"d"===n)t=[0,1];else if("arrowup"===n||"w"===n)t=[-1,0];else{if("arrowdown"!==n&&"s"!==n)return;t=[1,0]}r[0]+t[0]&&r[0]!==t[0]&&(this.state.move?this.setState({move:!1,vel:t}):this.setState({buff:t}))}},{key:"componentDidMount",value:function(){var e=this;this.timerID=setInterval((function(){return e.move()}),100),document.title="Snake | Bangyen",document.addEventListener("keydown",this.changeDir,!1),this.updateDim(),window.addEventListener("resize",this.updateDim)}},{key:"componentWillUnmount",value:function(){clearInterval(this.timerID),document.removeEventListener("keydown",this.changeDir,!1),window.removeEventListener("resize",this.updateDim)}},{key:"move",value:function(){var e=Object(u.a)(this.state.pos,2),t=e[0],n=e[1],r=Object(u.a)(this.state.vel,2),s=r[0],a=r[1],i=this.state,c=i.row,l=i.col,o=this.state.arr.map((function(e){return e.map((function(e){return e>0?e-1:e}))}));if(n=(n+a+l)%l,o[t=(t+s+c)%c][n]>0){var h=o[t][n];this.setState({len:this.state.len-h}),o=o.map((function(e){return e.map((function(e){return e>h?e-h:-(e<0)}))}))}else o[t][n]<0&&(this.setState({len:this.state.len+1}),this.randomPos(),o=this.state.arr.map((function(e){return e.map((function(e){return e>0?e+1:-(e<0)}))})));o[t][n]=this.state.len;var d=this.state.buff;d&&this.setState({buff:null,vel:d}),this.setState({move:!d,pos:[t,n],arr:o})}},{key:"render",value:function(){return Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsx)("table",{style:{height:"85vh",width:"95vw"},className:"grid",children:Object(h.jsx)("tbody",{children:this.state.arr.map((function(e,t){return Object(h.jsx)("tr",{children:e.map((function(e,n){return Object(h.jsx)("td",{className:"cell select",bgcolor:e>0?"white":e<0?"red":"black",style:{cursor:"default"},children:Object(h.jsx)("div",{children:"\xa0"})},"".concat(t,"-").concat(n))}))},t.toString())}))})}),Object(h.jsx)(c.b,{to:"/",style:{marginBottom:"20px"},children:Object(h.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}}]),n}(i.a.Component);function A(){return document.title="Home | Bangyen",Object(h.jsxs)("header",{className:"App-header select",children:[Object(h.jsx)("h1",{className:"logo",children:"Bangyen"}),Object(h.jsxs)("div",{children:[Object(h.jsxs)("div",{className:"dropdown",children:[Object(h.jsx)("button",{className:"custom",children:"Interpreters"}),Object(h.jsxs)("div",{className:"dropdown-content",children:[Object(h.jsx)(c.b,{to:"/back",children:"Back"}),Object(h.jsx)(c.b,{to:"/stun_step",children:"Stun Step"}),Object(h.jsx)(c.b,{to:"/suffolk",children:"Suffolk"}),Object(h.jsx)(c.b,{to:"/WII2D",children:"WII2D"})]})]}),Object(h.jsx)(c.b,{to:"/videos",children:Object(h.jsx)("button",{className:"custom",type:"button",children:"Videos"})}),Object(h.jsx)(c.b,{to:"/snake",children:Object(h.jsx)("button",{className:"custom",type:"button",children:"Snake"})}),Object(h.jsx)("form",{action:"https://github.com/bangyen",style:{display:"inline-block"},children:Object(h.jsx)("input",{type:"submit",value:"GitHub",className:"custom"})})]})]})}function B(){return document.title="Page Not Found | Bangyen",Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsx)("code",{style:{padding:"10px"},children:"This page isn't available."}),Object(h.jsx)(c.b,{to:"/",style:{marginBottom:"20px"},children:Object(h.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})})]})}function T(e,t){return Object(h.jsx)("div",{children:Object(h.jsx)("iframe",{width:"853",height:"480",src:"https://www.youtube.com/embed/".concat(e),frameBorder:"0",allowFullScreen:!0,title:t})})}var E=function(e){Object(m.a)(n,e);var t=Object(x.a)(n);function n(e){var r;return Object(v.a)(this,n),(r=t.call(this,e)).id=[["Project Glow DC 2022","uoaCbzWmDVk"],["Chicago","Ay6w4Fsk8Ec"],["Washington, DC","xM4Ttema4cg"],["Firefly 2021","nnwVZDGj-SU"]],r.change=r.change.bind(Object(g.a)(r)),r.state={num:0},r}return Object(O.a)(n,[{key:"componentDidMount",value:function(){document.title="Videos | Bangyen"}},{key:"change",value:function(e){var t=this,n=this.id.length,r=this.state.num;return e=r+e+n,function(){t.setState({num:e%n})}}},{key:"render",value:function(){var e=this.state.num,t=Object(u.a)(this.id[e],2),n=t[0],r=t[1];return Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsx)("h1",{children:Object(h.jsx)("code",{children:n})}),T(r,n),Object(h.jsxs)("div",{children:[d("\xa0\u276e\xa0",this.change(-1)),Object(h.jsx)(c.b,{to:"/",children:Object(h.jsx)("button",{className:"custom",type:"button",children:"\ud83c\udfe0\ufe0e"})}),d("\xa0\u276f\xa0",this.change(1))]})]})}}]),n}(i.a.Component);n(38),n(39),n(40);function P(){return Object(h.jsx)(c.a,{basename:"/",children:Object(h.jsx)("div",{children:Object(h.jsxs)(l.c,{children:[Object(h.jsx)(l.a,{exact:!0,path:"/back",children:Object(h.jsx)(k,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/stun_step",children:Object(h.jsx)(C,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/suffolk",children:Object(h.jsx)(N,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/WII2D",children:Object(h.jsx)(M,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/videos",children:Object(h.jsx)(E,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/snake",children:Object(h.jsx)(z,{})}),Object(h.jsx)(l.a,{exact:!0,path:"/",children:Object(h.jsx)(A,{})}),Object(h.jsx)(l.a,{children:Object(h.jsx)(B,{})})]})})})}s.a.render(Object(h.jsx)(i.a.StrictMode,{children:Object(h.jsx)(P,{})}),document.getElementById("root"))}},[[41,1,2]]]);
//# sourceMappingURL=main.29456bc8.chunk.js.map