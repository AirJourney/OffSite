// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getProfit(params) {
  const query = {
    company: params.company ? params.company : undefined,
    flightType: params.flightType ? params.flightType : undefined,
    segment: undefined,
    group: params.group,
  };

  if (params.from && params.to) {
    query.segment = `${params.from.toUpperCase()}-${params.to.toUpperCase()}`;
  }

  let profitRes = await request(currentEnv + '/support/getprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: query,
  });

  profitRes.content.forEach((p) => {
    p.from = p.segment.split('-')[0];
    p.to = p.segment.split('-')[1];

    p.numberDisplay = [];
    if (p.number) {
      p.numberDisplay.push(p.number.split('|')[0]);
    } else {
      p.numberDisplay = '-';
    }

    p.companyDisplay = [];
    if (p.company) {
      p.companyDisplay.push(p.company.split('|')[0]);
    } else {
      p.companyDisplay = '-';
    }

    p.cabinDisplay = [];
    if (p.cabin) {
      p.cabinDisplay.push(p.cabin.split('|')[0]);
    } else {
      p.cabinDisplay = '-';
    }

    if (p.flightType == 'RT') {
      p.number ? p.numberDisplay.push(p.number.split('|')[1]) : null;
      p.company ? p.companyDisplay.push(p.company.split('|')[1]) : null;
      p.cabin ? p.cabinDisplay.push(p.cabin.split('|')[1]) : null;
    }
    p.transitDisplay = p.transit == 'true' ? '是' : '否';
  });

  return profitRes;
}

export async function createProfit(params) {
  const res = request(currentEnv + '/support/createprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      flightType: params.flightType,
      segment: `${params.from.toUpperCase()}-${params.to.toUpperCase()}`,
      number: params.number != undefined ? params.number.toUpperCase() : '',
      company: params.company != undefined ? params.company.toUpperCase() : '',
      cabin: params.cabin != undefined ? params.cabin.toUpperCase() : '',
      transit: params.transit,
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      profitType: params.profitType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}

export async function updateProfit(params) {
  const res = request(currentEnv + '/support/updateprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      flightType: params.flightType,
      segment: `${params.from.toUpperCase()}-${params.to.toUpperCase()}`,
      number: params.number,
      company: params.company,
      cabin: params.cabin,
      transit: params.transit,
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      profitType: params.profitType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}

export async function deleteProfit(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deleteprofit', {
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

export async function copyProfit(params) {
  const res = request(currentEnv + '/support/createprofit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      group: params.group,
      flightType: params.flightType,
      segment: `${params.from.toUpperCase()}-${params.to.toUpperCase()}`,
      number: params.number != undefined ? params.number.toUpperCase() : '',
      company: params.company != undefined ? params.company.toUpperCase() : '',
      cabin: params.cabin != undefined ? params.cabin.toUpperCase() : '',
      transit: params.transit,
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      profitType: params.profitType,
      fixedPrice: params.fixedPrice,
      fixedTax: params.fixedTax,
      percent: params.percent,
      trim: params.trim,
    },
  });

  return res;
}
