// var sys = require("util")
// var fs = require('fs');
var moment = require('moment');
var xml2js = require('xml2js');
var XmlDocument = require('xmldoc').XmlDocument;

/**
 * Parses a nessus result line and handles missing fields.
 * @param nessStr - nbe result string line
 * @return - structure containing th eip, vulnid, vulntype, cvss and port
 */
var parseNessusResult = function(nessStr){
  return {
  "ip":"0.0.0.0.0",
  "vulnid": 0,
  "vulntype": "hole",
  "cvss":nessStr.childNamed('cvss_base_score') != null ?
    nessStr.childNamed('cvss_base_score').val : ' ',
  "value": 1,
  "port":nessStr.attr.port};
}

/**
 * @param stampString - timestamp line from an NBE file.
 * @return - milliseconds between epoch and the time in the stamp.
 */
var parseNessusTimeStamp = function(stampString){
    var moment = require("moment")
    var timeFormat = "ddd MMM DD HH:mm:ss YYYY"
    var splitInput = stampString.split("|")

    var time = moment(splitInput[splitInput.length - 2], timeFormat)
    //var time = splitInput[splitInput.length - 2]
    return time.valueOf()
}

/**
 * @param line - line to be tested.
 * @return - returns true if the line is a time line containing a timestamp.
 */
var hasTime = function(line){
    var splits = line.split("|")
    return (splits[splits.length - 2].length > 0 && splits[0] == "timestamps")
}

/**
 * @param line - line to be tested.
 * @return - returns true if the line is a result line and false otherwise.
 */
var isResult = function(line){
    return(line.split("|")[0] === "results")
}

/**
 * @param nbe - a string represen ting the contents of a NBE file.
 * @return - array where each entry is a result from the NBE file.
 */
var parseNBEFile = function(nbe){
    //var fs = require('fs');
    //var xml2js = require('xml2js');
    //var XmlDocument = require('xmldoc').XmlDocument;
    // var lines = nbe.split("\n")
    var currentTime = 0
    var returnArray = new Array(2)
    var parser = xml2js.Parser()

    parser.parseString(nbe, function (err, result) {
      var xmlDoc = new XmlDocument(nbe);
      var report = xmlDoc.childNamed("Report");
      var hosts = report.childrenNamed('ReportHost');

      for (var j = 0; j<hosts.length; j++) {
        var items = hosts[j].childrenNamed('ReportItem');
        for (var i = 0; i<items.length; i++) {
          returnArray.push(parseNessusResult(items[i]));
        }
      }
    });
  return returnArray;
}

module.exports = {
  parseNBEFile: parseNBEFile
}

/*
var parseNBEFile = function(nbe){
    var lines = nbe.split("\n")
    var currentTime = 0
    var returnArray = new Array(2)

    for(var i = 0; i < lines.length; i++){
        if(isResult(lines[i])){
            returnArray.push(parseNessusResult(lines[i]))
        }
    }
    return returnArray.filter(function(){return true});//removes nulls
}
*/

//module.exports.parseNessusResult = parseNessusResult;
//module.exports.parseNessusTimeStamp = parseNessusTimeStamp;
//module.exports.parseNBEFile = parseNBEFile;
