import * as cheerio from 'cheerio';

import { pageLabelRegex, slugRegex } from "../constants";
import { PaginationResult, Recipe } from '../types';
import sha256 from '../utils/sha256';

function parseRecipesList(
  html,
): Pick<PaginationResult<Recipe>, 'data' | 'pagesCount'> {
  const $ = cheerio.load(html);

  const recipes = [];

  $('div.elementor-posts article').each((_, element) => {
    const $recipe = $(element);
    const type = $recipe.find('div.elementor-post__badge').text();
    const photoUrl = $recipe
      .find('div.elementor-post__thumbnail img')
      .attr('src');
    const title = $recipe
      .find('div.elementor-post__text > h3.elementor-post__title')
      .text()
      .replace(/\n/g, '')
      .replace(/\t/g, '');
    const description = $recipe
      .find(
        'div.elementor-post__text > div.elementor-post__excerpt p:first-of-type',
      )
      .text();
    const url = $recipe
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href');
    const id = sha256(title);
    const [, slug] = slugRegex.exec(url) || []

    const recipe = {
      id,
      type,
      title,
      slug,
      description,
      photoUrl,
      url,
    };

    recipes.push(recipe);
  });

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text();
  const [, pagesCountText] =
    pageLabelRegex.exec(pagesCountLabel.toLowerCase()) || [];

  return { data: recipes, pagesCount: Number(pagesCountText) };
}

export default parseRecipesList;
