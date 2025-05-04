## Configuring an Apps Script Project

1. Move `sample.clasp.json` to `.clasp.json`
2. Set the `scriptId`
	- This can be found by opening to your script on the web
		and navigating to File > Project properties > Script ID

## Deploying

1. Run `clasp push`

Changes should take effect immediately in the associated Google Doc.

## Todo

- [ ] Use a bundler to convert TS into JS instead of using TS directly with clasp
	- see https://github.com/google/clasp/tree/master?tab=readme-ov-file#migrating-from-2x-to-3x
	- see https://github.com/google/aside/tree/main
	- use Rollup probably

