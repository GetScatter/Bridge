import IdGenerator from '@walletpack/core/util/IdGenerator';
import * as ApiActions from '@walletpack/core/models/api/ApiActions';
import Framework from "@walletpack/core/services/utility/Framework";

export const PopupDisplayTypes = {
    POP_IN:'popin',
    POP_OUT:'popout',
    POP_SIDE:'popside',
    SNACKBAR:'snackbar',
};

export class Popup {

    constructor(_displayType = PopupDisplayTypes.POP_IN, _data = new PopupData(), internal = false){
        this.id = IdGenerator.numeric(24);
        this.displayType = _displayType;
        this.data = _data;
        this.internal = internal;
    }

	static fromJson(json){ return Object.assign(new Popup(), json); }

    dimensions(){
    	switch (this.data.type) {
		    case ApiActions.LOGIN:
		    case ApiActions.LOGIN_ALL:
		    case ApiActions.GET_PUBLIC_KEY:
		    case ApiActions.TRANSFER:
			    return {width:600, height:600};
		    case ApiActions.UPDATE_IDENTITY:
			    return {width:420, height:600};
		    case ApiActions.SIGN:
			    return {width:920, height:600};
		    case 'linkApp':
			    return {width:420, height:500};
		    default:
			    return {width:800, height:600};
	    }
    }



	appData(){ return this.data.props.appData }
	payload(){ return this.data.props.payload }
	origin(){
    	const app = this.appData();
    	if(app) return app.name;
		return this.data.props.plugin
	}

}


export class PopupData {

    constructor(_type, _props, _callback = () => {}){
        this.type = _type;
        this.props = _props;
        this.callback = _callback;
    }

}
