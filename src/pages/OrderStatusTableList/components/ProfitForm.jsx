import React from 'react';
import { Modal, InputNumber } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ModalForm,
  DrawerForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const ProfitForm = (props) => {
  const intl = useIntl();
  return (
    <DrawerForm
      initialValues={props.values}
      destroyOnClose
      preserve={false}
      // onFieldsChange={(_, allFields) => {
      //   console.log(allFields);
      // }}
      onFinish={props.onFinish}
      onVisibleChange={props.onVisibleChange}
      title={intl.formatMessage({
        id: '扣率调整',
        defaultMessage: '扣率调整',
      })}
      drawerProps={{
        destroyOnClose: true,
      }}
      width={560}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      visible={props.updateModalVisible}
    >
      <ProFormText
        width="md"
        name="from"
        label="出发："
        placeholder="请输入三字码"
        rules={[{ required: true, message: '出发必填!' }]}
      />
      <ProFormText
        width="md"
        name="to"
        label="到达："
        placeholder="请输入三字码"
        rules={[{ required: true, message: '到达必填!' }]}
      />
      <ProFormDateRangePicker
        width="md"
        name="dateDisplay"
        label="起飞时间：(可选同一天)"
        rules={[{ required: true, message: '起飞时间必填!' }]}
      />

      <ProFormText width="md" name="number" label="航班号：" placeholder="如：2711" />

      <ProFormText
        width="md"
        name="commition"
        label="返点"
        placeholder="0.01"
        rules={[{ required: true, message: '必填!' }]}
      />
      <ProFormText
        width="md"
        name="profit"
        label="留钱"
        placeholder="正负数"
        rules={[{ required: true, message: '必填!' }]}
      />
    </DrawerForm>
  );
};

export default ProfitForm;
