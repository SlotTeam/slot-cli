/**
 * Created by cecheveria on 1/27/2015.
 */

var path = require("path"),
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    sortObj = require('sort-object'),
    cliHelper = require('./cliHelper'),
    pretty = require('./prettyMessage')
    ;

/**
 *
 * @param {string} pathToResources   Full path to the templates resources
 * @param {string} projectFolder     Full path where the project folder has been created
 * @param {string} page              The page name
 * @param {Object} slotJson          JavaScript object that holds the 'slot.json' file config
 * @param {boleean} isHomePage          JavaScript object that holds the 'slot.json' file config
 * @param {function} callback
 */
function addPage(pathToResources, projectFolder, page, slotJson, isHomePage, callback) {

    if (page.trim() != '') {
        pretty.doing("Adding new page '%s'", page);

        var folder = page.split('/').pop(); // Using '/' because we are talking about web contexts
        folder = page.replace(folder, '');

        // Be sure the full-path folder is created.
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.webRootDir, folder)), function (err) {
            if (err)
                callback(err); //console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err)
                        callback(err);
                    else {
                        cliHelper.buildPage(pathToResources, projectFolder, page, slotJson, isHomePage, callback);
                    }
                });
            }
        });
    }
    else {
        pretty.alert();
        pretty.alert('Please enter a valid page name');
        pretty.alert('   To see help use: slot add -h');
    }
}

/**
 *
 * @param {string} pathToResources   Full path to the templates resources
 * @param {string} projectFolder     Full path where the project folder has been created
 * @param {string} fragment          Fragment name
 * @param {Object} slotJson          JavaScript object that holds the 'slot.json' file config
 * @param {string} slotJsonFile      Full path to 'slot.json'
 * @param {function} callback
 */
function addFragment(pathToResources, projectFolder, fragment, slotJson, slotJsonFile, callback) {

    if (fragment.trim() != '') {
        pretty.doing("Adding new fragment '%s' on '%s'", fragment, slotJson.framework.fragmentRootDir);

        var fileName = fragment.split('/').pop(),
            folder = fragment.replace(fileName, '');

        // Be sure the full-path folder is created.
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.fragmentRootDir, folder)), function (err) {
            if (err)
                callback(err); //console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err)
                        callback(err);
                    else {
                        // Create fragment objects on file system
                        cliHelper.buildFragment(pathToResources, projectFolder, fragment, slotJson, function(err) {
                            if (err)
                                callback(err);
                            else {
                                // Add the newly created fragment on slot.json file
                                var fragmentName = fragment.split('/').pop();
                                slotJson.fragments[fragmentName] = '/' + fragment;
                                slotJson.fragments = sortObj(slotJson.fragments);
                                delete fragmentName;

                                fs.writeFile(slotJsonFile, JSON.stringify(slotJson, null, 4), function (err) {
                                    //if (err) {
                                    //    pretty.failed("Fail creating '%s'", fragment);
                                    //    throw err;
                                    //}
                                    //pretty.done("Fragment '%s' created on '%s'", fragment, 'todo_path');
                                    callback(err)
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        pretty.alert();
        pretty.alert('Please enter a valid fragment name');
        pretty.alert('   To see help use: slot add -h');
    }
}

/**
 *
 * @param pathToResources   Full path to the templates resources
 * @param projectFolder     Full path where the project folder has been created
 * @param rest              Rest service name
 */
function addRestService(pathToResources, projectFolder, rest, slotJson) {

    if (rest.trim() != '') {
        pretty.doing("Adding new rest service '%s'", rest);

        var folder = rest.split('/').pop(); // Using '/' because we are talking about web contexts
        folder = rest.replace(folder, '');

        // Be sure the full-path folder is created.
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.restRootDir, folder)), function (err) {
            if (err) {
                pretty.failed("Fail creating '%s'", rest);
                throw err;
            }
            else {
                cliHelper.buildRestService(pathToResources, projectFolder, rest, slotJson);

                pretty.done("Rest service '%s' created on '%s'", rest, 'todo_path');
            }
        });
    }
    else {
        pretty.alert();
        pretty.alert('Please enter a valid rest service name');
        pretty.alert('   To see help use: slot add -h');
    }
}

module.exports.addPage = addPage;
module.exports.addFragment = addFragment;
module.exports.addRestService = addRestService;
