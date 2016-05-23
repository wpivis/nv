/**
 * Created by Andrew on 1/25/16.
 * https://github.com/nfarina/xmldoc
 */

var scoreCode = ['Open Port', 'Low', 'Warning', 'Hole'];
var xml2js = require("xmldoc")
var parser = new xml2js.Parser();


function readNessus() {
    fs.readFile(__dirname + '/test.nessus', function(err, data) {
        parser.parseString(data, function (err, result) {
            return new XmlDocument(data);
        });
    });
}

var parseNessusResult = function () {
    var xmlDoc = readNessus();
    var report = xmlDoc.childNamed("Report");
    var hosts = report.childrenNamed('ReportHost');

    for (var j = 0; j<hosts.length; j++) {
        var items = hosts[j].childrenNamed('ReportItem');
        for (var i = 0; i<items.length; i++) {
            var parsedReport = {
                "ip":hosts[j].attr.name,
                "vulnid":items[i].attr.severity,
                "vulntype":scoreCode[items[i].attr.severity],
                "cvss":items[i].childNamed('cvss_base_score')!=null ?
                    items[i].childNamed('cvss_base_score').val : ' ',
                "value": 1,
                "port":items[i].attr.port
            };
        }
    }
}

