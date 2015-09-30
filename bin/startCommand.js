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
                    development.start();
            }
            else if (options.design) {
                if(options.silent)
                    //Start Designer Server in silent mode
                    cliHelper.nohup('slot', ['start', '-m'/*, '-s'*/], './logs/designer.log');
                else
                    designer.start();
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
                    development.start();

                pretty.alert();

                /**
                 * TODO:
                 *  1.  After all services are being created, we need to invoke a build for all the pages located
                 *      on slot.json/pages. This task maybe must be added as a task on Grunt.
                 */
                //slotJson = require(slotJsonFile);
                compilePages();
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

function compilePages() {
    async = require('async')
    slotJson = require(slotJsonFile);

    //for(xx in slotJson.pages) {
    //    pretty.alert("Compiling page %s", slotJson.pages[xx]+".html");
    //}

    async.eachSeries(slotJson.pages, function( page, callback) {
        //console.log('fragment: ' + fragmentName + ' - related page:' + page);
        pretty.alert("Compiling page %s", page+".html");

        setTimeout(function() {
            buildPage(page, function(content) {
                pretty.alert('received content: ' + content.length + 'Kb - ' + (new Date()).getTime() );

                callback();
            });
        }, 1000);

    }, function(err){
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
            // One of the iterations produced an error, the processing will now stop.
            console.log('Building pages has failed');
        } else {
            console.log('All pages have been built successfully');
        }
    });

}

function buildPage(url, callbackEnd) {
    var http = require('http');
    var options = {
        host: '127.0.0.1',
        path: url,
        port :2001
    };

    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            // console.log(str);
            callbackEnd(str);
        });
    }

    http.request(options, callback).end();
}


module.exports = startCommand;