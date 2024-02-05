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
import { useIntl, FormattedMessage } from 'umi';

const SupplierForm = (props) => {
  return (
    <ModalForm
      title="供应商运营编辑"
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
        <ProFormText width="md" name="supplierCode" label="供应商编号" disabled="true" />

        <ProFormText width="md" name="supplierName" label="供应商名称" disabled="true" />

        <ProFormSelect
          valueEnum={{
            GDS: 'GDS',
          }}
          initialValue="GDS"
          width="sm"
          name="exchangeType"
          label="汇率方式"
          disabled="true"
        />
        <ProFormSelect
          valueEnum={{
            travelport: 'travelport',
          }}
          initialValue="travelport"
          width="sm"
          name="gdsType"
          label="GDS"
          disabled="true"
        />
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
