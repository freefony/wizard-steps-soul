interface wizardOptions {
  steps: any[],
  beforeExit?: (...params: any[]) => any,
  afterExit?: (...params: any[]) => any,
  entryStepNumber?: number
}

let noop: () => void

let wizard = (): any => {
  let _options: any
  let iteratorPointer: number
  let entryStep: number
  let $fn: Function

  let _beforeExit: Function
  let _afterExit: Function

  let stepLength: number

  let _eventRegistry = {} as any

  const _eventDispatcher = (event: string, eventValue = {}):void => {
    if (!_eventRegistry.hasOwnProperty(event)) {
      return;
    }
    try {
      _eventRegistry[event](eventValue);
    } catch (e) {
      console.error('Error: invalid callback function supplied for wizard event' + event);
    }
  }

  const create = (options: wizardOptions) => {
    _options = options
    entryStep = options.entryStepNumber ? options.entryStepNumber : 1
    iteratorPointer = entryStep
    _beforeExit = options.beforeExit ? options.beforeExit : noop
    _afterExit = options.afterExit ? options.afterExit : noop
    stepLength = options.steps.length
  }

  let $on = function (event: string, callback: (eventValue: any) => void) {
    _eventRegistry[event] = callback
  }

  return {
    create,
    $on
  }

}
