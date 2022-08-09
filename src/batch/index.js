import { lstatSync, renameSync } from 'fs';
import { dirname as _dirname, isAbsolute, join } from 'path';
import update from 'immutability-helper';
import pMap from 'p-map';
import { sync } from 'glob';
import delay from 'delay';
import getPath from '../../helpers/get-path';
import read from '../read';
import remove from '../remove';
import write from '../write';

const isFile = (path) => lstatSync(path).isFile();

/**
 * Takes a glob patterns or an array of paths and asynchronously iterates it
 * over, executing the `onEach` function on every run.
 *
 * @param {String|String[]} input Glob string or an array of file paths.
 * @param {Int|Infinity} limit Limit the concurrent run of the async iterator.
 * @param {Function} onEach A function to execute of each iteration.
 * @returns {Promise}
 */
const batch = async (input, limit = Infinity, onEach) => {
	if (typeof input === 'undefined') {
		return undefined;
	}

	const files = Array.isArray(input)
		? input.map(getPath).filter(isFile)
		: sync(getPath(input)).filter(isFile);
	const options = { concurrency: limit };

	try {
		return pMap(
			files,
			async (file, index) => {
				const dirname = _dirname(file);
				const goods = await read(file);
				const actions = {
					update: (target) => update(goods, target),
					save: async (data, path = file, options) =>
						write(path, data, options),
					remove: async (path = file) => remove(path),
					rename: (newPath, oldPath = file) => {
						newPath = isAbsolute(newPath) ? newPath : join(dirname, newPath);
						renameSync(getPath(oldPath), newPath);
					},
					pMap,
				};

				return typeof onEach === 'function'
					? onEach({ actions, files, goods, index, delay })
					: goods;
			},
			options
		);
	} catch (error) {
		throw new Error(error);
	}
};

export default batch;
