import isAccurateWithinDelta from "./is-accurate-within-delta";

// quirk: if passed a third argument, deepObjectCompare compares number equality fuzzily,
// treating third argument as delta

const deepObjectCompare = (objectA: any, objectB: any, numCompareDelta?: number): boolean => {

  for (let prop in objectA){

    if (objectA.hasOwnProperty(prop)){

      // do both objects have this property?
      const isPropertyMismatch = !objectB.hasOwnProperty(prop);
      if (isPropertyMismatch){
        return false;
      }

      // are both of the values the same?
      const valueA = objectA[prop];
      const valueB = objectB[prop];

      const valueAIsArray = Array.isArray(valueA);
      const valueBIsArray = Array.isArray(valueB);

      const valueAIsObject = typeof valueA === "object" && valueA !== null;
      const valueBIsObject = typeof valueB === "object" && valueB !== null;

      const valueAIsNumber = typeof valueA === "number";
      const valueBIsNumber = typeof valueB === "number";

      if (valueAIsArray){
        if (valueBIsArray){
          if (deepArrayCompare(valueA, valueB, numCompareDelta) === false){
            return false;
          }
        } else {
          return false;
        }

      } else if (valueAIsObject){
        // if both valueA and valueB are objects,
        // recursively compare them
        if (valueBIsObject){
          if (deepObjectCompare(valueA, valueB, numCompareDelta) === false){
            return false;
          }
        } else {
        // if valueA is object and valueB is not,
        // they are different
          return false;
        }

      } else if (valueAIsNumber){
        if (valueBIsNumber){
          if (isAccurateWithinDelta(valueA, valueB, numCompareDelta) === false){
            console.log(valueA);
            return false;
          } 
        } else {
          return false;
        }
      } else {
        if(valueA !== valueB){
          return false;
        }
      }
    }
  }

  // both of the objects must be the same
  return true;
};


const deepArrayCompare = (arrayA: any[], arrayB: any[], numCompareDelta?: number) => {
  for (let i = 0; i < arrayA.length; i++){
    const valueA = arrayA[i];
    const valueB = arrayB[i];

    const valueAIsArray = Array.isArray(valueA);
    const valueBIsArray = Array.isArray(valueB);

    const valueAIsObject = typeof valueA === "object" && valueA !== null;
    const valueBIsObject = typeof valueB === "object" && valueB !== null;

    const valueAIsNumber = typeof valueA === "number";
    const valueBIsNumber = typeof valueB === "number";

    if (valueAIsArray){
      if (valueBIsArray){
        if (deepArrayCompare(valueA, valueB) === false){
          return false;
        }
      } else {
        return false;
      }

    } else if (valueAIsObject){
      if (valueAIsObject){
        if (deepObjectCompare(valueA, valueB) === false){
          return false;
        }
      } else {
        return false;
      }

    } else if (valueAIsNumber){
      if (valueBIsNumber){
        if (isAccurateWithinDelta(valueA, valueB, numCompareDelta) === false){
          console.log(valueA);
          return false;
        }
      } else {
        return false;
      }
    } else {
      if(valueA !== valueB){
        return false;
      }
    }
  }

  return true;
};


export default deepObjectCompare;