#!/usr/bin/env node

/**
 * A faster way to create a project and see created content, use this command line:
 *  project="demo1"; slot create $project; cat $project/slot.json; cat $project/package.json
 *
 * To see examples of how to use commander module, got to:
 *  https://github.com/visionmedia/commander.js/blob/master/examples/deploy
 *
 * @type {exports}
 */

var program = require('commander'),
    fs = require("fs");

program.version('0.0.6');

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
    .action(function(project){
        if(project) {
            console.log('Creating [' + project + '] poject!');

            var mkdirp = require('mkdirp'),
                path = require("path");

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
                                                                            //var pathToSlotJson = path.join(path.join(path.join(path.join(path.join(__dirname, ".."), "node_modules"), "slot-framework"), "templates"), "slot.json");

                                                                            var pathToResources = path.join(path.join(__dirname, ".."), "resources");
                                                                            console.log('Resources folder ' + pathToResources);

                                                                            /**
                                                                             * Create slot.json file
                                                                             */
                                                                            var content = fs.readFileSync(path.join(pathToResources, "slot.json"),'binary'),
                                                                                pathFile = path.join(project, "slot.json");
                                                                            //
                                                                            fs.writeFile(pathFile, content, function (err) {
                                                                                if (err) throw err;
                                                                                console.log('Saved slot.json on: ' + pathFile);

                                                                                /**
                                                                                 * Create package.json file
                                                                                 */
                                                                                content = fs.readFileSync(path.join(pathToResources, "package.json"),'binary'),
                                                                                pathFile = path.join(project, "package.json");
                                                                                //
                                                                                content = content
                                                                                    .replace("{@name@}",  project)
                                                                                    .replace("{@license@}",  "MIT");
                                                                                //
                                                                                fs.writeFile(pathFile, content, function (err) {
                                                                                    if (err) throw err;
                                                                                    console.log('Saved slot.json on: ' + pathFile);

                                                                                    /**
                                                                                     * TODO: Execute 'npm init' to build all dependencies
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
    .command('add')
    .description('Add a new object to current slot project')
    .option("-f, --fragment [fragment]", "Which fragment name to use", null)
    .option("-r, --rest [rest]", "Which rest service name to use", null)
    .action(function(options){
        //console.log('Adding options %s %s', options.fragment, options.rest);

        if(options.fragment) {
            createFragment(options.fragment);
        }
        else if(options.rest) {
            createRest(options.rest);
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

function createFragment(fragment) {

    if(fragment.trim()!='') {
        console.log('Adding new fragment [%s]', fragment);

        /**
         * TODO: Add code to build a new fragment..
         */

        console.log('Fragment [%s] created on [%s]', fragment, 'todo_path');
    }
    else {
        console.log('Please enter a valid fragment name');
        console.log('   To see help use: slot add -h');
    }
}

function createRest(rest) {

    if(rest.trim()!='') {
        console.log('Adding new rest service [%s]', rest);

        /**
         * TODO: Add code to build a new rest service..
         */

        console.log('Rest service [%s] created on [%s]', rest, 'todo_path');
    }
    else {
        console.log('Please enter a valid rest service name');
        console.log('   To see help use: slot add -h');
    }
}
