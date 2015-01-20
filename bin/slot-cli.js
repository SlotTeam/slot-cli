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
    slotJson = require('../slot.json'),
    slotJsonFile = path.join(process.cwd(), 'slot.json'),
    pkg = require('../package.json')
    ;

program.version(pkg.version);

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
            console.log('Creating [%s] project!', project);

            mkdirp(project, function (err) {
                if (err) console.error(err)
                else {
                    console.log('creating metaData folder');

                    mkdirp(path.join(project, slotJson.framework.metaData), function (err) {
                        if (err) console.error(err)
                        else {
                            console.log('creating fragmentRootDir folder');

                            mkdirp(path.join(project, slotJson.framework.fragmentRootDir), function (err) {
                                if (err) console.error(err)
                                else {
                                    console.log('creating webRootDir folder');

                                    mkdirp(path.join(project, slotJson.framework.webRootDir), function (err) {
                                        if (err) console.error(err)
                                        else {
                                            console.log('creating mvcRootDir folder');

                                            mkdirp(path.join(project, slotJson.framework.mvcRootDir), function (err) {
                                                if (err) console.error(err)
                                                else {
                                                    console.log('creating restRootDir folder');

                                                    mkdirp(path.join(project, slotJson.framework.restRootDir), function (err) {
                                                        if (err) console.error(err)
                                                        else {
                                                            console.log('creating dbRootDir folder');

                                                            mkdirp(path.join(project, slotJson.framework.dbRootDir), function (err) {
                                                                if (err) console.error(err)
                                                                else {
                                                                    /*console.log('creating restFilter folder');*/
                                                                    console.log('Running on  ' + __dirname);

                                                                    var pathToResources = path.join(path.join(__dirname, ".."), "resources");
                                                                    console.log('Resources folder ' + pathToResources);

                                                                    /**
                                                                     * Create slot.json file
                                                                     */
                                                                    var content = fs.readFileSync(path.join(pathToResources, "ref-slot.json"),'binary'),
                                                                        pathFile = path.join(project, "slot.json");
                                                                    //
                                                                    /**
                                                                     * TODO:
                                                                     *  1.  Evaluate if creating a new project using -T option deserve to add basic fragments
                                                                     *      in the fragments section.
                                                                     */
                                                                    content = content
                                                                        .replace("{@fragments@}",  "");
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
        else
            console.log('Enter a project name');
    });

program
    .command('start')
    .description('Start servers on current slot project, without parameters, it starts the designer server by default')
    //.option("-p, --port [port]", "specify the port [3000]", /*Number,*/ 3000)
    .option("-s, --design", "Start the designer server on current slot project")
    .option("-d, --develop", "Start the development server on current slot project")
    .option("-a, --all", "Start designer and development server on current slot project")
    .action(function(options){
        //console.log('Adding options %s %s', options.fragment, options.rest);
        //console.log('Starting on [%s]', process.cwd());

        /**
         * TODO: validate if current folder contains a node.js module structure
         */

        var development = require('slot-framework'),
            designer = development.Designer
            ;

        if(options.develop) {
            development.start();
        }
        else if(options.all) {
            cmdUnderConstruction()
        }
        else if(options.port) {
            cmdUnderConstruction()
        }
        else if(options.design || (!options.develop && !options.design && !options.all && !options.port)) {
            designer.start();
        }
        else {
            //console.log(options);
            console.log('Please enter a valid command');
            console.log('   To see help use: slot start -h');
        }
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

        // Load local slot configuration
        slotJson = require(slotJsonFile /*path.join(process.cwd(), 'slot.json')*/);

        /**
         * TODO: validate if current folder contains a node.js module structure
         */

        var pathToResources = path.join(path.join(__dirname, ".."), "resources");

        //console.log('Options [%s] [%s] [%s]', options.fragment, options.rest, options.page);

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
            console.log('Please enter a valid command');
            console.log('   To see help use: slot add -h');
        }
    }
);


program
    .command('export *')
    .description('Export current slot project into optimized format, a zip file will be created with just necesary objects to deploy on Production Server')
    .option("-m, --minify [minify]", "Minify 'html, css, js' files on current slot project"/*, null*/ /*,"ALL"*/)
    .action(function(options){
        //console.log(options);
        console.log('Export options %s', options.minify);

        if(options.minify) {

            /**
             * TODO:
             *  1.  Validate if(options.minify.trim()!='') when calling buildExport()
             */

            console.log('Exporting and minify current project.. %s', options.minify==true);

            // Load local slot configuration
            slotJson = require(slotJsonFile /*path.join(process.cwd(), 'slot.json')*/);

            //slot export -m 'css,html'

            // Set to ALL extensions, if '-m' option don't have values
            var extensions = options.minify == true ? "html,css,js".split(',') : options.minify.split(',');

            console.log('Exporting and minify current project, extensions %s', extensions);

            cmdUnderConstruction();
        }
        else {
            console.log('Exporting current project..');
            cmdUnderConstruction();
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

/**
 * Creates a resource (images, html, jsonFile, etc) on filesystem, then performs
 * a variable substitution finding the expressions on "attrs" array and replacing
 * a corresponding value from "values" array.
 *
 * @param source
 * @param destiny
 * @param attrs
 * @param values
 */
function buildResource(source, destiny, attrs, values) {

    // Load content
    var content = fs.readFileSync(source,'binary'),
        pathFile = destiny;

    // Substitute attributes and values
    for(var index in attrs){
        console.log('Attr [%s] [%s]', attrs[index], values[index]);
        content = content.replace(RegExp("{@" + attrs[index] + "@}","g"),  values[index]);
    }

    // Write content on file
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

    // Create JSON bind file
    buildResource(path.join(pathToResources, "ref-page-bind.json")
        , path.join(path.join(projectFolder, slotJson.framework.metaData), page+".json")
        , ["page-name", "page-creation-date", "pageTitle", "welcomeMsg"]
        , [page, nowTimeStamp, pageType, "Welcome to "+pageType]
    );

    // Create HTML file
    buildResource(path.join(pathToResources, "ref-page.html")
        , path.join(path.join(projectFolder, slotJson.framework.webRootDir), page+".html")
        , ["page-name", "page-creation-date"]
        , [page, nowTimeStamp]);
}

function buildFragment(pathToResources, projectFolder, fragment) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString(),
        prefixedName = fragment.split('/').pop();

    buildResource(path.join(pathToResources, "ref-fragment-bind.json")
        , path.join(path.join(projectFolder, slotJson.framework.metaData), fragment+".json")
        , ["fragmentID"]
        , [ 'frg' + (prefixedName.charAt(0).toUpperCase() + prefixedName.slice(1)) ]
    );

    buildResource(path.join(pathToResources, "ref-fragment.html")
        , path.join(path.join(projectFolder, slotJson.framework.fragmentRootDir), fragment+".html")
        , ["fragment-name", "fragment-creation-date"]
        , [fragment, nowTimeStamp]);
}

function buildRestService(pathToResources, projectFolder, rest) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString();

    buildResource(path.join(pathToResources, "ref-rest-service.js")
        , path.join(path.join(projectFolder, slotJson.framework.restRootDir), rest+".js")
        , ["rest-name", "rest-url", "pc-machine", "creation-date"]
        , [rest.split('/').pop(), "http://<server>:<port>/rest/"+rest, os.hostname, nowTimeStamp]);
}

/**
 *
 * @param pathToResources   The full path were the slot-cli/resources folder has been created
 * @param projectFolder     The full path were the project folder has been created
 * @param page              The page name
 */
function addPage(pathToResources, projectFolder, page) {

    if(page.trim()!='') {
        console.log('Adding new page [%s]', page);

        /**
         * Validate if exists the full-path folder where the file will be created,
         * then continue whit the buildPage() function
         */
        var folder = page.split('/').pop(); // Using '/' because we are talking about web contexts

        console.log('Adding new page name [%s]', folder);

        folder = page.replace(folder, '');

        console.log('Adding new page [%s] on [%s]', page, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.webRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err) console.error(err)
                    else {
                        buildPage(pathToResources, projectFolder, page);
                    }
                });
            }
        });

        console.log('Page [%s] created on [%s]', page, 'todo_path');
    }
    else {
        console.log('Please enter a valid page name');
        console.log('   To see help use: slot add -h');
    }
}

function addFragment(pathToResources, projectFolder, fragment) {

    if(fragment.trim()!='') {
        console.log('Adding new fragment [%s]', fragment);

        /**
         * Validate if exists the full-path folder where the file will be created,
         * then continue whit the buildFragment() function
         */
        var folder = fragment.split('/').pop(); // Using '/' because we are talking about web contexts

        //var fileName = 'frg' + (folder.charAt(0).toUpperCase() + folder.slice(1));
        var fileName = folder;
        fragment = fragment.replace(folder, fileName);
        folder = fileName;

        console.log('Adding new fragment name [%s]', folder);

        folder = fragment.replace(folder, '');

        console.log('Adding new fragment [%s] on [%s]', fragment, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.fragmentRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err) console.error(err)
                    else {
                        // Create fragment objects on file system
                        buildFragment(pathToResources, projectFolder, fragment);

                        // Add the newly created fragment on slot.framework.json file
                        var fragmentName = fragment.split('/').pop();
                        slotJson.fragments[fragmentName] = '/' + fragment;
                        slotJson.fragments = sortObj(slotJson.fragments);
                        //delete fragmentName;

                        fs.writeFile(slotJsonFile, JSON.stringify(slotJson, null, 4), function (err) {
                            if (err) throw err;
                            console.log('Saved resource on: %s', slotJsonFile);
                        });
                    }
                });
            }
        });

        console.log('Fragment [%s] created on [%s]', fragment, 'todo_path');
    }
    else {
        console.log('Please enter a valid fragment name');
        console.log('   To see help use: slot add -h');
    }
}

/**
 *
 * @param pathToResources   The full path were the slot-cli/resources folder has been created
 * @param projectFolder     The full path were the project folder has been created
 * @param rest              The rest service name
 */
function addRestService(pathToResources, projectFolder, rest) {

    if(rest.trim()!='') {
        console.log('Adding new rest service [%s]', rest);

        /**
         * Validate if exists the full-path folder where the file will be created,
         * then continue whit the buildRestService() function
         */
        var folder = rest.split('/').pop(); // Using '/' because we are talking about web contexts

        console.log('Adding new rest name [%s]', folder);

        folder = rest.replace(folder, '');

        console.log('Adding new rest [%s] on [%s]', rest, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.restRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                buildRestService(pathToResources, projectFolder, rest);
            }
        });

        console.log('Rest service [%s] created on [%s]', rest, 'todo_path');
    }
    else {
        console.log('Please enter a valid rest service name');
        console.log('   To see help use: slot add -h');
    }
}
