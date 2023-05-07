import { tick } from 'svelte';

import { render, screen } from '@testing-library/svelte';
import coverageReportResponse from '$lib/tests/apiResponses/coverageReport.json' assert { type: 'JSON' };
import { describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import CoverageReport from '$lib/components/CoverageReport.svelte';

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

afterEach(() => {
	fetchMocker.resetMocks();
});

describe('CoverageReport', () => {
	it('fetches coverage report from the API', () => {
		fetchMocker.mockResponseOnce(JSON.stringify(coverageReportResponse));
	});
});
