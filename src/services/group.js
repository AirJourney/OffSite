// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */
const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getGroup(params) {
  let groupRes = await request(currentEnv + '/support/getgroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      groupName: params.groupName,
      groupCode: params.groupCode,
    },
  });

  return groupRes;
}

export async function createGroup(params) {
  const res = request(currentEnv + '/support/creategroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      groupName: params.groupName,
      groupCode: params.groupCode,
    },
  });

  return res;
}

export async function updateGroup(params) {
  const res = request(currentEnv + '/support/updategroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      groupName: params.groupName,
      groupCode: params.groupCode,
    },
  });

  return res;
}
