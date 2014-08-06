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
    fs = require("fs"),
    path = require("path"),
    mkdirp = require('mkdirp')
    ;

program.version('0.0.7');

/*program
  .command('hi')
  .description('initialize project configuration')
  .action(function(){
		console.log('Hi my Friend!!!');
});

program
  .command('bye [name]')
  .description('initialize project configuration')
  .action(function(name){
		console.log('Bye ' + name + '. It was good to see you!');
});*/

/**
 * TODO:
 *  1.  Add a program command to control 'no parameters send by user'
 */

program
  .command('*')
  .action(function(env){
    console.log('Enter a Valid command');
    console.log('   To see help use: slot -h');
    //terminate(true);
});

program
    .command('create [project]')
    .description('Create a new project on folder [name]')

    //.option("-t, --theme [theme_id]", "Which theme_id to use in the project. It will install a predefined theme based on HTML5 frameworks like Bootstrap, Zurb, Kube.", null)
    /**
     * TODO: Complete the '-t, --theme' option
     */

    .action(function(project){
        if(project) {
            console.log('Creating [%s] poject!', project);

            //var mkdirp = require('mkdirp');

                mkdirp(project, function (err) {
                if (err) console.error(err)
                else {
                    console.log('creating metaData folder');

                    mkdirp(path.join(project, "/bind"), function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('creating webRootDir folder');

                            mkdirp(path.join(project, "/www"), function (err) {
                                if (err) console.error(err)
                                else {
                                    console.log('creating mvcRootDir folder');

                                    mkdirp(path.join(project, "/app/mvc"), function (err) {
                                        if (err) console.error(err)
                                        else {
                                            console.log('creating restRootDir folder');

                                            mkdirp(path.join(project, "/app/rest"), function (err) {
                                                if (err) console.error(err)
                                                else {
                                                    console.log('creating dbRootDir folder');

                                                    mkdirp(path.join(project, "/app/db"), function (err) {
                                                        if (err) console.error(err)
                                                        else {
                                                            console.log('creating restFilter folder');

                                                            mkdirp(path.join(project, "/rest"), function (err) {
                                                                if (err) console.error(err)
                                                                else {
                                                                    console.log('creating mvcFilter folder');

                                                                    mkdirp(path.join(project, "/mvc"), function (err) {
                                                                        if (err) console.error(err)
                                                                        else {
                                                                            console.log('Running on  ' + __dirname);

                                                                            var pathToResources = path.join(path.join(__dirname, ".."), "resources");
                                                                            console.log('Resources folder ' + pathToResources);

                                                                            /**
                                                                             * Create slot.json file
                                                                             */
                                                                            var content = fs.readFileSync(path.join(pathToResources, "ref-slot.json"),'binary'),
                                                                                pathFile = path.join(project, "slot.json");
                                                                            //
                                                                            fs.writeFile(pathFile, content, function (err) {
                                                                                if (err) throw err;
                                                                                console.log('Saved slot.json on: ' + pathFile);

                                                                                /**
                                                                                 * Create package.json file
                                                                                 */
                                                                                content = fs.readFileSync(path.join(pathToResources, "ref-package.json"),'binary'),
                                                                                pathFile = path.join(project, "package.json");
                                                                                //
                                                                                content = content
                                                                                    .replace("{@name@}",  project)
                                                                                    .replace("{@license@}",  "MIT");
                                                                                //
                                                                                fs.writeFile(pathFile, content, function (err) {
                                                                                    if (err) throw err;
                                                                                    console.log('Saved package.json on: ' + pathFile);

                                                                                    /**
                                                                                     * Execute 'npm install' to build all dependencies
                                                                                     */
                                                                                    npmInstall(project);

                                                                                    buildServes(pathToResources, project);

                                                                                    /**
                                                                                     * Build project home page
                                                                                     */
                                                                                    buildPage(pathToResources, project, "index", true /*<<== isHomepage*/);

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
            });
        }
        else
            console.log('Enter a project name');
    });

program
    .command('start')
    .description('Start designer and development servers on current slot project')
    .action(function(options){
        //console.log('Adding options %s %s', options.fragment, options.rest);

        /**
         * TODO: validate if current folder contains a node.js module structure
         */

        /*var pathToResources = path.join(path.join(__dirname, ".."), "resources");

        if(options.fragment) {
            addFragment(pathToResources, process.cwd(), options.fragment);
        }*/
        var designer = require('../lib/designServer'),
            development = require('../lib/developmentServer')
        ;

        designer.start();
        //development.start();
    }
);

program
    .command('add')
    .description('Add a new object to current slot project')
    .option("-p, --page [page]", "Which page name to use", null)
    .option("-f, --fragment [fragment]", "Which fragment name to use", null)
    .option("-r, --rest [rest]", "Which rest service name to use", null)
    .action(function(options){
        //console.log('Adding options %s %s', options.fragment, options.rest);

        /**
         * TODO: validate if current folder contains a node.js module structure
         */

        var pathToResources = path.join(path.join(__dirname, ".."), "resources");

        if(options.fragment) {
            addFragment(pathToResources, process.cwd(), options.fragment);
        }
        else if(options.rest) {
            addRestService(pathToResources, process.cwd(), options.rest);
        }
        else if(options.page) {
            addPage(pathToResources, process.cwd(), options.page);
        }
        else {
            console.log('Please enter a valid option');
            console.log('   To see help use: slot add -h');
        }
    }
);

program.parse(process.argv);

/**
 * Utility functions
 */
var exec = require('child_process').exec;

var run = function(cmd, callback) {
    var child = exec(cmd, function (error, stdout, stderr) {
        if (stderr !== null) {
            console.log('' + stderr);
        }
        if (stdout !== null) {
            console.log('' + stdout);
        }
        if (error !== null) {
            console.log('' + error);
        }

        //callback();
    });
};

function npmInstall(project) {

    if(project.trim()!='') {

        var current = process.cwd(),
            folder = path.join(process.cwd(), project);

        console.log('Installing new project [%s]', folder);
        process.chdir(folder);

        /**
         * Execute npm install for all dependencies..
         */
        run('npm install' /*, function() {
        }*/);

        console.log('Project [%s] installed on [%s]', project, folder);
        process.chdir(current);
    }
    else {
        console.log('Please enter a valid project name');
        console.log('   To see help use: slot -h');
    }
}

function cmdUnderConstruction() {
    console.log();
    console.log(' * This command option is under construction, we are * ');
    console.log(' * working hard to release as soon as possible.. :-) * ');
    console.log();
}
function buildResource(source, destiny, attrs, values) {
    /**
     * Load content
     */
    var content = fs.readFileSync(source,'binary'),
        pathFile = destiny;

    /**
     * Substitute attributes and values
     */
    for(var index in attrs){
        console.log('Attr [%s] [%s]', attrs[index], values[index]);
        content = content.replace(RegExp("{@" + attrs[index] + "@}","g"),  values[index]);
    }

    /**
     * Write content on file
     */
    /*fs.writeFile(pathFile, content, function (err) {
        if (err) throw err;
        console.log('Saved resource on: %s', pathFile);
    });*/
    fs.writeFileSync(pathFile, content);
    console.log('Saved resource on: %s', pathFile);
}

function buildServes(pathToResources, projectFolder) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString();

    mkdirp(path.join(projectFolder, "server"), function (err) {
        if (err) console.error(err)
        else {
            console.log('Creating servers..');

            buildResource(path.join(pathToResources, "ref-designerServer.js")
                , path.join(path.join(projectFolder, "server"), "designer.js")
                , ["page-creation-date"]
                , [nowTimeStamp]);

            buildResource(path.join(pathToResources, "ref-developerServer.js")
                , path.join(path.join(projectFolder, "server"), "developer.js")
                , ["page-creation-date"]
                , [nowTimeStamp]);
        }
    });
}

function buildPage(pathToResources, projectFolder, page, isHomePage) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString(),
        pageType = isHomePage ? " home page " : " page ",
        pageType = isHomePage ? projectFolder+pageType : page+pageType
        ;

    /*buildResource(path.join(pathToResources, "ref-fragment-bind.json")
     , path.join(path.join(project, "bind"), "index.json")
     , ["fragment-name", "fragment-creation-date"]
     , ["index", nowTimeStamp]);

     buildResource(path.join(pathToResources, "ref-fragment.html")
     , path.join(path.join(project, "www"), "index.html")
     , ["fragment-name", "fragment-creation-date"]
     , ["index", nowTimeStamp]);*/

    buildResource(path.join(pathToResources, "ref-page-bind.json")
        , path.join(path.join(projectFolder, "bind"), page+".json")
        , ["page-name", "page-creation-date", "pageTitle", "welcomeMsg"]
        //, [page, nowTimeStamp, projectFolder+pageType, "Welcome to "+projectFolder+pageType]
        , [page, nowTimeStamp, pageType, "Welcome to "+pageType]
        );

    buildResource(path.join(pathToResources, "ref-page.html")
        , path.join(path.join(projectFolder, "www"), page+".html")
        , ["page-name", "page-creation-date"]
        , [page, nowTimeStamp]);

}

function addFragment(pathToResources, projectFolder, fragment) {

    if(fragment.trim()!='') {
        console.log('Adding new fragment [%s]', fragment);

        /**
         * TODO: Add code to build a new fragment..
         */
        cmdUnderConstruction();

        //console.log('Fragment [%s] created on [%s]', fragment, 'todo_path');
    }
    else {
        console.log('Please enter a valid fragment name');
        console.log('   To see help use: slot add -h');
    }
}

function addRestService(pathToResources, projectFolder, rest) {

    if(rest.trim()!='') {
        console.log('Adding new rest service [%s]', rest);

        /**
         * TODO: Add code to build a new rest service..
         */
        cmdUnderConstruction();

        //console.log('Rest service [%s] created on [%s]', rest, 'todo_path');
    }
    else {
        console.log('Please enter a valid rest service name');
        console.log('   To see help use: slot add -h');
    }
}

function addPage(pathToResources, projectFolder, page) {

    if(page.trim()!='') {
        console.log('Adding new page [%s]', page);

        buildPage(pathToResources, projectFolder, page);

        console.log('Page [%s] created on [%s]', page, 'todo_path');
    }
    else {
        console.log('Please enter a valid page name');
        console.log('   To see help use: slot add -h');
    }
}
