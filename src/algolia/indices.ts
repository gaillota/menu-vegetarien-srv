import algoliasearch from 'algoliasearch';
import { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_RECIPE_INDEX_NAME } from '../env';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
export const recipeIndex = client.initIndex(ALGOLIA_RECIPE_INDEX_NAME);
