/**
 * Created by cecheveria on 10/10/2015.
 */

var fs = require("fs"),
    path = require("path"),
    cliHelper = require('./cliHelper'),
    cliActions = require('./cliActions'),
    pretty = require('./prettyMessage');
var slotJson,
    slotJsonFile;

function configCommand(options) {
    //Validate that we are located on a valid slot project
    cliHelper.isValidRootDir(process.cwd()
        , function (exists) {
            // Load local slot configuration
            slotJsonFile = path.join(process.cwd(), 'slot.json');
            slotJson = require(slotJsonFile);

            //pretty.alert("Port%s %s", slotJsonFile, typeof options.port);

            if (options.port) {

                var reg = new RegExp(/^\d+$/);
                //
                if(reg.test(options.port)) {
                    // Setting server port
                    slotJson.server.port = eval(options.port);

                    // Update slot.json file
                    cliActions.setConfigProperty(slotJson, slotJsonFile, 'server.port', function(err) {
                        if (err)
                            pretty.failed('setting server.port=%s', options.port);
                        else
                            pretty.done('server.port=%s was set', options.port);
                        pretty.alert();
                    });
                }
                else {
                    cliActions.showHelpMsg("Please enter a valid port number", "slot config -h")
                }
            }
            else {
                cliActions.showHelpMsg("Please enter a valid command", "slot config -h")
            }
        }
        , function (exists) {
            pretty.alert();
            pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            pretty.alert();
        }
    );
}

module.exports = configCommand;