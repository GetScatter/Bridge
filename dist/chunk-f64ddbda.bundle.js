(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f64ddbda"],{"92b9":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{class:{logos:!!t.app.img}},[t.app.img?n("figure",{staticClass:"logo"},[t.app.img?n("img",{attrs:{src:t.app.img}}):n("span",[t._v(t._s(t.app.name))])]):t._e()])},s=[],i={props:["app"]},a=i,r=n("2877"),c=Object(r["a"])(a,o,s,!1,null,null,null);e["a"]=c.exports},"95e0":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"app-login"},[n("section",{staticClass:"content"},[n("section",{staticClass:"app-details"},[n("PopOutLogos",{attrs:{app:t.app}}),n("figure",{staticClass:"action"},[t._v("Login")]),n("figure",{staticClass:"app-name"},[t._v("via "),n("b",[t._v(t._s(t.app.name))])]),n("figure",{staticClass:"text"},[t._v("By logging into this application you will be allowing it to interact with your Scatter, and see some of your personal information.")])],1)]),n("section",{staticClass:"popout-buttons"},[n("Button",{attrs:{text:"Deny"},nativeOn:{click:function(e){return t.closer(e)}}}),n("Button",{attrs:{primary:"1",text:"Login"},nativeOn:{click:function(e){return t.login(e)}}})],1)])},s=[],i=(n("8e6e"),n("ac6a"),n("456d"),n("7514"),n("bd86")),a=n("118f"),r=n("2f62"),c=n("efcb"),u=n.n(c),p=n("92b9"),l=n("4815");function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,o)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(n,!0).forEach(function(e){Object(i["a"])(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}var g={components:{PopOutLogos:p["a"]},props:["popup","closer"],computed:d({},Object(r["d"])(["scatter"]),{payload:function(){return this.popup.payload()},fields:function(){return a["IdentityRequiredFields"].fromJson(this.payload.fields)},accountRequirements:function(){return this.fields.accounts||[]},requestedNetworks:function(){var t=this;return this.accountRequirements.map(function(e){var n=u.a.fromJson(e);return t.scatter.settings.networks.find(function(t){return t.unique()===n.unique()})})},accounts:function(){return l["a"].accounts(this.requestedNetworks)},app:function(){return this.popup.data.props.appData}}),mounted:function(){console.log("accounts",this.accounts)},methods:{login:function(){this.$emit("returned",{identity:this.scatter.keychain.identities[0],location:this.scatter.keychain.locations[0],accounts:this.accounts})}}},b=g,h=(n("ceb0"),n("2877")),m=Object(h["a"])(b,o,s,!1,null,"6fcfd3c5",null);e["default"]=m.exports},adc1:function(t,e,n){e=t.exports=n("2350")(!1),e.push([t.i,"",""])},ceb0:function(t,e,n){"use strict";var o=n("d139"),s=n.n(o);s.a},d139:function(t,e,n){var o=n("adc1");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var s=n("499e").default;s("2a6d7374",o,!0,{sourceMap:!1,shadowMode:!1})}}]);