import * as flow from "lodash/fp/flow";
import * as get from "lodash/fp/get";
import parseMenu from "../parsers/menu";
import { Menu } from "../types";
import { api } from "../api";
import { translateDateString } from "./utils";
import { dateToTimestamp } from "../utils";

async function getMenu(slug: string): Promise<Menu> {
  const result = await api(`/${slug}`)
  const parsedMenu = parseMenu(result)
  return {
    ...parsedMenu,
    slug,
    dateTimestamp: flow(
      get('date'),
      translateDateString,
      dateToTimestamp,
    )(parsedMenu),
  }
}

export default getMenu
