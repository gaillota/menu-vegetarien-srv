import * as cheerio from 'cheerio';
import * as https from 'https';

// Paginate recipes
// Get on recipe
https
  .get('https://menu-vegetarien.com/recettes/', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    } else if (!/^text\/html/.test(contentType)) {
      error = new Error(
        'Invalid content-type.\n' +
          `Expected text/html but received ${contentType}`,
      );
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      if (!rawData) {
        return;
      }

      const $ = cheerio.load(rawData, {
        normalizeWhitespace: true,
      });

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
        const link = $recipe
          .find('div.elementor-post__text > a.elementor-post__read-more')
          .attr('href');

        const recipe = {
          type,
          photoUrl,
          title,
          description,
          link,
        };

        console.log(JSON.stringify(recipe, null, 2));
      });
    });
  })
  .on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
