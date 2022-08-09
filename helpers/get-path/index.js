import { isAbsolute, resolve } from 'path';

/**
 * Gets an absolute path to the current working directory.
 *
 * @param {String} file Path to a file or folder.
 * @returns {String}
 */
function getPath(file) {
	if (!file) return '';

	try {
		return isAbsolute(file) ? file : resolve(process.env.PWD, file);
	} catch (error) {
		throw new Error(error);
	}
}

export default getPath;
