var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var common = require('./common.js');
var filterLS = require('../index.js').filterLS;
var uploadFilesIndividually = require('../index.js').uploadFilesIndividually;

describe('Tests', function () {
  it('filter the specified directory correctly', function (done) {
    var cb = function (err, files) {
      if (err) throw err;
      assert.equal(files.length, 4);
      done();
    };
    filterLS('test/filterLS-test/', 'csv', cb);
  });
  it('upload the files in cp-files', function (done) {
    this.timeout(0);
    var mongodb;
    var finished = function () {
      var scores = mongodb.collection('scores');
      scores.count(function (err, count) {
        assert.equal(count, 62);
        return done();
      });
    };
    var initiated = function (err) {
      if (err) throw err;
      var scores = mongodb.collection('scores');
      var path = 'test/cp-files/';
      var format = common.format;
      uploadFilesIndividually(path, scores, format, finished);
    };
    var connected = function (err, db) {
      mongodb = db;
      db.dropDatabase(initiated);
    };
    MongoClient.connect('mongodb://localhost/test', connected);
  });
});
