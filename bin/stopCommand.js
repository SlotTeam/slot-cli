/**
 * Created by cecheveria on 2/1/2015.
 */

var fs = require("fs"),
    path = require("path"),
    cliHelper = require('./cliHelper'),
    pretty = require('./prettyMessage');

function stopCommand(options, onSuccess) {
    //Validate that we are located on a valid slot project
    cliHelper.isValidRootDir(process.cwd()
        , function (exists) {

            if(fs.existsSync(path.join(process.cwd(), '.pid.json'))) {
                pidFile = require(path.join(process.cwd(), '.pid.json'));

                //Kill all main services listed in the pid.json file
                var services = ['development', 'designer', 'watch'], service, failsStopping = false;

                pretty.alert();

                for(service in services) {
                    try {
                        process.kill(pidFile[services[service]].pid);
                        pretty.alert('Stopping %s service pid: %s success', services[service], pidFile[services[service]].pid);
                    }
                    catch(e) {
                        failsStopping = true;
                        pretty.alert('Problems stopping %s service pid: %s', services[service], pidFile[services[service]].pid);
                    }
                }

                pretty.alert();

                /**
                 * Start services again if onSuccess callback function parameter was send, and,
                 * if there were not failures stopping services.
                 */
                //!failsStopping &&
                onSuccess && onSuccess(options);
            }
        }
        , function (exists) {
            pretty.alert();
            pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            pretty.alert();
        }
    );
}

module.exports = stopCommand;