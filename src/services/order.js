// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const prdServicePath = 'https://www.skywinghub.com';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

const switchStatusDisplay = (val) => {
  let statusDisplay = '';
  switch (val) {
    case 0:
      statusDisplay = '出票中';
      break;
    case 1:
      statusDisplay = '出票成功';
      break;
    case 2:
      statusDisplay = '出票失败';
      break;
    case 10:
      statusDisplay = '改签中';
      break;
    case 11:
      statusDisplay = '改签成功';
      break;
    case 12:
      statusDisplay = '改签失败';
      break;
    case 20:
      statusDisplay = '退票中';
      break;
    case 21:
      statusDisplay = '退票成功';
      break;
    case 22:
      statusDisplay = '退票失败';
      break;
    case 99:
      statusDisplay = '待支付';
      break;
    default:
      statusDisplay = '未知';
      break;
  }
  return statusDisplay;
};

export async function getOrderList(params) {
  if (params.status == 999) {
    params.status = null;
  } else {
    params.status = Number(params.status);
  }

  let orderListRes = await request(currentEnv + '/api/order/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      orderId: params.orderId,
      status: params.status,
      isAdmin: params.role,
      group: params.group,
    },
  });

  orderListRes.content.forEach((o) => {
    o.statusDisplay = switchStatusDisplay(Number(o.status));
  });

  return orderListRes;
}

export async function updateOrder(orderInfo, staffId, value) {
  const opString = switchStatusDisplay(orderInfo.status);
  const res = request(currentEnv + '/api/order/ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      orderInfo,
      staffId,
      opType: `修改订单状态为 ${opString} 操作`,
      value,
    },
  });

  return res;
}

export async function refundOrder(orderInfo, staffId, value) {
  const opString = switchStatusDisplay(orderInfo.status);
  const res = request(currentEnv + '/api/order/refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      orderInfo,
      staffId,
      opType: `修改订单状态为 ${opString} 操作`,
      value,
    },
  });

  return res;
}

export async function getOffLogList(params) {
  let offLogListRes = await request(currentEnv + '/support/offlog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      orderId: params.orderId,
    },
  });

  return offLogListRes;
}

export async function orderChangeMail(orderId, group) {
  let orderChangeMailRes = await request(currentEnv + '/api/order/mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      orderId: orderId,
      group,
    },
  });

  return orderChangeMailRes;
}
