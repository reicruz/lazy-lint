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

## sample

Sample pipeline for linting a large codebase

### initial conversion

```
npm install lazy-lint eslint prettier prettier-eslint
```

If you wish to use `airbnb`'s set of eslint rules (optional)

```
npm install eslint-config-airbnb
```

Add script to `package.json`

```
"scripts": {
	"lazy-lint": "node ./node_modules/lazy-lint/cli.js -f '{lib,spec}/**/*.js' -p eslint",
	"prettify": "prettier-eslint --write '{lib,spec}/**/*.js' && npm run lazy-lint"
}
```

This will do an initial run of `prettier` and `eslint --fix` on the entire codebase. Not everything can be fixed though; `lazy-lint` adds an `eslint-disable` comment with a set of rules specific to each failing file.

### moving forward

```
npm install husky lint-staged
```

Add scripts to `package.json`

```
"scripts": {
  "precommit": "lint-staged",
  "prepush": "eslint lib spec"
}
"lint-staged": {
  "*.js": [
    "prettier-eslint --write",
    "git add"
  ]
}
```

Through the use of `husky` and `lint-staged`, you can automate formatting on files you edit. Finally, the `prepush` script will check for any linting errors that need to be fixed manually.

`lazy-lint` gives you the freedom of choosing when to do your manual edits.
