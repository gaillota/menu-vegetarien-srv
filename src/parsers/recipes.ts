import * as cheerio from 'cheerio';

import { pageLabelRegex, slugRegex } from "../constants";
import { PaginationResult } from '../types';

function parseRecipesList(
  html,
): Pick<PaginationResult<string>, 'data' | 'pagesCount'> {
  const $ = cheerio.load(html);

  const slugs = [];

  $('div.elementor-posts article').each((_, element) => {
    const $recipe = $(element);
    const url = $recipe
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href');
    const [, slug] = slugRegex.exec(url) || [];

    slugs.push(slug);
  });

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text();
  const [, pagesCountText] =
    pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || [];

  return { data: slugs, pagesCount: Number(pagesCountText) };
}

export default parseRecipesList;
