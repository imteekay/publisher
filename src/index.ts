import * as fs from 'fs';
import * as path from 'path';

fs.readFile(path.join(__dirname, '../data/template.html'), 'utf8', (error, data) => {
  // console.log(data);
});
