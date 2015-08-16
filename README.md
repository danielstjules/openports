# openports

Find multiple open ports.

[![Build Status](https://travis-ci.org/danielstjules/openports.svg?branch=master)](https://travis-ci.org/danielstjules/openports)

## Installation

`npm install --save openports`

## Usage

``` javascript
/**
 * Returns n open ports. Uses port 0 for port discovery, and binds to all ports
 * prior to releasing them to help avoid race conditions. Accepts an optional
 * callback, otherwise it returns a promise.
 *
 * @param   {int}      n    Number of ports to open
 * @param   {function} [fn] Optional callback to invoke
 * @returns {Promise}  An array of port numbers
 */
```

## Example

``` javascript
var openports = require('openports');

openports(1, function(err, ports) {
  console.log(ports); // [12345]
});

openports(2).then(function(ports) {
  console.log(ports); // [12345, 12346]
});
```
