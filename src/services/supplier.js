// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */
const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getSupplier(params) {
  let supplierRes = await request(currentEnv + '/support/getsupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      supplierCode: params.supplierCode,
      supplierName: params.supplierName,
      sellSwitch: params.sellSwitch,
      group: params.group,
    },
  });

  return supplierRes;
}

export async function createSupplier(params) {
  const res = request(currentEnv + '/support/createsupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      supplierCode: params.supplierCode,
      supplierName: params.supplierName,
      exchangeType: params.exchangeType,
      settlementCurrency: params.settlementCurrency,
      roundType: params.roundType,
      sellSwitch: params.sellSwitch,
      group: params.group,
    },
  });

  return res;
}

export async function getIPCCBySupplier(params) {
  let supplierRes = await request(currentEnv + '/support/getipccbysupplierid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      supplierId: params.supplierId,
    },
  });
  supplierRes.content.forEach((s) => {
    s.searchIPCC = s.IPCCSearch && s.IPCCSearch.length > 0 ? s.IPCCSearch[0].IPCC : '';
    s.bookIPCC = s.IPCCBooking && s.IPCCBooking.length > 0 ? s.IPCCBooking[0].IPCC : '';
  });
  return supplierRes;
}

export async function updateSupplier(params) {
  const res = request(currentEnv + '/support/updatesupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      supplierCode: params.supplierCode,
      supplierName: params.supplierName,
      exchangeType: params.exchangeType,
      settlementCurrency: params.settlementCurrency,
      roundType: params.roundType,
      sellSwitch: params.sellSwitch,
    },
  });

  return res;
}

export async function deleteSupplier(params) {
  const res = request(currentEnv + '/support/deletesupplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params,
    },
  });

  return res;
}
