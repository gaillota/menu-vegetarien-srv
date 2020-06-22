import * as cheerio from 'cheerio';

function parseRecipesList(html) {
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

    const recipe = {
      type,
      title,
      description,
      photoUrl,
      url,
    };

    recipes.push(recipe);
  });

  const pageLabelRegex = /Page(\d+)/;
  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text();
  const [, pagesCount] = pageLabelRegex.exec(pagesCountLabel) || [];

  return { recipes, pagesCount };
}

export default parseRecipesList;
