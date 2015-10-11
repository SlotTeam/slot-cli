/**
 * Created by cecheveria on 10/10/2015.
 */

var fs = require("fs"),
    path = require("path"),
    cliHelper = require('./cliHelper'),
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
                if ((!isNaN(options.port) && Number.isInteger(eval(options.port)))) {

                    pretty.doing();
                    pretty.doing('Setting server.port property');

                    //Setting server port
                    slotJson.server.port = eval(options.port);

                    // Update the slot.json file
                    fs.writeFile(slotJsonFile, JSON.stringify(slotJson, null, 4), function (err) {
                        if (err)
                            pretty.failed('setting server.port=%s', options.port);
                        else
                            pretty.done('server.port=%s was set', options.port);

                        pretty.alert();
                    });
                }
                else {
                    pretty.alert();
                    pretty.alert("Please enter a valid port number");
                    pretty.alert("   To see help use: slot config -h");
                    pretty.alert();
                }
            }
            else {
                pretty.alert();
                pretty.alert("Please enter a valid command");
                pretty.alert("   To see help use: slot config -h");
                pretty.alert();
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