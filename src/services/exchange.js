// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getExchangeList(params) {
  let exchangeListRes = await request(currentEnv + '/support/exchangelist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency,
    },
  });

  return exchangeListRes;
}
