import { request } from 'umi';
import moment from 'moment';

const devServicePath = 'http://localhost:7001';
const prdServicePath = 'https://www.skywinghub.com';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;
// 查询
export async function getBaggageList(params) {
  let exchangeListRes = await request(currentEnv + '/support/getBaggageList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });

  return exchangeListRes;
}
// 新增
export async function addBaggage(params) {
  return await request(currentEnv + '/support/addBaggage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...params,
    },
  });
}
// 修改
export async function updateBaggage(params) {
  return await request(currentEnv + '/support/updateBaggage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...params,
    },
  });
}
// 删除
export async function deleteBaggage(ids) {
  return await request(currentEnv + '/support/deleteBaggage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids,
    },
  });
}
