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

    if( vulnid in this.get('vulnIdInfo') ) {
      var vulnInfo = this.get('vulnIdInfo')[vulnid];
      vulnInfo.vulnid = vulnid;
      this.set('data', vulnInfo);
    } else {
      console.log('vulnerability missing: ' + vulnid);
    }

  }
});
