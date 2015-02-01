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

module.exports = startCommand;