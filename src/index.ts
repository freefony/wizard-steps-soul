interface wizardOptions {
  steps: any[],
  beforeExit?: (...params: any[]) => any,
  afterExit?: (...params: any[]) => any,
  entryStepNumber?: number
}

let noop: () => void

String.prototype.toCamelCase = function() {
  return this
    .replace(/\s(.)/g, function($1: string) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1: string) { return $1.toLowerCase(); });
}

let wizard = (): any => {
  let _options: any
  let iteratorPointer: number
  let entryStep: number
  let $fn: Function

  let _beforeExit: Function
  let _afterExit: Function

  let stepLength: number

  let _eventRegistry = {} as any

  const create = (options: wizardOptions) => {
    _options = options
    entryStep = options.entryStepNumber ? options.entryStepNumber : 1
    iteratorPointer = entryStep
    _beforeExit = options.beforeExit ? options.beforeExit : noop
    _afterExit = options.afterExit ? options.afterExit : noop
    stepLength = options.steps.length
  }

  const _iteratorTicker = {
    next():void { iteratorPointer++ },
    prev():void { iteratorPointer-- },
    go(index: number):void { iteratorPointer = index}
  }

  const _setScope = () => {
    let _currentStep =  _options.steps[iteratorPointer]
    let scope = _currentStep
      .actions
      .reduce(function (scope: any, action: any) {
        let key = action.label.toCamelCase()
        scope[key] = action
        return scope
      }, {})
    scope.templateUrl = _currentStep.templateUrl
    _eventDispatch('onScopeChange', scope)
    return scope
  }

  const next = () => {
    _iteratorTicker.next()
    let currentStep = _options.steps[iteratorPointer]
    currentStep._beforeNext()
    _setScope()
    currentStep._afterNext()

  }

  const _eventDispatch = (event: string, eventValue = {}):void => {
    if (!_eventRegistry.hasOwnProperty(event)) {
      return;
    }
    try {
      _eventRegistry[event](eventValue);
    } catch (e) {
      console.error('Error: invalid callback function supplied for wizard event' + event);
    }
  }

  let $on = function (event: string, callback: (eventValue: any) => void) {
    _eventRegistry[event] = callback
  }

  return {
    create,
    $on
  }

}
