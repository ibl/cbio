cbio={};

cbio.hello = function(){
	console.log('cbio :-)');
	return false
}

cbio.uid=function(x){
	if(!x){x='UID'};
	return x+Math.random().toString().slice(2)
}

cbio.removeEl=function(id){
	document.getElementById(id).parentNode.removeChild(document.getElementById(id))
}

cbio.getScript = function (url,cb,er){ // load script / JSON
	var s = document.createElement('script');
	s.src=url;
	s.id = this.uid();
	if(!!cb){s.onload=cb}
	if(!!er){s.onerror=er}
	document.head.appendChild(s);
	setTimeout('document.head.removeChild(document.getElementById("'+s.id+'"));',30000); // is the waiting still needed ?
	return s.id;
}

cbio.get = function(cmd,fun,parms){ // submit command cmd to cbio WebAPI and process it through callback function fun
	if(!cmd){cmd='getTypesOfCancer'}; // see http://www.cbioportal.org/public-portal/web_api.jsp for list of comands
	if(typeof(fun)=="object"){ // check if fun and parms are swicthed over
		var fun0=parms
		parms=fun
		fun=fun0
	}
	if(!fun){fun=function(x){console.log(cbio.table(x))}};
	if(!cbio.get.callbacks){cbio.get.callbacks={}};
	if(!cbio.get.cache){cbio.get.cache={}};
	var uid = this.uid('get');
	if(!parms){
		var Qparms="";
	} else {
		var Qparms="&";
		Qparms+=cbio.parms(parms);
	}
	this.get.callbacks[uid]={ // maybe this can be used as a cache to avoid repeating calls
		cmd:cmd,
		fun:function(x){cbio.get.cache[cmd+Qparms]=x;return fun(x)},
		t:Date.now()
	}
	if(!this.get.cache[cmd+Qparms]){ // this is not in the cache already
		this.getScript('https://script.google.com/macros/s/AKfycbwsJ5_WKUUZX1ccf7m1zYbtksCm-FEck_uC2agZv_DXAzsS7H4p/exec?cmd='+cmd+'&callback=cbio.get.callbacks.'+uid+'.fun'+Qparms);
	} else {
		cbio.get.callbacks[uid].fun(this.get.cache[cmd+Qparms]);
	}
	
	// proxy code at https://script.google.com/a/macros/mathbiol.org/d/17o5B1sXjmUEWRHG_6vHQhmz3qTMPCgpOvlX1kNvDQCkVcrH5ANsi2NrY/edit
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

cbio.getLinkStudy=function(parms,op){
	// i.e. parms={cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]}
	// example: cbio.getLinkStudy({cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]},'cbio')
	url = "http://www.cbioportal.org/public-portal/link.do?"+cbio.parms(parms);
	this.openUrl(url,op);
	return url
}

cbio.getLinkCase=function(parms,op){
	// i.e. parms={case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"}
	// example: 
	// cbio.getLinkCase({case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"},"cbio")
	url = "http://www.cbioportal.org/public-portal/case.do?"+cbio.parms(parms);
	this.openUrl(url,op);
	return url
}

cbio.openUrl = function(url,op){
	switch(op){
	case undefined:
		break; // move on
	case 1: // open in a new window
		window.open(url);
		break;
	case 2: // open in new iframe 
		4
		break;
	default: // treating op as the parent DOM element
		if(typeof(op)=="object"){var parentEl = op}
		else { // op is the id of the parent DOM element
			var parentEl = document.getElementById(op);
			if(!parentEl){ // if not found create it and drop it in the body
				var parentEl = document.createElement('div');
				document.body.appendChild(parentEl);
			}
		}
		var div = document.createElement('div');
		div.id=cbio.uid();
		//div.innerHTML='<a href="'+url+'" target=_blank>Open</a> in new window; <button style="color:red" onclick="cbio.removeEl(\''+div.id+'\')">Remove</button>';
		div.innerHTML='<button onclick="window.open(\''+url+'\');" style="color:blue">Open</button> in new window; <button style="color:red" onclick="cbio.removeEl(\''+div.id+'\')">Remove</button>';
		parentEl.appendChild(div);
		var ifr = document.createElement('iframe');
		div.appendChild(ifr);ifr.width="100%";ifr.height="100%";
		ifr.src=url;
	}
	return false;
}

cbio.oncoprint

// new API endpoint http://www.cbioportal.org/api/swagger-ui.html#/
