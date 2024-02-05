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
  ProFormDateRangePicker,
  ProFormDigit,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

import { getSupplier } from '@/services/supplier';

const GroupForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="集团编辑"
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
        <ProFormText
          width="md"
          name="groupCode"
          label="集团编号"
          rules={[{ required: true, message: '集团编号必填!' }]}
        />
        <ProFormText
          width="md"
          name="groupName"
          label="集团名称"
          rules={[{ required: true, message: '集团名称必填!' }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default GroupForm;
