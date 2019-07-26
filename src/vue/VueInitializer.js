import Vue from 'vue'
import {mapState, mapActions} from 'vuex';


import VueRouter from 'vue-router'
import {RouteNames, Routing} from './Routing';
import StoreService from "scatter-core/services/utility/StoreService";
import THEMES from "../util/Themes";
import * as Actions from "scatter-core/store/constants";

Vue.config.productionTip = false

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

	    StoreService.get().dispatch(Actions.LOAD_SCATTER).then(async () => {
		    Vue.mixin({
			    data(){ return {
				    RouteNames,
                    THEMES,
				    scroll:0,
				    isMobile:false,
				    isMobileDevice:false,
			    }},
			    computed:{
				    ...mapState([
				        'theme',
				    ]),
			    },
			    mounted(){
			    	this.checkMobileSize();
			        window.addEventListener('resize', this.checkMobileSize)
			    },
			    methods: {
			    	checkMobileSize(){
					    if(this.isMobileDevice) return;
					    this.isMobile = window.innerWidth < 768;
				    },
			    	checkDevice(){
					    let check = false;
					    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
					    if(check) {
					    	this.isMobileDevice = true;
					    	this.isMobile = true;
					    }
				    },
				    formatNumber(num, commaOnly = false){
					    if(!num) return 0;
					    num = parseFloat(num.toString());
					    const toComma = x => {
						    const [whole, decimal] = x.toString().split('.');
						    return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimal ? `.${decimal}` : '').toString();
					    }
					    if(commaOnly) return toComma(num);
					    return (num > 999999999 ? toComma((num/1000000000).toFixed(1)) + ' B' :
						    num > 999999 ? toComma((num/1000000).toFixed(1)) + ' M' :
							    num > 999 ? toComma((num/1000).toFixed(1)) + ' K' : num)
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
	    });



        return router;
    }

    setupVuePlugins(){
        Vue.use(VueRouter);
    }

    registerComponents(components){
        components.map(component => {
            Vue.component(component.tag, component.vue);
        });
    }

    setupRouting(routes, middleware){
        const router = new VueRouter({routes, mode: 'history', linkExactActiveClass: 'active'});
        router.beforeEach((to, from, next) => {
            return middleware(to, next, StoreService.get())
        });
        return router;
    }

    setupVue(router){
        const app = new Vue({router, store:StoreService.get()});
        app.$mount('#scatter');

        // This removes the browser console's ability to
        // gain access to vuex store. ( for instance `scatter.__vue__.$store.state` )
	    document.getElementById('scatter').removeAttribute('id')
    }

}