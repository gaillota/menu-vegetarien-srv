import * as cheerio from 'cheerio'

import { pageLabelRegex } from '../constants'

function parsePagesNumber(
	html:string
): number {
	const $ = cheerio.load(html)
	
	const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
	.last()
	.text()
	const [, pagesCountText] =
		pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || []

	return Number(pagesCountText)
}

export default parsePagesNumber