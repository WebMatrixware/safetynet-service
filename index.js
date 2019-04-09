'use strict';

require('dotenv').config();

const Cmdr = require('commander');
const EventLogger = require('node-windows').EventLogger;
const fs = require('fs');
const Service = require('node-windows').Service;
const Package = require('./package.json');
const Path = require('path');
const T = require('tracer').colorConsole({
  transport: (data) => {

    let stamp = new Date();
    let filename = `safetynet_${stamp.getFullYear()}-${stamp.getMonth()}-${stamp.getDay()}.log`;

    fs.open(`./${filename}`, 'a', (err, fd) => {
      if(err) {
        console.log('Log file could not be opened or created.')
      }
    });

    console.log(data.output);
    fs.appendFile(`./${filename}`, data.rawoutput + '\n', (err) => {
      if(err) {
        throw err;
      }
    });
  }
});

const EL = new EventLogger('safetynet-service');
const Svc = new Service({
  name: Package.name + ' v' + Package.version,
  description: Package.description,
  script: Path.join(__dirname, 'service.js')
});

Cmdr
  .version(Package.version, '-v --version')
  .option('-i, --install', 'Install service on in Windows')
  .option('-r, --remove', 'Uninstall (remove) service from Windows')
  .option('-s, --start', 'Start service')
  .option('-t, --stop, --terminate', 'Stop (terminate) service')
  .option('-u, --uninstall', 'Alias for --remove')
  .parse(process.argv);


if (Cmdr.install) {
  Svc.install();
} else if (Cmdr.remove) {
  Svc.uninstall();
} else if (Cmdr.uninstall) {
  Svc.uninstall();
} else if (Cmdr.start) {
  Svc.start();
} else if (Cmdr.stop) {
  Svc.stop();
} else {
  Cmdr.outputHelp();
}
