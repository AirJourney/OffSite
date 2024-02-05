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

const VendibilityForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="销售航司配置编辑"
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
        <ProFormTextArea
          rows={4}
          width="lg"
          name="company"
          label="可销售航司"
          tooltip="多个航司使用英文逗号隔开"
          rules={[{ required: true, message: '可销售航司必填!' }]}
        />

        <ProFormRadio.Group
          name="isVendibility"
          label="可售状态"
          initialValue={true}
          rules={[{ required: true, message: '可售状态必选!' }]}
          options={[
            {
              label: '可售',
              value: true,
            },
            {
              label: '停售',
              value: false,
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default VendibilityForm;
