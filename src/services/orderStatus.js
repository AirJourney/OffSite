// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.skywinghub.com';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getOrderStatus(params) {
  let orderStatusRes = await request(currentEnv + '/support/orderwatcher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      OrderBeginDateTime: params.dateRange[0],
      OrderEndDateTime: params.dateRange[1],
    },
  });

  return orderStatusRes;
}

export async function editIssue(params) {
  const res = request(currentEnv + '/support/saveissue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      billId: params.billId,
      desc: params.desc,
    },
  });

  return res;
}
