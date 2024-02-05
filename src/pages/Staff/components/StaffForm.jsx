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

const StaffForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="账号编辑"
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
          name="id"
          label="账号"
          rules={[{ required: true, message: '账号必填!' }]}
        />
        <ProFormText
          width="md"
          name="password"
          label="密码"
          rules={[{ required: true, message: '密码必填!' }]}
        />
        <ProFormText
          width="md"
          name="name"
          label="用户名"
          rules={[{ required: true, message: '用户名必填!' }]}
        />
        <ProFormRadio.Group
          name="role"
          label="角色"
          initialValue={true}
          rules={[{ required: true, message: '角色必选!' }]}
          options={[
            {
              label: '管理员',
              value: 'admin',
            },
            {
              label: '员工',
              value: 'staff',
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default StaffForm;
