(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ead07866"],{"1fab":function(e,t,n){t=e.exports=n("2350")(!1),t.push([e.i,'.login[data-v-b09ca5a8]{overflow:hidden}.login[data-v-b09ca5a8],.login .authentication[data-v-b09ca5a8]{height:100vh;display:-webkit-box;display:-ms-flexbox;display:flex}.login .authentication[data-v-b09ca5a8]{background:hsla(0,0%,100%,.99);background:linear-gradient(-65deg,hsla(0,0%,100%,.81),hsla(0,0%,100%,.99) 60%);max-width:600px;width:100%;padding:80px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-transition:all 1s ease;transition:all 1s ease;-webkit-transition-property:padding;transition-property:padding}.login .authentication .inputs[data-v-b09ca5a8]{max-width:300px;margin-top:50px}.login .authentication .loading[data-v-b09ca5a8]{height:162px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:48px;color:#9a9a9a}.login .authentication .logo[data-v-b09ca5a8]{color:#00a8ff;font-size:50px;margin-left:-15px;position:absolute;top:60px}.login .authentication .title[data-v-b09ca5a8]{color:#111;margin-top:2px;font-size:24px;font-weight:700}.login .authentication .text[data-v-b09ca5a8]{font-size:12px;font-weight:700;color:#9a9a9a}.login .authentication button[data-v-b09ca5a8]{width:100%;margin-bottom:10px}.login .authentication button.big[data-v-b09ca5a8]{height:80px;font-size:16px}.login .authentication .login-with[data-v-b09ca5a8]{margin-top:20px;font-size:9px}.login .authentication .login-with .label[data-v-b09ca5a8]{font-weight:700;color:#9a9a9a}.login .authentication .login-with .option[data-v-b09ca5a8]{cursor:pointer;font-weight:700;margin-left:4px;color:#00a8ff}.login .beauty[data-v-b09ca5a8]{position:fixed;top:0;bottom:0;left:0;right:0;z-index:-1;height:100vh;-webkit-box-flex:1;-ms-flex:1;flex:1}.login .beauty img[data-v-b09ca5a8]{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.mobile .login .authentication[data-v-b09ca5a8]{padding:50px;width:calc(100% - 50px)}.blue-steel .login .authentication[data-v-b09ca5a8]{background:#031c2f;background:linear-gradient(-65deg,rgba(3,28,47,.6),#031c2f 60%)}.blue-steel .login .authentication .title[data-v-b09ca5a8]{color:#fff}.blue-steel .login .beauty[data-v-b09ca5a8]:after{content:"";display:block;position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(3,28,47,.5)}',""])},"5da6":function(e,t,n){(function(){var e,r,a,i,u,o;for(t["const"]=n("9467"),a=[n("8477"),n("aaa1")],u=0,o=a.length;u<o;u++)for(e in r=a[u],r)i=r[e],t[e]=i}).call(this)},6394:function(e,t,n){var r=n("1fab");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=n("499e").default;a("a6b2b790",r,!0,{sourceMap:!1,shadowMode:!1})},8477:function(e,t,n){(function(e){(function(){var r,a,i,u,o,c,s,l,f,p,h=[].slice;r=n("9467"),i=function(e,t,n,a,i){var u,o,c,l;for(u in c={},a)l=a[u],c[u]=l;return c[r.lineno]=null!=t?t[r.lineno]:void 0,o=function(){var r,a,u;return r=1<=arguments.length?h.call(arguments,0):[],null!=t&&null!=(u=t.assign_fn)&&u.apply(null,r),e?(a=e,i||(e=null),a._fulfill(n,c)):s("overused deferral at "+p(c))},o[r.trace]=c,o},f=0,o=function(e){return f++,f%e===0&&(f=0,!0)},l=null,p=function(e){var t;return t=e[r.funcname]||"<anonymous>",t+" ("+e[r.filename]+":"+(e[r.lineno]+1)+")"},s=function(e){return"undefined"!==typeof console&&null!==console?console.error("ICED warning: "+e):void 0},t.trampoline=c=function(t){return o(500)?null!=("undefined"!==typeof e&&null!==e?e.nextTick:void 0)?e.nextTick(t):setTimeout(t):t()},t.Deferrals=function(){function e(e,t){this.trace=t,this.continuation=e,this.count=1,this.ret=null}return e.prototype._call=function(e){var t;return this.continuation?(l=e,t=this.continuation,this.continuation=null,t(this.ret)):s("Entered dead await at "+p(e))},e.prototype._fulfill=function(e,t){if(!(--this.count>0))return c(function(e){return function(){return e._call(t)}}(this))},e.prototype.defer=function(e){var t;return this.count++,t=this,i(t,e,null,this.trace)},e}(),t.findDeferral=function(e){var t,n,a;for(n=0,a=e.length;n<a;n++)if(t=e[n],null!=t?t[r.trace]:void 0)return t;return null},t.Rendezvous=function(){var e;function t(){this.completed=[],this.waiters=[],this.defer_id=0}return e=function(){function e(e,t,n){this.rv=e,this.id=t,this.multi=n}return e.prototype.defer=function(e){return this.rv._defer_with_id(this.id,e,this.multi)},e}(),t.prototype.wait=function(e){var t;return this.completed.length?(t=this.completed.shift(),e(t)):this.waiters.push(e)},t.prototype.defer=function(e){var t;return t=this.defer_id++,this._defer_with_id(t,e)},t.prototype.id=function(t,n){return n=!!n,new e(this,t,n)},t.prototype._fulfill=function(e,t){var n;return this.waiters.length?(n=this.waiters.shift(),n(e)):this.completed.push(e)},t.prototype._defer_with_id=function(e,t,n){return this.count++,i(this,t,e,{},n)},t}(),t.stackWalk=u=function(e){var t,n,a,i;n=[],a=e?e[r.trace]:l;while(a)t="   at "+p(a),n.push(t),a=null!=a&&null!=(i=a[r.parent])?i[r.trace]:void 0;return n},t.exceptionHandler=a=function(e,t){var n;if(t||(t=console.error),t(e.stack),n=u(),n.length)return t("Iced 'stack' trace (w/ real line numbers):"),t(n.join("\n"))},t.catchExceptions=function(t){return"undefined"!==typeof e&&null!==e?e.on("uncaughtException",function(n){return a(n,t),e.exit(1)}):void 0}}).call(this)}).call(this,n("f28c"))},"8bc7":function(e,t,n){"use strict";(function(e){n.d(t,"a",function(){return T});n("ac6a"),n("5df3"),n("96cf");var r=n("3b8d"),a=n("d225"),i=n("b0b4"),u=n("cee8"),o=n.n(u),c=n("e65b"),s=n.n(c),l=n("483b"),f=n.n(l),p=(n("c3e7"),n("b075")),h=n("c079"),d=n.n(h),b=n("20cb"),w=n.n(b),g=(n("7978"),n("31bf")),m=n.n(g),v=n("ad0d"),k=n("c7ad"),y=n.n(k),x=n("aa3c"),_=n("17e3"),O=n("1f17"),j=n.n(O),R=n("6d42"),S=n.n(R),D=n("a64e"),E=n.n(D),T=function(){function t(){Object(a["a"])(this,t)}return Object(i["a"])(t,null,[{key:"getScatter",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",E.a.get().dispatch(x["LOAD_SCATTER"]));case 1:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()},{key:"createEntropy",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){var t,n,a,i,u,c,s=arguments;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t=s.length>0&&void 0!==s[0]?s[0]:16,n=function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){var n,r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:r=0;case 1:if(!(r<t)){e.next=8;break}return e.next=4,o.a.secureHash(f.a.text(128),n||"begin");case 4:n=e.sent;case 5:r++,e.next=1;break;case 8:return e.abrupt("return",n);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),a=[];case 3:if(!(a.length<5)){e.next=11;break}return e.t0=a,e.next=7,n();case 7:e.t1=e.sent,e.t0.push.call(e.t0,e.t1),e.next=3;break;case 11:return i=new d.a.Generator,e.next=14,new Promise(function(e){i.generate(1e3,function(t){t=t.map(function(e){return f.a.text(Math.abs(e)>128?128:Math.abs(e))+t}),e(t)})});case 14:return u=e.sent.join(""),e.next=17,o.a.secureHash(u,u.substr(Math.round(100*Math.random()+1),1e3));case 17:return c=e.sent,e.abrupt("return",o.a.unsaltedQuickHash(o.a.unsaltedQuickHash(a.join(""))+o.a.unsaltedQuickHash(a.reverse().join(""))+c));case 19:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()},{key:"shaPass",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,o.a.secureHash(t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t){return e.apply(this,arguments)}return t}()},{key:"getLocalEntropy",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",s.a.decrypt(v["a"].decompress(window.localStorage.getItem("boxent")),t));case 1:case"end":return e.stop()}},e)}));function t(t){return e.apply(this,arguments)}return t}()},{key:"setLocalEntropy",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",window.localStorage.setItem("boxent",v["a"].compress(s.a.encrypt(t,n))));case 1:case"end":return e.stop()}},e)}));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"makeSeed",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,o.a.secureHash(t,n);case 2:return e.t0=e.sent,e.next=5,o.a.secureHash(n,t);case 5:return e.t1=e.sent,e.abrupt("return",e.t0+e.t1);case 7:case"end":return e.stop()}},e)}));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"makeKey",value:function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(n,r){var a,i,u,o,c=arguments;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return a=c.length>2&&void 0!==c[2]?c[2]:0,i=p["fromSeed"](e.from(n,"hex")),u=w.a.plugin(r),o=i.derivePath("".concat(u.bip()).concat(a)).privateKey,t.abrupt("return",u.bufferToHexPrivate(o));case 5:case"end":return t.stop()}},t)}));function n(e,n){return t.apply(this,arguments)}return n}()},{key:"register",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(n,a){var i,u,o,c,s,l,f=arguments;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return i=f.length>2&&void 0!==f[2]?f[2]:null,e.next=3,t.shaPass(a);case 3:return a=e.sent,e.next=6,t.createEntropy(1);case 6:return o=e.sent,e.next=9,t.setLocalEntropy(o,a);case 9:return e.next=11,t.makeSeed(n,o);case 11:return c=e.sent,e.next=14,m.a.create();case 14:return s=e.sent,e.next=17,t.makeKey(c,_["Blockchains"].EOSIO,100);case 17:return l=e.sent,s.keychain.identities[0].publicKey=w.a.plugin(_["Blockchains"].EOSIO).privateToPublic(l),s.keychain.identities[0].privateKey="",e.next=22,Promise.all(_["BlockchainsArray"].map(function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(n){var a,i,o,l,f;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=w.a.plugin(n.value),e.next=3,t.makeKey(c,n.value);case 3:return i=e.sent,o=j.a.fromJson({name:n.value,privateKey:"",publicKeys:[{blockchain:n.value,key:a.privateToPublic(i)}],blockchains:[n.value]}),s.keychain.keypairs.push(o),a.accountsAreImported()?(f=s.settings.networks.filter(function(e){return e.blockchain===n.value}),f.map(function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:u=S.a.fromJson({keypairUnique:o.unique(),networkUnique:t.unique(),publicKey:o.publicKeys[0].key,name:"ramdeathtest",authority:"active"}),s.keychain.accounts.push(u);case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())):(l=s.settings.networks.filter(function(e){return e.blockchain===n.value}),l.map(function(e){s.keychain.accounts.push(S.a.fromJson({keypairUnique:o.unique(),networkUnique:e.unique(),publicKey:o.publicKeys[0].key,name:n.value}))})),e.abrupt("return",!0);case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 22:return s.keychain.identities[0].personal.email=i,e.next=25,y.a.services.secure.Seeder.setSeed(a);case 25:return e.next=27,y.a.services.utility.StoreService.get().dispatch(x["SET_SCATTER"],s);case 27:return e.abrupt("return",!0);case 28:case"end":return e.stop()}},e)}));function n(t,n){return e.apply(this,arguments)}return n}()},{key:"login",value:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(n){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.shaPass(n);case 3:return n=e.sent,e.next=6,y.a.services.secure.Seeder.setSeed(n);case 6:return e.next=8,t.getScatter(n);case 8:return r=e.sent,e.next=11,y.a.services.utility.StoreService.get().dispatch(x["HOLD_SCATTER"],r);case 11:return e.abrupt("return",!0);case 14:return e.prev=14,e.t0=e["catch"](0),console.error(e.t0),e.abrupt("return",!1);case 18:case"end":return e.stop()}},e,null,[[0,14]])}));function n(t){return e.apply(this,arguments)}return n}()}]),t}()}).call(this,n("1c35").Buffer)},9467:function(e,t){(function(){e.exports={k:"__iced_k",k_noop:"__iced_k_noop",param:"__iced_p_",ns:"iced",runtime:"runtime",Deferrals:"Deferrals",deferrals:"__iced_deferrals",fulfill:"_fulfill",b_while:"_break",t_while:"_while",c_while:"_continue",n_while:"_next",n_arg:"__iced_next_arg",defer_method:"defer",slot:"__slot",assign_fn:"assign_fn",autocb:"autocb",retslot:"ret",trace:"__iced_trace",passed_deferral:"__iced_passed_deferral",findDeferral:"findDeferral",lineno:"lineno",parent:"parent",filename:"filename",funcname:"funcname",catchExceptions:"catchExceptions",runtime_modes:["node","inline","window","none","browserify","interp"],trampoline:"trampoline",context:"context",defer_arg:"__iced_defer_"}}).call(this)},a55b:function(e,t,n){"use strict";n.r(t);var r,a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"login"},[e._m(0),n("section",{staticClass:"authentication"},[n("section",[n("figure",{staticClass:"logo scatter-logologo"}),n("figure",{staticClass:"title"},[e._v("Embark on an adventure")]),n("figure",{staticClass:"text"},[e._v("\n\t\t\t\tand join the millions of people experiencing the modern age revolution that is redefining how we use the internet.\n\t\t\t")]),e.ready&&!e.working?n("section",{staticClass:"inputs"},[e.isNewScatter?n("section",[n("Button",{staticClass:"big",attrs:{primary:"1",text:"Create new Scatter"},nativeOn:{click:function(t){return e.login(t)}}}),n("Button",{attrs:{text:"Load from Backup"},nativeOn:{click:function(t){return e.loadBackup(t)}}})],1):n("section",[e.asWallet?n("Input",{attrs:{text:e.password,type:"password",placeholder:"Enter your password"},on:{enter:e.login,changed:function(t){return e.password=t}}}):e._e(),n("Button",{staticClass:"big",attrs:{primary:"1",text:"Login"},nativeOn:{click:function(t){return e.login(t)}}})],1)]):n("section",{staticClass:"loading"},[n("i",{staticClass:"animate-spin fas fa-spinner"})])])])])},i=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"beauty"},[n("img",{attrs:{src:"https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"}})])}],u=(n("8e6e"),n("456d"),n("7f7f"),n("ac6a"),n("5df3"),n("7618")),o=(n("28a5"),n("768b")),c=(n("96cf"),n("3b8d")),s=n("bd86"),l=n("2f62"),f=n("d225"),p=n("b0b4"),h="https://apis.google.com/js/api.js",d="select_account",b={clientId:"663744530151-8t2jaivpdh277lns05gtr17usp0p2dvh.apps.googleusercontent.com",scope:"profile email",discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],prompt:d},w=function(){function e(){Object(f["a"])(this,e)}return Object(p["a"])(e,null,[{key:"init",value:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=function(){return new Promise(function(e){var t=document.createElement("script");t.src=h,t.onreadystatechange=t.onload=function(){t.readyState&&!/loaded|complete/.test(t.readyState)||setTimeout(function(){e()},500)},document.getElementsByTagName("head")[0].appendChild(t)})},n=function(){return new Promise(function(e){window.gapi.load("auth2",function(){window.gapi.auth2.init(b).then(function(){e(window.gapi)}).catch(function(){return e(null)})})})},e.next=4,t();case 4:return e.abrupt("return",n());case 5:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()}]),e}(),g=function(){function e(){Object(f["a"])(this,e),this.GoogleAuth=null,this.isAuthorized=!1}return Object(p["a"])(e,[{key:"init",value:function(){var e=this;return w.init().then(function(t){e.GoogleAuth=t.auth2.getAuthInstance(),e.isAuthorized=e.GoogleAuth.isSignedIn.get()}).catch(function(){return null})}},{key:"getAuthCode",value:function(){var e=this;return new Promise(function(t,n){if(!e.GoogleAuth)return n(!1);e.GoogleAuth.grantOfflineAccess({prompt:d}).then(function(e){return t(e.code)}).catch(function(e){return t(null)})})}}]),e}(),m=n("21f8"),v=n("4b59"),k=n("8bc7"),y=n("6964"),x=n("fca0"),_=n("3efc"),O=(n("b038"),n("1cb0"),n("aa3c")),j=n("abe0"),R=n("d946"),S=n("31bf"),D=n.n(S),E=n("1f17"),T=n.n(E),P=n("3b57"),A=n.n(P),C=n("e65a"),B=n.n(C);function K(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function L(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?K(n,!0).forEach(function(t){Object(s["a"])(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):K(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var M={data:function(){return{working:!1,ready:!1,asWallet:!1,isNewScatter:!1,password:"",restoringBackup:!1}},mounted:function(){"undefined"===typeof window.wallet?this.initAsBridge():this.initAsWallet()},methods:L({initAsWallet:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.asWallet=!0,this.ready=!0,e.next=4,window.wallet.exists();case 4:this.isNewScatter=!e.sent;case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),initAsBridge:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(r=new g,r){e.next=3;break}return e.abrupt("return",this.ready=!0);case 3:return e.next=5,r.init();case 5:this.ready=!0;case 6:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),loginSuccess:function(){_["a"].set(!0),this.$router.push({name:this.RouteNames.Dashboard})},login:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!this.working){e.next=2;break}return e.abrupt("return");case 2:this.working=!0,this.asWallet?this.walletLogin():this.oauthLogin();case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),walletLogin:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.isNewScatter){e.next=13;break}return e.next=3,window.wallet.unlock(this.password);case 3:if(!e.sent){e.next=9;break}return e.next=6,this[O["LOAD_SCATTER"]]();case 6:this.loginSuccess(),e.next=11;break;case 9:m["a"].push(v["a"].snackbar("Bad Password")),this.working=!1;case 11:e.next=14;break;case 13:m["a"].push(v["a"].getPassword(function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n){e.next=2;break}return e.abrupt("return",t.working=!1);case 2:return e.next=4,t[j["a"]](n);case 4:t.loginSuccess();case 5:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),!0));case 14:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),oauthLogin:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,n,a,i,u,o,c,s,l,f,p,h;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r.getAuthCode().catch(function(){return null});case 2:if(t=e.sent,t){e.next=5;break}return e.abrupt("return",this.working=!1);case 5:return e.next=7,Object(y["b"])("oauth/google",{access_token:t});case 7:if(n=e.sent,n){e.next=10;break}return e.abrupt("return",this.working=!1);case 10:return a=n.isNew,i=n.session,u=n.requires2fa,o=n.email,c=n.kycHash,y["c"].setSessionToken(i),e.next=14,new Promise(function(e){m["a"].push(v["a"].getPassword(function(t){e(t)},a))});case 14:if(s=e.sent,s){e.next=17;break}return e.abrupt("return",this.working=!1);case 17:if(!u){e.next=23;break}return e.next=20,new Promise(function(e){m["a"].push(v["a"].twoFactorAuth(function(t){!t&&a&&Object(y["a"])("2fa/cancel"),e(t)},a))});case 20:e.t0=e.sent,e.next=24;break;case 23:e.t0=!0;case 24:if(l=e.t0,l){e.next=27;break}return e.abrupt("return",this.working=!1);case 27:return e.next=29,Object(y["a"])("encryption_key").catch(function(){return null});case 29:if(f=e.sent,f){e.next=32;break}return e.abrupt("return",this.working=!1);case 32:if(p=!1,!a){e.next=44;break}return e.next=36,Object(y["a"])("entropy").catch(function(){return null});case 36:if(h=e.sent,h){e.next=39;break}return e.abrupt("return",this.working=!1);case 39:return e.next=41,k["a"].register(h,s+f,o);case 41:p=e.sent,e.next=47;break;case 44:return e.next=46,k["a"].login(s+f);case 46:p=e.sent;case 47:if(p){e.next=49;break}return e.abrupt("return",this.working=!1);case 49:x["a"].setKycHash(c),this.loginSuccess();case 51:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),loadBackup:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,n,r,a,i,s=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=function(){s.working=!1,s.restoringBackup=!1,window.wallet.lock()},!this.restoringBackup){e.next=3;break}return e.abrupt("return");case 3:return this.restoringBackup=!0,e.next=6,Object(R["a"])(["json","txt"]);case 6:if(n=e.sent,n){e.next=9;break}return e.abrupt("return",t());case 9:if(r=n[0],r){e.next=12;break}return e.abrupt("return",t());case 12:a=function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(n,r){var a,i,l,f,p;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(a=n.split("|SLT|"),i=Object(o["a"])(a,2),l=i[0],f=i[1],l&&f){e.next=4;break}return t(),e.abrupt("return",m["a"].push(v["a"].snackbar("Error parsing backup")));case 4:return e.next=6,window.wallet.lock();case 6:return e.next=8,window.wallet.unlock(r,!0,f);case 8:return e.next=10,window.wallet.decrypt(l);case 10:if(p=e.sent,"object"!==Object(u["a"])(p)||!p.hasOwnProperty("keychain")){e.next=20;break}return e.next=14,window.wallet.decrypt(p.keychain);case 14:p.keychain=e.sent,p.settings.backupLocation="",s.working=!1,m["a"].push(v["a"].showTerms(function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t){e.next=3;break}return window.wallet.lock(),e.abrupt("return");case 3:return p.onboarded=!0,e.next=6,s[O["SET_SCATTER"]](D.a.fromJson(p));case 6:return e.next=8,window.wallet.lock();case 8:window.wallet.utility.reload();case 9:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())),e.next=22;break;case 20:return t(),e.abrupt("return",m["a"].push(v["a"].snackbar("Error decrypting backup")));case 22:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}(),i=function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(n,r){var a,i,l,f,p,h,d;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(a=n.split("|SSLT|"),i=Object(o["a"])(a,2),l=i[0],f=i[1],l&&f){e.next=4;break}return t(),e.abrupt("return",m["a"].push(v["a"].snackbar("Error parsing backup")));case 4:return e.next=6,window.wallet.lock();case 6:return e.next=8,window.wallet.unlock(r,!0,f);case 8:return e.next=10,window.wallet.decrypt(l);case 10:if(p=e.sent,"object"!==Object(u["a"])(p)||!p.hasOwnProperty("keychain")){e.next=23;break}return e.next=14,Promise.all(p.keychain.keypairs.map(function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,window.wallet.decrypt(t.privateKey);case 2:return t.privateKey=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()).map(function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(t){var n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=T.a.fromJson({name:t.name,blockchains:[t.blockchain],privateKey:Crypto.privateKeyToBuffer(t.privateKey,t.blockchain)}),e.next=3,A.a.makePublicKeys(n);case 3:return e.abrupt("return",n);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 14:return h=e.sent,e.next=17,D.a.create();case 17:d=e.sent,d.keychain.keypairs=h,s.working=!1,m["a"].push(v["a"].showTerms(function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t){e.next=3;break}return window.wallet.lock(),e.abrupt("return");case 3:return d.onboarded=!0,e.next=6,s[O["SET_SCATTER"]](d);case 6:return e.next=8,Promise.all(h.map(function(e){return B.a.importAllAccounts(e)}));case 8:return e.next=10,window.wallet.lock();case 10:window.wallet.utility.reload();case 11:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())),e.next=25;break;case 23:return t(),e.abrupt("return",m["a"].push(v["a"].snackbar("Error decrypting backup")));case 25:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}(),window.wallet.storage.openFile(r).then(function(e){if(!e)return t(),m["a"].push(v["a"].snackbar("Can't read backup"));var n=r.split(".")[r.split(".").length-1];m["a"].push(v["a"].getPassword(function(){var r=Object(c["a"])(regeneratorRuntime.mark(function r(u){return regeneratorRuntime.wrap(function(r){while(1)switch(r.prev=r.next){case 0:if(u&&u.length){r.next=2;break}return r.abrupt("return",t());case 2:s.working=!0,r.prev=3,r.t0=n,r.next="json"===r.t0?7:"txt"===r.t0?10:13;break;case 7:return r.next=9,a(e,u);case 9:return r.abrupt("return",r.sent);case 10:return r.next=12,i(e,u);case 12:return r.abrupt("return",r.sent);case 13:r.next=20;break;case 15:return r.prev=15,r.t1=r["catch"](3),console.error("e",r.t1),t(),r.abrupt("return",m["a"].push(v["a"].snackbar("Error decrypting backup")));case 20:case"end":return r.stop()}},r,null,[[3,15]])}));return function(e){return r.apply(this,arguments)}}()))});case 15:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},Object(l["b"])([O["LOAD_SCATTER"],O["SET_SCATTER"],j["a"]])),watch:Object(s["a"])({},"window.wallet",function(){this.initAsWallet()})},z=M,H=(n("c2f3"),n("2877")),I=Object(H["a"])(z,a,i,!1,null,"b09ca5a8",null);t["default"]=I.exports},aaa1:function(e,t,n){(function(){var e,r,a,i,u,o=[].slice;e=n("9467"),t.iced=r=n("8477"),u=function(e,t,n,a){var i,u,c,s,l;s=r.findDeferral(arguments),u=new r.Rendezvous,a[0]=u.id(!0).defer({assign_fn:function(e){return function(){return function(){return i=o.call(arguments,0)}}}()(),lineno:20,context:l}),setTimeout(u.id(!1).defer({lineno:21,context:l}),t),function(e){return function(e){l=new r.Deferrals(e,{parent:s,filename:"/Users/max/src/iced/iced-runtime/src/library.iced"}),u.wait(l.defer({assign_fn:function(){return function(){return c=arguments[0]}}(),lineno:22})),l._fulfill()}}()(function(t){return function(){return n&&(n[0]=c),e.apply(null,i)}}())},t.timeout=function(e,t,n){var r;return r=[],u(e,t,n,r),r[0]},a=function(e,t,n){var a,i,u;i=r.findDeferral(arguments),function(e){return function(e){u=new r.Deferrals(e,{parent:i,filename:"/Users/max/src/iced/iced-runtime/src/library.iced"}),n[0]=u.defer({assign_fn:function(){return function(){return a=arguments[0]}}(),lineno:39}),u._fulfill()}}()(function(n){return function(){return a||(t[0]=!1),e()}}())},t.iand=function(e,t){var n;return n=[],a(e,t,n),n[0]},i=function(e,t,n){var a,i,u;i=r.findDeferral(arguments),function(e){return function(e){u=new r.Deferrals(e,{parent:i,filename:"/Users/max/src/iced/iced-runtime/src/library.iced"}),n[0]=u.defer({assign_fn:function(){return function(){return a=arguments[0]}}(),lineno:58}),u._fulfill()}}()(function(n){return function(){return a&&(t[0]=!0),e()}}())},t.ior=function(e,t){var n;return n=[],i(e,t,n),n[0]},t.Pipeliner=function(){function t(t,n){this.window=t||1,this.delay=n||0,this.queue=[],this.n_out=0,this.cb=null,this[e.deferrals]=this,this["defer"]=this._defer}return t.prototype.waitInQueue=function(e){var t,n;t=r.findDeferral(arguments),function(e){return function(a){var i;i=function(a){var u,o,c;if(u=a,o=function(){return r.trampoline(function(){return i(a)})},c=o,!(e.n_out>=e.window))return u();(function(a){n=new r.Deferrals(a,{parent:t,filename:"/Users/max/src/iced/iced-runtime/src/library.iced",funcname:"Pipeliner.waitInQueue"}),e.cb=n.defer({lineno:100}),n._fulfill()})(c)},i(a)}}(this)(function(a){return function(){a.n_out++,function(e){if(!a.delay)return e();(function(e){n=new r.Deferrals(e,{parent:t,filename:"/Users/max/src/iced/iced-runtime/src/library.iced",funcname:"Pipeliner.waitInQueue"}),setTimeout(n.defer({lineno:108}),a.delay),n._fulfill()})(e)}(function(){return e()})}}(this))},t.prototype.__defer=function(e,t){var n,a,i,u;i=r.findDeferral(arguments),function(n){return function(n){u=new r.Deferrals(n,{parent:i,filename:"/Users/max/src/iced/iced-runtime/src/library.iced",funcname:"Pipeliner.__defer"}),a=u.defer({lineno:122}),e[0]=function(){var e,n;return e=1<=arguments.length?o.call(arguments,0):[],null!=(n=t.assign_fn)&&n.apply(null,e),a()},u._fulfill()}}()(function(e){return function(){if(e.n_out--,e.cb)return n=e.cb,e.cb=null,n()}}(this))},t.prototype._defer=function(e){var t;return t=[],this.__defer(t,e),t[0]},t.prototype.flush=function(e){var t,n,a;n=e,t=r.findDeferral(arguments),a=function(e){var n;return function(i){var u,o,c;if(u=i,o=function(){return r.trampoline(function(){return a(i)})},c=o,!e.n_out)return u();(function(a){n=new r.Deferrals(a,{parent:t,filename:"/Users/max/src/iced/iced-runtime/src/library.iced",funcname:"Pipeliner.flush"}),e.cb=n.defer({lineno:151}),n._fulfill()})(c)}}(this),a(n)},t}()}).call(this)},c079:function(e,t,n){(function(){t.Generator=n("cc14").Generator}).call(this)},c2f3:function(e,t,n){"use strict";var r=n("6394"),a=n.n(r);a.a},cc14:function(e,t,n){(function(){var e,r,a;r=n("5da6"),a=function(){},e=e=function(){function e(e){e=e||{},this.lazy_loop_delay=e.lazy_loop_delay||30,this.loop_delay=e.loop_delay||5,this.work_min=e.work_min||1,this.auto_stop_bits=e.auto_stop_bits||4096,this.max_bits_per_delta=e.max_bits_per_delta||4,this.auto_stop=!e.auto_stop||e.auto_stop,this.entropies=[],this.running=!0,this.is_generating=!1,this.timer_race_loop()}return e.prototype.generate=function(e,t){var n,a,i,u,o;u=r.findDeferral(arguments),this.is_generating=!0,this.running||this.resume(),a=0,i=[],function(t){return function(c){var s,l;s=[],l=function(c){var f,p,h;if(f=function(){return c(s)},p=function(){return r.trampoline(function(){return l(c)})},h=function(e){return s.push(e),p()},!(a<e))return f();(function(e){if(t.entropies.length)return n=t.entropies.splice(0,1)[0],a+=n[1],e(i.push(n[0]));(function(e){o=new r.Deferrals(e,{parent:u,filename:"/Users/chris/git/more-entropy/src/generator.iced",funcname:"Generator.generate"}),t.delay(o.defer({lineno:28})),o._fulfill()})(e)})(h)},l(c)}}(this)(function(e){return function(){return e.auto_stop&&e.stop(),e.is_generating=!1,t(i)}}(this))},e.prototype.stop=function(){return this.running=!1},e.prototype.resume=function(){return this.running=!0,this.timer_race_loop()},e.prototype.reset=function(){return this.entropies=[],this.total_bits=0},e.prototype.count_unused_bits=function(){var e,t,n,r,a;for(e=0,a=this.entropies,n=0,r=a.length;n<r;n++)t=a[n],e+=t[1];return e},e.prototype.delay=function(e){var t,n,a;n=r.findDeferral(arguments),t=this.is_generating?this.loop_delay:this.lazy_loop_delay,function(e){return function(e){a=new r.Deferrals(e,{parent:n,filename:"/Users/chris/git/more-entropy/src/generator.iced",funcname:"Generator.delay"}),setTimeout(a.defer({lineno:50}),t),a._fulfill()}}()(function(t){return function(){return e()}}())},e.prototype.timer_race_loop=function(){var e,t,n,i;t=a,e=r.findDeferral(arguments),this._last_count=null,n=[],i=function(t){var a,u,o,c,s;return function(l){var f,p,h;if(f=function(){return l(n)},p=function(){return r.trampoline(function(){return i(l)})},h=function(e){return n.push(e),p()},!t.running)return f();t.count_unused_bits()<t.auto_stop_bits&&(a=t.millisecond_count(),null!=t._last_count&&(u=a-t._last_count)&&(o=Math.floor(t.log_2(Math.abs(u))),o=Math.min(t.max_bits_per_delta,o),c=[u,o],t.entropies.push(c)),t._last_count=a),function(n){s=new r.Deferrals(n,{parent:e,filename:"/Users/chris/git/more-entropy/src/generator.iced",funcname:"Generator.timer_race_loop"}),t.delay(s.defer({lineno:64})),s._fulfill()}(h)}}(this),i(t)},e.prototype.log_2=function(e){return Math.log(e)/Math.LN2},e.prototype.millisecond_count=function(){var e,t,n;e=Date.now(),t=n=0;while(Date.now()<e+this.work_min+1)t++,n=Math.sin(Math.sqrt(Math.log(t+n)));return t},e}(),"undefined"!==typeof window&&null!==window&&(window.Generator=e),null!==t&&(t.Generator=e)}).call(this)}}]);