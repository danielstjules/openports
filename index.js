var http    = require('http');
var Promise = require('bluebird');

/**
 * Returns n open ports. Uses port 0 for port discovery, and binds to all ports
 * prior to releasing them to help avoid race conditions. Accepts an optional
 * callback, otherwise it returns a promise.
 *
 * @param   {int}      n    Number of ports to open
 * @param   {function} [fn] Optional callback to invoke
 * @returns {Promise}  An array of port numbers
 */
function find(n, fn) {
  var ports;
  var getServers = [];

  for (var i = 0; i < n; i++) {
    getServers.push(getServer());
  }

  return Promise.all(getServers).then(function(servers) {
    ports = servers.map(function(server) {
      return server.address().port;
    });

    return closeServers(servers);
  }).then(function() {
    return ports;
  }).nodeify(fn);
}

/**
 * Returns a promise resolving with an active server.
 *
 * @returns {Promise}
 */
function getServer() {
  return new Promise(function(resolve, reject) {
    var server = http.createServer();
    server.on('error', function() {
      // Port taken, try again
      resolve(getServer());
    });
    server.on('listening', function() {
      resolve(server);
    });

    server.listen(0);
  });
}

/**
 * Returns a promise that resolves once all the supplied servers have been
 * closed, freeing up their associated ports.
 *
 * @param   {Server[]} An array of servers
 * @returns {Promise}
 */
function closeServers(servers) {
  var closeServer = function(server) {
    return new Promise(function(resolve, reject) {
      server.close(function(err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  return Promise.all(servers.map(closeServer));
}

module.exports = find;
