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
  ProFormDependency,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

import { getSupplier, getIPCCBySupplier } from '@/services/supplier';
import { getGroup } from '@/services/group';

const RevenueForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="加价政策编辑"
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
            // params.group = JSON.parse(localStorage.currentUser).group;
            const groupRes = await getGroup(params);
            let groupList = [];
            groupRes.content.forEach((s) => {
              groupList.push({ label: s.groupCode, value: s.groupCode });
              // supplierObj[s.supplierId] = s.supplierName;
            });
            return groupList;
          }}
          debounceTime={1000}
          width="md"
          name="group"
          label="集团"
          // disabled="false"
        />

        <ProFormSelect
          dependencies={['group']}
          request={async (params) => {
            if (params.group == undefined) {
              return [];
            }
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
        />

        <ProFormSelect
          dependencies={['supplierId']}
          request={async (params) => {
            if (params.supplierId == undefined) {
              return [];
            }
            const supplierRes = await getIPCCBySupplier(params);
            let supplierList = [];
            supplierRes.content.forEach((s) => {
              supplierList.push({ label: s.searchIPCC, value: s.searchIPCC });
              // supplierObj[s.supplierId] = s.supplierName;
            });
            return supplierList;
          }}
          debounceTime={1000}
          width="md"
          name="IPCC"
          label="IPCC"
        />
        <ProFormSelect
          valueEnum={{
            LCC: '廉航',
            FSC: '全服务',
          }}
          initialValue="LCC"
          width="md"
          name="carrierType"
          label="出票航司类型"
          rules={[{ required: true, message: '出票航司类型必选!' }]}
        />

        <ProFormSelect
          valueEnum={{
            fixed: '一口价',
            percent: '扣率',
          }}
          initialValue="fixed"
          width="md"
          name="revenueType"
          label="加价类型"
          rules={[{ required: true, message: '加价类型必选!' }]}
        />
        <ProFormDigit
          width="md"
          name="fixedPrice"
          label="票面一口价(CNY)"
          defaultValue={0}
          value={props.values.fixedPrice}
          // onChange={props.onNumberChange}
        />
        <ProFormDigit
          width="md"
          name="fixedTax"
          label="税费一口价(CNY)"
          defaultValue={0}
          value={props.values.fixedTax}
          // onChange={props.onNumberChange}
        />
        <ProFormDigit
          width="md"
          name="percent"
          label="扣率(%)"
          defaultValue={100}
          value={props.values.percent}
          // onChange={props.onNumberChange}
        />

        <ProFormDigit
          width="md"
          name="trim"
          label="调整值"
          defaultValue={100}
          value={props.values.trim}
          // onChange={props.onNumberChange}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default RevenueForm;
