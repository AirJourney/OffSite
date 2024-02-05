// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getProhibition(params) {
  let prohibitionRes = await request(currentEnv + '/support/getprohibition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      tripType: params.tripType ? params.tripType : '',
      depart: params.depart ? params.depart : '',
      arrival: params.arrival ? params.arrival : '',
      isProhibition: params.isProhibition ? params.isProhibition === 'true' : '',
      group: params.group,
    },
  });

  return prohibitionRes;
}

export async function createProhibition(params) {
  const res = request(currentEnv + '/support/createprohibition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      company: params.company,
      segmentList: params.segmentList,
      isProhibition: params.isProhibition,
    },
  });

  return res;
}

export async function updateProhibition(params) {
  const res = request(currentEnv + '/support/updateprohibition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      isProhibition: params.isProhibition,
    },
  });

  return res;
}

export async function batchUpdateProhibition(params, isProhibition) {
  let updateCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/updateprohibition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        _id: p,
        isProhibition: isProhibition,
      },
    });
    if (res.status == true) {
      updateCount++;
    }
  });

  return updateCount == params.key.length ? true : false;
}

export async function deleteProhibition(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deleteprohibition', {
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

export async function asyncProhibition(params) {
  const res = request(currentEnv + '/support/prohibition/async', {
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
