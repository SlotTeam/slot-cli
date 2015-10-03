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

            //var development = require('slot-framework'),
            var development = require(path.join(process.cwd(), 'node_modules/slot-framework')),
                designer = development.Designer;

            if (options.develop) {
                if(options.silent)
                    //Start Development Server in silent mode
                    cliHelper.nohup('slot', ['start', '-d'/*, '-s'*/], './logs/development.log');
                else
                    development.start(
                        3001,
                        function(){
                            pretty.alert();
                            pretty.alert('Development server has been started..');
                            pretty.alert();
                            compileAllPages(5000);
                        }
                    );
            }
            else if (options.design) {
                if(options.silent)
                    //Start Designer Server in silent mode
                    cliHelper.nohup('slot', ['start', '-m'/*, '-s'*/], './logs/designer.log');
                else
                    designer.start();

                compileAllPages(5000);
            }
            else if (options.watch) {
                cliHelper.nohup('grunt', [], './logs/auto.log');
            }
            else if (options.port) {
                cliHelper.cmdUnderConstruction()
            }
            else if (options.silent || (!options.develop && !options.design && !options.port)) {
                pretty.alert();
                pretty.alert('Starting designer service');
                //
                //Start Designer Server
                cliHelper.nohup('slot', ['start', '-m'/*, '-s'*/], './logs/designer.log');

                pretty.alert('Starting watch service');
                //
                //Start Automated Build Services
                cliHelper.nohup('grunt', [], './logs/auto.log');

                pretty.alert('Starting development service');
                //
                if(options.silent) {
                    // Start Development Server in silent mode
                    cliHelper.nohup('slot', ['start', '-d'/*, '-s'*/], './logs/development.log');
                }
                else
                    development.start(
                        3001,
                        function(){
                            pretty.alert();
                            pretty.alert('Development server has been started..');
                            pretty.alert();
                            compileAllPages(5000);
                        }
                    );

                pretty.alert();
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

/**
 *  After all servers are being started, we need to invoke a build for all the pages located
 *  on slot.json/pages.
 */
function compileAllPages(waitTime) {
    setTimeout(function() {

        var GruntTasks = require('../node_modules/slot-framework/lib/gruntTasks').create(),
            usageMap = require(path.join(process.cwd(), '.usageMap.json'));

        GruntTasks.buildAllPages(slotJson, usageMap);

    }, waitTime);
}

module.exports = startCommand;