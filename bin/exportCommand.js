/**
 * Created by cecheveria on 2/1/2015.
 */

var path = require("path"),
    cliHelper = require('./cliHelper'),
    pretty = require('./prettyMessage');
var slotJson,
    slotJsonFile;

function exportCommand(options) {
    if (options.minify) {
        /**
         * TODO:
         *  1.  Validate if(options.minify.trim()!='') when calling buildExport()
         */
        console.log('Exporting and minify current project.. %s', options.minify == true);

        // Load local slot configuration
        slotJson = require(slotJsonFile);

        //slot export -m 'css,html'
        // Set to ALL extensions, if '-m' option don't have values
        var extensions = options.minify == true ? "html,css,js".split(',') : options.minify.split(',');

        console.log('Exporting and minify current project, extensions %s', extensions);
    }
    else {
        //console.log('Exporting current project..');
    }

    cliHelper.cmdUnderConstruction();
}

module.exports = exportCommand;