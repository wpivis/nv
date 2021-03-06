var moment = require('moment');
var xml2js = require('xml2js');
var XmlDocument = require('xmldoc').XmlDocument;

/**
 * Parses a nessus result line and handles missing fields.
 * @param nessStr - nbe result string line
 * @return - structure containing th eip, vulnid, vulntype, cvss and port
 */
var parseNessusResult = function(nessStr, name){
  //id = nessStr.attr.severity;
  //var scoreCode = ['Note', 'Warning', 'Hole'];

  return {
  "ip": name,
  "vulnid": nessStr.attr.pluginID,
  //"vulntype": scoreCode[nessStr.attr.severity],
  "vulntype": nessStr.childNamed('risk_factor') != null ? nessStr.childNamed('risk_factor').val :'',
  "cvss": nessStr.childNamed('cvss_base_score') != null ?
    parseInt(nessStr.childNamed('cvss_base_score').val) : '',
  "value": 1,
  "port": nessStr.attr.port,
  "title": nessStr.childNamed('plugin_name') != null ? nessStr.childNamed('plugin_name').val :'',
  "description": nessStr.childNamed('description') != null ? nessStr.childNamed('description').val :'',
  "family": nessStr.attr.pluginFamily,
  "risk_factor": nessStr.childNamed('risk_factor') != null ? nessStr.childNamed('risk_factor').val :'',
  "synopsis": nessStr.childNamed('synopsis') != null ? nessStr.childNamed('synopsis').val :'',
  "solution": nessStr.childNamed('solution') != null ? nessStr.childNamed('solution').val :''};
}

/**
 * @param stampString - timestamp line from an NBE file.
 * @return - milliseconds between epoch and the time in the stamp.
 */
var parseNessusTimeStamp = function(stampString){
    var moment = require("moment");
    var timeFormat = "ddd MMM DD HH:mm:ss YYYY";
    var splitInput = stampString.split("|");

    var time = moment(splitInput[splitInput.length - 2], timeFormat)
    var time = splitInput[splitInput.length - 2]
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
    var returnArray = new Array(2)
    var parser = xml2js.Parser()

    parser.parseString(nbe, function (err, result) {
      var xmlDoc = new XmlDocument(nbe);
      var report = xmlDoc.childNamed("Report");
      var hosts = report.childrenNamed('ReportHost');

      for (var j = 0; j<hosts.length; j++) {
        var items = hosts[j].childrenNamed('ReportItem');
        for (var i = 0; i<items.length; i++) {
          returnArray.push(parseNessusResult(items[i], hosts[j].attr.name));
        }
      }
    });
    var objects = returnArray.filter(function(){return true});  //remove nulls
    return objects;
}

module.exports = {
  parseNBEFile: parseNBEFile
}
