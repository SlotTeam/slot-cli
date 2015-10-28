/**
 * Created by cecheverria on 10/24/15.
 */

var util = require('util'),
    path = require("path"),
    fs = require('fs'),
    async = require('async'),
    pretty = require('./prettyMessage');

/**
 * Reads a file from file system give to you the content on `onUpdate` function. When
 * you finish updating the content, you must call `afterUpdate` function to save the
 * content on file system
 *
 * @param source
 * @param onUpdate
 * @param callback
 */
function updateResource(source, onUpdate, callback) {

    // Load content
    var content = fs.readFileSync(source, 'binary');

    // Call onUpdate callback function to let modify the content
    onUpdate(content,
             function(content, source) {   // <= After update callback
                 // Write content on file
                 fs.writeFile(source, content, function(err) {
                     callback(err);
                 })
             }
    );
}

/**
 * Adds an attribute whit out any reference to other fragments
 *
 * @param attr
 * @param attrName
 * @param options
 * @param slotJson
 * @param callback
 */
function addSingleAttribute(attr, attrName, options, slotJson, callback) {

    pretty.inform("%s: Attribute '%s' will be added as single attribute", attr, attrName);

    var metaDataFilePath = path.join(process.cwd(), slotJson.framework.metaData, (options.toPage ? options.toPage : options.toFragment) + '.json'),
        metaDataFile = require(metaDataFilePath);

    if(metaDataFile.binds[attrName]) {
        callback && callback(util.format("attribute '%s' already exists on '%s' %s", attrName, (options.toPage ? options.toPage : options.toFragment), (options.toPage ? "page" : "fragment")));
    }
    else{
        // Add dummy value for added attribute
        metaDataFile.binds[attrName] = attrName + " dummy value";

        // Delete 'someAttribute' test attribute if exists
        metaDataFile.binds['someAttribute'] && delete metaDataFile.binds['someAttribute']

        // Update the metaData file
        fs.writeFile(metaDataFilePath, JSON.stringify(metaDataFile, null, 4), function (err) {

            if (!err) {
                pretty.inform("   '%s' added to metadata file '%s'", attrName, metaDataFilePath);

                // Continue adding attributes on html file
                var htmlDataFile = path.join(process.cwd(), (options.toPage ? slotJson.framework.webRootDir : slotJson.framework.fragmentRootDir), (options.toPage ? options.toPage : options.toFragment) + '.html');

                updateResource(htmlDataFile,
                    function(content, afterUpdate) {    // <= onUpdate callback function

                        // Modify content, adding a attribute in this case
                        content = content.replace("{@someAttribute@}", "<!--append here-->")
                        content = content.replace("<!--append here-->", "{@" +attrName+ "@}" + "\r\n<!--append here-->")

                        // Call back to update content on file system
                        afterUpdate(content, htmlDataFile);
                    },
                    function(err) {    // <= final callback function
                        if(!err)
                            pretty.inform("   '%s' added to html file '%s'", attrName, htmlDataFile);
                        else
                            err = util.format('   failed updating html file [%s] [%s]', htmlDataFile, err);

                        callback && callback(err);
                    }
                )
            }
            else{
                callback && callback(util.format('   failed updating metaData file [%s] [%s]', metaDataFile, err));
            }
        });
    }
}

function addFragmentAttribute(attr, attrName, usingFragmentId, options, slotJson, callback) {

    //pretty.inform("%s: Attribute '%s' will be added as single attribute", attr, attrName);
    pretty.inform("%s: Attribute '%s' is a typeOf fragmentId '%s'", attr, attrName, usingFragmentId);

    var metaDataFilePath = path.join(process.cwd(), slotJson.framework.metaData, (options.toPage ? options.toPage : options.toFragment) + '.json'),
        metaDataFile = require(metaDataFilePath);

    if(metaDataFile.binds[attrName]) {
        callback && callback(util.format("attribute '%s' already exists on '%s'", attrName, (options.toPage ? options.toPage + " page" : options.toFragment + " fragment")));
    }
    else {
        // Validate fragmentId to add already exists on ("slot.json file").fragments
        if(slotJson.fragments[usingFragmentId]) {

            //var pageMetaDataFile = path.join(slotJsonFile, slotJson.framework.metaData, slotJson.fragments[usingFragmentId], '.json');
            //
            //pretty.inform("   '%s' added to metadata file '%s'.json", attrName, slotJson.fragments[usingFragmentId]);
            //pretty.inform("   '%s' added to html file '%s'.html", attrName, slotJson.fragments[usingFragmentId]);

            /**
             * TODO:
             *  1.  Look the referenced fragment.json file
             */
            var referencedMetaDataFilePath = path.join(process.cwd(), slotJson.framework.metaData, slotJson.fragments[usingFragmentId] + '.json'),
                referencedMetaDataFile = require(referencedMetaDataFilePath);

            pretty.inform(" usingFragmentId[%s] referencedMetaDataFilePath[%s]", usingFragmentId, referencedMetaDataFilePath);

            //delete referencedMetaDataFile.binds['fragmentID'];
            pretty.inform("referencedMetaDataFile %s", JSON.stringify(referencedMetaDataFile.binds, null, 4));


            //Set the referenced FragmentId
            referencedMetaDataFile.binds['fragmentID'] = usingFragmentId+"xx";

            //if(options)
            // Add dummy value for added attribute
            metaDataFile.binds[attrName] = referencedMetaDataFile.binds;

            // Delete 'someAttribute' test attribute if exists
            metaDataFile.binds['someAttribute'] && delete metaDataFile.binds['someAttribute']

            pretty.inform("metaDataFile %s", JSON.stringify(metaDataFile, null, 4));
            //callback && callback(err);

            // Update the metaData file
            fs.writeFile(metaDataFilePath, JSON.stringify(metaDataFile, null, 4), function (err) {

                if (!err) {
                    pretty.inform("   '%s' added to metadata file '%s'", attrName, metaDataFilePath);

                    // Continue adding attributes on html file
                    var htmlDataFile = path.join(process.cwd(), (options.toPage ? slotJson.framework.webRootDir : slotJson.framework.fragmentRootDir), (options.toPage ? options.toPage : options.toFragment) + '.html');

                    updateResource(htmlDataFile,
                        function(content, afterUpdate) {    // <= onUpdate callback function

                            // Modify content, adding a attribute in this case
                            content = content.replace("{@someAttribute@}", "<!--append here-->")
                            content = content.replace("<!--append here-->", "{@" +attrName+ "@}" + "\r\n<!--append here-->")

                            // Call back to update content on file system
                            afterUpdate(content, htmlDataFile);
                        },
                        function(err) {    // <= final callback function
                            if(!err)
                                pretty.inform("   '%s' added to html file '%s'", attrName, htmlDataFile);
                            else
                                err = util.format('   failed updating html file [%s] [%s]', htmlDataFile, err);

                            callback && callback(err);
                        }
                    )
                }
                else{
                    callback && callback(util.format('   failed updating metaData file [%s] [%s]', metaDataFile, err));
                }
            });
        }
        else {
            //pretty.failed("fragmentId '%s' does not exists", usingFragmentId);
            callback && callback(util.format("fragmentId '%s' does not exists on slot.json file", usingFragmentId));
        }
    }
}

function handleAttributes (options, slotJson, slotJsonFile, callback) {
    //slot add -a att1,attr2,attr3@frag1,attrA --toPage page1
    //slot add -a att1,attr2,attr3@clone/frag1,attrA --toPage page1
    //slot add -a att1,attr2,attr3@frag1,attr4@clone/frag1,attrA --toPage page1
    //slot add -a att1,attr2,attr3@frag3,attr4@clone/frag4,attrA --toPage page1

    pretty.doing("Adding attributes '%s' to %s", options.attributes, (options.toPage ? options.toPage+" page" : options.toFragment+" fragment"));

    var attr = 0;
    // Loop over many attributes
    async.eachSeries( options.attributes.split(',')
        , function( attribute, iteratorCallback) {

            setTimeout(function() {
                attribute = attribute.split('@');

                var attrName = attribute[0],
                    usingFragmentId = attribute.length == 2 ? attribute[1] : "",
                    cloningFragmentId = "";

                if(!usingFragmentId) {
                    // Add attribute whit out any reference to other fragments
                    addSingleAttribute(++attr, attrName, options, slotJson, iteratorCallback);
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
                    // Add attribute referencing a fragment
                    addFragmentAttribute(++attr, attrName, usingFragmentId, options, slotJson, iteratorCallback);
                }
            }, 75);
        }
        , function(err){

            callback(err);
        }
    );
}

module.exports.handleAttributes = handleAttributes;
module.exports.addSingleAttribute = addSingleAttribute;
