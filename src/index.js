var noop;
String.prototype.toCamelCase = function () {
    return this
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
};
var wizard = function () {
    var _options;
    var iteratorPointer;
    var entryStep;
    var $fn;
    var _beforeExit;
    var _afterExit;
    var stepLength;
    var _eventRegistry = {};
    var create = function (options) {
        _options = options;
        entryStep = options.entryStepNumber ? options.entryStepNumber : 1;
        iteratorPointer = entryStep;
        _beforeExit = options.beforeExit ? options.beforeExit : noop;
        _afterExit = options.afterExit ? options.afterExit : noop;
        stepLength = options.steps.length;
    };
    var _iteratorTicker = {
        next: function () { iteratorPointer++; },
        prev: function () { iteratorPointer--; },
        go: function (index) { iteratorPointer = index; }
    };
    var _setScope = function () {
        var _currentStep = _options.steps[iteratorPointer];
        var scope = _currentStep
            .actions
            .reduce(function (scope, action) {
            var key = action.label.toCamelCase();
            scope[key] = action;
            return scope;
        }, {});
        scope.templateUrl = _currentStep.templateUrl;
        _eventDispatch('onScopeChange', scope);
        return scope;
    };
    var next = function () {
        _iteratorTicker.next();
        var currentStep = _options.steps[iteratorPointer];
        if (typeof currentStep.beforeNext === 'Function') {
            currentStep.beforeNext();
        }
        currentStep._beforeNext();
        _setScope();
        if (typeof currentStep.afterNext === 'Function') {
            currentStep.afterNext();
        }
    };
    var _eventDispatch = function (event, eventValue) {
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
    var $on = function (event, callback) {
        _eventRegistry[event] = callback;
    };
    return {
        create: create,
        $on: $on,
        next: next
    };
};
