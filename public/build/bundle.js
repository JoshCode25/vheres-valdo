var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function o(){return Object.create(null)}function i(e){e.forEach(n)}function r(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(t,n,o){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const o=t.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function l(e,t,n,o){return e[1]&&o?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](o(t))):n.ctx}const c="undefined"!=typeof window;let u=c?()=>window.performance.now():()=>Date.now(),d=c?e=>requestAnimationFrame(e):e;const h=new Set;function m(e){h.forEach((t=>{t.c(e)||(h.delete(t),t.f())})),0!==h.size&&d(m)}function f(e,t){e.appendChild(t)}function p(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function y(e){const t=k("style");return function(e,t){f(e.head||e,t),t.sheet}(p(e),t),t.sheet}function g(e,t,n){e.insertBefore(t,n||null)}function $(e){e.parentNode&&e.parentNode.removeChild(e)}function k(e){return document.createElement(e)}function b(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function x(e){return document.createTextNode(e)}function v(){return x(" ")}function w(){return x("")}function T(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function P(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function N(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function D(e,t,n){e.classList[n?"add":"remove"](t)}function V(e,t,{bubbles:n=!1,cancelable:o=!1}={}){const i=document.createEvent("CustomEvent");return i.initCustomEvent(e,n,o,t),i}const L=new Map;let M,S=0;function G(e,t,n,o,i,r,s,a=0){const l=16.666/o;let c="{\n";for(let e=0;e<=1;e+=l){const o=t+(n-t)*r(e);c+=100*e+`%{${s(o,1-o)}}\n`}const u=c+`100% {${s(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${a}`,h=p(e),{stylesheet:m,rules:f}=L.get(h)||function(e,t){const n={stylesheet:y(t),rules:{}};return L.set(e,n),n}(h,e);f[d]||(f[d]=!0,m.insertRule(`@keyframes ${d} ${u}`,m.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${d} ${o}ms linear ${i}ms 1 both`,S+=1,d}function I(e,t){const n=(e.style.animation||"").split(", "),o=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),i=n.length-o.length;i&&(e.style.animation=o.join(", "),S-=i,S||d((()=>{S||(L.forEach((e=>{const{ownerNode:t}=e.stylesheet;t&&$(t)})),L.clear())})))}function C(e){M=e}function H(){const e=function(){if(!M)throw new Error("Function called outside component initialization");return M}();return(t,n,{cancelable:o=!1}={})=>{const i=e.$$.callbacks[t];if(i){const r=V(t,n,{cancelable:o});return i.slice().forEach((t=>{t.call(e,r)})),!r.defaultPrevented}return!0}}const A=[],_=[],z=[],R=[],E=Promise.resolve();let W=!1;function Y(e){z.push(e)}const j=new Set;let F,B=0;function O(){const e=M;do{for(;B<A.length;){const e=A[B];B++,C(e),J(e.$$)}for(C(null),A.length=0,B=0;_.length;)_.pop()();for(let e=0;e<z.length;e+=1){const t=z[e];j.has(t)||(j.add(t),t())}z.length=0}while(A.length);for(;R.length;)R.pop()();W=!1,j.clear(),C(e)}function J(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(Y)}}function q(e,t,n){e.dispatchEvent(V(`${t?"intro":"outro"}${n}`))}const K=new Set;let U;function Z(){U={r:0,c:[],p:U}}function Q(){U.r||i(U.c),U=U.p}function X(e,t){e&&e.i&&(K.delete(e),e.i(t))}function ee(e,t,n,o){if(e&&e.o){if(K.has(e))return;K.add(e),U.c.push((()=>{K.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}else o&&o()}const te={duration:0};function ne(n,o,s,a){let l=o(n,s),c=a?0:1,f=null,p=null,y=null;function g(){y&&I(n,y)}function $(e,t){const n=e.b-c;return t*=Math.abs(n),{a:c,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function k(o){const{delay:r=0,duration:s=300,easing:a=t,tick:k=e,css:b}=l||te,x={start:u()+r,b:o};o||(x.group=U,U.r+=1),f||p?p=x:(b&&(g(),y=G(n,c,o,s,r,a,b)),o&&k(0,1),f=$(x,s),Y((()=>q(n,o,"start"))),function(e){let t;0===h.size&&d(m),new Promise((n=>{h.add(t={c:e,f:n})}))}((e=>{if(p&&e>p.start&&(f=$(p,s),p=null,q(n,f.b,"start"),b&&(g(),y=G(n,c,f.b,f.duration,0,a,l.css))),f)if(e>=f.end)k(c=f.b,1-c),q(n,f.b,"end"),p||(f.b?g():--f.group.r||i(f.group.c)),f=null;else if(e>=f.start){const t=e-f.start;c=f.a+f.d*a(t/f.duration),k(c,1-c)}return!(!f&&!p)})))}return{run(e){r(l)?(F||(F=Promise.resolve(),F.then((()=>{F=null}))),F).then((()=>{l=l(),k(e)})):k(e)},end(){g(),f=p=null}}}function oe(e,t){e.d(1),t.delete(e.key)}function ie(e,t){ee(e,1,1,(()=>{t.delete(e.key)}))}function re(e,t,n,o,i,r,s,a,l,c,u,d){let h=e.length,m=r.length,f=h;const p={};for(;f--;)p[e[f].key]=f;const y=[],g=new Map,$=new Map;for(f=m;f--;){const e=d(i,r,f),a=n(e);let l=s.get(a);l?o&&l.p(e,t):(l=c(a,e),l.c()),g.set(a,y[f]=l),a in p&&$.set(a,Math.abs(f-p[a]))}const k=new Set,b=new Set;function x(e){X(e,1),e.m(a,u),s.set(e.key,e),u=e.first,m--}for(;h&&m;){const t=y[m-1],n=e[h-1],o=t.key,i=n.key;t===n?(u=t.first,h--,m--):g.has(i)?!s.has(o)||k.has(o)?x(t):b.has(i)?h--:$.get(o)>$.get(i)?(b.add(o),x(t)):(k.add(i),h--):(l(n,s),h--)}for(;h--;){const t=e[h];g.has(t.key)||l(t,s)}for(;m;)x(y[m-1]);return y}function se(e){e&&e.c()}function ae(e,t,o,s){const{fragment:a,after_update:l}=e.$$;a&&a.m(t,o),s||Y((()=>{const t=e.$$.on_mount.map(n).filter(r);e.$$.on_destroy?e.$$.on_destroy.push(...t):i(t),e.$$.on_mount=[]})),l.forEach(Y)}function le(e,t){const n=e.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ce(e,t){-1===e.$$.dirty[0]&&(A.push(e),W||(W=!0,E.then(O)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ue(t,n,r,s,a,l,c,u=[-1]){const d=M;C(t);const h=t.$$={fragment:null,ctx:[],props:l,update:e,not_equal:a,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};c&&c(h.root);let m=!1;if(h.ctx=r?r(t,n.props||{},((e,n,...o)=>{const i=o.length?o[0]:n;return h.ctx&&a(h.ctx[e],h.ctx[e]=i)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](i),m&&ce(t,e)),n})):[],h.update(),m=!0,i(h.before_update),h.fragment=!!s&&s(h.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);h.fragment&&h.fragment.l(e),e.forEach($)}else h.fragment&&h.fragment.c();n.intro&&X(t.$$.fragment),ae(t,n.target,n.anchor,n.customElement),O()}C(d)}class de{$destroy(){le(this,1),this.$destroy=e}$on(t,n){if(!r(n))return e;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(n),()=>{const e=o.indexOf(n);-1!==e&&o.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const he=[];function me(t,n=e){let o;const i=new Set;function r(e){if(s(t,e)&&(t=e,o)){const e=!he.length;for(const e of i)e[1](),he.push(e,t);if(e){for(let e=0;e<he.length;e+=2)he[e][0](he[e+1]);he.length=0}}}return{set:r,update:function(e){r(e(t))},subscribe:function(s,a=e){const l=[s,a];return i.add(l),1===i.size&&(o=n(r)||e),s(t),()=>{i.delete(l),0===i.size&&(o(),o=null)}}}}const fe=function(){const e=me({initialTime:30,score:0,highScore:10,remainingTime:30,remainingPercent:100,timerHasBeenSet:!1,timerActive:!1,updateRemainingPercent(){this.remainingPercent=Math.round(this.remainingTime/this.initialTime*100)},resetScore(){this.score=0},resetTime(){this.remainingTime=this.initialTime,this.updateRemainingPercent()}});return{subscribe:e.subscribe,setTimerActive:()=>e.update((e=>(e.timerActive=!0,e))),setTimerInactive:()=>e.update((e=>(e.timerActive=!1,e))),setInitialTime:t=>e.update((e=>(e.initialTime=t,e.remainingTime=t,e))),incrementTime:t=>e.update((e=>(e.remainingTime=e.remainingTime+t,e.updateRemainingPercent(),e))),decrementTime:t=>e.update((e=>(e.remainingTime=e.remainingTime-t,e.updateRemainingPercent(),e))),resetGame:()=>e.update((e=>(e.resetScore(),e.resetTime(),e))),increaseScore:t=>e.update((e=>(e.score=e.score+t,e))),setHighscore:t=>e.update((e=>(e.highScore=t,e)))}}();function pe(t){let n,o;return{c(){n=k("div"),o=k("div"),P(o,"class","timerBar svelte-1wamyou"),P(n,"class","timerBarWrapper svelte-1wamyou"),P(n,"style",t[0])},m(e,t){g(e,n,t),f(n,o)},p(e,[t]){1&t&&P(n,"style",e[0])},i:e,o:e,d(e){e&&$(n)}}}function ye(e,t,n){let o,i;a(e,fe,(e=>n(2,i=e)));let r=["green","orange","red"],s=r[0];return e.$$.update=()=>{6&e.$$.dirty&&(i.remainingPercent>=50&&s!==r[0]?n(1,s=r[0]):i.remainingPercent<50&&s!==r[1]?n(1,s=r[1]):i.remainingPercent<10&&s!==r[2]&&n(1,s=r[2])),6&e.$$.dirty&&n(0,o=`--width: ${i.remainingPercent}%; --background-color: ${s}`)},[o,s,i]}class ge extends de{constructor(e){super(),ue(this,e,ye,pe,s,{})}}const $e=[{name:"Brown",hex:"8d5524",rgb:[141,85,36],cmyk:[0,40,74,45],hsb:[28,74,55],hsl:[28,59,35],lab:[42,19,37]},{name:"Bronze",hex:"c68642",rgb:[198,134,66],cmyk:[0,32,67,22],hsb:[31,67,78],hsl:[31,54,52],lab:[61,18,46]},{name:"Earth Yellow",hex:"e0ac69",rgb:[224,172,105],cmyk:[0,23,53,12],hsb:[34,53,88],hsl:[34,66,65],lab:[74,11,42]},{name:"Gold Crayola",hex:"f1c27d",rgb:[241,194,125],cmyk:[0,20,48,5],hsb:[36,48,95],hsl:[36,81,72],lab:[81,8,41]},{name:"Deep Champagne",hex:"ffdbac",rgb:[255,219,172],cmyk:[0,14,33,0],hsb:[34,33,100],hsl:[34,100,84],lab:[89,6,28]}],ke=["Anibrev","Bakinaw","Calibrew","Deknure","Elimoore","Farigraph","Ge","Hanifred","Indigo","Jerepass","Kekanumatonadoe","Lilu","Mavito","Neen","Oi","Prespinta","Q","Reshira","Sariphone","Tavisha","Umpturmass","Variphore","Wiltmoore","Xythe","Yershig","Zashima","Adrik","Baboi","Cra","Dartrik","Edgrene","Ferdinhand","Greaseinhamworth","Hue","Intison","Jurst","Kwekrish","Limast","Markwin","Nerdinand","Ogredin","Petegrismik","Questbrink","Rhestoromor","Stagrtire","Tiv","U","Valdo","Workwillmingtonham","Xyther","Yassy","Zeriford"],be=["Acre","Adathming","Brinkbronk","Bro","Cascade","Crustler","Dynamrick","Dustoshelf","Elison","Eghsk","Fsark","Fi","Gershandermind","Grint","Hinkminghan","Hunkertonmore","I","Ishmihash","Jrush","Jergo","Klimpkly","Ktuse","Lalilome","Lwaliluke","Madders","Mintma","Naftorafti","Nertmew","Oithyou","Ohgruq","Pepp","Poi","Qwertikeytab","Quibsta","Rickruck","Rhy","Salvisious","Slide","Tumpterton","To","Udgee","Uthergriv","Valdo","Vestiz","Westoip","Wringrij","XL","Xerximars","Yashrima","Yupe","Zawkimoh","Zcrievklmas"],xe=["Hey","Heru","Yersh","Yupsle","Ye-Yers","Heha","Yo","Hi","Sup","So'up","Wa-hey","Ye bop","Greetings","Y'all","Hio","Wowa"],ve=["You got me!","Here I am!","What a find!","I thought I was gonna get you on that one","How'd you know it was me?","No hiding the wool over your eyes","That hiding spot usually works","Good eye!","Looks like you can still see the trees in the forest","Are you sure I'm the one? ... Yeah it's me","Do you have time to find another?","I knew I should've picked a different spot!","Aww Rat-paste! You win!","I think I'll use my invisibility cloak next time","Wait, you got me already?","It takes two to tango but just you to find me","Okay, I'm the one","Yep, it's me!","Uh-huh, pat yourself on the back","Correct, but don't get too full of yourself","The next one will be more difficult!"],we=["Not today","You best be tryin' again","I don't look anything like them!","Negative, nope, nada!","I'm trying to read over here!","I'd ask you to help find my phone, but I think I need someone a little bit more skilled in the finding arena","Haha, nope!","Try again friend!","Was that your final answer?","Maybe next time","Don't quit your day job - or night if you've got that shift","I'm flattered you confused me with the real Valdo","You fell for my clever disguise! Try again!","You're still it!","Keep trying","Pick another","Have you seen my wallet?","Are you the one who took my ice cream?","The longer I look at the sun, the darker everything gets","Sorry, I was day dreaming - try again","I think they got it wrong, try me again!","Ewww! When was the last time you washed your hands?","Here's some more points - wait, nevermind","The timer's gonna keep ticking!","That tickled! No points for you!","Nope","Zilch","Nada","Nuh-uh","No no no no","Not me!","Nopers","Negatory","Sorry, wrong one!","I hate to disappoint you, but I'm not who you're looking for","Noooooooope!","Nah no Nah Nah!","Um... no","What day is it?","Are you allergic to incorrect answers?","Not a perfect score for you, but you can try again"];function Te(){let e=ke.slice().sort((()=>Math.random()-.5)),t=be.slice().sort((()=>Math.random()-.5)),n=xe.slice().sort((()=>Math.random()-.5)),o=ve.slice().sort((()=>Math.random()-.5)),i=we.slice().sort((()=>Math.random()-.5));return e.map(((e,r)=>({firstName:e,lastName:t[r],greeting:n[r%n.length],fullName:`${e} ${t[r]}`,correctResponse:o[r%o.length],incorrectResponse:i[r%i.length],skinTone:"#"+$e[r%$e.length].hex})))}let Pe=Te();const Ne=function(){const e=me({totalValdoList:Pe,netValdoList:Pe,activeValdo:{},displayedValdos:[],minDisplayedValdoNumber:4,foundValdos:[],activatedGame:!1,shuffleNetValdoList(){let e=function(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1)),o=e[t];e[t]=e[n],e[n]=o}return e}(this.netValdoList.slice());this.netValdoList=e},setActiveValdo(){this.activeValdo=this.displayedValdos[Math.floor(Math.random()*this.displayedValdos.length)]},setDisplayedValdos(){this.shuffleNetValdoList();let e=this.netValdoList.slice(0,2*this.foundValdos.length+this.minDisplayedValdoNumber);this.displayedValdos=e,this.setActiveValdo()},addFoundValdo(){let e=this.netValdoList.findIndex((e=>e.fullName===this.activeValdo.fullName));if(-1!==e){let t=this.netValdoList.splice(e,1);return this.foundValdos=[...this.foundValdos,t],void this.setDisplayedValdos()}console.log(this.activeValdo,e)}});return{subscribe:e.subscribe,startNewGame:()=>e.update((e=>(e.activatedGame=!0,e.foundValdos.length=0,e.setDisplayedValdos(),console.log(e),e))),startNewRound:()=>e.update((e=>(e.addFoundValdo(),e))),finishGame:()=>e.update((e=>(e.activatedGame=!1,e.totalValdoList=Te(),e.netValdoList=e.totalValdoList,e)))}}();function De(e,{delay:n=0,duration:o=400,easing:i=t}={}){const r=+getComputedStyle(e).opacity;return{delay:n,duration:o,easing:i,css:e=>"opacity: "+e*r}}function Ve(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Le(e,t){let{x:n,y:o}=e,{x:i,y:r}=t,s=i-n,a=r-o;return{x:i-n,y:r-o,angleToHoriz:Math.atan(a/s)}}let Me=function(e){let t=[...e,...e],n="abcdefghijklmnopqrstuvwxyz".split("").sort((()=>Math.random()-.5));return t.reduce(((e,t,o)=>(e[n[o]]=`#${t.hex}`,e)),{})}([{name:"Vivid Sky Blue",hex:"5ad2f4",rgb:[90,210,244],cmyk:[63,14,0,4],hsb:[193,63,96],hsl:[193,88,65],lab:[79,-24,-27]},{name:"Rebecca Purple",hex:"6e2594",rgb:[110,37,148],cmyk:[26,75,0,42],hsb:[279,75,58],hsl:[279,60,36],lab:[31,50,-47]},{name:"Minion Yellow",hex:"ecd444",rgb:[236,212,68],cmyk:[0,10,71,7],hsb:[51,71,93],hsl:[51,82,60],lab:[85,-7,70]},{name:"Blue Crayola",hex:"2176ff",rgb:[33,118,255],cmyk:[87,54,0,0],hsb:[217,87,100],hsl:[217,100,56],lab:[52,26,-75]},{name:"Brick Red",hex:"d1495b",rgb:[209,73,91],cmyk:[0,65,56,18],hsb:[352,65,82],hsl:[352,60,55],lab:[51,55,19]},{name:"Asparagus",hex:"87a878",rgb:[135,168,120],cmyk:[20,0,29,34],hsb:[101,29,66],hsl:[101,22,56],lab:[65,-20,21]},{name:"Onyx",hex:"32373b",rgb:[50,55,59],cmyk:[15,7,0,77],hsb:[207,15,23],hsl:[207,8,21],lab:[23,-1,-3]},{name:"Tea Green",hex:"dbf9b8",rgb:[219,249,184],cmyk:[12,0,26,2],hsb:[88,26,98],hsl:[88,84,85],lab:[94,-21,28]},{name:"Vivid Tangerine",hex:"eb9486",rgb:[235,148,134],cmyk:[0,37,43,8],hsb:[8,43,92],hsl:[8,72,72],lab:[70,31,21]},{name:"Khaki Web",hex:"cab7a2",rgb:[202,183,162],cmyk:[0,9,20,21],hsb:[32,20,79],hsl:[32,27,71],lab:[75,3,13]},{name:"Magenta",hex:"f038ff",rgb:[240,56,255],cmyk:[6,78,0,0],hsb:[295,78,100],hsl:[295,100,61],lab:[60,88,-61]},{name:"Cyclamen",hex:"ef709d",rgb:[239,112,157],cmyk:[0,53,34,6],hsb:[339,53,94],hsl:[339,80,69],lab:[64,53,-1]},{name:"Granny Smith Apple",hex:"c7f2a7",rgb:[199,242,167],cmyk:[18,0,31,5],hsb:[94,31,95],hsl:[94,74,80],lab:[91,-27,32]}]);console.log(Me);const Se={subscribe:me({apparelColorList:Me,apparelLengths:[3,10],sleevePantLength:.85,apparelThickness:4},(e=>()=>{})).subscribe};function Ge(e,t,n){const o=e.slice();return o[24]=t[n],o[26]=n,o}function Ie(e){let t,n=[],o=new Map,i=e[8];const r=e=>e[24].x;for(let t=0;t<i.length;t+=1){let s=Ge(e,i,t),a=r(s);o.set(a,n[t]=Ce(a,s))}return{c(){for(let e=0;e<n.length;e+=1)n[e].c();t=w()},m(e,o){for(let t=0;t<n.length;t+=1)n[t].m(e,o);g(e,t,o)},p(e,s){785&s&&(i=e[8],n=re(n,s,r,1,e,i,o,t.parentNode,oe,Ce,t,Ge))},d(e){for(let t=0;t<n.length;t+=1)n[t].d(e);e&&$(t)}}}function Ce(e,t){let n,o,i;return{key:e,first:null,c(){n=b("circle"),P(n,"id",o=t[9][t[26]]+t[4]),P(n,"cx",t[24].x),P(n,"cy",t[24].y),P(n,"r",i=t[0]/4),this.first=n},m(e,t){g(e,n,t)},p(e,r){t=e,16&r&&o!==(o=t[9][t[26]]+t[4])&&P(n,"id",o),1&r&&i!==(i=t[0]/4)&&P(n,"r",i)},d(e){e&&$(n)}}}function He(t){let n,o,i,r,s,a=t[11]&&function(e){let t,n,o;return{c(){t=b("path"),P(t,"id",n=`${e[3]}${e[4]}sleeve`),P(t,"d",e[6]),P(t,"stroke",e[12]),P(t,"stroke-width",o=e[7].apparelThickness*e[1]),P(t,"class","svelte-1k8lj6w")},m(e,n){g(e,t,n)},p(e,i){24&i&&n!==(n=`${e[3]}${e[4]}sleeve`)&&P(t,"id",n),64&i&&P(t,"d",e[6]),130&i&&o!==(o=e[7].apparelThickness*e[1])&&P(t,"stroke-width",o)},d(e){e&&$(t)}}}(t),l=t[5]&&Ie(t);return{c(){n=b("path"),i=v(),a&&a.c(),r=v(),l&&l.c(),s=w(),P(n,"id",o=`${t[3]}${t[4]}arm`),P(n,"d",t[10]),P(n,"stroke",t[2]),P(n,"stroke-width",t[1]),P(n,"class","svelte-1k8lj6w")},m(e,t){g(e,n,t),g(e,i,t),a&&a.m(e,t),g(e,r,t),l&&l.m(e,t),g(e,s,t)},p(e,[t]){24&t&&o!==(o=`${e[3]}${e[4]}arm`)&&P(n,"id",o),4&t&&P(n,"stroke",e[2]),2&t&&P(n,"stroke-width",e[1]),e[11]&&a.p(e,t),e[5]?l?l.p(e,t):(l=Ie(e),l.c(),l.m(s.parentNode,s)):l&&(l.d(1),l=null)},i:e,o:e,d(e){e&&$(n),e&&$(i),a&&a.d(e),e&&$(r),l&&l.d(e),e&&$(s)}}}function Ae(e,t,n){let o;a(e,Se,(e=>n(7,o=e)));let{shoulderPoint:i={x:10,y:10}}=t,{handPoint:r={x:15,y:15}}=t,{headDiameter:s=5}=t,{maxArmLength:l=3*s}=t,{limbThickness:c=4}=t,{skinTone:u="black"}=t,{fullName:d="Jimberly Hanifred"}=t,{armType:h="none"}=t,{displayDots:m=!0}=t,f=d.split(" ")[0],p={},y=Ve(i,r),g=l/2,{angleToHoriz:$}=Le(i,r);if("left"===h&&($+=Math.PI),y>=l)p={x:l*Math.cos($)/2,y:l*Math.sin($)/2};else if(y<l){let e=$-Math.acos(y/(2*g));p={x:g*Math.cos(e),y:g*Math.sin(e)}}let k={x:i.x+p.x,y:i.y+p.y},b=[i,k,r],x=Le(k,r),v=`M ${i.x} ${i.y} \n    l ${p.x} ${p.y} \n    l ${x.x} ${x.y}`,w=f.length>o.apparelLengths[0],T="",P=o.apparelColorList[f[0].toLowerCase()];if(w){let e,t,n=f.length>o.apparelLengths[1]?"long":"short";"long"===n?(e=p,t={x:x.x*o.sleevePantLength,y:x.y*o.sleevePantLength},T=`M ${i.x} ${i.y} \n        l ${e.x} ${e.y} \n        l ${t.x} ${t.y}`):"short"===n&&(e={x:p.x*o.sleevePantLength,y:p.y*o.sleevePantLength},T=`M ${i.x} ${i.y} \n        l ${e.x} ${e.y}`)}return e.$$set=e=>{"shoulderPoint"in e&&n(13,i=e.shoulderPoint),"handPoint"in e&&n(14,r=e.handPoint),"headDiameter"in e&&n(0,s=e.headDiameter),"maxArmLength"in e&&n(15,l=e.maxArmLength),"limbThickness"in e&&n(1,c=e.limbThickness),"skinTone"in e&&n(2,u=e.skinTone),"fullName"in e&&n(3,d=e.fullName),"armType"in e&&n(4,h=e.armType),"displayDots"in e&&n(5,m=e.displayDots)},[s,c,u,d,h,m,T,o,b,["shoulder","elbow","hand"],v,w,P,i,r,l]}console.log(Se);class _e extends de{constructor(e){super(),ue(this,e,Ae,He,s,{shoulderPoint:13,handPoint:14,headDiameter:0,maxArmLength:15,limbThickness:1,skinTone:2,fullName:3,armType:4,displayDots:5})}}function ze(t){let n,o,i,r;return{c(){n=b("circle"),P(n,"cx",o=t[0].x),P(n,"cy",i=t[0].y),P(n,"r",r=t[1]/2),P(n,"stroke",t[3]),P(n,"stroke-width",t[2]),P(n,"fill",t[3])},m(e,t){g(e,n,t)},p(e,[t]){1&t&&o!==(o=e[0].x)&&P(n,"cx",o),1&t&&i!==(i=e[0].y)&&P(n,"cy",i),2&t&&r!==(r=e[1]/2)&&P(n,"r",r),8&t&&P(n,"stroke",e[3]),4&t&&P(n,"stroke-width",e[2]),8&t&&P(n,"fill",e[3])},i:e,o:e,d(e){e&&$(n)}}}function Re(e,t,n){let{headPoint:o={}}=t,{headDiameter:i=15}=t,{strokeWidth:r=4}=t,{skinTone:s="black"}=t;return e.$$set=e=>{"headPoint"in e&&n(0,o=e.headPoint),"headDiameter"in e&&n(1,i=e.headDiameter),"strokeWidth"in e&&n(2,r=e.strokeWidth),"skinTone"in e&&n(3,s=e.skinTone)},[o,i,r,s]}class Ee extends de{constructor(e){super(),ue(this,e,Re,ze,s,{headPoint:0,headDiameter:1,strokeWidth:2,skinTone:3})}}function We(e,t,n){const o=e.slice();return o[24]=t[n],o[26]=n,o}function Ye(e){let t,n=[],o=new Map,i=e[8];const r=e=>e[24].x;for(let t=0;t<i.length;t+=1){let s=We(e,i,t),a=r(s);o.set(a,n[t]=je(a,s))}return{c(){for(let e=0;e<n.length;e+=1)n[e].c();t=w()},m(e,o){for(let t=0;t<n.length;t+=1)n[t].m(e,o);g(e,t,o)},p(e,s){785&s&&(i=e[8],n=re(n,s,r,1,e,i,o,t.parentNode,oe,je,t,We))},d(e){for(let t=0;t<n.length;t+=1)n[t].d(e);e&&$(t)}}}function je(e,t){let n,o,i;return{key:e,first:null,c(){n=b("circle"),P(n,"id",o=t[9][t[26]]+t[4]),P(n,"cx",t[24].x),P(n,"cy",t[24].y),P(n,"r",i=t[0]/4),this.first=n},m(e,t){g(e,n,t)},p(e,r){t=e,16&r&&o!==(o=t[9][t[26]]+t[4])&&P(n,"id",o),1&r&&i!==(i=t[0]/4)&&P(n,"r",i)},d(e){e&&$(n)}}}function Fe(t){let n,o,i,r,s,a=t[11]&&function(e){let t,n,o;return{c(){t=b("path"),P(t,"id",n=`${e[3]}${e[4]}pant`),P(t,"d",e[6]),P(t,"stroke",e[12]),P(t,"stroke-width",o=e[7].apparelThickness*e[1]),P(t,"class","svelte-1k8lj6w")},m(e,n){g(e,t,n)},p(e,i){24&i&&n!==(n=`${e[3]}${e[4]}pant`)&&P(t,"id",n),64&i&&P(t,"d",e[6]),130&i&&o!==(o=e[7].apparelThickness*e[1])&&P(t,"stroke-width",o)},d(e){e&&$(t)}}}(t),l=t[5]&&Ye(t);return{c(){n=b("path"),i=v(),a&&a.c(),r=v(),l&&l.c(),s=w(),P(n,"id",o=`${t[3]}${t[4]}arm`),P(n,"d",t[10]),P(n,"stroke",t[2]),P(n,"stroke-width",t[1]),P(n,"class","svelte-1k8lj6w")},m(e,t){g(e,n,t),g(e,i,t),a&&a.m(e,t),g(e,r,t),l&&l.m(e,t),g(e,s,t)},p(e,[t]){24&t&&o!==(o=`${e[3]}${e[4]}arm`)&&P(n,"id",o),4&t&&P(n,"stroke",e[2]),2&t&&P(n,"stroke-width",e[1]),e[11]&&a.p(e,t),e[5]?l?l.p(e,t):(l=Ye(e),l.c(),l.m(s.parentNode,s)):l&&(l.d(1),l=null)},i:e,o:e,d(e){e&&$(n),e&&$(i),a&&a.d(e),e&&$(r),l&&l.d(e),e&&$(s)}}}function Be(e,t,n){let o;a(e,Se,(e=>n(7,o=e)));let{hipPoint:i={x:10,y:10}}=t,{footPoint:r={x:15,y:15}}=t,{headDiameter:s=5}=t,{maxLegLength:l=3*s}=t,{limbThickness:c=4}=t,{skinTone:u="black"}=t,{fullName:d="Jimberly Hanifred"}=t,{legType:h="none"}=t,{displayDots:m=!0}=t,f=d.split(" ")[1],p={},y=Ve(i,r),g=l/2,{angleToHoriz:$}=Le(i,r);if("left"===h&&($+=Math.PI),y>=l)p={x:l*Math.cos($)/2,y:l*Math.sin($)/2};else if(y<l){let e=$-Math.acos(y/(2*g));p={x:g*Math.cos(e),y:g*Math.sin(e)}}let k={x:i.x+p.x,y:i.y+p.y},b=[i,k,r],x=Le(k,r),v=`M ${i.x} ${i.y} \n  l ${p.x} ${p.y} \n  l ${x.x} ${x.y}`,w=f.length>o.apparelLengths[0],T="",P=o.apparelColorList[f[0].toLowerCase()];if(w){let e,t,n=f.length>o.apparelLengths[1]?"long":"short";"long"===n?(e=p,t={x:x.x*o.sleevePantLength,y:x.y*o.sleevePantLength},T=`M ${i.x} ${i.y} \n        l ${e.x} ${e.y} \n        l ${t.x} ${t.y}`):"short"===n&&(e={x:p.x*o.sleevePantLength,y:p.y*o.sleevePantLength},T=`M ${i.x} ${i.y} \n        l ${e.x} ${e.y}`)}return e.$$set=e=>{"hipPoint"in e&&n(13,i=e.hipPoint),"footPoint"in e&&n(14,r=e.footPoint),"headDiameter"in e&&n(0,s=e.headDiameter),"maxLegLength"in e&&n(15,l=e.maxLegLength),"limbThickness"in e&&n(1,c=e.limbThickness),"skinTone"in e&&n(2,u=e.skinTone),"fullName"in e&&n(3,d=e.fullName),"legType"in e&&n(4,h=e.legType),"displayDots"in e&&n(5,m=e.displayDots)},[s,c,u,d,h,m,T,o,b,["hip","knee","foot"],v,w,P,i,r,l]}class Oe extends de{constructor(e){super(),ue(this,e,Be,Fe,s,{hipPoint:13,footPoint:14,headDiameter:0,maxLegLength:15,limbThickness:1,skinTone:2,fullName:3,legType:4,displayDots:5})}}function Je(t){let n,o,i,r,s;return{c(){n=b("line"),P(n,"x1",o=t[0].x),P(n,"y1",i=t[0].y),P(n,"x2",r=t[1].x),P(n,"y2",s=t[1].y),P(n,"stroke",t[3]),P(n,"stroke-width",t[2])},m(e,t){g(e,n,t)},p(e,[t]){1&t&&o!==(o=e[0].x)&&P(n,"x1",o),1&t&&i!==(i=e[0].y)&&P(n,"y1",i),2&t&&r!==(r=e[1].x)&&P(n,"x2",r),2&t&&s!==(s=e[1].y)&&P(n,"y2",s),8&t&&P(n,"stroke",e[3]),4&t&&P(n,"stroke-width",e[2])},i:e,o:e,d(e){e&&$(n)}}}function qe(e,t,n){let{neckPoint:o={}}=t,{shoulderPoint:i={}}=t,{limbThickness:r=4}=t,{skinTone:s="black"}=t;return e.$$set=e=>{"neckPoint"in e&&n(0,o=e.neckPoint),"shoulderPoint"in e&&n(1,i=e.shoulderPoint),"limbThickness"in e&&n(2,r=e.limbThickness),"skinTone"in e&&n(3,s=e.skinTone)},[o,i,r,s]}class Ke extends de{constructor(e){super(),ue(this,e,qe,Je,s,{neckPoint:0,shoulderPoint:1,limbThickness:2,skinTone:3})}}function Ue(t){let n,o,i,r,s,a,l,c,u,d,h,m,f;return{c(){n=b("line"),a=v(),l=b("line"),P(n,"x1",o=t[0].x),P(n,"y1",i=t[0].y),P(n,"x2",r=t[1].x),P(n,"y2",s=t[1].y),P(n,"stroke",t[3]),P(n,"stroke-width",t[2]),P(l,"x1",c=t[0].x),P(l,"y1",u=t[0].y),P(l,"x2",d=t[1].x),P(l,"y2",h=t[1].y),P(l,"stroke",m=t[4].apparelColorList[t[5][0]]),P(l,"stroke-width",f=t[2]*t[4].apparelThickness*2)},m(e,t){g(e,n,t),g(e,a,t),g(e,l,t)},p(e,[t]){1&t&&o!==(o=e[0].x)&&P(n,"x1",o),1&t&&i!==(i=e[0].y)&&P(n,"y1",i),2&t&&r!==(r=e[1].x)&&P(n,"x2",r),2&t&&s!==(s=e[1].y)&&P(n,"y2",s),8&t&&P(n,"stroke",e[3]),4&t&&P(n,"stroke-width",e[2]),1&t&&c!==(c=e[0].x)&&P(l,"x1",c),1&t&&u!==(u=e[0].y)&&P(l,"y1",u),2&t&&d!==(d=e[1].x)&&P(l,"x2",d),2&t&&h!==(h=e[1].y)&&P(l,"y2",h),16&t&&m!==(m=e[4].apparelColorList[e[5][0]])&&P(l,"stroke",m),20&t&&f!==(f=e[2]*e[4].apparelThickness*2)&&P(l,"stroke-width",f)},i:e,o:e,d(e){e&&$(n),e&&$(a),e&&$(l)}}}function Ze(e,t,n){let o;a(e,Se,(e=>n(4,o=e)));let{shoulderPoint:i={}}=t,{hipPoint:r={}}=t,{torsoThickness:s=4}=t,{fullName:l="Jack Gerifor"}=t,{skinTone:c="black"}=t,u=l[0].toLowerCase();return e.$$set=e=>{"shoulderPoint"in e&&n(0,i=e.shoulderPoint),"hipPoint"in e&&n(1,r=e.hipPoint),"torsoThickness"in e&&n(2,s=e.torsoThickness),"fullName"in e&&n(6,l=e.fullName),"skinTone"in e&&n(3,c=e.skinTone)},[i,r,s,c,o,u,l]}class Qe extends de{constructor(e){super(),ue(this,e,Ze,Ue,s,{shoulderPoint:0,hipPoint:1,torsoThickness:2,fullName:6,skinTone:3})}}function Xe(t){let n;return{c(){n=k("h3"),n.textContent=`${t[5]}`,P(n,"class","svelte-1utlztj")},m(e,t){g(e,n,t)},p:e,i:e,o:e,d(e){e&&$(n)}}}function et(e){let t,n,o,i,r,s,a,l,c,u,d;n=new Ee({props:{headPoint:e[10],headDiameter:e[9],strokeWidth:e[8],skinTone:e[6]}}),o=new Ke({props:{neckPoint:e[11],shoulderPoint:e[12],limbThickness:e[18],skinTone:e[6]}}),i=new Qe({props:{shoulderPoint:e[12],hipPoint:e[13],torsoThickness:e[19],skinTone:e[6],fullName:e[5]}}),r=new _e({props:{displayDots:e[4],fullName:e[5],armType:"right",shoulderPoint:e[12],headDiameter:e[9],handPoint:e[14],limbThickness:e[18],skinTone:e[6]}}),s=new _e({props:{displayDots:e[4],fullName:e[5],armType:"left",shoulderPoint:e[12],headDiameter:e[9],handPoint:e[15],limbThickness:e[18],skinTone:e[6]}}),a=new Oe({props:{displayDots:e[4],fullName:e[5],legType:"right",hipPoint:e[13],headDiameter:e[9],footPoint:e[16],limbThickness:e[18],skinTone:e[6]}}),l=new Oe({props:{displayDots:e[4],fullName:e[5],legType:"left",hipPoint:e[13],headDiameter:e[9],footPoint:e[17],limbThickness:e[18],skinTone:e[6]}});let h=e[3]&&tt(e);return{c(){t=b("svg"),se(n.$$.fragment),se(o.$$.fragment),se(i.$$.fragment),se(r.$$.fragment),se(s.$$.fragment),se(a.$$.fragment),se(l.$$.fragment),c=v(),h&&h.c(),u=w(),P(t,"width",e[7]),P(t,"height",e[1])},m(e,m){g(e,t,m),ae(n,t,null),ae(o,t,null),ae(i,t,null),ae(r,t,null),ae(s,t,null),ae(a,t,null),ae(l,t,null),g(e,c,m),h&&h.m(e,m),g(e,u,m),d=!0},p(e,n){const o={};16&n&&(o.displayDots=e[4]),r.$set(o);const i={};16&n&&(i.displayDots=e[4]),s.$set(i);const c={};16&n&&(c.displayDots=e[4]),a.$set(c);const m={};16&n&&(m.displayDots=e[4]),l.$set(m),(!d||2&n)&&P(t,"height",e[1]),e[3]?h?h.p(e,n):(h=tt(e),h.c(),h.m(u.parentNode,u)):h&&(h.d(1),h=null)},i(e){d||(X(n.$$.fragment,e),X(o.$$.fragment,e),X(i.$$.fragment,e),X(r.$$.fragment,e),X(s.$$.fragment,e),X(a.$$.fragment,e),X(l.$$.fragment,e),d=!0)},o(e){ee(n.$$.fragment,e),ee(o.$$.fragment,e),ee(i.$$.fragment,e),ee(r.$$.fragment,e),ee(s.$$.fragment,e),ee(a.$$.fragment,e),ee(l.$$.fragment,e),d=!1},d(e){e&&$(t),le(n),le(o),le(i),le(r),le(s),le(a),le(l),e&&$(c),h&&h.d(e),e&&$(u)}}}function tt(t){let n;return{c(){n=k("p"),n.textContent=`${t[5]}`,P(n,"class","svelte-1utlztj")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function nt(e){let t,n,o,i,r,s,a;const l=[et,Xe],c=[];function u(e,t){return e[0]?0:1}return n=u(e),o=c[n]=l[n](e),{c(){t=k("div"),o.c(),P(t,"class","svelte-1utlztj"),D(t,"hoverPointer",e[2])},m(o,i){g(o,t,i),c[n].m(t,null),r=!0,s||(a=T(t,"click",e[20]),s=!0)},p(e,[i]){let s=n;n=u(e),n===s?c[n].p(e,i):(Z(),ee(c[s],1,1,(()=>{c[s]=null})),Q(),o=c[n],o?o.p(e,i):(o=c[n]=l[n](e),o.c()),X(o,1),o.m(t,null)),(!r||4&i)&&D(t,"hoverPointer",e[2])},i(e){r||(X(o),Y((()=>{i||(i=ne(t,De,{},!0)),i.run(1)})),r=!0)},o(e){ee(o),i||(i=ne(t,De,{},!1)),i.run(0),r=!1},d(e){e&&$(t),c[n].d(),e&&i&&i.end(),s=!1,a()}}}function ot(e,t,n){let{valdoData:o={}}=t,{displaySVG:i=!0}=t,{totalHeight:r=150}=t,{hoverPointer:s=!0}=t,{showFullName:a=!1}=t,{displayDots:l=!0}=t,{firstName:c="Jeshua",lastName:u="Granstand",fullName:d=`${c} ${u}`,skinTone:h="black",greeting:m="hello",correctResponse:f="yes",incorrectResponse:p="no",height:y=.95*r,width:g=5*y/6,strokeWidth:$=2,midPoint:k={x:g/2,y:y/2},headDiameter:b=y/7,headPoint:x={x:k.x,y:$+b/2},neckPoint:v={x:k.x,y:2+b},shoulderPoint:w={x:k.x,y:2+1.5*b},hipPoint:T={x:k.x,y:4*b},rightHandPoint:P={x:k.x+2*b,y:.75*T.y},leftHandPoint:N={x:k.x-2*b,y:x.y},rightFootPoint:D={x:k.x+2*b,y:1.25*T.y},leftFootPoint:V={x:k.x-2*b,y:y},limbThickness:L=y/50,torsoThickness:M=L}=o;const S=H();return e.$$set=e=>{"valdoData"in e&&n(21,o=e.valdoData),"displaySVG"in e&&n(0,i=e.displaySVG),"totalHeight"in e&&n(1,r=e.totalHeight),"hoverPointer"in e&&n(2,s=e.hoverPointer),"showFullName"in e&&n(3,a=e.showFullName),"displayDots"in e&&n(4,l=e.displayDots)},[i,r,s,a,l,d,h,g,$,b,x,v,w,T,P,N,D,V,L,M,function(){S("tag",{fullName:d,greeting:m,correctResponse:f,incorrectResponse:p})},o]}class it extends de{constructor(e){super(),ue(this,e,ot,nt,s,{valdoData:21,displaySVG:0,totalHeight:1,hoverPointer:2,showFullName:3,displayDots:4})}}function rt(t){let n,o,i;return{c(){n=k("button"),n.textContent="Play Again?",P(n,"class","hoverPointer svelte-3yivzb")},m(e,r){g(e,n,r),o||(i=T(n,"click",t[4]),o=!0)},p:e,d(e){e&&$(n),o=!1,i()}}}function st(t){let n;return{c(){n=k("h2"),n.textContent="Current Valdo:",P(n,"class","svelte-3yivzb")},m(e,t){g(e,n,t)},p:e,d(e){e&&$(n)}}}function at(t){let n,o,i;return{c(){n=k("button"),n.textContent="Click to Start",P(n,"class","hoverPointer svelte-3yivzb")},m(e,r){g(e,n,r),o||(i=T(n,"click",t[4]),o=!0)},p:e,d(e){e&&$(n),o=!1,i()}}}function lt(t){let n;return{c(){n=k("h4"),n.textContent="New Valdo Pending..."},m(e,t){g(e,n,t)},p:e,i:e,o:e,d(e){e&&$(n)}}}function ct(t){let n,o,i=t[1].activeValdo,r=ut(t);return{c(){r.c(),n=w()},m(e,t){r.m(e,t),g(e,n,t),o=!0},p(t,o){2&o&&s(i,i=t[1].activeValdo)?(Z(),ee(r,1,1,e),Q(),r=ut(t),r.c(),X(r,1),r.m(n.parentNode,n)):r.p(t,o)},i(e){o||(X(r),o=!0)},o(e){ee(r),o=!1},d(e){e&&$(n),r.d(e)}}}function ut(e){let t,n;return t=new it({props:{displayDots:!1,totalHeight:100,valdoData:e[1].activeValdo,displaySVG:e[0],hoverPointer:!1}}),{c(){se(t.$$.fragment)},m(e,o){ae(t,e,o),n=!0},p(e,n){const o={};2&n&&(o.valdoData=e[1].activeValdo),1&n&&(o.displaySVG=e[0]),t.$set(o)},i(e){n||(X(t.$$.fragment,e),n=!0)},o(e){ee(t.$$.fragment,e),n=!1},d(e){le(t,e)}}}function dt(e){let t,n,o,i,r,s,a,l,c,u,d,h,m,p,y,b,w,T,D,V,L,M,S,G=e[3].score+"",I=e[3].highScore+"",C=e[3].remainingTime+"";function H(e,t){return e[1].activatedGame||e[2]?e[1].activatedGame?st:e[2]?rt:void 0:at}let A=H(e),_=A&&A(e);const z=[ct,lt],R=[];function E(e,t){return e[1].activatedGame?0:1}return D=E(e),V=R[D]=z[D](e),M=new ge({}),{c(){t=k("header"),n=k("div"),o=k("h3"),i=x("Current Score: "),r=x(G),s=v(),a=k("h3"),l=x("High Score: "),c=x(I),u=v(),d=k("h3"),h=x("Remaining Time: "),m=x(C),p=x("s"),y=v(),b=k("div"),_&&_.c(),w=v(),T=k("div"),V.c(),L=v(),se(M.$$.fragment),P(o,"class","svelte-3yivzb"),P(a,"class","svelte-3yivzb"),P(d,"class","svelte-3yivzb"),P(n,"class","gameInfoWrapper svelte-3yivzb"),P(b,"class","svelte-3yivzb"),P(T,"class","currentValdoWrapper svelte-3yivzb"),P(t,"class","svelte-3yivzb")},m(e,$){g(e,t,$),f(t,n),f(n,o),f(o,i),f(o,r),f(n,s),f(n,a),f(a,l),f(a,c),f(n,u),f(n,d),f(d,h),f(d,m),f(d,p),f(t,y),f(t,b),_&&_.m(b,null),f(t,w),f(t,T),R[D].m(T,null),g(e,L,$),ae(M,e,$),S=!0},p(e,[t]){(!S||8&t)&&G!==(G=e[3].score+"")&&N(r,G),(!S||8&t)&&I!==(I=e[3].highScore+"")&&N(c,I),(!S||8&t)&&C!==(C=e[3].remainingTime+"")&&N(m,C),A===(A=H(e))&&_?_.p(e,t):(_&&_.d(1),_=A&&A(e),_&&(_.c(),_.m(b,null)));let n=D;D=E(e),D===n?R[D].p(e,t):(Z(),ee(R[n],1,1,(()=>{R[n]=null})),Q(),V=R[D],V?V.p(e,t):(V=R[D]=z[D](e),V.c()),X(V,1),V.m(T,null))},i(e){S||(X(V),X(M.$$.fragment,e),S=!0)},o(e){ee(V),ee(M.$$.fragment,e),S=!1},d(e){e&&$(t),_&&_.d(),R[D].d(),e&&$(L),le(M,e)}}}function ht(e,t,n){let o,i;a(e,Ne,(e=>n(1,o=e))),a(e,fe,(e=>n(3,i=e)));let r,{displaySVG:s=!0}=t,l=!1;return e.$$set=e=>{"displaySVG"in e&&n(0,s=e.displaySVG)},e.$$.update=()=>{2&e.$$.dirty&&console.log(o.activeValdo)},[s,o,l,i,function(){o.activatedGame||Ne.startNewGame(),fe.setTimerActive(),r=setInterval((()=>{return e=r,void(i.remainingTime>0?fe.decrementTime(1):i.remainingTime<=0&&(console.log("finished game:",l,o,i),function(e){clearInterval(e),fe.setTimerInactive(),i.score>i.highScore&&fe.setHighscore(i.score),n(2,l=!0),fe.resetGame(),Ne.finishGame(),console.log("finished game:",l,o,i)}(e)));var e}),1e3),console.log(i)}]}class mt extends de{constructor(e){super(),ue(this,e,ht,dt,s,{displaySVG:0})}}function ft(e){let t,n;const o=e[1].default,i=function(e,t,n,o){if(e){const i=l(e,t,n,o);return e[0](i)}}(o,e,e[0],null);return{c(){t=k("div"),i&&i.c(),P(t,"class","svelte-w77ngl")},m(e,o){g(e,t,o),i&&i.m(t,null),n=!0},p(e,[t]){i&&i.p&&(!n||1&t)&&function(e,t,n,o,i,r){if(i){const s=l(t,n,o,r);e.p(s,i)}}(i,o,e,e[0],n?function(e,t,n,o){if(e[2]&&o){const i=e[2](o(n));if(void 0===t.dirty)return i;if("object"==typeof i){const e=[],n=Math.max(t.dirty.length,i.length);for(let o=0;o<n;o+=1)e[o]=t.dirty[o]|i[o];return e}return t.dirty|i}return t.dirty}(o,e[0],t,null):function(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let e=0;e<n;e++)t[e]=-1;return t}return-1}(e[0]),null)},i(e){n||(X(i,e),n=!0)},o(e){ee(i,e),n=!1},d(e){e&&$(t),i&&i.d(e)}}}function pt(e,t,n){let{$$slots:o={},$$scope:i}=t;return e.$$set=e=>{"$$scope"in e&&n(0,i=e.$$scope)},[i,o]}class yt extends de{constructor(e){super(),ue(this,e,pt,ft,s,{})}}function gt(e,t,n){const o=e.slice();return o[3]=t[n],o}function $t(e){let t,n,o=[],i=new Map,r=e[0].displayedValdos;const s=e=>e[3].firstName;for(let t=0;t<r.length;t+=1){let n=gt(e,r,t),a=s(n);i.set(a,o[t]=kt(a,n))}return{c(){for(let e=0;e<o.length;e+=1)o[e].c();t=w()},m(e,i){for(let t=0;t<o.length;t+=1)o[t].m(e,i);g(e,t,i),n=!0},p(e,n){3&n&&(r=e[0].displayedValdos,Z(),o=re(o,n,s,1,e,r,i,t.parentNode,ie,kt,t,gt),Q())},i(e){if(!n){for(let e=0;e<r.length;e+=1)X(o[e]);n=!0}},o(e){for(let e=0;e<o.length;e+=1)ee(o[e]);n=!1},d(e){for(let t=0;t<o.length;t+=1)o[t].d(e);e&&$(t)}}}function kt(e,t){let n,o,i;return o=new it({props:{valdoData:t[3],displaySVG:vt,showFullName:wt,displayDots:Tt}}),o.$on("tag",t[1]),{key:e,first:null,c(){n=w(),se(o.$$.fragment),this.first=n},m(e,t){g(e,n,t),ae(o,e,t),i=!0},p(e,n){t=e;const i={};1&n&&(i.valdoData=t[3]),o.$set(i)},i(e){i||(X(o.$$.fragment,e),i=!0)},o(e){ee(o.$$.fragment,e),i=!1},d(e){e&&$(n),le(o,e)}}}function bt(e){let t,n,o=e[0].activatedGame&&$t(e);return{c(){o&&o.c(),t=w()},m(e,i){o&&o.m(e,i),g(e,t,i),n=!0},p(e,n){e[0].activatedGame?o?(o.p(e,n),1&n&&X(o,1)):(o=$t(e),o.c(),X(o,1),o.m(t.parentNode,t)):o&&(Z(),ee(o,1,1,(()=>{o=null})),Q())},i(e){n||(X(o),n=!0)},o(e){ee(o),n=!1},d(e){o&&o.d(e),e&&$(t)}}}function xt(e){let t,n,o,i;return t=new mt({}),o=new yt({props:{$$slots:{default:[bt]},$$scope:{ctx:e}}}),{c(){se(t.$$.fragment),n=v(),se(o.$$.fragment)},m(e,r){ae(t,e,r),g(e,n,r),ae(o,e,r),i=!0},p(e,[t]){const n={};65&t&&(n.$$scope={dirty:t,ctx:e}),o.$set(n)},i(e){i||(X(t.$$.fragment,e),X(o.$$.fragment,e),i=!0)},o(e){ee(t.$$.fragment,e),ee(o.$$.fragment,e),i=!1},d(e){le(t,e),e&&$(n),le(o,e)}}}const vt=!0;let wt=!1,Tt=!1;function Pt(e,t,n){let o,i;return a(e,Ne,(e=>n(0,o=e))),a(e,fe,(e=>n(2,i=e))),[o,function(e){i.timerActive&&(e.detail.fullName===o.activeValdo.fullName?(fe.increaseScore(1),/valdo/i.test(e.detail.fullName)?fe.incrementTime(5):fe.incrementTime(2),Ne.startNewRound()):fe.decrementTime(5))}]}return new class extends de{constructor(e){super(),ue(this,e,Pt,xt,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
