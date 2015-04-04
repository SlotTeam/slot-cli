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
    createCommand = require('./createCommand'),
    addCommand = require('./addCommand'),
    startCommand = require('./startCommand'),
    exportCommand = require('./exportCommand'),
    pretty = require('./prettyMessage'),
    pkg = require('../package.json');

// Get version number from package.json file
program.version(pkg.version);

/**
 * TODO:
 *  1.  Add code to control 'no parameters send by user'
 */

program.command('*')
    .action(function (env) {
        pretty.alert();
        pretty.alert("Enter a Valid command");
        pretty.alert("   To see help use: slot -h");
    });

program.command('create [project]')
    .description('Creates a new project on folder [name]')  //.option("-t, --theme [theme_id]", "Which theme_id to use in the project. It will install a predefined theme based on HTML5 frameworks like Bootstrap, Zurb, Kube.", null)
    .action(function (project) {

        createCommand(project);
    });

program.command('start')
    .description('Starts servers on current slot project, without parameters, it starts the designer server by default')    //.option("-p, --port [port]", "specify the port [3000]", /*Number,*/ 3000)
    .option("-m, --design", "Start the designer server on current project")
    .option("-d, --develop", "Start the development server on current project")
    .option("-w, --watch", "Start automated build services on current project")
    .option("-s, --silent", "Start the services on silent mode")
    .action(function (options) {

        startCommand(options);
    }
);

/**
 * TODO:
 *  1.  Implement Stop command
 */

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

        exportCommand(options);
    }
);


// Invoke the command execution
program.parse(process.argv);
