// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getVendibility(params) {
  let vendibilityRes = await request(currentEnv + '/support/getvendibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      isVendibility: params.isVendibility ? params.isVendibility === 'true' : '',
      group: params.group,
    },
  });

  return vendibilityRes;
}

export async function createVendibility(params) {
  const res = request(currentEnv + '/support/createvendibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      company: params.company,
      isVendibility: params.isVendibility,
    },
  });

  return res;
}

export async function updateVendibility(params) {
  const res = request(currentEnv + '/support/updatevendibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      isVendibility: params.isVendibility,
    },
  });

  return res;
}

export async function batchUpdateVendibility(params, isVendibility) {
  let updateCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/updatevendibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        _id: p,
        isVendibility: isVendibility,
      },
    });
    if (res.status == true) {
      updateCount++;
    }
  });

  return updateCount == params.key.length ? true : false;
}

export async function deleteVendibility(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deletevendibility', {
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

export async function asyncVendibility(params) {
  const res = request(currentEnv + '/support/vendibility/async', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
    },
  });

  return res;
}
