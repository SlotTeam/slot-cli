/**
 * Created by cecheveria on 1/31/2015.
 */

var program = require('commander'),
    fs = require("fs"),
    path = require("path"),
    mkdirp = require('mkdirp'),
    cliHelper = require('./cliHelper'),
    cliActions = require('./cliActions'),
    pretty = require('./prettyMessage');
var slotJson,
    slotJsonFile;

function createCommand(project) {
    if (project) {
        //Validate that we are not located on a valid slot project
        cliHelper.isValidRootDir(process.cwd()
            , function (exists) {
                pretty.alert();
                pretty.alert("It appears that you are located on a valid slot project, you can't execute 'create command' inside an existing slot project.");
            }
            , function (exists) {
                slotJson = require('../slot.json');
                slotJsonFile = path.join(process.cwd(), 'slot.json');

                pretty.doing("Creating '%s' project!", project);

                mkdirp(project, function (err) {
                    if (err) {
                        pretty.failed("Fail creating '%s'", project);
                        throw err;
                    }
                    else {
                        pretty.doing("Creating metaData folder");

                        mkdirp(path.join(project, slotJson.framework.metaData), function (err) {
                            if (err) {
                                pretty.fail("Fail creating meta-data layer folder");
                                throw err;
                            }
                            else {
                                pretty.doing("Creating fragmentRootDir folder");

                                mkdirp(path.join(project, slotJson.framework.fragmentRootDir), function (err) {
                                    if (err) {
                                        pretty.fail("Fail creating Fragments layer folder");
                                        throw err;
                                    }
                                    else {
                                        pretty.doing("Creating webRootDir folder");

                                        mkdirp(path.join(project, slotJson.framework.webRootDir), function (err) {
                                            if (err) {
                                                pretty.fail("Fail creating Web root folder");
                                                throw err;
                                            }
                                            else {
                                                pretty.doing("Creating mvcRootDir folder");

                                                mkdirp(path.join(project, slotJson.framework.mvcRootDir), function (err) {
                                                    if (err) {
                                                        pretty.fail("Fail creating REST layer folder");
                                                        throw err;
                                                    }
                                                    else {
                                                        pretty.doing("Creating restRootDir folder");

                                                        mkdirp(path.join(project, slotJson.framework.restRootDir), function (err) {
                                                            if (err) {
                                                                pretty.fail("Fail creating REST layer folder");
                                                                throw err;
                                                            }
                                                            else {
                                                                pretty.doing("Creating dbRootDir folder");

                                                                mkdirp(path.join(project, slotJson.framework.dbRootDir), function (err) {
                                                                    if (err) {
                                                                        pretty.fail("Fail creating DB layer folder");
                                                                        throw err;
                                                                    }
                                                                    else {
                                                                        pretty.inform("Running on  " + __dirname);

                                                                        //var pathToResources = path.join(path.join(__dirname, ".."), "resources");
                                                                        var pathToResources = path.join(__dirname, "..", "resources");
                                                                        pretty.inform("Resources folder " + pathToResources);

                                                                        pretty.doing("Setting up initial project config..");
                                                                        /**
                                                                         * Create slot.json file
                                                                         */
                                                                        var content = fs.readFileSync(path.join(pathToResources, "ref-slot.json"), 'binary'),
                                                                            pathFile = path.join(project, "slot.json");
                                                                        /**
                                                                         * TODO:
                                                                         *  1.  Evaluate if creating a new project using -T option deserve to add basic fragments
                                                                         *      in the fragments section.
                                                                         */
                                                                        content = content.replace("{@fragments@}", "");
                                                                        //
                                                                        fs.writeFile(pathFile, content, function (err) {
                                                                            if (err) {
                                                                                pretty.fail("Fail creating slot.json file on: %s", pathFile);
                                                                                throw err;
                                                                            }
                                                                            pretty.inform("Saved slot.json on: %s", pathFile);

                                                                            /**
                                                                             * Create package.json file
                                                                             */
                                                                            content = fs.readFileSync(path.join(pathToResources, "ref-package.json"), 'binary');
                                                                            pathFile = path.join(project, "package.json");
                                                                            content = content
                                                                                .replace("{@name@}", project)
                                                                                .replace("{@license@}", "MIT");
                                                                            //
                                                                            fs.writeFile(pathFile, content, function (err) {
                                                                                if (err) throw err;
                                                                                pretty.inform("Saved package.json on: %s", pathFile);
                                                                                pretty.done("Initial project config was set..");

                                                                                pretty.doing("Installing new project..");
                                                                                /**
                                                                                 * Execute 'npm install' to build all dependencies
                                                                                 */
                                                                                cliHelper.npmInstall(project, function (error, stdout, stderr) {
                                                                                    if(error) {
                                                                                        pretty.failed("Fail creating project '%s'", project);
                                                                                        pretty.failed("%s", error);
                                                                                    }
                                                                                    else {
                                                                                        pretty.done("Project '%s' was correctly created..", project/*, folder*/);

                                                                                        cliHelper.buildServers(pathToResources, project
                                                                                            , function (err) {
                                                                                                if(err) {
                                                                                                    pretty.failed("Fail creating servers");
                                                                                                    pretty.failed("%s", error);
                                                                                                }
                                                                                                else {
                                                                                                    pretty.done("Servers were created");

                                                                                                    pretty.doing("Creating log folder");

                                                                                                    mkdirp(path.join(project, 'logs'), function (err) {
                                                                                                        if (err) {
                                                                                                            pretty.fail("Fail creating logs folder");
                                                                                                            throw err;
                                                                                                        }
                                                                                                        else {
                                                                                                            pretty.done("Log folder was created");

                                                                                                            pretty.doing("Setting up Automation Services.. "
                                                                                                                //+
                                                                                                                //(path.join(project, "node_modules/slot-framework/Gruntfile.js"))
                                                                                                                //+ " " +
                                                                                                                //(path.join(project, "Gruntfile.js"))
                                                                                                            );

                                                                                                            fs.rename(
                                                                                                                path.join(project, "node_modules/slot-framework/Gruntfile.js")
                                                                                                                , path.join(project, "Gruntfile.js")
                                                                                                                , function(){
                                                                                                                    if(err)
                                                                                                                        pretty.failed("Fail setting automation services..");
                                                                                                                    else {
                                                                                                                        pretty.done("Automation Services were set up..");

                                                                                                                        pretty.doing("Adding home page..");
                                                                                                                        /**
                                                                                                                         * Build project home page
                                                                                                                         */
                                                                                                                        cliActions.addPage(pathToResources, project, "index", slotJson
                                                                                                                            , true /*<<== isHomepage*/
                                                                                                                            , path.join(project, "slot.json") //slotJsonFile
                                                                                                                            , function (err) {
                                                                                                                                if(err)
                                                                                                                                    pretty.failed("Fail creating home page..");
                                                                                                                                else {
                                                                                                                                    pretty.done("Home page was created");
                                                                                                                                    /**
                                                                                                                                     * TODO:
                                                                                                                                     *  1.  After creation show a message saying:
                                                                                                                                     *      This project have been created with OneTheme, the oficial Bootstrap
                                                                                                                                     *      custom theme for Slot Framework. You can see full show case of OneTheme
                                                                                                                                     *      in:
                                                                                                                                     *          http://www.slotframework.org/slot-themes/bootstrap/oneTheme
                                                                                                                                     *
                                                                                                                                     *      Or describe any other theme the user has selected
                                                                                                                                     */
                                                                                                                                    pretty.inform("");
                                                                                                                                }
                                                                                                                            }
                                                                                                                        );
                                                                                                                    }
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                });
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
        );
    }
    else {
        pretty.alert();
        pretty.alert("Please enter a project name");
    }
}

module.exports = createCommand;