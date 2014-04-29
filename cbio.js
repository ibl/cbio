cbio={};

cbio.hello = function(){
	console.log('cbio :-)');
}

cbio.uid=function(x){
	if(!x){x='UID'};
	return x+Math.random().toString().slice(2)
}

cbio.get = function(cmd,fun,parms){ // submit command cmd to cbio WebAPI and process it through callback function fun
	if(!cmd){cmd='getTypesOfCancer'}; // see http://www.cbioportal.org/public-portal/web_api.jsp for list of comands
	if(!fun){fun=function(x){console.log(cbio.table(x))}};
	if(!cbio.get.callbacks){cbio.get.callbacks={}};
	var uid = this.uid('fetch');
	this.get.callbacks[uid]={
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
	$.getScript('https://script.google.com/macros/s/AKfycbwsJ5_WKUUZX1ccf7m1zYbtksCm-FEck_uC2agZv_DXAzsS7H4p/exec?cmd='+cmd+'&callback=cbio.get.callbacks.'+uid+'.fun'+Qparms);
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
		if(Array.isArray(x[f])){ // then turn them into a comma delimited string
			var xx = x[f][0];
			for (var i = 1 ; i<x[f].length ; i++){
				xx += ',' + x[f][i];
			}
			x[f]=xx;
		}
		y+=f+'='+x[f]+'&';
	}
	return encodeURI(y.slice(0,y.length-1));
}

// cBio webAPI commands, verbatin from
// http://www.cbioportal.org/public-portal/web_api.jsp

cbio.getTypesOfCancer=function(fun){
	return cbio.get('getTypesOfCancer',fun);
}

cbio.getCancerStudies=function(fun){
	return cbio.get('getCancerStudies',fun);
}

cbio.getGeneticProfiles=function(cancer_study_id,fun){
	// cancer_study_id is required, for example "gbm_tcga"
	if(typeof(cancer_study_id)=='string'){cancer_study_id={cancer_study_id:cancer_study_id}};
	return cbio.get('getGeneticProfiles',fun,cancer_study_id);
}

cbio.getCaseLists=function(cancer_study_id,fun){
	// cancer_study_id is required, for example "gbm_tcga"
	if(typeof(cancer_study_id)=='string'){cancer_study_id={cancer_study_id:cancer_study_id}};
	return cbio.get('getCaseLists',fun,cancer_study_id);
}

cbio.getProfileData=function(parms,fun){
	return cbio.get('getProfileData',fun,parms);
	// case_set_id= [case set ID] (required)
    // genetic_profile_id= [one or more genetic profile IDs] (required). Multiple genetic profile IDs must be separated by comma (,) characters, or URL encoded spaces, e.g. +
	// gene_list=  [one or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs] (required). Multiple genes must be separated by comma (,) characters, or URL encoded spaces, e.g. +
}

cbio.getMutationData=function(parms,fun){
	return cbio.get('getMutationData',fun,parms);
	// genetic_profile_id= [one or more mutation profile IDs] (required). Multiple genetic profile IDs must be separated by comma (,) characters, or URL encoded spaces, e.g. +
	// case_set_id= [case set ID] (optional). If not provided, all cases that have data in the specified mutation profiles will be queried.
	// gene_list= [one or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs] (required). Multiple genes must be separated by comma (,) characters, or URL encoded spaces, e.g. +
}

cbio.getClinicalData=function(case_set_id,fun){
	// case_set_id is required, for example "ov_tcga_all"
	if(typeof(case_set_id)=='string'){case_set_id={case_set_id:case_set_id}};
	return cbio.get('getClinicalData',fun,case_set_id);
}

cbio.getProteinArrayInfo=function(parms,fun){
	// cancer_study_id= [cancer study ID] (required)
	// protein_array_type= [protein_level or phosphorylation]
	// gene_list= [one or more genes, specified as HUGO Gene Symbols or Entrez Gene IDs]. Multiple genes must be separated by comma (,) characters, or URL encoded spaces, e.g. +
	return cbio.get('getProteinArrayInfo',fun,parms);
}

cbio.getProteinArrayData=function(parms,fun){
	// case_set_id= [case set ID] (required)
	// array_info= [1 or 0]. If 1, antibody information will also be exported.
	if(typeof(parms)=='string'){parms={case_set_id:parms}};
	return cbio.get('getProteinArrayData',fun,parms);
}

cbio.getLinkStudy=function(parms){
	// i.e. parms={cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]}
	return "http://www.cbioportal.org/public-portal/link.do?"+cbio.parms(parms);
}

cbio.getLinkCase=function(parms){
	// i.e. parms={case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"}
	return "http://www.cbioportal.org/public-portal/case.do?"+cbio.parms(parms);
}

