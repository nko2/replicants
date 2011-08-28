#!/usr/bin/env node
var browserify = require('browserify');
var fs = require('fs');

var build = module.exports = function (opts) {
    if (!opts.file || opts.file === 'player') {
        fs.writeFileSync(__dirname + '/../static/player.js', browserify({
            entry : __dirname + '/../browser/player.js',
            filter : opts.debug ? String : require('uglify-js'),
        }).bundle());
    }
    
    if (!opts.file || opts.file === 'index') {
        fs.writeFileSync(__dirname + '/../static/index.js', browserify({
            entry : __dirname + '/../browser/index.js',
            filter : opts.debug ? String : require('uglify-js'),
        }).bundle());
    }
};

if (__filename === process.argv[1]) {
    var argv = require('optimist').argv;
    process.stdout.write('Building...');
    build(argv);
    console.log(' ok');
}
