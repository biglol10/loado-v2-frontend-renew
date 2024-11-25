import { http, HttpResponse } from 'msw';
import { SIMULATION_ITEM_PRICE_DATA } from './testData';

const LOADO_API_URL = process.env.LOADO_API_URL;

const handlers = [
  http.post(`${LOADO_API_URL}/api/loadoPrice/currentMarketItemPRice`, () => {
    return HttpResponse.json(SIMULATION_ITEM_PRICE_DATA);
  }),
];

export default handlers;
