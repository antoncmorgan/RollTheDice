
export default {
  debugLevels: {
    ERRORS: 0,
    WARNINGS: 1,
    INFO: 2,
    TESTING: 3
  },
  debugLevel: 0,
  deepClone(objectToClone) {
    // cheesed deep clone
    return JSON.parse(JSON.stringify(objectToClone));
  },
  whoIsParent() {
    try {
      throw new Error();
    } catch (e) {
      // matches this function, the caller and the parent
      const allMatches = e.stack.match(/(\w+)@|at (\w+) \(/g);
      // match parent function name
      if (allMatches && allMatches[2]) {
        const parentMatches = allMatches[2].match(/(\w+)@|at (\w+) \(/);
        // return only name
        return parentMatches[1] || parentMatches[2];
      }
      else {
        return "Unknown";
      }
    }
  },
  debugLog(message, debugLevel) {
    debugLevel = debugLevel ? debugLevel : this.debugLevels.TESTING;
    if (debugLevel <= this.debugLevel) {
      console.log("(from) " + this.whoIsParent() + ":");
      console.log(message);
    }
  }
}
