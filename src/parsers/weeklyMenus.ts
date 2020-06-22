import * as cheerio from 'cheerio';

import execRegex from "../utils/regex";

const dateRegex = /(.*)Semaine du (.*)\.+/;
const pageLabelRegex = /Page(\d+)/;

function parseWeeklyMenus(html) {
  const $ = cheerio.load(html);

  const menus = [];

  $('div.elementor-posts article').each((_, element) => {
    const $menu = $(element);
    const photoUrl = $menu
      .find('div.elementor-post__thumbnail img')
      .attr('src');
    const title = $menu
      .find('div.elementor-post__text > h3.elementor-post__title')
      .text()
      .replace(/\n/g, '')
      .replace(/\t/g, '');
    const description = $menu
      .find(
        'div.elementor-post__text > div.elementor-post__excerpt p:first-of-type',
      )
      .text();
    const url = $menu
      .find('div.elementor-post__text > a.elementor-post__read-more')
      .attr('href');
    const date = execRegex(dateRegex, title);

    const recipe = {
      title,
      description,
      photoUrl,
      url,
      date,
    };

    menus.push(recipe);
  });

  const pagesCountLabel = $('nav.elementor-pagination a.page-numbers')
    .last()
    .text();
  const pagesCount = execRegex(pageLabelRegex, pagesCountLabel);

  return { menus, pagesCount };
}

export default parseWeeklyMenus;
