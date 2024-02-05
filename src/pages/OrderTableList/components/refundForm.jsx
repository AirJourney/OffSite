import React from 'react';
import { Result, Descriptions, Divider } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ModalForm,
} from '@ant-design/pro-form';
import { CheckCard } from '@ant-design/pro-components';
const RefundForm = (props) => {
  return (
    <ModalForm
      initialValues={props.values}
      destroyOnClose
      preserve={false}
      // onFieldsChange={(_, allFields) => {
      //   console.log(allFields);
      // }}
      onFinish={props.onFinish}
      onVisibleChange={props.onVisibleChange}
      title={'退票'}
      drawerProps={{
        destroyOnClose: true,
      }}
      width={900}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      visible={props.refundModalVisible}
    >
      <br />

      <CheckCard.Group style={{ width: '100%' }}>
        {props.values.passengerList
          ? props.values.passengerList.map((psg, i) => {
              if (psg.isRefund == true) {
                return;
              }
              return (
                <CheckCard
                  title={`乘客信息${i + 1}`}
                  description={
                    <div>
                      <p>{`姓名: ${psg.surName}/${psg.givenName} `}</p>
                      <p>{`证件号:${psg.cardNo}`}</p>
                      <p>{`票种:${psg.travelerType}`}</p>
                      <p>{`票号:${psg.ticketNumber ? psg.ticketNumber : ''}`}</p>
                      <p>{`航司编号:${psg.companyNumber ? psg.companyNumber : ''}`}</p>
                      <p>{`PNR:${psg.pnr ? psg.pnr : ''}`}</p>
                    </div>
                  }
                  value={psg.passengerId}
                  defaultChecked={psg.isRefund}
                  onChange={(e) => {
                    psg.isRefund = e;
                    props.onCheckChange(psg);
                  }}
                ></CheckCard>
              );
            })
          : null}
      </CheckCard.Group>
      <Divider />
      <ProFormSelect
        // defaultValue={props.status}
        width="sm"
        name="statusDisplay"
        label="订单状态"
        rules={[{ required: true, message: '订单状态必填!' }]}
        onChange={props.onStatusChange} //  99未支付；0:已支付出票中/ 1:出票成功/ 2:出票失败/ 10:改签中/ 11:改签成功/ 12:改签失败/ 20:退票中/ 21:退票成功/ 22:退票失败
        valueEnum={{
          0: '出票中',
          1: '出票成功',
          2: '出票失败',
          10: '改签中',
          11: '改签成功',
          12: '改签失败',
          20: '退票中',
          21: '退票成功',
          22: '退票失败',
        }}
      />
      {/* <Switch
        checkedChildren="出票成功"
        unCheckedChildren="出票失败"
        defaultChecked
        onChange={props.onSwitchChange}
      /> */}
    </ModalForm>
  );
};

export default RefundForm;
