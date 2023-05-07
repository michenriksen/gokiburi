module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint', 'simple-import-sort', 'import'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: false
	},
	rules: {
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Side effect imports.
					['^\\u0000'],

					// Svelte imports.
					[`^svelte(/.*)?$`, `^svelte(/.*)?\\u0000$`],

					// Skeleton imports.
					[`^@skeletonlabs/`, `^@skeletonlabs/.+\\u0000$`],

					// Any other external imports.
					[`^`, `\\u0000$`],

					[`^\\$lib/components/`],
					[`^\\$lib/stores/`],
					[`^\\$lib/services/`],
					[`^\\$lib/common/`, `^\\$lib/common/(.+)\\u0000$`]
				]
			}
		],
		'simple-import-sort/exports': 'error'
	}
};
