/**
 * Created by cecheveria on 1/27/2015.
 */

var os = require("os"),
    fs = require("fs"),
    path = require("path"),
    mkdirp = require('mkdirp'),
    exec = require('child_process').exec,
    pretty = require('./prettyMessage');

var run = function (cmd, callback) {
    var child = exec(cmd, function (error, stdout, stderr) {

        /**
         * TODO:
         *  1.  Pass a parameter to know if we are going to show the stdout/stderr/error
         */
        /*if (stderr !== null) {
            console.log('' + stderr);
        }
        if (stdout !== null) {
            console.log('' + stdout);
        }
        if (error !== null) {
            console.log('' + error);
        }*/
        callback(error, stdout, stderr);
    });
};

function nohup(command, arguments, logFile) {

    var fs = require('fs'),
        spawn = require('child_process').spawn,
        out = fs.openSync(logFile, 'a'),
        err = fs.openSync(logFile, 'a');

    if(os.platform() == 'win32') {

        //Add comspec and command as a part of the arguments
        arguments.unshift('/c', command);

        spawn(process.env.comspec, arguments, {
            stdio: ['ignore', out, err], // piping stdout and stderr to out.log
            detached: true
        }).unref();
    }
    else {
        spawn(command, arguments, {
            stdio: ['ignore', out, err], // piping stdout and stderr to out.log
            detached: true
        }).unref();
    }

    //var spawn = require('child_process').spawn;
    //var cp = spawn(process.env.comspec, ['/c', 'command', '-arg1', '-arg2']);
    //
    //cp.stdout.on("data", function(data) {
    //    console.log(data.toString());
    //});
    //
    //cp.stderr.on("data", function(data) {
    //    console.error(data.toString());
    //});

    //arguments.unshift('/c', 'command')
}

function isValidRootDir(dirPath, onExists, onDontExists) {

    var slotJsonFile = path.join(dirPath, 'slot.json');

    fs.exists(slotJsonFile, function (exists) {
        if (exists)
            onExists(exists)
        else
            onDontExists(exists);
    });
}

function npmInstall(project, callback) {

    if (project.trim() != '') {
        pretty.doing("Installing npm dependencies..");

        var current = process.cwd(),
            folder = path.join(process.cwd(), project);

        process.chdir(folder);
        // Execute npm install for all dependencies..
        run('npm install' , function(error, stdout, stderr) {
            process.chdir(current);
            callback(error, stdout, error);
        });
    }
    else {
        pretty.alert("Please enter a valid project name");
        pretty.doing("   To see help use: slot -h");
    }
}

function cmdUnderConstruction() {
    pretty.alert();
    pretty.alert("This command option is under construction, we are * ");
    pretty.alert("working hard to release as soon as possible.. :-) * ");
    pretty.alert();
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
 * @param callback
 */
function buildResource(source, destiny, attrs, values, callback) {

    // Load content
    var content = fs.readFileSync(source, 'binary'),
        pathFile = destiny;

    // Substitute attributes and values
    for (var index in attrs) {
        content = content.replace(RegExp("{@" + attrs[index] + "@}", "g"), values[index]);
    }

    // Write content on file
    fs.writeFile(pathFile, content, function(err) {
        if(!err)
            pretty.inform('Resource created on %s', pathFile);

        callback(err);
    });
}

function buildServers(pathToResources, projectFolder, callback) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString();

    mkdirp(path.join(projectFolder, "server"), function (err) {
        if (err)
            callback(err);  //console.error(err)
        else {
            pretty.doing("Creating servers..");

            buildResource(path.join(pathToResources, "ref-designerServer.js")
                , path.join(path.join(projectFolder, "server"), "designer.js")
                , ["page-creation-date"]
                , [nowTimeStamp]
                , function(err) {
                    buildResource(path.join(pathToResources, "ref-developerServer.js")
                        , path.join(path.join(projectFolder, "server"), "developer.js")
                        , ["page-creation-date"]
                        , [nowTimeStamp]
                        , callback
                    );
                }
            );
        }
    });
}

function buildPage(pathToResources, projectFolder, page, slotJson, isHomePage, callback) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString(),
        pageType = isHomePage ? " home page " : " page ",
        pageType = isHomePage ? projectFolder + pageType : page + pageType
        ;

    // Wait a seconds to avoid coalitions on building services
    setTimeout(function(){

        // Create Meta-data binding file
        buildResource(path.join(pathToResources, "ref-page-bind.json")
            , path.join(path.join(projectFolder, slotJson.framework.metaData), page + ".json")
            , ["page-name", "page-creation-date", "pageTitle", "welcomeMsg"]
            , [page, nowTimeStamp, pageType, "Welcome to " + pageType]
            , function(err) {
                if(err)
                    callback(false);
                else {
                    // Wait a seconds to avoid coalitions on building services
                    setTimeout(function(){

                        //Create HTML file
                        buildResource(path.join(pathToResources, "ref-page.html")
                            , path.join(path.join(projectFolder, slotJson.framework.webRootDir), page + ".html")
                            , ["page-name", "page-creation-date"]
                            , [page, nowTimeStamp]
                            , callback
                        );
                    }, 1000);
                }
            }
        );
    }, 1000);
}

function buildFragment(pathToResources, projectFolder, fragment, slotJson, callback) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString(),
        prefixedName = fragment.split('/').pop();

    // Wait a seconds to avoid coalitions on building services
    setTimeout(function(){

        // Create Meta-data binding file
        buildResource(path.join(pathToResources, "ref-fragment-bind.json")
            , path.join(path.join(projectFolder, slotJson.framework.metaData), fragment + ".json")
            , ["fragmentID"]
            //, ['frg' + (prefixedName.charAt(0).toUpperCase() + prefixedName.slice(1))]
            , [prefixedName]
            , function(err) {
                if(err)
                    callback(false);
                else {
                    // Wait a seconds to avoid coalitions on building services
                    setTimeout(function(){

                        //Create HTML file
                        buildResource(path.join(pathToResources, "ref-fragment.html")
                            , path.join(path.join(projectFolder, slotJson.framework.fragmentRootDir), fragment + ".html")
                            , ["fragment-name", "fragment-creation-date"]
                            , [fragment, nowTimeStamp]
                            , callback
                        );
                    }, 1000);
                }
            }
        );
    }, 1000);
}

function buildRestService(pathToResources, projectFolder, rest, slotJson, callback) {

    var nowTimeStamp = (new Date()).toDateString() + " " + (new Date()).toLocaleTimeString();

    // Create JS file
    buildResource(path.join(pathToResources, "ref-rest-service.js")
        , path.join(path.join(projectFolder, slotJson.framework.restRootDir), rest + ".js")
        , ["rest-name", "rest-url", "pc-machine", "creation-date"]
        , [rest.split('/').pop(), "http://<server>:<port>/rest/" + rest, os.hostname, nowTimeStamp]
        , callback
    );
}


module.exports.run = run;
module.exports.nohup = nohup;
module.exports.isValidRootDir = isValidRootDir;
module.exports.npmInstall = npmInstall;
module.exports.cmdUnderConstruction = cmdUnderConstruction;
module.exports.buildResource = buildResource;
module.exports.buildServers = buildServers;
module.exports.buildPage = buildPage;
module.exports.buildFragment = buildFragment;
module.exports.buildRestService = buildRestService;
