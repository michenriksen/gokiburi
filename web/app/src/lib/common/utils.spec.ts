import { escapeHtml, formatBytes, formatDuration, pluralize, sortByTime, truncateFilepath } from './utils';
import { describe, expect, it } from 'vitest';

describe('escapeHtml', () => {
	it('escapes special HTML characters', () => {
		expect(escapeHtml(`&<>"'/`)).toEqual(`&amp;&lt;&gt;&quot;&#39;&#x2F;`);
		expect(escapeHtml(`<script>alert('xss')</script>`)).toEqual(
			`&lt;script&gt;alert(&#39;xss&#39;)&lt;&#x2F;script&gt;`
		);
		expect(escapeHtml(`Hello\n<strong>World!</strong>`)).toEqual(`Hello\n&lt;strong&gt;World!&lt;&#x2F;strong&gt;`);
	});
});

describe('formatDuration', () => {
	it('formats nanoseconds to human readable format', () => {
		expect(formatDuration(92_000_000_000)).toEqual('1m32s');
		expect(formatDuration(16_000_000_000)).toEqual('16s');
		expect(formatDuration(8_000_000)).toEqual('8ms');
	});
});

describe('pluralize', () => {
	it('pluralizes a word correctly from a number', () => {
		expect(pluralize(-1, 'test', 'tests')).toEqual('-1 tests');
		expect(pluralize(0, 'test', 'tests')).toEqual('0 tests');
		expect(pluralize(1, 'test', 'tests')).toEqual('1 test');
		expect(pluralize(2, 'test', 'tests')).toEqual('2 tests');
	});
});

describe('sortByTime', () => {
	it('sorts an array of timestamped objects by time in ascending order', () => {
		const objs = [
			{ time: '2023-04-08T17:20:18.605327' },
			{ time: '2023-04-08T17:20:17.605327' },
			{ time: '2023-04-07T17:20:18.605327' }
		];

		const sorted = objs.sort(sortByTime);

		expect(sorted[0].time).toEqual('2023-04-07T17:20:18.605327');
		expect(sorted[1].time).toEqual('2023-04-08T17:20:17.605327');
		expect(sorted[2].time).toEqual('2023-04-08T17:20:18.605327');
	});
});

describe('formatBytes', () => {
	it('formats bytes as human-readable text', () => {
		expect(formatBytes(0)).toEqual('0 B');
		expect(formatBytes(500)).toEqual('500 B');
		expect(formatBytes(1024)).toEqual('1.0 KiB');
		expect(formatBytes(1024 * 1024)).toEqual('1.0 MiB');
		expect(formatBytes(1_572_864)).toEqual('1.5 MiB');
	});
});

describe('truncateFilepath', () => {
	it('truncates a filepath to a maximum length', () => {
		const tt = [
			{
				s: 'github.com/johndoe/project/warpcore/breach.go',
				l: 40,
				want: 'github.com/john…roject/warpcore/breach.go'
			},
			{
				s: 'github.com/johndoe/project/main.go',
				l: 40,
				want: 'github.com/johndoe/project/main.go'
			},
			{
				s: 'github.com/johndoe/project/main.go',
				l: 0,
				want: 'github.com/johndoe/project/main.go'
			},
			{
				s: 'github.com/johndoe/project/main.go',
				l: -1,
				want: 'github.com/johndoe/project/main.go'
			}
		];

		for (const tc of tt) {
			expect(truncateFilepath(tc.s, tc.l)).toEqual(tc.want);
		}
	});
});
