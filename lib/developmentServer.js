/**
 * Created by cecheveria on 8/5/14.
 */

var server = require('slot-framework')
    ;

function start(options) {
    /**
     * TODO:
     *  1.  Validate options.port have been send
     */

    //server.setDevMode(false);
    server.start(/*81*/);
}

module.exports.start = start;