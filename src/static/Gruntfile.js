module.exports = function ( grunt ) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-ng-constant');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
          ' * <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
          '<%= pkg.author %>\n' +
          ' * Licensed <%= pkg.licenses.type %> ' +
          '<<%= pkg.licenses.url %>>\n' +
          ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= buildDir %>',
      '<%= compileDir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `buildDir`, and then to copy the assets to `compileDir`.
     */
    copy: {
      buildAppAssets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= buildDir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      buildVendorAssets: {
        files: [
          {
            src: [ '<%= vendorFiles.assets %>' ],
            dest: '<%= buildDir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },
      buildAppjs: {
        files: [
          {
            src: [ '<%= tempFiles.js %>' ],
            dest: '<%= buildDir %>',
            cwd: '<%= buildDir %>',
            expand: true
          }
        ]
      },
      buildVendorjs: {
        files: [
          {
            src: [ '<%= vendorFiles.js %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      buildVendorcss: {
        files: [
          {
            src: [ '<%= vendorFiles.css %>' ],
            dest: '<%= buildDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      compileAssets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compileDir %>/assets',
            cwd: '<%= buildDir %>/assets',
            expand: true
          },
          {
            src: [ '<%= vendorFiles.css %>' ],
            dest: '<%= compileDir %>/',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `buildCss` target concatenates compiled CSS and vendor CSS
       * together.
       */
      buildCss: {
        src: [
          '<%= vendorFiles.css %>',
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compileJs` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compileJs: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendorFiles.js %>',
          'module.prefix',
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= compileDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: [
          {
            expand: true,
            src: [ '<%= appFiles.js %>'],
            dest: '<%= buildDir %>'
          }
        ]
      }
    },

    /**
     * `ngAnnotate` annotates the sources before minifying.
     * That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= appFiles.js %>' ],
            cwd: '<%= buildDir %>',
            dest: '<%= buildDir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compileJs.dest %>': '<%= concat.compileJs.dest %>'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and
     * uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css':
              '<%= appFiles.less %>'
        }
      },
      compile: {
        files: {
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css':
              '<%= appFiles.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= appFiles.js %>'
      ],
      test: [
        '<%= appFiles.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        esnext: true,
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        camelcase : true,
        //indent: 2,
        undef: true,
        quotmark: 'single',
        maxlen: 80,
        trailing: true,
        predef: [
          'angular',
          'require',
          'module',
          'jasmine',
          'describe',
          'xdescribe',
          'before',
          'beforeEach',
          'after',
          'afterEach',
          'it',
          'xit',
          'it',
          'inject',
          'expect',
          'spyOn'
        ],
        devel: true
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= appFiles.atpl %>' ],
        dest: '<%= buildDir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= appFiles.ctpl %>' ],
        dest: '<%= buildDir %>/templates-common.js'
      }
    },

    /**
     * Environment targets
     * */
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config'
      },
      development: {
        options: {
          dest: '<%= buildDir %>/src/app/config/config.js'
        },
        constants: {
          ENV: '<%= devEnv %>'
        }
      },
      production: {
        options: {
          dest: '<%= buildDir %>/src/app/config/config.js'
        },
        constants: {
          ENV: '<%= prodEnv %>'
        }
      }
    },


    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= buildDir %>',
        src: [
          '<%= vendorFiles.js %>',
          '<%= buildDir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendorFiles.css %>',
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compileDir %>',
        src: [
          '<%= concat.compileJs.dest %>',
          '<%= vendorFiles.css %>',
          '<%= buildDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= appFiles.js %>'
        ],
        tasks: [
          'jshint:src',
          'babel'
          //'copy:buildAppjs'
        ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:buildAppAssets', 'copy:buildVendorAssets' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= appFiles.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= appFiles.atpl %>',
          '<%= appFiles.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'less:build' ]
      }

    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [
    'build',
    'delta'
  ] );
  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'html2js',
    'less:build', 'ngconstant:development',
    'concat:buildCss', 'copy:buildAppAssets', 'copy:buildVendorAssets',
    'babel', 'copy:buildVendorjs', 'copy:buildVendorcss',
    'index:build'
  ]);

  /**
   * The `compile` task gets your app ready for deployment
   * by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'less:compile', 'copy:compileAssets',
    'ngconstant:production', 'ngAnnotate', 'concat:compileJs',
    'uglify', 'index:compile'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask(
      'index', 'Process index.html template', function () {
    var dirRE = new RegExp(
            '^('+grunt.config('buildDir')+'|'+grunt.config(
                'compileDir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

};
