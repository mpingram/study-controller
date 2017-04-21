interface CountdownTimerConfigurationObject {
  timerLength: [number, string];
  onIntervalCallback?: OnIntervalCallbackFunction;
  onCompleteCallback: Function;
}

interface OnIntervalCallbackFunction {
  (timeRemainingAsString?: string): any;
}


export default CountdownTimerConfigurationObject;