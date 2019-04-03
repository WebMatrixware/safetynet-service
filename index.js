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
  name: Package.name + ' -v' + Package.version,
  description: Package.description,
  script: Path.join(__dirname, 'service.js')
});

Cmdr
  .version(Package.version, '-v --version')
  .parse(process.argv);


Cmdr.outputHelp();
