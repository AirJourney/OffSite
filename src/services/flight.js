// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.skywinghub.com';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getFlightList(params) {
  let tripSearch = [];
  if (params.flightType === 'RT') {
    tripSearch = [
      {
        depart: params.depart,
        arrive: params.arrive,
        departTime: params.dateRange[0],
      },
      {
        depart: params.arrive,
        arrive: params.depart,
        departTime: params.dateRange[1],
      },
    ];
  } else {
    tripSearch = [
      {
        depart: params.depart,
        arrive: params.arrive,
        departTime: moment(params.dateRange[0]).format('YYYY-MM-DD'),
      },
    ];
  }

  let exchangeListRes = await request(currentEnv + '/website/switch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://www.mollytrip.com',
    },
    data: {
      locale: 'TW',
      language: 'tc',
      flightType: params.flightType,
      currency: params.currency,
      passenger: [
        { name: 'Adult', count: params.adult, flag: 'ADT' },
        { name: 'Children', count: params.child, flag: 'CHD' },
        { name: 'Infants', count: params.inf, flag: 'INF' },
      ],
      tripSearch: tripSearch,
      cabinType: params.cabinType,
    },
  });

  return exchangeListRes;
}
