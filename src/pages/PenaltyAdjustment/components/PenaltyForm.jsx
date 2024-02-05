import React, { useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProForm,
  ProFormRadio,
  ProFormDigit,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const ProfitForm = (props) => {
  const intl = useIntl();

  const [abandonRTPercentDisabled, setAbandonRTPercentDisabled] = useState(true);
  const [refundBeforePercentDisabled, setRefundBeforePercentDisabled] = useState(true);
  const [refundAfterPercentDisabled, setRefundAfterPercentDisabled] = useState(true);
  const [changeBeforePercentDisabled, setChangeBeforePercentDisabled] = useState(true);
  const [changeAfterPercentDisabled, setChangeAfterPercentDisabled] = useState(true);

  return (
    <ModalForm
      title="退改政策编辑"
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
          // onChange={(value) => {
          //   if (value === 'RT') {
          //     setAbandonRTPercentDisabled(false);
          //     setRefundBeforePercentDisabled(false);
          //     setRefundAfterPercentDisabled(false);
          //     setChangeBeforePercentDisabled(false);
          //     setChangeAfterPercentDisabled(false);
          //   } else {
          //     setAbandonRTPercentDisabled(true);
          //     setRefundBeforePercentDisabled(true);
          //     setRefundAfterPercentDisabled(true);
          //     setChangeBeforePercentDisabled(true);
          //     setChangeAfterPercentDisabled(true);
          //   }
          // }}
        />
        <ProFormRadio.Group
          name="penaltyType"
          label="退改类型"
          initialValue="bothNever"
          rules={[{ required: true, message: '退改类型必选!' }]}
          options={[
            {
              label: '不退不改',
              value: 'bothNever',
            },
            {
              label: '可退可改',
              value: 'both',
            },
            {
              label: '仅可退',
              value: 'onlyRefund',
            },
            {
              label: '仅可改',
              value: 'onlyChange',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="from"
          label="出发"
          tooltip="请输入三字码,全局请填Global"
          rules={[{ required: true, message: '出发必填!' }]}
        />
        <ProFormText
          width="md"
          name="to"
          label="到达"
          tooltip="请输入三字码,全局请填Global"
          rules={[{ required: true, message: '到达必填!' }]}
        />
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
          width="md"
          name="company"
          label="航司"
          tooltip="例如: 输入MU,多航司适用,隔开"
          // placeholder="单程输入MU ; 往返输入MU|MU"
        />
        <ProFormText
          width="md"
          name="number"
          label="航班号"
          tooltip="例如: 输入2711,多航班适用,隔开"
          // placeholder="单程输入2711 ; 往返输入2711|2710"
        />
        <ProFormText
          width="md"
          name="cabin"
          label="舱等"
          tooltip="例如: 经济舱输入E,多舱等适用,隔开"
          // placeholder="单程输入Y ; 往返输入Y|U"
        />

        <ProFormDigit
          label="去程起飞前退票(%)"
          tooltip="占票面价的比例"
          name="refundBeforePercentFWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={refundBeforePercentDisabled}
        />
        <ProFormDigit
          label="去程起飞后退票(%)"
          tooltip="占票面价的比例"
          name="refundAfterPercentFWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={refundAfterPercentDisabled}
        />

        <ProFormDigit
          label="去程起飞前改签(%)"
          tooltip="占票面价的比例"
          name="changeBeforePercentFWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={changeBeforePercentDisabled}
        />
        <ProFormDigit
          label="去程起飞后改签(%)"
          tooltip="占票面价的比例"
          name="changeAfterPercentFWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={changeAfterPercentDisabled}
        />

        <ProFormDigit
          label="返程起飞前退票(%)"
          tooltip="占票面价的比例"
          name="refundBeforePercentBWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={refundBeforePercentDisabled}
        />
        <ProFormDigit
          label="返程起飞后退票(%)"
          tooltip="占票面价的比例"
          name="refundAfterPercentBWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={refundAfterPercentDisabled}
        />

        <ProFormDigit
          label="返程起飞前改签(%)"
          tooltip="占票面价的比例"
          name="changeBeforePercentBWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={changeBeforePercentDisabled}
        />
        <ProFormDigit
          label="返程起飞后改签(%)"
          tooltip="占票面价的比例"
          name="changeAfterPercentBWT"
          width="md"
          min={1}
          max={100}
          placeholder="占票面价的比例"
          // disabled={changeAfterPercentDisabled}
        />
        <ProFormDigit
          label="弃程退票(%)"
          tooltip="该航段未使用时，退票所需的金额占往返总票面价的比例"
          name="abandonRTPercent"
          width="md"
          min={1}
          max={100}
          placeholder="占往返总票面价的比例"
          // disabled={abandonRTPercentDisabled}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default ProfitForm;
