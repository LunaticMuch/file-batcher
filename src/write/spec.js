import fs from 'jest-plugin-fs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { path as mockPath, markdown } from '../../fixtures/shapes';
import write from './index.js';

jest.mock('fs', () => require('jest-plugin-fs/mock'));

const FRONT_MATTER_OBJECT = {
	content: 'Hello\n',
	data: {
		title: 'foo',
		description: 'bar',
		categories: ['images', 'birds'],
	},
};

const filePath = join(mockPath, 'foo.md');

describe('write:', () => {
	// Write an empty file.
	beforeEach(() => fs.mock({ [mockPath]: '' }));
	afterEach(() => fs.restore());

	test('should write JSON into a markdown file', async () => {
		await write(filePath, FRONT_MATTER_OBJECT);

		const actual = readFileSync(filePath, 'utf8');
		const expected = markdown;

		expect(actual).toBe(expected);
	});

	test('should write non Front Matter data into file as is', async () => {
		await write(filePath, 'foo');

		const actual = readFileSync(filePath, 'utf8');
		const expected = 'foo';

		expect(actual).toBe(expected);
	});
});
