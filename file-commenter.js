const exec = require('mz/child_process').exec;
const readFile = require('fs-promise').readFile;
const writeFile = require('fs-promise').writeFile;

const HEADER_COMMENT_LINES = {
  todo: '// TODO: This file was updated by lazy-lint.',
  fixIssues: '// Fix any style issues and re-enable lint.',
};

async function prependToFile(path, prependText) {
  let contents = await readFile(path);
  let lines = contents.toString().split('\n');
  if (lines[0] && lines[0].startsWith('#!')) {
    contents = lines[0] + '\n' + prependText + lines.slice(1).join('\n');
  } else {
    contents = prependText + contents;
  }
  await writeFile(path, contents);
}

async function lint(path, eslintPath) {
  let messages = [];

  let eslintOutputStr = (await exec(`${eslintPath} --format json ${path}; :`, {
    maxBuffer: 10000 * 1024,
  }))[0];

  let ruleIds;
  if (eslintOutputStr.includes("ESLint couldn't find a configuration file")) {
    messages.push(`Skipping "eslint" on ${path} because there was no eslint config file.`);
    ruleIds = [];
  } else {
    let eslintOutput;
    try {
      eslintOutput = JSON.parse(eslintOutputStr);
    } catch (e) {
      throw new Error(`Error while running eslint:\n${eslintOutputStr}`);
    }
    ruleIds = eslintOutput[0].messages.map(message => message.ruleId).filter(ruleId => ruleId);
    ruleIds = Array.from(new Set(ruleIds)).sort();
  }

  if (ruleIds.length > 0) {
    await prependToFile(
      `${path}`,
      `${HEADER_COMMENT_LINES.todo}\n${HEADER_COMMENT_LINES.fixIssues}\n\n`
    );

    await prependToFile(
      `${path}`,
      `\
    /* eslint-disable
    ${ruleIds.map(ruleId => `    ${ruleId},`).join('\n')}
    */
    `
    );
  }
  return { error: null, messages };
}

module.exports = async function runEslint(jsFiles, eslintPath) {
  console.log('Running lazy-lint on the following files...');
  console.log(jsFiles);
  for (file of jsFiles) {
    let eslintResults = await lint(file, eslintPath);
    for (let message of eslintResults.messages) {
      console.log(message);
    }
  }
};
