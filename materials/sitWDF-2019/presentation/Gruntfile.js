module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            src: {
                options: {
                    hostname: "sitWDF",
                    base: "./",
                    port: 2019,
                    // keepalive: true
                    livereload: true
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    "**",
                    "!node_modules/**",
                    "!*.less"
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect:src', 'watch']);

};