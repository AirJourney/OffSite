// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';

// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function createPenalty(params) {
  if (params.penaltyType == 'bothNever') {
    params.refundBeforePercentFWT = 0;
    params.refundAfterPercentFWT = 0;
    params.changeBeforePercentFWT = 0;
    params.changeAfterPercentFWT = 0;

    params.refundBeforePercentBWT = 0;
    params.refundAfterPercentBWT = 0;
    params.changeBeforePercentBWT = 0;
    params.changeAfterPercentBWT = 0;
  } else if (params.penaltyType == 'onlyRefund') {
    params.changeBeforePercentFWT = 0;
    params.changeAfterPercentFWT = 0;

    params.changeBeforePercentBWT = 0;
    params.changeAfterPercentBWT = 0;
  } else if (params.penaltyType == 'onlyChange') {
    params.refundBeforePercentFWT = 0;
    params.refundAfterPercentFWT = 0;

    params.refundBeforePercentBWT = 0;
    params.refundAfterPercentBWT = 0;
  }

  const res = request(currentEnv + '/support/createpenalty', {
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
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      penaltyType: params.penaltyType,
      refundBeforePercentFWT:
        params.refundBeforePercentFWT != undefined ? params.refundBeforePercentFWT : 0,
      refundBeforePercentBWT:
        params.refundBeforePercentBWT != undefined ? params.refundBeforePercentBWT : 0,
      refundAfterPercentFWT:
        params.refundAfterPercentFWT != undefined ? params.refundAfterPercentFWT : 0,
      refundAfterPercentBWT:
        params.refundAfterPercentBWT != undefined ? params.refundAfterPercentBWT : 0,
      changeBeforePercentFWT:
        params.changeBeforePercentFWT != undefined ? params.changeBeforePercentFWT : 0,
      changeBeforePercentBWT:
        params.changeBeforePercentBWT != undefined ? params.changeBeforePercentBWT : 0,
      changeAfterPercentFWT:
        params.changeAfterPercentFWT != undefined ? params.changeAfterPercentFWT : 0,
      changeAfterPercentBWT:
        params.changeAfterPercentBWT != undefined ? params.changeAfterPercentBWT : 0,
      abandonRTPercent: params.flightType == 'RT' ? params.abandonRTPercent : 0,
    },
  });

  return res;
}

export async function getPenalty(params) {
  const query = {
    flightType: params.flightType ? params.flightType : undefined,
    segment: undefined,
    group: params.group,
  };

  if (params.from && params.to) {
    query.segment = `${params.from.toUpperCase()}-${params.to.toUpperCase()}`;
  }

  let penaltyRes = await request(currentEnv + '/support/getpenalty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: query,
  });

  penaltyRes.content.forEach((p) => {
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

    p.FWTDisplay = [];
    p.FWTDisplay.push(p.refundBeforePercentFWT);
    p.FWTDisplay.push(p.refundAfterPercentFWT);
    p.FWTDisplay.push(p.changeBeforePercentFWT);
    p.FWTDisplay.push(p.changeAfterPercentFWT);

    p.BWTDisplay = [];
    p.BWTDisplay.push(p.refundBeforePercentBWT);
    p.BWTDisplay.push(p.refundAfterPercentBWT);
    p.BWTDisplay.push(p.changeBeforePercentBWT);
    p.BWTDisplay.push(p.changeAfterPercentBWT);
  });

  return penaltyRes;
}

export async function updatePenalty(params) {
  if (params.penaltyType == 'bothNever') {
    params.refundBeforePercentFWT = 0;
    params.refundAfterPercentFWT = 0;
    params.changeBeforePercentFWT = 0;
    params.changeAfterPercentFWT = 0;

    params.refundBeforePercentBWT = 0;
    params.refundAfterPercentBWT = 0;
    params.changeBeforePercentBWT = 0;
    params.changeAfterPercentBWT = 0;
  } else if (params.penaltyType == 'onlyRefund') {
    params.changeBeforePercentFWT = 0;
    params.changeAfterPercentFWT = 0;

    params.changeBeforePercentBWT = 0;
    params.changeAfterPercentBWT = 0;
  } else if (params.penaltyType == 'onlyChange') {
    params.refundBeforePercentFWT = 0;
    params.refundAfterPercentFWT = 0;

    params.refundBeforePercentBWT = 0;
    params.refundAfterPercentBWT = 0;
  }

  const res = request(currentEnv + '/support/updatepenalty', {
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
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      penaltyType: params.penaltyType,
      refundBeforePercentFWT:
        params.refundBeforePercentFWT != undefined ? params.refundBeforePercentFWT : 0,
      refundBeforePercentBWT:
        params.refundBeforePercentBWT != undefined ? params.refundBeforePercentBWT : 0,
      refundAfterPercentFWT:
        params.refundAfterPercentFWT != undefined ? params.refundAfterPercentFWT : 0,
      refundAfterPercentBWT:
        params.refundAfterPercentBWT != undefined ? params.refundAfterPercentBWT : 0,
      changeBeforePercentFWT:
        params.changeBeforePercentFWT != undefined ? params.changeBeforePercentFWT : 0,
      changeBeforePercentBWT:
        params.changeBeforePercentBWT != undefined ? params.changeBeforePercentBWT : 0,
      changeAfterPercentFWT:
        params.changeAfterPercentFWT != undefined ? params.changeAfterPercentFWT : 0,
      changeAfterPercentBWT:
        params.changeAfterPercentBWT != undefined ? params.changeAfterPercentBWT : 0,
      abandonRTPercent: params.flightType == 'RT' ? params.abandonRTPercent : 0,
    },
  });

  return res;
}

export async function deletePenalty(params) {
  let delCount = 0;
  params.key.forEach(async (p) => {
    const res = await request(currentEnv + '/support/deletepenalty', {
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

export async function copyPenalty(params) {
  const res = request(currentEnv + '/support/createpenalty', {
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
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      penaltyType: params.penaltyType,
      refundBeforePercentFWT:
        params.refundBeforePercentFWT != undefined ? params.refundBeforePercentFWT : 0,
      refundBeforePercentBWT:
        params.refundBeforePercentBWT != undefined ? params.refundBeforePercentBWT : 0,
      refundAfterPercentFWT:
        params.refundAfterPercentFWT != undefined ? params.refundAfterPercentFWT : 0,
      refundAfterPercentBWT:
        params.refundAfterPercentBWT != undefined ? params.refundAfterPercentBWT : 0,
      changeBeforePercentFWT:
        params.changeBeforePercentFWT != undefined ? params.changeBeforePercentFWT : 0,
      changeBeforePercentBWT:
        params.changeBeforePercentBWT != undefined ? params.changeBeforePercentBWT : 0,
      changeAfterPercentFWT:
        params.changeAfterPercentFWT != undefined ? params.changeAfterPercentFWT : 0,
      changeAfterPercentBWT:
        params.changeAfterPercentBWT != undefined ? params.changeAfterPercentBWT : 0,
      abandonRTPercent: params.flightType == 'RT' ? params.abandonRTPercent : 0,
    },
  });

  return res;
}
