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

    constructor(_displayType = PopupDisplayTypes.POP_IN, _data = new PopupData(), internal = false, dimensions = {width:360, height:650}){
        this.id = IdGenerator.numeric(24);
        this.displayType = _displayType;
        this.data = _data;
        this.internal = internal;
        this.dimensions = dimensions;
    }

	static fromJson(json){ return Object.assign(new Popup(), json); }



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
