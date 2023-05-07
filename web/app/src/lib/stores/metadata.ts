import { readable } from 'svelte/store';

import { dev } from '$app/environment';
import { PUBLIC_APP_NAME, PUBLIC_APP_VERSION } from '$env/static/public';

import type { Metadata } from '$lib/common/types';

const appName = PUBLIC_APP_NAME || 'gokiburi';
const version = PUBLIC_APP_VERSION || '0.0.0-dev';
const projectUrl = 'https://github.com/michenriksen/gokiburi';

const data: Metadata = {
	appName: appName,
	version: version,
	isDevVersion: version.endsWith('-dev'),
	environment: dev ? 'development' : 'production',
	projectUrl: projectUrl,
	issuesUrl: `${projectUrl}/issues/new`
};

export const metadata = readable<Metadata>(data);
