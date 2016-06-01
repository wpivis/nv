// The router is our entire app
var NV = new (Backbone.Router.extend({
  routes: {
    "": "index"
  },

  // instantiate/link views and models
  initialize: function(){
    // the crossfilter holder
    this.nessus           =  new Nessus({
                             dimensions: [ 'ip', 
                                           'port',
                                           'cvss',
                                           'vulnid',
                                           'vulntype']
                           });

  // models and views

    // cvss (severity) histogram
    
    this.cvssHistogram        =   new Histogram({  
                                  app: this,
                                  datasource: this.nessus, 
                                  bins: 10, 
                                  range: [0, 10], 
                                  filterOptions: { attribute:'cvss' }
                               });

   this.cvssHistogramView    =   new HistogramView({
                                 app: this,
                                 model: this.cvssHistogram,
                                 target:'#cvssHistogram',
                                 barwidth: 20,
                                 w: 220,
                                 h: 165,
                                 title: 'cvss'
                              });

    // vulnerability type histogram

      // NOTE: This is a hack to make categorical histograms.
      // If d3 somehow supports non-numerical histograms, we can remove this
      // and lighten the histogram model considerably.
      var vulnTypeMap = d3.scale.ordinal()
          //.domain(['hole', 'port', 'note'])
          .domain(['None', 'Low', 'Medium', 'High', 'Critical'])
          .range([1,2,3,4,5]);

      this.vulnTypeHistogram        =   new Histogram({  
                                        app: this,
                                        datasource: this.nessus, 
                                        bins: 5,
                                        datamap: vulnTypeMap,
                                        filterOptions: {
                                          attribute: 'vulntype'
                                        }
                                    });

      this.vulnTypeHistogramView    =   new HistogramView({
                                        app: this,
                                        model: this.vulnTypeHistogram,
                                        target:'#vulnTypeHistogram',
                                        barwidth: 30,
                                        w: 150,
                                        h: 165,
                                        title: 'vuln type'
                                    });

    // top notes histogram

    this.topNoteHistogram        =   new Histogram({  
                                     app: this,
                                     datasource: this.nessus, 
                                     limit: 6,
                                     filterOptions: {
                                       attribute: 'vulnid',
                                       filters: [
                                         { attribute:'vulntype', exact:'None' }
                                       ]
                                     }
                                 });

    this.topNoteHistogramView    =  new HistogramView({
                                    app: this,
                                    model: this.topNoteHistogram,
                                    target:'#topNoteHistogram',
                                    barwidth: 30,
                                    w: 180,
                                    h: 165,
                                    title: 'top notes'
                                });
 
    // top holes histogram

    this.topHoleHistogram       =   new Histogram({  
                                    app: this,
                                    datasource: this.nessus, 
                                    limit: 6,
                                    filterOptions: {
                                      attribute: 'vulnid',
                                      filters: [
                                        { attribute:'vulntype', exact:'Medium' }
                                      ]
                                    }
                                });

    this.topHoleHistogramView   =   new HistogramView({
                                    app: this,
                                    barwidth: 30,
                                    model: this.topHoleHistogram,
                                    target:'#topHoleHistogram',
                                    w: 180,
                                    h: 165,
                                    title: 'top holes'
                                });

    // treemap hierarchy
    this.hierarchy      =   new Hierarchy({  
                            app: this,
                            datasource: this.nessus
                        });

    this.hierarchyView  =   new HierarchyView({
                            app: this,
                            model: this.hierarchy,
                            target:'#hierarchy'
                        });

    // color view
    this.colorLegend      =   new ColorLegend({  
                              app: this,
                              datasource: this.nessus
                          });

    this.colorLegendView   =   new ColorLegendView({
                              app: this,
                              model: this.colorLegend,
                              target:'#colorlegend'
                          });

    
    // TODO treemap hierarchy view

    // treemap
    this.treemap        =   new Treemap({  
                            app: this,
                            datasource: this.nessus, 
                            hierarchy: this.hierarchy, 
                            filterOptions: {
                              attribute: 'vulnid'
                            }
                        });

    this.treemapView    =   new TreemapView({
                            app: this,
                            model: this.treemap,
                            color: this.colorLegend, 
                            target:'#vis'
                        });



    // info view
    this.nessusInfo       =   new NessusInfo({  
                              app: this,
                              datasource: this.nessus
                          });

    this.nessusInfoView   =   new NessusInfoView({
                              app: this,
                              model: this.nessusInfo,
                              target:'#nessusinfo'
                          });


  },

  // called from outside the app
  start: function(){
    Backbone.history.start();
  },

  resize: function(){
    this.trigger('resize');
  }

}))();
