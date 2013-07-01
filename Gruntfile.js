module.exports = function (grunt) {

    // Configuration goes here
    grunt.initConfig({
        htmllint: {
            all: ["src/html/test.html"]
        },
        csslint: {
            strict: {
                options: {
                    import: 2,
                    ids: false
                },
                src: ['src/css/*.css']
            },
            lax: {
                options: {
                    import: false
                },
                src: ['src/css/*.css']
            }
        },
         cssmin: {
            minify: {
                expand: true,
                cwd: 'src/css/',
                src: ['*.css'],
                dest: 'src/css/min/',
                ext: '.min.css'
            },
            add_banner: {
                options: {
                    banner: '/*\n* Owner: www.surfstitch.com \n* Description: \n* Author: SurfStitch Content team\n* Date: ' + grunt.template.today('yyyy-mm-dd h:MM:ss TT Z') + '\n*/\n'
                },
                files: {
                    'src/css/min/ctUserStyles.css': ['src/css/min/*.min.css']
                }
            }
        },
        hash: {
            src: 'src/css/min/ctUserStyles.css',  //all your js that needs a hash appended to it
            mapping: 'assets.json', //mapping file so your server can serve the right files
            dest: 'release/ct/css/' //where the new files will be created
        },
        git: {
            pull: {
                options: {
                    command: 'pull'
                }
            },
            task: {
                options: {
                    command: 'commit',
                    message: 'Testing'
                },
                files: {
                    src: ['release/ct/css/ctUserStyles.*.css']
                }
            }
        },
        secret: grunt.file.readJSON('secret.json'),
        sftp: {
            test: {
                files: {
                    "uat/css/": "tasks/**/*.js"
                },
                options: {
                    host: '<%= secret.host %>',
                    username: '<%= secret.username %>',
                    // password auth
                    password: '<%= secret.password %>'
                }
            }
        }
    });

    // Load plugins here
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-html-validation');
    grunt.loadNpmTasks('grunt-hash');

  // Define your tasks here
    grunt.registerTask('default', ['csslint:strict','cssmin','hash']);
    grunt.registerTask('deploy_uat', ['sftp']);
    grunt.registerTask('deploy_prod', ['sftp']);
};