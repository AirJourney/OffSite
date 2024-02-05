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

const SegmentForm = (props) => {
  return (
    <ModalForm
      title="航线编辑"
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
        padding: 16,
      }}
    >
      <ProForm.Group>
        <ProFormText width="sm" name="IPCC" label="IPCC" disabled="true" />

        <ProFormSelect
          valueEnum={{
            Global: '全球',
            Continent: '洲',
            Country: '国家',
            City: '城市',
          }}
          width="sm"
          name="departType"
          label="出发类型"
        />

        <ProFormSelect
          valueEnum={{
            Global: '全球',
            Continent: '洲',
            Country: '国家',
            City: '城市',
          }}
          width="sm"
          name="arrivalType"
          label="到达类型"
        />

        <ProFormText width="sm" name="depart" label="出发" />
        <ProFormText width="sm" name="arrival" label="到达" />

        <ProFormSelect
          valueEnum={{
            OW: '单程',
            RT: '往返',
            ALL: '全部',
          }}
          width="sm"
          name="tripType"
          label="航程类型"
        />

        <ProFormDigit
          min={1}
          max={100}
          defaultValue={2}
          label="可预订几天(不含)后机票"
          name="startDays"
        />
        <ProFormDigit min={1} max={120} defaultValue={30} label="可预定结束天数" name="endDays" />
        <ProFormText width="sm" name="vendibilityCompanies" label="可售航司" />
        <ProFormText width="sm" name="cabinType" label="可售舱等" />
        <ProFormSelect
          valueEnum={{
            yes: '是',
            no: '否',
          }}
          width="sm"
          name="overWrite"
          label="是否覆盖"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default SegmentForm;
