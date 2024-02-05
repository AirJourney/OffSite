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

const ProfitForm = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={props.values}
      title="价格政策编辑"
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
          valueEnum={{
            OW: '单程',
            RT: '往返',
          }}
          initialValue="OW"
          width="sm"
          name="flightType"
          label="适用行程类型"
          rules={[{ required: true, message: '行程类型必选!' }]}
        />
        <ProFormText
          // width="md"
          name="from"
          label="出发"
          tooltip="请输入三字码,全局请填Global"
          rules={[{ required: true, message: '出发必填!' }]}
        />
        <ProFormText
          // width="md"
          name="to"
          label="到达"
          tooltip="请输入三字码,全局请填Global"
          rules={[{ required: true, message: '到达必填!' }]}
        />
        {/* <ProFormDateRangePicker
          name="dateRange"
          label="旅行时间段"
          width="xl"
          rules={[{ required: true, message: '旅行时间段必填!' }]}
        /> */}
        <ProFormText
          // width="sm"
          name="dateStart"
          label="销售开始日期距离起飞时间"
          tooltip="例如: 输入2"
        />
        <ProFormText
          // width="sm"
          name="dateEnd"
          label="销售结束日期距离起飞时间"
          tooltip="例如: 输入10"
        />
        <ProFormText
          // width="sm"
          name="company"
          label="航司"
          tooltip="例如: 输入MU,多航司适用,隔开"
          // placeholder="单程输入MU ; 往返输入MU|MU"
        />
        <ProFormText
          // width="sm"
          name="number"
          label="航班号"
          tooltip="例如: 输入2711,多航班适用,隔开"
          // placeholder="单程输入2711 ; 往返输入2711|2710"
        />
        <ProFormText
          // width="sm"
          name="cabin"
          label="舱等"
          tooltip="例如: 经济舱输入E,多舱等适用,隔开"
          // placeholder="单程输入Y ; 往返输入Y|U"
        />
        <ProFormSelect
          valueEnum={{
            true: '是',
            false: '否',
          }}
          initialValue="false"
          width="md"
          name="transit"
          label="是否中转航线"
          rules={[{ required: true, message: '是否中转航线必选!' }]}
        />
        <ProFormSelect
          valueEnum={{
            fixed: '一口价',
            percent: '扣率',
          }}
          initialValue="fixed"
          width="md"
          name="profitType"
          label="价格政策类型"
          rules={[{ required: true, message: '价格政策类型必选!' }]}
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

export default ProfitForm;
