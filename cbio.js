cbio={};

cbio.hello = function(){
	console.log('cbio :-)');
}

cbio.uid=function(x){
	if(!x){x='UID'};
	return x+Math.random().toString().slice(2)
}

cbio.fetch = function(cmd,fun,parms){ // submit command cmd to cbio WebAPI and process it through callback function fun
	if(!cmd){cmd='getTypesOfCancer'}; // see http://www.cbioportal.org/public-portal/web_api.jsp for list of comands
	if(!fun){fun=function(x){console.log(x)}};
	if(!cbio.fetch.callbacks){cbio.fetch.callbacks={}};
	var uid = this.uid('fetch');
	this.fetch.callbacks[uid]={
		cmd:cmd,
		fun:fun,
		t:Date.now()
	}
	if(!parms){
		var Qparms="";
	} else {
		var Qparms="&";
		Qparms+=cbio.parms(parms);
	}
	$.getScript('https://script.google.com/macros/s/AKfycbwsJ5_WKUUZX1ccf7m1zYbtksCm-FEck_uC2agZv_DXAzsS7H4p/exec?cmd='+cmd+'&callback=cbio.fetch.callbacks.'+uid+'.fun'+Qparms);
	//$.getScript('https://script.google.com/macros/s/AKfycbwsJ5_WKUUZX1ccf7m1zYbtksCm-FEck_uC2agZv_DXAzsS7H4p/exec')
	// https://script.google.com/macros/s/AKfycbzyVWTAXybGiTfiZXv3cy5CFO8b9Wn4noStMdSYFSCBNvVG2pME/exec
	return uid;
}

cbio.table=function(x){ // converts cbio JSON into a table object
	x = x.map(function(x){return x.split('\t')}); // parse tab delimeted rows
	var n = x.length, m = x[0].length; // table size
	var y = {};
	for(var j in x[0]){ // for each header
	var h = x[0][j];
		y[h]=[x[0][j]]; // create array
		for(var i = 1 ; i<n ; i++){
			y[h][i-1]=x[i][j]; // fill cells
		}
	}
	return y;
}

cbio.parms = function(x){ // converts JSON formated parameters into URL call query arguments
	var y = '';
	for (var f in x){
		y+=f+'='+x[f]+'&';
	}
	return encodeURI(y.slice(0,y.length-1));
}

// cBio webAPI commands
// http://www.cbioportal.org/public-portal/web_api.jsp
cbio.getTypesOfCancer=function(fun){
	if(!fun){fun = function(x){console.log(cbio.table(x))}};
	return cbio.fetch('getTypesOfCancer',fun);
}

cbio.getCancerStudies=function(fun){
	if(!fun){fun = function(x){console.log(cbio.table(x))}};
	return cbio.fetch('getCancerStudies',fun);
}

cbio.getGeneticProfiles=function(fun,cancer_study_id){
	if(!fun){fun = function(x){console.log(cbio.table(x))}};
	// cancer_study_id is required, for example "gbm_tcga"
	return cbio.fetch('getGeneticProfiles',fun,{cancer_study_id:cancer_study_id});
}
