#!/usr/bin/env node

const electron = require('electron-prebuilt');
const proc = require('child_process');

var child = proc.spawn(electron, [__dirname], { stdio: 'inherit' });
child.on('close', function (code) {
  process.exit(code)
});
