/**
 * Created by cecheveria on 1/28/2015.
 */

var colors = require('colors'),
    S = require('string')
    ;

var PrettyMsg = (function() {
    function PrettyMessage() {

    }

    PrettyMessage.prototype = {
        /**
         @param {...*} message
         */
        doing : function (message) {
            arguments[0] = ('* ').yellow + arguments[0];
            console.log.apply(this, arguments);
        },
        /**
         @param {...*} message
         */
        done : function(message) {
            arguments[0] = ('  done: ').green + arguments[0];
            console.log.apply(this, arguments);
        },
        /**
         @param {...*} message
         */
        failed : function (message) {
            arguments[0] = ('  fail: ').red + arguments[0];
            console.log.apply(this, arguments);
        },
        /**
         @param {...*} message
         */
        inform : function (message) {
            arguments[0] = ('  ').grey + arguments[0];
            console.log.apply(this, arguments);
        },
        /**
         @param {...*} message
         */
        alert : function (message) {
            arguments[0] = (' * ').yellow + arguments[0];
            console.log.apply(this, arguments);
        }
    }

    return new PrettyMessage();
})();

// Export main object
module.exports = PrettyMsg;