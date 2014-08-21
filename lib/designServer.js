/**
 * Created by cecheveria on 8/5/14.
 */

var designerServer = require('slot-framework').Designer
    ;

function start(options) {
    /**
     * TODO:
     *  1.  Validate options.port have been send
     */

    designerServer.start(/*801*/);
}

module.exports.start = start;