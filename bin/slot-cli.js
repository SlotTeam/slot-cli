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
    path = require("path"),
    cliHelper = require('./cliHelper'),
    addCommand = require('./addCommand'),
    createCommand = require('./createCommand'),
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

program.command('*')
    .action(function (env) {
        pretty.alert();
        pretty.alert("Enter a Valid command");
        pretty.alert("   To see help use: slot -h");
    });

program.command('create [project]')
    .description('Creates a new project on folder [name]')
    //.option("-t, --theme [theme_id]", "Which theme_id to use in the project. It will install a predefined theme based on HTML5 frameworks like Bootstrap, Zurb, Kube.", null)
    .action(function (project) {

        createCommand(project);
    });

program.command('start')
    .description('Starts servers on current slot project, without parameters, it starts the designer server by default')
    //.option("-p, --port [port]", "specify the port [3000]", /*Number,*/ 3000)
    .option("-s, --design", "Start the designer server on current project")
    .option("-d, --develop", "Start the development server on current project")
    .option("-a, --all", "Start designer and development server on current project")
    .action(function (options) {
        //Validate that we are located on a valid slot project
        cliHelper.isValidRootDir(process.cwd()
            , function (exists) {
                // Load local slot configuration
                slotJsonFile = path.join(process.cwd(), 'slot.json');
                slotJson = require(slotJsonFile);
                //
                var development = require('slot-framework'),
                    designer = development.Designer;

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
                    pretty.alert();
                    pretty.alert("Please enter a valid command");
                    pretty.alert("   To see help use: slot start -h");
                }
            }
            , function (exists) {
                pretty.alert();
                pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            }
        );
    }
);

program.command('add')
    .description('Adds a new object to current slot project')
    .option("-p, --page [page]", "Which page name to use", null)
    .option("-f, --fragment [fragment]", "Which fragment name to use", null)
    .option("-r, --rest [rest]", "Which rest service name to use", null)
    .action(function (options) {

        addCommand(options);
    }
);

program.command('export *')
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
        }
        else {
            //console.log('Exporting current project..');
        }

        cliHelper.cmdUnderConstruction();
    }
);


// Invoke the command execution
program.parse(process.argv);
