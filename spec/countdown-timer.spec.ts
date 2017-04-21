import CountdownTimer from "../src/scripts/countdown-timer";
import CountdownTimerConfigurationObject from "../src/scripts/typedefs/countdown-timer-configuration-object";


// set default timeout interval so that long callbacks
//   between timer start and timer end don't fail tests
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999999;

xdescribe("Countdown timer", () => {

  function test(inputConfig: CountdownTimerConfigurationObject): Promise<number> {
    return new Promise((resolve, reject) => {
      const config: CountdownTimerConfigurationObject = {
        timerLength: inputConfig.timerLength,
        onIntervalCallback: inputConfig.onIntervalCallback,
        // adjust onComplete to resolve Promise
        onCompleteCallback: () => {
          inputConfig.onCompleteCallback();
          let endTimestamp: number = now();
          resolve(endTimestamp);
        }
      };
      const timer: CountdownTimer = new CountdownTimer(config);
      timer.start();
    });
  };

  function now(): number {
    return new Date().getTime();
  }

  function randomInt(lower: number, upper: number): number {
    return Math.round(lower + (Math.random() * (upper - lower)));
  }

  const GLOBAL_DELTA = 100;
  function isWithinDelta(actual: number, expected: number, delta?: number): boolean {
    if (delta === undefined){
      delta = GLOBAL_DELTA;
    }
    delta = Math.abs(delta);
    const upperBound = expected + delta;
    const lowerBound = expected - delta;
    return actual < upperBound && actual > lowerBound;
  };

  xdescribe("with no interruptions", () => {
   
    it("should run for the specified timer length", (done) => {
      // create random runtime in seconds
      const randInt = randomInt(1,10);
      const targetTime = randInt * 1000;

      const config: CountdownTimerConfigurationObject = {
        timerLength: [randInt, "seconds"],
        onIntervalCallback: (time: string) => {
          console.log(time);
        },
        onCompleteCallback: () => {
          done();
        },
      };

      const startTime = now();
      test(config).then( (endTime) => {
        const actualTime = endTime - startTime;
        const isAccurate = isWithinDelta(actualTime, targetTime);
        expect(isAccurate).toBe(true);
      });
    });

    it("should run for the specified timer length if no interval callback is specified", (done) => {
      // create random runtime in seconds
      const randInt = randomInt(1,10);
      const targetTime = randInt * 1000;
      console.log(targetTime);

      const config: CountdownTimerConfigurationObject = {
        timerLength: [randInt, "seconds"],
        onIntervalCallback: undefined,
        onCompleteCallback: () => {
          done();
        },
      };

      const startTime = now();
      test(config).then( (endTime) => {
        const actualTime = endTime - startTime;
        const isAccurate = isWithinDelta(actualTime, targetTime);
        expect(isAccurate).toBe(true);
      });
    });

    it("should execute interval callbacks accurately", (done) => {
      const targetInterval = randomInt(100,2000);
      let intervals: number[] = [];
      const delta = 50;

      const config: CountdownTimerConfigurationObject = {
        timerLength: [10, "seconds"],
        onIntervalCallback: (time: string) => {
          console.log(time);
          const intervalTimestamp = now();
          intervals.push(intervalTimestamp);
        },
        onCompleteCallback: () => {
          done();
        }
      };

      test(config).then( () => {
        function isAccurate(interval){
          return isWithinDelta(interval, targetInterval, delta);
        }
        expect(intervals.every(isAccurate)).toBe(true);
      });
    });

  });
  
  describe("with interruptions", () => {

    it("should maintain accuracy after randonly starting and stopping", (done) => {

      const TIMER_LENGTH_IN_SECONDS = 10;
      const TIMER_PAUSE_PROBABILITY_PER_SECOND = 0.05;

      const config: CountdownTimerConfigurationObject = {
        timerLength: [TIMER_LENGTH_IN_SECONDS, "seconds"],
        onIntervalCallback: (time: string) => {
          console.log(time);
        },
        onCompleteCallback: () => {
          console.log("Done");
        }
      }

      function customTest(inputConfig){ 
        return new Promise((resolve, reject) => {

          let startTimestamp: number;
          let runningTimeExpected: number = inputConfig.timerLength[0] * 1000;

          const config: CountdownTimerConfigurationObject = {
            timerLength: inputConfig.timerLength,
            // extend onInterval to implement random pausing
            onIntervalCallback: (time) => {
              inputConfig.onIntervalCallback(time);
              // if coin flip, then pause study at some point
              //   before the next interval starts.
              if(Math.random() < TIMER_PAUSE_PROBABILITY_PER_SECOND){
                setTimeout( () => {
                  console.log("Stopped.")
                  pauseTimer(randomInt(0, 5000));
                }, randomInt(0, inputConfig.timerIntervalInMs));
                
              }
            },
            // extend onComplete to resolve Promise
            onCompleteCallback: () => {
              inputConfig.onCompleteCallback();
              const endTimestamp = now();
              const runningTimeActual = endTimestamp - startTimestamp;
              resolve([runningTimeActual, runningTimeExpected]);
            }
          };

          const timer: CountdownTimer = new CountdownTimer(config);

          const pauseTimer = (duration: number): void => {
            timer.stop();
            runningTimeExpected += duration;
            setTimeout( () => {
              console.log("Starting.")
              timer.start();
            }, duration);
          };

          startTimestamp = now();
          timer.start();
        });
      }

      customTest(config).then( (resultArr) => {
        const actualRunningTime = resultArr[0];
        const expectedRunningTime = resultArr[1];
        const isAccurate = isWithinDelta(actualRunningTime, expectedRunningTime);
        console.log(actualRunningTime);
        console.log(expectedRunningTime);
        expect(isAccurate).toBe(true);
        done();
      });
    });


    xit("should not be affected by repeated calls to start and stop", () => {

    });

  });

});
