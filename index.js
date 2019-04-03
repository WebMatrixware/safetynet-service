require('dotenv').config();

const fs = require('fs');
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
