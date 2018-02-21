import * as program from 'commander';

import ECS from './helpers/EcsHelper';

program
  .version('1.0.0')
  .usage(' -- [options]')
  .option('-t, --tag <tag>', 'Specify the tag for the image, default: "latest"', 'latest');

program.on('--help', () => {
  console.log('\n  Examples:\n');
  console.log('    $ npm run deploy -- -t 1.0.0\n');
});

const { tag } = program.parse(process.argv);

ECS.deploy(tag);
