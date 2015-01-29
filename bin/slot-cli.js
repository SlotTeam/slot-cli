#!/usr/bin/env node

/**
 * A faster way to create a project and see created content, use this command line:
 *  project="demo1"; slot create $project; cat $project/slot.json; cat $project/package.json
 *
 * A faster way to add a page to project and see created content, use this command line:
 *  page="demo1"; slot add -p $page; cat www/$page.html; echo "====="; cat bind/$page.json
 *
 * To see examples of how to use commander module, got to:
 *  https://github.com/visionmedia/commander.js/blob/master/examples/deploy
 *
 * @type {exports}
 */

var program = require('commander'),
    os = require("os"),
    fs = require("fs"),
    path = require("path"),
    mkdirp = require('mkdirp'),
    sortObj = require('sort-object'),
    cliHelper = require('./cliHelper'),
    cliActions = require('./cliActions'),
    pretty = require('./prettyMessage'),
    pkg = require('../package.json');
var slotJson,
    slotJsonFile;

// Set command line version
program.version(pkg.version);

/**
 * TODO:
 *  1.  Add a program command to control 'no parameters send by user'
 */

program
    .command('*')
    .action(function (env) {
        console.log('Enter a Valid command');
        console.log('   To see help use: slot -h');
    });

program
    .command('create [project]')
    .description('Create a new project on folder [name]')
    //.option("-t, --theme [theme_id]", "Which theme_id to use in the project. It will install a predefined theme based on HTML5 frameworks like Bootstrap, Zurb, Kube.", null)

/**
 * TODO: Complete the '-t, --theme' option
 */

    .action(function (project) {

        if (project) {
            //Validate that we are not located on a valid slot project
            cliHelper.isValidRootDir(process.cwd()
                , function (exists) {
                    pretty.alert();
                    pretty.alert("It appears that you are located on a valid slot project, you can't execute 'create command' inside an existing slot project.");
                }
                , function (exists) {
                    slotJson = require('../slot.json');
                    slotJsonFile = path.join(process.cwd(), 'slot.json');

                    pretty.doing("Creating '%s' project!", project);

                    mkdirp(project, function (err) {
                        if (err) console.error(err)
                        else {
                            pretty.doing("creating metaData folder");

                            mkdirp(path.join(project, slotJson.framework.metaData), function (err) {
                                if (err) console.error(err)
                                else {
                                    pretty.doing("creating fragmentRootDir folder");

                                    mkdirp(path.join(project, slotJson.framework.fragmentRootDir), function (err) {
                                        if (err) console.error(err)
                                        else {
                                            pretty.doing("creating webRootDir folder");

                                            mkdirp(path.join(project, slotJson.framework.webRootDir), function (err) {
                                                if (err) console.error(err)
                                                else {
                                                    pretty.doing("creating mvcRootDir folder");

                                                    mkdirp(path.join(project, slotJson.framework.mvcRootDir), function (err) {
                                                        if (err) console.error(err)
                                                        else {
                                                            pretty.doing("creating restRootDir folder");

                                                            mkdirp(path.join(project, slotJson.framework.restRootDir), function (err) {
                                                                if (err) console.error(err)
                                                                else {
                                                                    pretty.doing("creating dbRootDir folder");

                                                                    mkdirp(path.join(project, slotJson.framework.dbRootDir), function (err) {
                                                                        if (err) console.error(err)
                                                                        else {
                                                                            /*pretty.doing("creating restFilter folder');*/
                                                                            pretty.inform("Running on  " + __dirname);

                                                                            var pathToResources = path.join(path.join(__dirname, ".."), "resources");
                                                                            pretty.inform("Resources folder " + pathToResources);

                                                                            /**
                                                                             * Create slot.json file
                                                                             */
                                                                            var content = fs.readFileSync(path.join(pathToResources, "ref-slot.json"), 'binary'),
                                                                                pathFile = path.join(project, "slot.json");
                                                                            //
                                                                            /**
                                                                             * TODO:
                                                                             *  1.  Evaluate if creating a new project using -T option deserve to add basic fragments
                                                                             *      in the fragments section.
                                                                             */
                                                                            content = content
                                                                                .replace("{@fragments@}", "");
                                                                            //
                                                                            fs.writeFile(pathFile, content, function (err) {
                                                                                if (err) throw err;
                                                                                pretty.inform("Saved slot.json on: " + pathFile);

                                                                                /**
                                                                                 * Create package.json file
                                                                                 */
                                                                                content = fs.readFileSync(path.join(pathToResources, "ref-package.json"), 'binary');
                                                                                pathFile = path.join(project, "package.json");
                                                                                //
                                                                                content = content
                                                                                    .replace("{@name@}", project)
                                                                                    .replace("{@license@}", "MIT");
                                                                                //
                                                                                fs.writeFile(pathFile, content, function (err) {
                                                                                    if (err) throw err;
                                                                                    pretty.inform("Saved package.json on: " + pathFile);

                                                                                    /**
                                                                                     * Execute 'npm install' to build all dependencies
                                                                                     */
                                                                                    cliHelper.npmInstall(project);

                                                                                    cliHelper.buildServers(pathToResources, project);

                                                                                    /**
                                                                                     * Build project home page
                                                                                     */
                                                                                    cliHelper.buildPage(pathToResources, project, "index", slotJson, true /*<<== isHomepage*/);

                                                                                    /**
                                                                                     * TODO:
                                                                                     *  1.  After creation show a message saying:
                                                                                     *      This project have been created with OneTheme, the oficial Bootstrap
                                                                                     *      custom theme for Slot Framework. You can see full show case of OneTheme
                                                                                     *      in:
                                                                                     *          http://www.slotframework.org/slot-themes/bootstrap/oneTheme
                                                                                     *
                                                                                     *      Or describe any other theme the user has selected
                                                                                     */
                                                                                });
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            );
        }
        else
            console.log('Please enter a project name');
    });

program
    .command('start')
    .description('Start servers on current slot project, without parameters, it starts the designer server by default')
    //.option("-p, --port [port]", "specify the port [3000]", /*Number,*/ 3000)
    .option("-s, --design", "Start the designer server on current slot project")
    .option("-d, --develop", "Start the development server on current slot project")
    .option("-a, --all", "Start designer and development server on current slot project")
    .action(function (options) {
        //Validate that we are located on a valid slot project
        cliHelper.isValidRootDir(process.cwd()
            , function (exists) {
                // Load local slot configuration
                slotJsonFile = path.join(process.cwd(), 'slot.json');
                slotJson = require(slotJsonFile);

                //
                var development = require('slot-framework'),
                    designer = development.Designer
                    ;

                if (options.develop) {
                    development.start();
                }
                else if (options.all) {
                    cliHelper.cmdUnderConstruction()
                }
                else if (options.port) {
                    cliHelper.cmdUnderConstruction()
                }
                else if (options.design || (!options.develop && !options.design && !options.all && !options.port)) {
                    designer.start();
                }
                else {
                    console.log('Please enter a valid command');
                    console.log('   To see help use: slot start -h');
                }
            }
            , function (exists) {
                pretty.alert();
                pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            }
        );
    }
);

program
    .command('add')
    .description('Add a new object to current slot project')
    .option("-p, --page [page]", "Which page name to use", null)
    .option("-f, --fragment [fragment]", "Which fragment name to use", null)
    .option("-r, --rest [rest]", "Which rest service name to use", null)
    .action(function (options) {

        //Validate that we are located on a valid slot project root directory
        cliHelper.isValidRootDir(process.cwd()
            , function (exists) {
                // Load local slot configuration
                slotJsonFile = path.join(process.cwd(), 'slot.json');
                slotJson = require(slotJsonFile);

                //
                var pathToResources = path.join(path.join(__dirname, ".."), "resources");

                if (options.fragment) {
                    cliActions.addFragment(pathToResources, process.cwd(), options.fragment, slotJson, slotJsonFile);
                }
                else if (options.rest) {
                    cliActions.addRestService(pathToResources, process.cwd(), options.rest, slotJson);
                }
                else if (options.page) {
                    cliActions.addPage(pathToResources, process.cwd(), options.page, slotJson);
                }
                else {
                    console.log('Please enter a valid command');
                    console.log('   To see help use: slot add -h');
                }
            }
            , function (exists) {
                pretty.alert();
                pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            }
        );
    }
);

program
    .command('export *')
    .description('Export current slot project into optimized format, a zip file will be created with just necesary objects to deploy on Production Server')
    .option("-m, --minify [minify]", "Minify 'html, css, js' files on current slot project"/*, null*/ /*,"ALL"*/)
    .action(function (options) {

        if (options.minify) {

            /**
             * TODO:
             *  1.  Validate if(options.minify.trim()!='') when calling buildExport()
             */

            console.log('Exporting and minify current project.. %s', options.minify == true);

            // Load local slot configuration
            slotJson = require(slotJsonFile /*path.join(process.cwd(), 'slot.json')*/);

            //slot export -m 'css,html'

            // Set to ALL extensions, if '-m' option don't have values
            var extensions = options.minify == true ? "html,css,js".split(',') : options.minify.split(',');

            console.log('Exporting and minify current project, extensions %s', extensions);

            cliHelper.cmdUnderConstruction();
        }
        else {
            console.log('Exporting current project..');
            cliHelper.cmdUnderConstruction();
        }
    }
);


// Invoke the command execution
program.parse(process.argv);
