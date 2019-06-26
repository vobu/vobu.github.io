module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        connect: {
            src: {
                options: {
                    hostname: "ui5con",
                    base: ["./", "../"],
                    port: 28619,
                    // keepalive: true
                    // livereload: true
                }
            }
        },
        watch: {
            // livereload: {
            //     options: {
            //         livereload: true
            //     },
            //     files: [
            //         "**",
            //         "!node_modules/**",
            //         "!*.less"
            //     ]
            // },
            styles: {
                files: ['custom.less'], // which files to watch
                tasks: ['less'],
                options: {
                  nospawn: true
                }
              }
        },
        less: {
            development: {
                files: {
                  "custom.css": "custom.less" // destination file and source file
                }
              }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['connect:src', 'watch']);

};
