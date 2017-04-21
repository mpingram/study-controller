// #docregion
module.exports = function(config) {

  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-spec-reporter"),
      require("karma-jasmine-html-reporter"), // click "Debug" in browser to see it
      //require('karma-htmlfile-reporter') // crashing w/ strange socket error
    ],

    files: [
      // transpiled application & spec code paths loaded via module imports
      {pattern: "built/**/*.ts", included: true, watched: true},
      {pattern: "built/**/*.spec.js", included: true, watched: true},
      //{pattern: "spec/**/*.spec.js", included: true, watched: false}

    ],

    exclude: [],
    reporters: ["progress", "kjhtml", "spec"],
    browsers: ["Chrome"],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false
  });
};