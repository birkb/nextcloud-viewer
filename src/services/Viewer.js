/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Images from '../models/images.js'
import Videos from '../models/videos.js'
import Audios from '../models/audios.js'

export default class Viewer {

	_state
	_mimetypes

	constructor() {
		this._mimetypes = []
		this._state = {}
		this._state.file = ''
		this._state.files = []
		this._state.loadMore = () => ([])
		this._state.onPrev = () => {}
		this._state.onNext = () => {}
		this._state.onClose = () => {}
		this._state.canLoop = true
		this._state.el = null
		this._state.handlers = []

		// ! built-in handlers
		this.registerHandler(Images)
		this.registerHandler(Videos)
		this.registerHandler(Audios)

		console.debug('OCA.Viewer initialized')
	}

	/**
	 * Return the registered handlers
	 *
	 * @readonly
	 * @memberof Viewer
	 */
	get availableHandlers() {
		return this._state.handlers
	}

	/**
	 * Register a new handler
	 *
	 * @memberof Viewer
	 * @param {object} handler a new unregistered handler
	 */
	registerHandler(handler) {
		this._state.handlers.push(handler)
		this._mimetypes.push.apply(this._mimetypes, handler.mimes)
	}

	/**
	 * Get the current opened file
	 *
	 * @memberof Viewer
	 * @return {string} the currently opened file
	 */
	get file() {
		return this._state.file
	}

	/**
	 * Get the current files list
	 *
	 * @memberof Viewer
	 * @return {object[]} the currently opened file
	 */
	get files() {
		return this._state.files
	}

	/**
	 * Get the element to render the current file in
	 *
	 * @memberof Viewer
	 * @return {string} selector of the element
	 */
	get el() {
		return this._state.el
	}

	/**
	 * Get the supported mimetypes that can be opened with the viewer
	 *
	 * @memberof Viewer
	 * @return {Array} list of mimetype strings that the viewer can open
	 */
	get mimetypes() {
		return this._mimetypes
	}

	/**
	 * Return the method provided to fetch more results
	 *
	 * @memberof Viewer
	 * @return {Function}
	 */
	get loadMore() {
		return this._state.loadMore
	}

	/**
	 * Get the method to run on previous navigation
	 *
	 * @memberof Viewer
	 * @return {Function}
	 */
	get onPrev() {
		return this._state.onPrev
	}

	/**
	 * Get the method to run on next navigation
	 *
	 * @memberof Viewer
	 * @return {Function}
	 */
	get onNext() {
		return this._state.onNext
	}

	/**
	 * Get the method to run on viewer close
	 *
	 * @memberof Viewer
	 * @return {Function}
	 */
	get onClose() {
		return this._state.onClose
	}

	/**
	 * Is looping over the provided list allowed?
	 *
	 * @memberof Viewer
	 * @return {boolean}
	 */
	get canLoop() {
		return this._state.canLoop
	}

	/**
	 * Set element to open viewer in
	 *
	 * @memberof Viewer
	 * @param {string} el selector of the element to render the file in
	 */
	setRootElement(el = null) {
		if (this._state.file) {
			throw new Error('Please set root element before calling Viewer.open().')
		}
		this._state.el = el
	}

	/**
	 * Open the path into the viewer
	 *
	 * @memberof Viewer
	 * @param {object} options Options for opening the viewer
	 * @param {string} options.path path of the file to open
	 * @param {object[]} [options.list] the list of files as objects (fileinfo) format
	 * @param {Function} options.loadMore callback for loading more files
	 * @param {boolean} options.canLoop can the viewer loop over the array
	 * @param {Function} options.onPrev callback when navigating back to previous file
	 * @param {Function} options.onNext callback when navigation forward to next file
	 * @param {Function} options.onClose callback when closing the viewer
	 */
	open({ path, list = [], loadMore = () => ([]), canLoop = true, onPrev = () => {}, onNext = () => {}, onClose = () => {} } = {}) {
		if (typeof arguments[0] === 'string') {
			throw new Error('Opening the viewer with a single string parameter is deprecated. Please use a destructuring object instead', `OCA.Viewer.open({ path: '${path}' })`)
		}

		if (!path.startsWith('/')) {
			throw new Error('Please use an absolute path')
		}

		if (!Array.isArray(list)) {
			throw new Error('The files list must be an array')
		}

		if (typeof loadMore !== 'function') {
			throw new Error('The loadMore method must be a function')
		}

		this._state.file = path
		if (!this._state.el) {
			this._state.files = list
			this._state.loadMore = loadMore
			this._state.onPrev = onPrev
			this._state.onNext = onNext
			this._state.onClose = onClose
			this._state.canLoop = canLoop
		}
	}

	/**
	 * Close the opened file
	 *
	 * @memberof Viewer
	 */
	close() {
		this._state.file = ''
		this._state.files = []
		this._state.canLoop = true
		this._state.loadMore = () => ([])
	}

}
