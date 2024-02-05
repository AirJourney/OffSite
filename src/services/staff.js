// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */
const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;


export async function changePassword(body, options) {
  return request(currentEnv + '/support/changePwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getStaff(params) {
  let staffRes = await request(currentEnv + '/support/getstaff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      name: params.name,
      id: params.id,
      role: params.role,
      group: params.group,
    },
  });

  return staffRes;
}

export async function createStaff(params) {
  const res = request(currentEnv + '/support/createstaff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      name: params.name,
      id: params.id,
      password: params.password,
      role: params.role,
      group: params.group,
    },
  });

  return res;
}

export async function updateStaff(params) {
  const res = request(currentEnv + '/support/updatestaff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      name: params.name,
      id: params.id,
      password: params.password,
      role: params.role,
    },
  });

  return res;
}
export async function deleteStaff(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deletestaff', {
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
