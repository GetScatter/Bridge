(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-679d739a"],{"0122":function(t,a,e){a=t.exports=e("2350")(!1),a.push([t.i,".scan-qr[data-v-67d2cc97]{max-width:400px;width:calc(100% - 80px);margin:0 auto}.scan-qr .sub-title[data-v-67d2cc97]{margin-top:-20px}.scan-qr .line[data-v-67d2cc97]{margin-top:40px;margin-bottom:40px}.scan-qr .qr[data-v-67d2cc97]{border-radius:4px;overflow:hidden;width:100%;height:220px;line-height:220px;background:-webkit-gradient(linear,left top,left bottom,from(#00a8ff),to(#078ce9));background:linear-gradient(180deg,#00a8ff,#078ce9);text-align:center;font-size:48px}.scan-qr .qr i[data-v-67d2cc97]{color:#fff}",""])},"14a2":function(t,a,e){var n=e("0122");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var c=e("499e").default;c("09f24dae",n,!0,{sourceMap:!1,shadowMode:!1})},d5b7:function(t,a,e){"use strict";var n=e("14a2"),c=e.n(n);c.a},e22b:function(t,a,e){"use strict";e.r(a);var n,c=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("section",{staticClass:"scan-qr"},[e("section",{staticClass:"popup-content"},[t._m(0),e("figure",{staticClass:"sub-title"},[t._v("Place your camera over the QR code and it will automatically scan it.")]),e("figure",{staticClass:"line"}),t.loading?e("section",{staticClass:"qr loading"},[e("i",{staticClass:"animate-spin fas fa-spinner"})]):t._e(),e("qrcode-stream",{directives:[{name:"show",rawName:"v-show",value:!t.loading,expression:"!loading"}],ref:"qr",staticClass:"qr",on:{decode:t.qrScanned}})],1),e("section",{staticClass:"popup-buttons"},[e("Button",{attrs:{text:"Cancel"},nativeOn:{click:function(a){return function(){return t.closer(null)}()}}})],1)])},i=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("figure",{staticClass:"title"},[t._v("Scan "),e("span",[t._v("QR Code")])])}],s={props:["popin","closer"],data:function(){return{loading:!0}},mounted:function(){var t=this;n=setInterval(function(){t.$refs.qr.cameraInstance&&(clearInterval(n),t.loading=!1)},50)},destroyed:function(){clearInterval(n)},methods:{qrScanned:function(t){this.closer(t)}}},r=s,o=(e("d5b7"),e("2877")),l=Object(o["a"])(r,c,i,!1,null,"67d2cc97",null);a["default"]=l.exports}}]);