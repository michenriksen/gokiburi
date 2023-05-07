import coverageReportResponse from '$lib/tests/apiResponses/coverageReport.json';
import WS from 'jest-websocket-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import ApiService from '$lib/services/api';

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

afterEach(() => {
	fetchMocker.resetMocks();
	WS.clean();
	vi.clearAllMocks();
});

describe('ApiService', () => {
	describe('results', () => {
		it('fetches test results from API', async () => {
			fetchMocker.mockResponseOnce(JSON.stringify([{ uuid: 'deadbeef', pass: true }]));

			const results = await ApiService.results();

			expect(results).not.toBeNull;
			expect(results?.length).toBe(1);

			const result = results?.[0];

			expect(result?.uuid).toBe('deadbeef');
			expect(result?.pass).toBe(true);

			const req = fetchMocker.requests()[0];
			expect(req.url).toBe('/api/results');
			expect(req.method).toBe('GET');
		});

		describe('when there are no test results', () => {
			it('returns null', async () => {
				fetchMocker.mockResponseOnce(JSON.stringify(null));

				const results = await ApiService.results();

				expect(results).toBeNull;
			});
		});
	});

	describe('report', () => {
		it('fetches coverage report from API', async () => {
			fetchMocker.mockResponseOnce(JSON.stringify(coverageReportResponse));

			const report = await ApiService.report('deadbeef');

			expect(report.profiles.length).toBe(1);
			expect(report.profiles[0].path).toBe('/Users/johndoe/src/github.com/johndoe/project/pkg/warpcore/warpcore.go');

			const req = fetchMocker.requests()[0];
			expect(req.url).toBe('/api/results/deadbeef/report');
			expect(req.method).toBe('GET');
		});
	});
});
