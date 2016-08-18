var noop;
var wizard = function () {
    var _options;
    var iteratorPointer;
    var entryStep;
    var $fn;
    var _beforeExit;
    var _afterExit;
    var stepLength;
    var _eventRegistry = {};
    var _eventDispatcher = function (event, eventValue) {
        if (eventValue === void 0) { eventValue = {}; }
        if (!_eventRegistry.hasOwnProperty(event)) {
            return;
        }
        try {
            _eventRegistry[event](eventValue);
        }
        catch (e) {
            console.error('Error: invalid callback function supplied for wizard event' + event);
        }
    };
    var create = function (options) {
        _options = options;
        entryStep = options.entryStepNumber ? options.entryStepNumber : 1;
        iteratorPointer = entryStep;
        _beforeExit = options.beforeExit ? options.beforeExit : noop;
        _afterExit = options.afterExit ? options.afterExit : noop;
        stepLength = options.steps.length;
    };
    var $on = function (event, callback) {
        _eventRegistry[event] = callback;
    };
    return {
        create: create,
        $on: $on
    };
};
