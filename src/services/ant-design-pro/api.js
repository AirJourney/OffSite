// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

const devServicePath = 'http://localhost:80';
const prdServicePath = 'https://www.skywinghub.com';
// const currentEnv = devServicePath;
const currentEnv = prdServicePath;

export async function currentUser(options) {
  return localStorage.getItem('currentUser');
}
/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(options) {
  return localStorage.removeItem('currentUser');
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return request(currentEnv + '/support/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 GET /api/notices */

export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取规则列表 GET /api/rule */

export async function rule(params, options) {
  return request('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建规则 PUT /api/rule */

export async function updateRule(options) {
  return request('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建规则 POST /api/rule */

export async function addRule(options) {
  return request('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return request('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
