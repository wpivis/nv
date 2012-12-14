/*jshint node:true */
/*global module:false */

module.exports = function (grunt) {

  'use strict';

  /*
  Tasks:
  * lint - uses [jshint](https://github.com/jshint/jshint/)
  * min - uses [uglify-js](https://github.com/mishoo/UglifyJS)
  * [mincss](https://github.com/gruntjs/grunt-contrib-mincss)
  */

  grunt.loadNpmTasks('grunt-contrib-mincss');

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: [
        'source/js/nv/*.js'
      , 'source/js/nv/models/*.js'
      , 'source/js/nv/views/*.js'
      ]
    }
    ,
    mincss: {
      'public/css/style.min.css': [
        'source/css/nv.css'
      , 'source/css/tipsy.css'
      ]
    }
    ,
    concat: {
      libs: {
        src: [
          'source/js/lib/d3.v2.js'
        , 'source/js/lib/underscore.js'
        , 'source/js/lib/backbone.js'
        , 'source/js/lib/crossfilter.js'
        , 'source/js/lib/jquery-ui-1.9.2.custom.js'
        , 'source/js/lib/jquery.tipsy.js'
        ]
      , dest: 'public/js/lib.min.js'
      }
    , app: {
        src: [
          'source/js/nv/main.js'
        , 'source/js/nv/util.js'
        , 'source/js/nv/models/*.js'
        , 'source/js/nv/views/*.js'
        , 'source/js/nv/router.js'
        , 'source/js/legacy.js'
        , 'source/js/parser/src/parser.js'
        ]
      , dest: 'public/js/app.min.js'
      }
    }
    ,
    min: {
      libs: {
        src: [
          'source/js/lib/d3.v2.js'
        , 'source/js/lib/underscore.js'
        , 'source/js/lib/backbone.js'
        , 'source/js/lib/crossfilter.js'
        , 'source/js/lib/jquery-ui-1.9.2.custom.js'
        , 'source/js/lib/jquery.tipsy.js'
        ]
      , dest: 'public/js/lib.min.js'
      }
    , app: {
        src: [
          'source/js/nv/main.js'
        , 'source/js/nv/util.js'
        , 'source/js/nv/models/*.js'
        , 'source/js/nv/views/*.js'
        , 'source/js/nv/router.js'
        , 'source/js/legacy.js'
        , 'source/js/parser/src/parser.js'
        ]
      , dest: 'public/js/app.min.js'
      }
    }
    ,
    copy: {
      html: {
        src: [ 'source/index.html']
      , dest: 'public/'
      }
    , jquery: {
        src: [ 'source/assets/js/jquery-1.8.3.min.js' ]
      , dest: 'public/js/'
      }
    }
    ,
    watch: { 
      files: [ 
        '<config:concat.app.src>'
      , 'source/index.html'
      , 'source/css/nv.css'
      , 'source/css/tipsy.css'
      ]
    , tasks: 'dev'
    }
    ,
    jshint: {
      options: {
        browser: true,
        laxcomma: true,
        maxparams: 5,
        maxdepth: 5,
        maxstatements: 30,
        maxcomplexity: 10
      },
      globals: {
        jQuery: true,
        console: false
      }
    }
  });

  // production, run when grunt is run with no arguments
  grunt.registerTask('default', 'lint mincss min copy');

  // development - dont minify js
  grunt.registerTask('dev', 'lint mincss concat copy');

  grunt.registerMultiTask('copy', 'Copy static files to deployment directory', function () {
    var path = require("path"),
        files = grunt.file.expand(this.file.src),
        dest = this.file.dest;

    grunt.log.writeln('Copying files for ' + this.target + '.');
        
    files.forEach(function (file) {      
      grunt.file.copy(file, path.join(dest, path.basename(file)), {noProcess: true});
      grunt.log.writeln('File "' + file + '" copied to "' + dest + '".');
    });
  });

};
