var fs = require('fs');
var path = require('path');
var lscpProcessor = require('lscp-processor');
var MongoClient = require('mongodb').MongoClient;
var DbUtils = lscpProcessor.DbUtils;
var CallsProcessed = lscpProcessor.CallsProcessed;
var dir = process.argv[2];

function uploadFilesIndividually(dir, collection, format, cb) {
  var filtered = function (err, files) {
    if (err) throw err;
    var index = 0;
    var saved = function (report) {
      if (index < files.length) {
        DbUtils.saveToDb(dir + files[index], collection, format, saved);
      } else {
        return cb();
      }
      index++;
    };
    DbUtils.saveToDb(dir + files[index], collection, format, saved);
  };
  filterLS(dir, 'csv', filtered);
}

function filterLS(dir, ext, cb) {
  var createList = function (err, files) {
    if (err) return cb(err, null);
    var result = [];
    for (var i = 0; i < files.length; i++) {
      if (path.extname(files[i]) == '.'+ext) {
        result.push(files[i]);
      }
    }
    cb(null, result);
  };
  fs.readdir(dir, createList);
}

function main() {
  if (path) {
  } else {
    console.log('No path specified!');
  }
};

module.exports = {
  filterLS: filterLS,
  uploadFilesIndividually: uploadFilesIndividually,
};
