import Vue from 'vue'
import {mapState, mapActions} from 'vuex';
import VueQrcodeReader from 'vue-qrcode-reader'


import VueRouter from 'vue-router'
import {RouteNames, Routing} from './Routing';
import StoreService from "@walletpack/core/services/utility/StoreService";
import THEMES from "../util/Themes";
import * as Actions from "@walletpack/core/store/constants";
import Helpers from "../util/Helpers";

Vue.config.productionTip = false;
Vue.config.devtools = false;

export let router;

/***
 * Sets up an instance of Vue.
 * This is shared between the popup.js and prompt.js scripts.
 */
export default class VueInitializer {

    constructor(routes,
                components,
                middleware = () => {}){

        this.setupVuePlugins();
        this.registerComponents(components);
        router = this.setupRouting(routes, middleware);

	    // StoreService.get().dispatch(Actions.LOAD_SCATTER).then(async () => {
		//
	    // });

	    Vue.mixin({
		    data(){ return {
			    RouteNames,
			    THEMES,
		    }},
		    computed:{
			    ...mapState([
				    'theme',
				    'isMobile',
				    'isMobileDevice'
			    ]),
		    },
		    mounted(){
			    this.sanitizeVuex();
		    },
		    methods: {
			    sanitizeVuex(){
				    // Doesn't matter on mobile.
				    if(this.isMobile || this.isMobileDevice) return;

				    // Removes pesky __vue__ exposure from elements.
				    const all = document.querySelectorAll("*");
				    for (let i=0, max=all.length; i < max; i++) {
					    if(all[i].hasOwnProperty('__vue__')) delete all[i].__vue__;
				    }
			    },
			    formatNumber(num){
				    if(!num) return 0;
				    num = Helpers.fixTrailingZeroes(num.toString());

				    num = parseFloat(num.toString());
				    const [whole, decimal] = num.toString().split('.');
				    return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimal ? `.${decimal}` : '').toString();
			    },
			    formatTime(milliseconds){
				    const formatTimeNumber = n => {
					    if(!n) return '00';
					    if(n.toString().length === 1) n = '0'+n;
					    if(n.toString().length === 0) n = '00';
					    return n;
				    };

				    const seconds = Math.trunc(milliseconds) % 60;
				    const minutes = Math.trunc(milliseconds / 60) % 60;
				    return `${formatTimeNumber(minutes)}:${formatTimeNumber(seconds)}`;
			    },
		    }
	    })

	    this.setupVue(router);



        return router;
    }

    setupVuePlugins(){
        Vue.use(VueRouter);
        Vue.use(VueQrcodeReader);
    }

    registerComponents(components){
        components.map(component => {
            Vue.component(component.tag, component.vue);
        });
    }

    setupRouting(routes, middleware){
        const router = new VueRouter({
	        routes,
	        mode: 'history',
	        linkExactActiveClass: 'active',
	        scrollBehavior (to, from, savedPosition) {
	        	document.getElementsByClassName('.router').scrollTop = 0;
		        return { x: 0, y: 0 }
	        }
        });

        router.beforeEach((to, from, next) => {
            return middleware(to, next, StoreService.get())
        });
        return router;
    }

    setupVue(router){
        const app = new Vue({router, store:StoreService.get(), strict:true});
        app.$mount('#scatter');
    }

}