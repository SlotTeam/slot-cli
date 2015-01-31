/**
 * Created by cecheveria on 1/31/2015.
 */

var program = require('commander'),
    //os = require("os"),
    //fs = require("fs"),
    path = require("path"),
    //mkdirp = require('mkdirp'),
    //sortObj = require('sort-object'),
    cliHelper = require('./cliHelper'),
    cliActions = require('./cliActions'),
    pretty = require('./prettyMessage');
var slotJson,
    slotJsonFile;

function addCommand(options) {

    //Validate that we are located on a valid slot project root directory
    cliHelper.isValidRootDir(process.cwd()
        , function (exists) {
            // Load local slot configuration
            slotJsonFile = path.join(process.cwd(), 'slot.json');
            slotJson = require(slotJsonFile);
            //
            var pathToResources = path.join(path.join(__dirname, ".."), "resources");

            if (options.fragment) {
                cliActions.addFragment(pathToResources, process.cwd(), options.fragment, slotJson, slotJsonFile, function(err) {
                    if(err)
                        pretty.failed("Fail creating fragment '%s'", options.fragment);
                    else
                        pretty.done("Fragment '%s' created on '%s'", options.fragment/*, 'todo_path'*/, err);
                });
            }
            else if (options.rest) {
                cliActions.addRestService(pathToResources, process.cwd(), options.rest, slotJson);
            }
            else if (options.page) {
                cliActions.addPage(pathToResources, process.cwd(), options.page, slotJson, false/*isHomePage*/, function(err) {
                    if(err)
                        pretty.failed("Fail creating page '%s'", options.page);
                    else
                        pretty.done("Page '%s' created on '%s'", options.page/*, 'todo_path'*/, err);
                });
            }
            else {
                pretty.alert();
                pretty.alert("Please enter a valid command");
                pretty.alert("   To see help use: slot add -h");
            }
        }
        , function (exists) {
            pretty.alert();
            pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
        }
    );
}

module.exports = addCommand;