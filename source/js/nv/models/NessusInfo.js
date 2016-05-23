var NessusInfo = Backbone.Model.extend({

  initialize: function() {
    var self = this;

    this.get('app').on('treemap_mouseover', function(key){
      if( key.indexOf('id') !== -1 ){
        key = key.replace('id', '');
        this.updateData(key);
      }
    }, this);

    // respond to a mouseover on histogram
    this.get('app').on('histogramMouseover', function(msg){
      if( msg.chart.indexOf('notes') !== -1 || msg.chart.indexOf('holes') !== -1 ){
        this.updateData( msg.label );
      }
    }, this);

    // load vulnerability ids
    $.get("data/vulnIDs.json", function(data) {
      self.set('vulnIdInfo', data);
    });
  },

  updateData: function(vulnid){
    var vulnInfo = {};

    if( vulnid in this.get('vulnIdInfo') ) {
      vulnInfo = this.get('vulnIdInfo')[vulnid];
      vulnInfo.vulnid = vulnid;
      this.set('data', vulnInfo);
    } else {
      console.log('vulnerability missing but watch: ' + vulnid);
      vulnInfo = {
        "bugtraqList": [
          "<a href='http://securityfocus.com/bid/'></a>"
        ], 
        "cveList": [
          "<a href='http://cgi.nessus.org/cve.php3?cve='></a>"
        ], 
        "description": "This vulnerability is currently missing from NV's database. ", 
        "family": "unknown", 
        "otherInfoList": [
          "Risk factor : unknown"
        ], 
        "solution": "", 
        "synopsis": "<a target='_blank' href='http://www.tenable.com/plugins/index.php?view=single&id="+vulnid+"'>Vulnerability details on Tenable</a>.", 
        "title": "Missing: see below for external links", 
        "updateInfo": ""
      };
      vulnInfo.vulnid = vulnid;
      this.set('data', vulnInfo);
    }

  }
});
