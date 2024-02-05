import React, { useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProForm,
  ProFormRadio,
  ProFormDigit,
  ProFormDateRangePicker,
  ProFormSwitch,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { Divider } from 'antd';
import { getSupplier } from '@/services/supplier';

const IPCCForm = (props) => {
  return (
    <ModalForm
      title="IPCC编辑"
      initialValues={props.values}
      preserve={false}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          props.setModalVisit(false);
        },
      }}
      visible={props.modalVisit}
      onFinish={props.onFinish}
      style={{
        padding: 24,
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          request={async () => {
            let params = {};
            params.group = JSON.parse(localStorage.currentUser).group;
            const supplierRes = await getSupplier(params);
            let supplierList = [];
            supplierRes.content.forEach((s) => {
              supplierList.push({ label: s.supplierName, value: s.supplierId });
              // supplierObj[s.supplierId] = s.supplierName;
            });
            return supplierList;
          }}
          debounceTime={1000}
          width="md"
          name="supplierId"
          label="供应商名称"
          // disabled="false"
        />

        <ProFormSelect
          valueEnum={{
            search: '查询/订位',
            // booking: '订位',
          }}
          // initialValue="IPCCType"
          width="sm"
          name="IPCCType"
          label="IPCC类型"
          // disabled="false"
        />

        <ProFormSelect
          valueEnum={{
            travelport: 'travelport',
            External: 'External',
          }}
          // initialValue="GDS"
          width="sm"
          name="GDS"
          label="查询渠道"
          // disabled="false"
        />

        <ProFormSelect
          valueEnum={{
            Galileo: 'Galileo',
            External: 'External',
          }}
          // initialValue="GDSBooking"
          width="sm"
          name="GDSBooking"
          label="订位渠道"
          // disabled="false"
        />

        <ProFormText width="sm" name="IPCC" label="IPCC" disabled="" />

        <ProFormDigit
          min={1}
          max={100}
          defaultValue={2}
          label="可预订几天(不含)后机票"
          name="startDays"
        />
        <ProFormDigit min={1} max={120} defaultValue={30} label="可预定结束天数" name="endDays" />

        <ProFormText width="xl" name="shoppingApi" label="查询API地址" disabled="" />
        <ProFormText width="xl" name="checkApi" label="验舱验价API地址" disabled="" />
        <ProFormText width="xl" name="bookingApi" label="生单API地址" disabled="" />
        <ProFormText width="xl" name="ticketApi" label="出票API地址" disabled="" />
        <ProFormText width="xl" name="changeApi" label="退改API地址" disabled="" />
      </ProForm.Group>
    </ModalForm>
  );
};

export default IPCCForm;
