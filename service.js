'use strict';

require('dotenv').config();

const CronJob = require('cron').CronJob;
const Cronstrue = require('cronstrue');
const Enc = require('simple-encryptor')(process.env.SECRET_KEY);
const FS = require('fs');
const Moment = require('moment');
const Path = require('path');
const T = require('tracer').colorConsole({
  transport: (data) => {

    let stamp = new Date();
    let filename = `safetynet_${stamp.getFullYear()}-${stamp.getMonth()}-${stamp.getDay()}.log`;

    FS.open(`./${filename}`, 'a', (err, fd) => {
      if(err) {
        console.log('Log file could not be opened or created.')
      }
    });

    console.log(data.output);
    FS.appendFile(`./${filename}`, data.rawoutput + '\n', (err) => {
      if(err) {
        throw err;
      }
    });
  }
});
const YAML = require('js-yaml');

//Enc.decrypt(doc.backup.sftp.password);

T.log('#####################');
T.log('Service coming online');

try {
  let cfg;
  FS.readFile(process.env.CONFIG_PATH, (err, data) => {
    if (err) {
      T.error(err);
    } else {
      cfg = YAML.safeLoad(data);
      T.log('Loaded config');
      T.log('#############');
      T.log(cfg);
      T.log('#############')
      T.log('Backing up ' + Cronstrue.toString(cfg.backup.frequency));

      new CronJob(cfg.backup.frequency, () => {
        T.log('Backup routine starting');
        backup(cfg);
        T.log('Backup routeine complete');
      }, null, true, 'America/New_York');
    }
  });
} catch(err) {
  T.error(err);
}

const backup = function backup(cfg) {

  const stamp = Moment.parseZone(new Date()).format('YYYY-MM-DD_HH-mm');

  FS.mkdir(Path.join(cfg.backup.storagePath, stamp), { recursive: true }, (err) => {
    if (err) {
      T.error(err);
    }
  });
};
