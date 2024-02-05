// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */
const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getIPCC(params) {
  let ipccRes = await request(currentEnv + '/support/getipcc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      IPCCType: params.IPCCType,
      IPCC: params.IPCC,
      group: params.group,
    },
  });

  return ipccRes;
}

export async function createIPCC(params) {
  const res = request(currentEnv + '/support/createipcc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      supplierId: params.supplierId,
      GDS: params.GDS,
      IPCCType: params.IPCCType,
      GDSBooking: params.GDSBooking,
      IPCC: params.IPCC,
      startDays: params.startDays,
      endDays: params.endDays,
      group: params.group,
      shoppingApi: params.shoppingApi,
      checkApi: params.checkApi,
      bookingApi: params.bookingApi,
      ticketApi: params.ticketApi,
      changeApi: params.changeApi,
    },
  });

  return res;
}

export async function updateIPCC(params) {
  const res = request(currentEnv + '/support/updateipcc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      GDS: params.GDS,
      IPCCType: params.IPCCType,
      GDSBooking: params.GDSBooking,
      IPCC: params.IPCC,
      startDays: params.startDays,
      endDays: params.endDays,
      shoppingApi: params.shoppingApi,
      checkApi: params.checkApi,
      bookingApi: params.bookingApi,
      ticketApi: params.ticketApi,
      changeApi: params.changeApi,
    },
  });

  return res;
}

export async function deleteIPCC(params) {
  const res = request(currentEnv + '/support/deleteipcc', {
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

export async function syncSellSegment(params) {
  const res = await request(currentEnv + '/support/clearsellfight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      IPCC: params.IPCC,
    },
  });

  if (res.content == true) {
    const res2 = await request(currentEnv + '/support/createsellfight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        IPCC: params.IPCC,
        IPCCType: 'search',
      },
    });
    return res2;
  } else {
    return res;
  }
}

export async function deleteIPCCSegment(params) {
  const res = await request(currentEnv + '/support/deletesegment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _idList: params,
    },
  });

  return true;
}
