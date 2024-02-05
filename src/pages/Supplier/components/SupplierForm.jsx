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
import { useIntl, FormattedMessage } from 'umi';
import { getIPCC } from '@/services/ipcc';

const SupplierForm = (props) => {
  return (
    <ModalForm
      title="供应商配置编辑"
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
        <ProFormText width="md" name="supplierCode" label="供应商编号" />

        <ProFormText width="md" name="supplierName" label="供应商名称" />

        <ProFormSelect
          valueEnum={{
            GDSExchange: 'GDS汇率',
          }}
          initialValue="GDS"
          width="sm"
          name="exchangeType"
          label="汇率方式"
          // disabled="false"
        />

        <Divider />

        <ProFormText width="md" name="settlementCurrency" label="结算币种" disabled="" />

        <ProFormSelect
          valueEnum={{
            integer: '整数',
            decimal: '两位小数',
          }}
          initialValue="integer"
          width="sm"
          name="roundType"
          label="取整方式"
          disabled=""
        />

        <Divider />
        {/* <ProFormText width="md" name="businessTime" label="投放时间" disabled="true" /> */}
        <ProFormSwitch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          defaultChecked
          width="sm"
          name="sellSwitch"
          label="售卖开关"
        />
        {/* <ProFormCheckbox.Group
          options={plainOptions} defaultValue={['Apple']} onChange={onChange} 
        /> */}
      </ProForm.Group>
    </ModalForm>
  );
};

export default SupplierForm;
