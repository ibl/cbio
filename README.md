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

### getCancerStudies

cbio.getCancerStudies( callbackFunction );

### getGeneticProfiles

cbio.getGeneticProfiles( callbackFunction , "cancer study ID")


