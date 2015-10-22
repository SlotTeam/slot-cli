/**
 * Created by cecheveria on 1/31/2015.
 */

var path = require("path"),
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
                        pretty.done("Fragment '%s' was created", options.fragment);
                });
            }
            else if (options.rest) {
                cliActions.addRestService(pathToResources, process.cwd(), options.rest, slotJson, function(err) {
                    if(err)
                        pretty.failed("Fail creating rest service '%s'", options.rest);
                    else
                        pretty.done("Rest service '%s' was created", options.rest);
                });
            }
            else if (options.page) {
                cliActions.addPage(pathToResources, process.cwd(), options.page, slotJson, false/*isHomePage*/, slotJsonFile, function(err) {
                    if(err)
                        pretty.failed("Fail creating page '%s'", options.page);
                    else
                        pretty.done("Page '%s' was created", options.page);
                });
            }
            else if (options.attributes) {
                //slot add -a att1,attr2,attr3@frag1,attrA --toPage page1
                //slot add -a att1,attr2,attr3@clone/frag1,attrA --toPage page1
                //slot add -a att1,attr2,attr3@frag1,attr4@clone/frag1,attrA --toPage page1
                //slot add -a att1,attr2,attr3@frag3,attr4@clone/frag4,attrA --toPage page1

                pretty.doing("Adding attributes '%s' to %s", options.attributes, (options.toPage ? options.toPage+" page" : options.toFragment+" fragment"));

                for(attr in (attributes = options.attributes.split(','))) {

                    var attribute = attributes[attr].split('@'),
                        attrName = attribute[0],
                        usingFragmentId = attribute.length == 2 ? attribute[1] : "",
                        cloningFragmentId = "";
                        ;

                    if(!usingFragmentId) {
                        /**
                         * Add attribute whit out any reference to other fragments
                         */
                        pretty.inform("%s: Attribute '%s' added as single attribute", attr, attrName);
                    }
                    else if(usingFragmentId.startsWith('clone/')) {
                        /**
                         * Add attribute cloning a referenced fragment
                         */
                        usingFragmentId = usingFragmentId.split('clone/');
                        cloningFragmentId = usingFragmentId[1];
                        usingFragmentId = "";

                        pretty.inform("%s: Attribute '%s' will be cloned from fragmentId '%s'", attr, attrName, cloningFragmentId);

                        // Validate fragmentId to add already exists on ("slot.json file").fragments
                        if(slotJson.fragments[cloningFragmentId]) {

                        }
                        else {
                            pretty.failed("fragmentId '%s' does not exists", cloningFragmentId);
                        }
                    }
                    else {
                        /**
                         * Add attribute referencing a fragment
                         */
                        pretty.inform("%s: Attribute '%s' is a typeOf fragmentId '%s'", attr, attrName, usingFragmentId);

                        // Validate fragmentId to add already exists on ("slot.json file").fragments
                        if(slotJson.fragments[usingFragmentId]) {

                            var pageMetaDataFile = path.join(slotJsonFile, slotJson.framework.metaData, slotJson.fragments[usingFragmentId], '.json');

                            pretty.inform(".. '%s' added to metadata file '%s'.json", attrName, slotJson.fragments[usingFragmentId]);
                            pretty.inform(".. '%s' added to html file '%s'.html", attrName, slotJson.fragments[usingFragmentId]);

                            /**
                             * TODO:
                             *  1.  Load metadata Page file and add the new fragment into file:
                             *          "pageNavbar": {
                             *              "fragmentID":"frgNavbar"
                             *          },
                             *
                             *          Or
                             *
                                     "iotCards":{
                                        "fragmentID":"iotCard",
                                        "bind":[
                                            {"iotId":"WAL-000001",
                                              "address":"Store 1025 Av.",
                                              "inmap":"Aisle 3, bin 32",
                                              "aliveTime":"10.5 hours alive",
                                              "adsSend":"1050 Ads send"
                                             },
                                            {"iotId":"WAL-000002",
                                              "address":"Store 1025 Av.",
                                              "inmap":"Aisle 3, bin 32",
                                              "aliveTime":"8.5 hours alive",
                                              "adsSend":"1235 Ads send"
                                             }
                                        ]
                                    }
                             *
                             *  2.  Load html Page file and add the new fragment into file:
                             *      {@attrName@}
                             */

                        }
                        else {
                            pretty.failed("fragmentId '%s' does not exists", usingFragmentId);
                        }
                    }
                }
            }
            else {
                cliActions.showHelpMsg("Please enter a valid command", "slot add -h")
            }
        }
        , function (exists) {
            pretty.alert();
            pretty.alert("It appears that you are not located on a project root folder, the 'slot.json' file was not found on current directory.");
            pretty.alert();
        }
    );
}

module.exports = addCommand;