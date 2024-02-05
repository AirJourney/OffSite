// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:7001';
const prdServicePath = 'http://47.243.79.251:80';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getProfit(params) {
  let profitRes = await request(currentEnv + '/support/getprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      from: params.from,
      to: params.to,
      dateStart: params.dateRange[0],
      dateEnd: params.dateRange[1],
    },
  });
  profitRes.content.forEach((p) => {
    const date = moment(p.redisCode.split('-')[0]);
    p.dateDisplay = [];
    p.dateDisplay.push(date.format('YYYY-MM-DD'));
    p.from = p.redisCode.split('-')[1];
    p.to = p.redisCode.split('-')[2];
    p.numberDisplay = [];
    p.segmentDecoderResult.segmentTranslateList.forEach((s) => {
      p.numberDisplay.push(s.flightNumber);
    });
    p.settlementPrice =
      p.priceDecoderResultList[0].price + p.priceDecoderResultList[0].taxFeeAmount;
  });

  const { number } = params;
  if (number && profitRes.content.filter((p) => p.numberDisplay.includes(number)).length > 0) {
    profitRes.content = profitRes.content.filter((p) => p.numberDisplay.includes(number));
  }

  return profitRes;
}

export async function getDefaultProfit(params) {
  let profitRes = await request(currentEnv + '/support/defaultprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { company: params },
  });

  return profitRes;
}

export async function editProfit(params) {
  if (params.dateDisplay.length == 1) {
    const date = params.dateDisplay[0];
    params.dateDisplay = [];
    params.dateDisplay.push(date);
    params.dateDisplay.push(date);
  }

  const res = request(currentEnv + '/support/updateprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      segment: params.from + params.to,
      number: params.number ? params.number : '',
      commition: params.commition,
      profit: params.profit,
      date: params.dateDisplay,
      _id: params._id,
    },
  });

  return res;
}

export async function editDefaultProfit(params) {
  const res = request(currentEnv + '/support/updatedefaultprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      commition: params.commition,
      profit: params.profit,
      company: params.company,
    },
  });

  return res;
}
