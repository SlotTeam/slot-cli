/**
 * Created by cecheveria on 1/27/2015.
 */

var path = require("path"),
    fs = require("fs"),
    mkdirp = require('mkdirp'),
    sortObj = require('sort-object'),
    cliHelper = require('./cliHelper')
    ;

/**
 *
 * @param pathToResources   The full path were the slot-cli/resources folder has been created
 * @param projectFolder     The full path were the project folder has been created
 * @param page              The page name
 */
function addPage(pathToResources, projectFolder, page, slotJson) {

    if (page.trim() != '') {
        console.log('Adding new page [%s]', page);

        /**
         * Be sure that exists the full-path folder where the file will be created,
         * then continue whit the buildPage() function
         */
        var folder = page.split('/').pop(); // Using '/' because we are talking about web contexts

        console.log('Adding new page name [%s]', folder);

        folder = page.replace(folder, '');

        console.log('Adding new page [%s] on [%s]', page, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.webRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err) console.error(err)
                    else {
                        cliHelper.buildPage(pathToResources, projectFolder, page, slotJson);
                    }
                });
            }
        });

        console.log('Page [%s] created on [%s]', page, 'todo_path');
    }
    else {
        console.log('Please enter a valid page name');
        console.log('   To see help use: slot add -h');
    }
}

function addFragment(pathToResources, projectFolder, fragment, slotJson, slotJsonFile) {

    if (fragment.trim() != '') {
        console.log('Adding new fragment [%s]', fragment);

        /**
         * Validate if exists the full-path folder where the file will be created,
         * then continue whit the buildFragment() function
         */
        var folder = fragment.split('/').pop(); // Using '/' because we are talking about web contexts

        //var fileName = 'frg' + (folder.charAt(0).toUpperCase() + folder.slice(1));
        var fileName = folder;
        fragment = fragment.replace(folder, fileName);
        folder = fileName;

        console.log('Adding new fragment name [%s]', folder);

        folder = fragment.replace(folder, '');

        console.log('Adding new fragment [%s] on [%s]', fragment, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.fragmentRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                mkdirp(path.join(projectFolder, path.join(slotJson.framework.metaData, folder)), function (err) {
                    if (err) console.error(err)
                    else {
                        // Create fragment objects on file system
                        cliHelper.buildFragment(pathToResources, projectFolder, fragment, slotJson);

                        // Add the newly created fragment on slot.framework.json file
                        var fragmentName = fragment.split('/').pop();
                        slotJson.fragments[fragmentName] = '/' + fragment;
                        slotJson.fragments = sortObj(slotJson.fragments);
                        delete fragmentName;

                        fs.writeFile(slotJsonFile, JSON.stringify(slotJson, null, 4), function (err) {
                            if (err) throw err;
                            console.log('Saved resource on: %s', slotJsonFile);
                        });
                    }
                });
            }
        });

        console.log('Fragment [%s] created on [%s]', fragment, 'todo_path');
    }
    else {
        console.log('Please enter a valid fragment name');
        console.log('   To see help use: slot add -h');
    }
}

/**
 *
 * @param pathToResources   The full path were the slot-cli/resources folder has been created
 * @param projectFolder     The full path were the project folder has been created
 * @param rest              The rest service name
 */
function addRestService(pathToResources, projectFolder, rest, slotJson) {

    if (rest.trim() != '') {
        console.log('Adding new rest service [%s]', rest);

        /**
         * Validate if exists the full-path folder where the file will be created,
         * then continue whit the buildRestService() function
         */
        var folder = rest.split('/').pop(); // Using '/' because we are talking about web contexts

        console.log('Adding new rest name [%s]', folder);

        folder = rest.replace(folder, '');

        console.log('Adding new rest [%s] on [%s]', rest, folder);
        //
        mkdirp(path.join(projectFolder, path.join(slotJson.framework.restRootDir, folder)), function (err) {
            if (err) console.error(err)
            else {
                cliHelper.buildRestService(pathToResources, projectFolder, rest, slotJson);
            }
        });

        console.log('Rest service [%s] created on [%s]', rest, 'todo_path');
    }
    else {
        console.log('Please enter a valid rest service name');
        console.log('   To see help use: slot add -h');
    }
}

module.exports.addPage = addPage;
module.exports.addFragment = addFragment;
module.exports.addRestService = addRestService;
