/**
 * Rest service {@rest-name@}, to consume use the URL:
 *
 *  {@rest-url@}
 *
 * Created using Slot Command Line by {@pc-machine@} on {@creation-date@}.
 */

var Slot = require('slot-framework');

/**
 * Function run must be used to implements your REST Service logic,then when
 * you are ready, you must execute the function callback. The function
 * callback is passed as a parameter when the mainController invoke the
 * run(callback) method, and you need to pass the data content to be
 * rendered.
 */
function run(request,
             callback) {
    /**
     * Tip: how to implement session variables
     *
    var sess = request.session;
    if(!sess.count)
        sess.count = 1;
     */

    var data = new Object();
    data.todo = "Please implement the return object";
    /**
     * TODO:
     *  1.  Do whatever you want to extract data, you must return an Object, it
     *      can be an Array or a standar Object:
     *
     *      Return a single object:
     *      ======================
     *      var data = new Object();
     *      data.name = "Jhon";
     *      data.lastName = "Doe";
     *
     *      Return an array object:
     *      ======================
     *      var data = [];
     *      for(x=0; x<10; x++) {
     *          data[x] = new Object();
     *          data[x].name = "Jhon " + x;
     *          data[x].lastName = "Doe";
     *      }
     */

    /**
     * Call the callback function when your data have been filled.
     */
    callback(data /*<<== "data to be saved on memory"*/);
}

module.exports.run = run;
