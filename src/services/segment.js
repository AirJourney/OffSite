// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import moment from 'moment';
/** 获取当前的用户 GET /api/currentUser */
const devServicePath = 'http://localhost:6001';
const prdServicePath = 'https://www.mollytrip.com:6001';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function getSegment(params) {
  let segmentRes = await request(currentEnv + '/support/getsegment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      depart: params.depart,
      arrival: params.arrival,
      departType: params.departType,
      arrivalType: params.arrivalType,
      tripType: params.tripType,

      IPCCId: params.IPCCId,
      group: params.group,
    },
  });

  return segmentRes;
}

export async function pitchCreateSegment(importList) {
  const res = await request(currentEnv + '/support/importsegment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      importList,
    },
  });
  return res;
}

export async function createSegment(params) {
  const res = await request(currentEnv + '/support/createsegment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      IPCCId: params.IPCCId,
      depart: params.depart,
      arrival: params.arrival,
      departType: params.departType,
      arrivalType: params.arrivalType,
      tripType: params.tripType,
      startDays: params.startDays,
      endDays: params.endDays,
      vendibilityCompanies: params.vendibilityCompanies,
      cabinType: params.cabinType,
      overWrite: params.overWrite,
      group: params.group,
    },
  });

  return res;
}

export async function updateSegment(params) {
  const res = await request(currentEnv + '/support/updatesegment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      _id: params._id,
      depart: params.depart,
      arrival: params.arrival,
      departType: params.departType,
      arrivalType: params.arrivalType,
      tripType: params.tripType,
      startDays: params.startDays,
      endDays: params.endDays,
      cabinType: params.cabinType,
      vendibilityCompanies: params.vendibilityCompanies,
      overWrite: params.overWrite,
    },
  });

  return res;
}

export async function deleteSegment(params) {
  const res = await request(currentEnv + '/support/deletesegment', {
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
