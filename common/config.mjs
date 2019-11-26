import fs from 'fs';
import path from 'path';

let config;
const getConfig = () => {
  if (!config) 
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')).toString());
  

  return config;
} 

export default getConfig;
