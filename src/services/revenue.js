// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getRevenue(params) {
  const query = {
    group: params.group,
    carrierType: params.carrierType,
    IPCC: params.IPCC,
  };

  let revenueRes = await request(currentEnv + '/support/getrevenue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: query,
  });

  return revenueRes;
}

export async function createRevenue(params) {
  const res = request(currentEnv + '/support/createrevenue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      carrierType: params.carrierType,
      supplierId: params.supplierId,
      IPCC: params.IPCC,
      revenueType: params.revenueType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}

export async function updateRevenue(params) {
  const res = request(currentEnv + '/support/updaterevenue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      group: params.group,
      IPCC: params.IPCC,
      carrierType: params.carrierType,
      supplierId: params.supplierId,
      revenueType: params.revenueType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}

export async function deleteRevenue(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deleterevenue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        _id: p,
      },
    });
    if (res.status == true) {
      delCount++;
    }
  });

  return delCount == params.key.length ? true : false;
}

export async function copyRevenue(params) {
  let dateStart,
    dateEnd = '';
  if (params.dateRange && params.dateRange.length > 0) {
    dateStart = params.dateRange[0];
    dateEnd = params.dateRange[1];
  }
  const res = request(currentEnv + '/support/createrevenue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      IPCC: params.IPCC,
      carrierType: params.carrierType,
      supplierId: params.supplierId,
      revenueType: params.revenueType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}
