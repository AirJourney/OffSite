// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getBillList(params) {
  let billListRes = await request(currentEnv + '/support/getbill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      mktportal: params.mktportal, // 区分多渠道使用
      group: params.group, // 区分多供应商订单使用
      dateRange: params.dateRange,
      status: [1],
    },
  });

  // billListRes.content.forEach((o) => {
  //   o.statusDisplay = switchStatusDisplay(Number(o.status));
  // });

  return billListRes;
}
