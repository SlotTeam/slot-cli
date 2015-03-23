/**
 * Created by cecheveria on 2/1/2015.
 */

var path = require("path"),
    cliHelper = require('./cliHelper'),
    pretty = require('./prettyMessage');
var slotJson,
    slotJsonFile;

function startCommand(options) {
    //Validate that we are located on a valid slot project
    cliHelper.isValidRootDir(process.cwd()
        , function (exists) {
            // Load local slot configuration
            slotJsonFile = path.join(process.cwd(), 'slot.json');
            slotJson = require(slotJsonFile);
            //

            /**
             * TODO:
             *  1. Take require('slot-framework') from the project folder, we are going
             *     to remove the 'slot-framework' from the command line dependencies.
             *     This is going to warranty always we will be working whit the Slot version
             *     installed on the local project.
             *
             *     a.   The proposed code change is:
             *          var development = require(path.join(process.cwd(), 'slot-framework'));
             *
             *     b.   Validate that path.join(process.cwd(), 'slot-framework') exists.
             *          If not, we need to show an alert message.
             *
             *  2. Add code section to start the 'Grunt Watcher', it will contain all the
             *     necessary services to automate 'building tasks' in the framework.
             */
            //var development = require('slot-framework'),
            var development = require(path.join(process.cwd(), 'node_modules/slot-framework')),
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
            else if (options.watch) {
                cliHelper.run('grunt', function(error, stdout, stderr){
                    if (stderr !== null) {
                        console.log('' + stderr);
                    }
                    if (stdout !== null) {
                        console.log('' + stdout);
                    }
                    if (error !== null) {
                        console.log('' + error);
                    }
                })
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
            pretty.alert();
        }
    );
}

module.exports = startCommand;