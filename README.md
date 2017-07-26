# lazy-lint

A small CLI for getting rid of eslint errors by disabling failing rules in individual files.

Linting a large codebase can be a daunting task. Instead of spending a large amount of effort linting a project in one go, you can combinine this tool with `eslint --fix` and/or other automated formatters (i.e. `prettier`) to provide an easy mechanism for linting files as you develop. By commenting out specific rules in individual files, you and your team can manually fix linting errors on a file-by-files basis as you move along with the code.

Inspired by [decaffeinate](https://github.com/decaffeinate/decaffeinate).

## installation

	npm install lazy-lint

## usage

- `--file [-f]`: file or glob pattern
- `--path [-p]`: path to eslint binary 

```	
lazy-lint --file '{lib,spec}/**/*.js' --path './node_modules/eslint/bin/eslint
```
