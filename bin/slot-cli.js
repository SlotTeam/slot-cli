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
    configCommand = require('./configCommand'),
    addCommand = require('./addCommand'),
    startCommand = require('./startCommand'),
    stopCommand = require('./stopCommand'),
    exportCommand = require('./exportCommand'),
    pretty = require('./prettyMessage'),
    pkg = require('../package.json'),
    pkgFramework = require('../node_modules/slot-framework/package.json');

// Get version number from package.json file
program.version(pkg.version);
program.framework = {version : pkgFramework.version};

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

/**
 * Start command
 */
program.command('framework')
    .description('Shows version details for each component')
    .option("-V, --version", "Shows the actual framework used on the command line")
    .action(function (options) {

            pretty.alert('Version: %s', program.framework.version);
        }
    );

program.command('create [project]')
    .description('Creates a new project on folder [name]')  //.option("-t, --theme [theme_id]", "Which theme_id to use in the project. It will install a predefined theme based on HTML5 frameworks like Bootstrap, Zurb, Kube.", null)
    .action(function (project) {

        createCommand(project);
    });

/**
 * Config command
 */
program.command('config')
    .description('Configures server properties on current slot project')
    .option(", --port [port]", "Set server.port property")
    .action(function (options) {

        configCommand(options);
    }
);

/**
 * Start command
 */
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
 * Stop command
 */
program.command('stop')
    .description('Stops all main services on current slot project')
    .action(function (options) {

        stopCommand(options);
    }
);

/**
 * Restart command
 */
program.command('restart')
    .description('Restarts all main services on current slot project')
    .option("-s, --silent", "Restarts the services on silent mode")
    .action(function (options) {

        stopCommand(options, function() { //onSuccess callback function
            startCommand(options);
        });
    }
);

/**
 * Add command
 */
program.command('add')
    .description('Adds a new object to current slot project')
    .option("-p, --page [page]", "Which page name to use", null)
    .option("-f, --fragment [fragment]", "Which fragment name to use", null)
    .option("-r, --rest [rest]", "Which rest service name to use", null)
    //.option("-a, --attributes [attributes]", "Add a comma separated attributes list. It adds attributes to pages when using -p/--page, or adds attributes to fragments when using -f/--fragment, ", null)
    .option("-a, --attributes [attributes]", "Add a comma separated attributes list. It adds attributes to pages when using --toPage, or adds attributes to fragments when using --toFragment, ", null)
    .option("--toPage [toPage]", "The page where attributes are going to be added, ", null)
    .option("--toFragment [toFragment]", "The fragment where attributes are going to be added, ", null)
    .option("--repeat [repeat]", "How many times a fragment will be added, ", null)
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
