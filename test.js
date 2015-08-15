var assert    = require('assert');
var http      = require('http');
var openports = require('./index.js');

describe('openports', function() {
  it('returns an unused port', function(done) {
    openports(1).then(function(ports) {
      assert.equal(ports.length, 1);

      var server = http.createServer();
      server.listen(ports[0]);
      server.on('listening', function() {
        server.close(done);
      });
    });
  });

  it('avoids used ports', function(done) {
    var server;

    openports(1).spread(function(port) {
      server = http.createServer();
      server.listen(port + 1);

      return openports(1);
    }).spread(function(port) {
      server.close(done);
    });
  });

  it('returns multiple unused ports', function() {
    return openports(5).then(function(ports) {
      assert.equal(ports.length, 5);
      ports.forEach(function(port) {
        assert(!isNaN(port));
      });
    });
  });

  it('accepts an optional callback', function(done) {
    openports(1, function(err, ports) {
      assert.equal(err, null);
      assert.equal(ports.length, 1);
      done();
    });
  });
});
