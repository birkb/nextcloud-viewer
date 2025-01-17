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

import { loadState } from '@nextcloud/initial-state'
import logger from '../services/logger.js'
import Images from '../components/Images.vue'

const enabledPreviewProviders = loadState(appName, 'enabled_preview_providers', [])

const mimes = [
	'image/bmp',
	'image/heic',
	'image/heif',
	'image/jpeg',
	'image/png',
	'image/tiff',
	'image/webp',
	'image/x-xbitmap',
]

// Filter out supported mimes that are _not_
// enabled in the preview API
const filterEnabledMimes = () => {
	return mimes.filter(filter => {
		return enabledPreviewProviders.findIndex(mimeRegex => {
			// Remove leading and trailing slash from string regex
			const regex = new RegExp(mimeRegex.replace(/^\/|\/$/g, ''), 'i')
			return filter.match(regex)
		}) > -1
	})
}

const enabledMimes = filterEnabledMimes()
const ignoredMimes = mimes.filter(x => !enabledMimes.includes(x))
if (ignoredMimes.length > 0) {
	logger.warn('Some mimes were ignored because they are not enabled in the server previews config', { ignoredMimes })
}

export default {
	id: 'images',
	group: 'media',
	mimes: [
		// Gif and svg images does not rely on previews
		'image/gif',
		'image/svg+xml',
		...enabledMimes,
	],
	component: Images,
}
