import { http, HttpResponse } from 'msw';
import { CATEGORY_44410_DATA } from './testData';

const LOADO_API_URL = process.env.LOADO_API_URL;

const handlers = [
  http.get(
    `${LOADO_API_URL}/api/loadoPrice/getMarketPriceByCategoryCode?categoryCode=44410&timeValue=2024-11-19`,
    () => {
      return HttpResponse.json(CATEGORY_44410_DATA);
    }
  ),
];

export default handlers;
