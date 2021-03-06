# IBL/cBio

All you need is

	<script src="https://ibl.github.io/cbio/cbio.js"></script>

Live at: [https://ibl.github.io/cbio/](http://ibl.github.io/cbio/)

---

Experimenting with the possibility of having [cBioPortal Web API](http://www.cbioportal.org/public-portal/web_api.jsp) as a client side JavaScript library. Since the API is not [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled, a [Google Script](https://script.google.com/a/macros/mathbiol.org/d/17o5B1sXjmUEWRHG_6vHQhmz3qTMPCgpOvlX1kNvDQCkVcrH5ANsi2NrY/edit) was implemented as a middle layer. The basic idea is to mimic the query syntax with objects constructed as

<i>
cbio.\<cmd\>( callbackFunction , { argument<sub>i</sub> : value<sub>i</sub> , ... } );
</i>

Many thanks to [MSKCC](http://www.mskcc.org/)'s [cBioPortal](http://www.cbioportal.org/public-portal/) team - this is a great public service !

---
### get
```javascript
cbio.get = function(cmd,fun,parms)
```

All commands below are a type of bio.get, sy submitting command cmd to cbio WebAPI and process it through callback function fun with option parameters parms. For example
```javascript
cbio.getTypesOfCancer is cbio.get('getTypesOfCancer')
```
and

```javascript

cbio.getProteinArrayData(
	{
		case_set_id:"coadread_tcga_RPPA",
		array_info:1
	},
	function(x){console.log(cbio.table(x))}
)

```

is the same as

```javascript
cbio.get(
	"getProteinArrayData",
	{
		case_set_id:"coadread_tcga_RPPA",
		array_info:1
	},
	function(x){console.log(cbio.table(x))}
)

```

or

```javascript
cbio.get(
	"getProteinArrayData",
	function(x){console.log(cbio.table(x))},
	{
		case_set_id:"coadread_tcga_RPPA",
		array_info:1
	}
)

```

(note the code will check for switch over vars fun and parms)

### getTypesOfCancer
```javascript
cbio.getTypesOfCancer( callbackFunction );
```
example: 

```javascript
	
cbio.getTypesOfCancer()

```

### getCancerStudies
```javascript
cbio.getCancerStudies( callbackFunction );
```
example: 

```javascript
	
cbio.getCancerStudies()

```

### getGeneticProfiles
```javascript
cbio.getGeneticProfiles( "cancer study ID (required)" , callbackFunction)
```
example: 

```javascript

	cbio.getGeneticProfiles("gbm_tcga") 
```

### getCaseLists
```javascript
cbio.getCaseLists(cancer_study_id)
```
example: 

```javascript	
cbio.getCaseLists("gbm_tcga") 
```

### getProfileData

```javascript

cbio.getProfileData({ 
	case_set_id: "case set ID (required)" , 
	genetic_profile_id: "one or more genetic profile IDs (required)",
	gene_list: "one or more HUGO Gene Symbols or Entrez Gene IDs (required)" 
})

```

examples: 

```javascript
cbio.getProfileData({
	case_set_id:"gbm_tcga_all",
	genetic_profile_id:"gbm_tcga_mutations",
	gene_list:["BRCA1","BRCA2","TP53"]
})

cbio.getProfileData({
	case_set_id:"gbm_tcga_all",
	genetic_profile_id:["gbm_tcga_log2CNA","gbm_tcga_gistic"],
	gene_list:"EGFR"
})

```

### getMutationData

```javascript

cbio.getMutationData({ 
	genetic_profile_id: "one or more mutation profile IDs (required)",
	case_set_id: "case set ID (optional)",
	gene_list: "one or more HUGO Gene Symbols or Entrez Gene IDs (required)"
})

```

examples: 
 
```javascript
cbio.getMutationData({
	case_set_id:"gbm_tcga_all",
	genetic_profile_id:"gbm_tcga_mutations",
	gene_list:["EGFR","PTEN"]
})

cbio.getMutationData({
	genetic_profile_id:["ov_tcga_mutations","ucec_tcga_mutations"],
	gene_list:"BRCA1"
})
```

### getClinicalData

cbio.getClinicalData("case set ID (required)")

example: 

```javascript
	
	cbio.getClinicalData("ov_tcga_all") 
```

### getProteinArrayInfo

```javascript
cbio.getProteinArrayInfo({
	cancer_study_id: "cancer study ID (required)",
	protein_array_type:"protein_level or phosphorylation",
	 gene_list:["one or more HUGO Gene Symbols or Entrez Gene IDs"]
})
```

examples:

```javascript	
cbio.getProteinArrayInfo({cancer_study_id:"coadread_tcga"})

cbio.getProteinArrayInfo({
	cancer_study_id:"coadread_tcga",
	protein_array_type:"phosphorylation"
})

cbio.getProteinArrayInfo({
	cancer_study_id:"coadread_tcga",
	protein_array_type:"protein_level",
	gene_list:["ERBB2","TP53"]
})
```

### getProteinArrayData

```javascript

cbio.getProteinArrayData({
	case_set_id: "case set ID (required)",
	array_info: “[1 or 0]. If 1, antibody information will also be exported”
})

```
examples:
```javascript
	cbio.getProteinArrayData("coadread_tcga_RPPA")

	cbio.getProteinArrayData({case_set_id:"coadread_tcga_RPPA"})

	cbio.getProteinArrayData({case_set_id:"coadread_tcga_RPPA",array_info:1})
```
---

### getLinkStudy
```javascript
cbio.getLinkStudy(parms)
```
example: 
```javascript
	cbio.getLinkStudy({cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]}) // returns URL

	cbio.getLinkStudy({cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]})  // opens URL
```
### getLinkCase

cbio.getLinkCase(parms)

examples: 

```javascript
	cbio.getLinkCase({case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"})  // returns URL

	cbio.getLinkCase({case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"},'cbio')  // opens URL

```

### oncoprint

...

