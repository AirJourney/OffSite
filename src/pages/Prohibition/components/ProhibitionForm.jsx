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
  ProFormList,
  ProFormGroup,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const ProhibitionForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="航线禁售配置编辑"
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
        <ProFormText width="md" name="company" label="航司" tooltip="只能填写一个航司" />

        <ProFormRadio.Group
          name="isProhibition"
          label="禁售状态"
          initialValue={true}
          rules={[{ required: true, message: '禁售状态必选!' }]}
          options={[
            {
              label: '禁售',
              value: true,
            },
            {
              label: '在售',
              value: false,
            },
          ]}
        />
        <ProFormList
          name="segmentList"
          label="禁售航线"
          initialValue={[
            {
              from: '',
              to: '',
            },
          ]}
          copyIconProps={false}
          deleteIconProps={{
            tooltipText: '不需要这行了',
          }}
        >
          <ProFormGroup key="group">
            <ProFormText name="from" label="出发" />
            <ProFormText name="to" label="到达" />
          </ProFormGroup>
        </ProFormList>
      </ProForm.Group>
    </ModalForm>
  );
};

export default ProhibitionForm;
