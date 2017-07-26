'use strict';

const yargs = require('yargs');
const glob = require('glob');
const fileCommenter = require('./file-commenter');

const args = yargs
  .usage('Usage: $0 <command> [options]')
  .command('comment', 'Add TODO comment with all failing eslint rules')
  .example(
    '$0 comment -f **/*.js -p ./node_modules/eslint/bin/eslint',
    'count the lines in the given file'
  )
  .alias('f', 'file')
  .alias('p', 'path')
  .describe('f', 'A file or glob pattern of files')
  .describe('p', 'The path to the eslint binary')
  .option('f', {
    type: 'string',
  })
  .demandOption(['f', 'p'])
  .help('h')
  .alias('h', 'help').argv;

glob(args.file, {}, (error, files) => {
  fileCommenter(files, args.path);
});
