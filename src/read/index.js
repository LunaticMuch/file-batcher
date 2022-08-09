import { readFile as _readFile } from 'fs';
import { promisify } from 'util';
import matter, { test } from 'gray-matter';
import getPath from '../../helpers/get-path';

const readFile = promisify(_readFile);

/**
 * Reads the contents of a markdown file asynchronously.
 *
 * @param {String} file Where to read the data from
 * @param {Object} options Options for `fs.readFile`
 * @returns {Promise{}}
 */
const read = async (file, options = {}) => {
	const DEFAULTS = { encoding: 'utf8' };
	const path = getPath(file);

	try {
		const rawContents = await readFile(path, { ...DEFAULTS, ...options });
		const isFrontMatter = test(rawContents);

		if (!isFrontMatter) {
			return rawContents;
		}

		const content = matter(rawContents);

		// The `matter.read()` method adds the path to the object, but we're not
		// using it, so let's add it.
		content.path = path;
		delete content.orig;

		return content;
	} catch (error) {
		throw new Error(error);
	}
};

export default read;
