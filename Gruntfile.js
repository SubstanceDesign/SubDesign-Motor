'use strict';

module.exports = function( grunt ) {

  // tasks
  grunt.initConfig({

    // concat JS
    concat: {
      options: {
        separator: '\n\n'
      },
      scripts: {
        src: ['_source/core/base/js/base.js','_source/core/**/js/*.js','_source/modules/**/js/*.js'],
        dest: 'js/motor.js'
      }
    },

    // beautify deploy JS
    jsbeautifier: {
      files: ['js/motor.js'],
      options: {
          config: 'jsbeautifier.json'
      }
    },

    // minify deploy JS
    uglify: {
      scripts: {
        files: {
          'js/motor.min.js': 'js/motor.js'
        }
      }
    },

    // compile Sass
    sass: {                              
      dist: {                           
        options: {                       
          style: 'expanded'
        },
        files: {              
          'css/motor.css': '_source/main.scss'
        }
      }
    },

    // autoprefix CSS
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'Android 3', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 7', 'ie 8', 'ie 9']
      },
      no_dest: {
        src: ['css/motor.css']
      }
    },

    // beautify CSS
    csscomb: {
      styles: {
        options: {
          config: 'csscomb.json'
        },
        files: {
          'css/motor.css': 'css/motor.css'
        }
      }
    },

    // minify CSS
    cssmin: {
      options: {
          keepSpecialComments: 0
      },
      styles: {
        files: {
          'css/motor.min.css': 'css/motor.css'
        }
      }
    },

    // watches files for changes
    watch: {
      js: {
        files: ['_source/core/**/js/*.js','_source/modules/**/js/*.js'],
        tasks: [ 'concat' ]
      },
      css: {
        files: ['_source/*.scss','_source/core/**/scss/*.scss','_source/modules/**/scss/*.scss'],
        tasks: [ 'sass', 'autoprefixer' ]
      }
    },

    // server
    connect: {
      server: {
        options: {
          port: 8123
        }
      }
    }

  });

  // Загрузка плагинов, установленных с помощью npm install
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-csscomb' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-autoprefixer' );
  grunt.loadNpmTasks( 'grunt-contrib-concat');
  grunt.loadNpmTasks( 'grunt-jsbeautifier' );
  grunt.loadNpmTasks( 'grunt-jsbeautifier' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );

  // some default tasks

  grunt.registerTask( 'default', [ 'concat', 'sass', 'autoprefixer' ] );
  grunt.registerTask( 'publish', [ 'concat', 'uglify', 'jsbeautifier', 'sass', 'autoprefixer', 'csscomb', 'cssmin' ] );
  grunt.registerTask( 'serv', [ 'connect', 'watch' ] );

};