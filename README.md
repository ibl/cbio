# IBL/cBio

Live at: [http://ibl.github.io/cbio/](http://ibl.github.io/cbio/)

---

Experimenting with the possibility of having [cBioPortal Web API](http://www.cbioportal.org/public-portal/web_api.jsp) as a client side JavaScript library. Since the API is not [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) enabled, a [Google Script](https://script.google.com/a/macros/mathbiol.org/d/17o5B1sXjmUEWRHG_6vHQhmz3qTMPCgpOvlX1kNvDQCkVcrH5ANsi2NrY/edit) was implemented as a middle layer. The basic idea is to mimic the query syntax with objects constructed as

<i>
cbio.\<cmd\>( callbackFunction , { argument<sub>i</sub> : value<sub>i</sub> , ... } );
</i>

Many thanks to [MSKCC](http://www.mskcc.org/)'s [cBioPortal](http://www.cbioportal.org/public-portal/) team - this is a great public service !

---

### getTypesOfCancer

cbio.getTypesOfCancer( callbackFunction );

example: <i>
	
	cbio.getTypesOfCancer()</i>

### getCancerStudies

cbio.getCancerStudies( callbackFunction );

example: <i>cbio.getCancerStudies();</i>

### getGeneticProfiles

cbio.getGeneticProfiles( "cancer study ID (required)" , callbackFunction)

example: <i>
	
	cbio.getGeneticProfiles("gbm_tcga") 
</i>

### getCaseLists

cbio.getCaseLists(cancer_study_id)

example: <i> 
	
	cbio.getCaseLists("gbm_tcga") 
</i>

### getProfileData

cbio.getProfileData({ 
	case_set_id: "case set ID (required)" , 
	genetic_profile_id: "one or more genetic profile IDs (required)",
	gene_list: "one or more HUGO Gene Symbols or Entrez Gene IDs (required)" 
})

examples: 

<i> 

	cbio.getProfileData({case_set_id:"gbm_tcga_all",genetic_profile_id:"gbm_tcga_mutations",gene_list:["BRCA1","BRCA2","TP53"]})

	cbio.getProfileData({case_set_id:"gbm_tcga_all",genetic_profile_id:["gbm_tcga_log2CNA","gbm_tcga_gistic"],gene_list:"EGFR"})
</i>

### getMutationData

cbio.getMutationData({ 
	genetic_profile_id: "one or more mutation profile IDs (required)",
	case_set_id: "case set ID (optional)",
	gene_list: "one or more HUGO Gene Symbols or Entrez Gene IDs (required)"
})

examples: 

<i> 

	cbio.getMutationData({case_set_id:"gbm_tcga_all",genetic_profile_id:"gbm_tcga_mutations",gene_list:["EGFR","PTEN"]})

	cbio.getMutationData({genetic_profile_id:["ov_tcga_mutations","ucec_tcga_mutations"],gene_list:"BRCA1"})
</i>

### getClinicalData

cbio.getClinicalData("case set ID (required)")

example: <i> 

	
	cbio.getClinicalData("ov_tcga_all") 

</i>

### getProteinArrayInfo

cbio.getProteinArrayInfo({cancer_study_id: "cancer study ID (required)",protein_array_type:"protein_level or phosphorylation", gene_list:["one or more HUGO Gene Symbols or Entrez Gene IDs"]})

examples:

<i> 
	
	cbio.getProteinArrayInfo({cancer_study_id:"coadread_tcga"})

	cbio.getProteinArrayInfo({cancer_study_id:"coadread_tcga",protein_array_type:"phosphorylation"})

	cbio.getProteinArrayInfo({cancer_study_id:"coadread_tcga",protein_array_type:"protein_level",gene_list:["ERBB2","TP53"]})
</i>

### getProteinArrayData

cbio.getProteinArrayData({case_set_id: "case set ID (required)", array_info: [1 or 0]. If 1, antibody information will also be exported})

examples:

<i>
	
	cbio.getProteinArrayData("coadread_tcga_RPPA")

	cbio.getProteinArrayData({case_set_id:"coadread_tcga_RPPA"})

	cbio.getProteinArrayData({case_set_id:"coadread_tcga_RPPA",array_info:1})
</i>

---

### getLinkStudy

cbio.getLinkStudy(parms)

example: <i> 
	
	cbio.getLinkStudy({cancer_study_id:"gbm_tcga",gene_list:["EGFR","NF1"]}) 
</i>

### getLinkCase

cbio.getLinkCase(parms)

example: <i> 
	
	cbio.getLinkCase({case_id:"TCGA-81-5910",cancer_study_id:"gbm_tcga"}) 
</i>


