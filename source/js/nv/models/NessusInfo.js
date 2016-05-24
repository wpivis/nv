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
    var e = null;
    eventList.forEach(function(event) {
      if (event.vulnid == vulnid) {
        e = event;
      }
    });
    var vulnInfo = {
      "bugtraqList": [
        "<a href='http://securityfocus.com/bid/'></a>"
      ],
      "cveList": [
        "<a href='http://cgi.nessus.org/cve.php3?cve='></a>"
      ],
      "description": e.description,
      "family": e.family,
      "otherInfoList": [
        "Risk factor : " + e.risk_factor + " / CVSS Base Score : " + e.cvss
      ],
      "solution": e.solution,
      "synopsis": e.synopsis,
      "title": e.title,
      "updateInfo": ""
    };
    vulnInfo.vulnid = vulnid;
    this.set('data', vulnInfo);

  }
});
