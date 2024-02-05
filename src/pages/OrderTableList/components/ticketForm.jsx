import React from 'react';
import { Input, Descriptions, Divider } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ModalForm,
  DrawerForm,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const TicketForm = (props) => {
  const intl = useIntl();
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
      title={intl.formatMessage({
        id: '填写票号',
        defaultMessage: '填写票号',
      })}
      drawerProps={{
        destroyOnClose: true,
      }}
      width={800}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      visible={props.updateModalVisible}
    >
      <br />
      {props.values.passengerList
        ? props.values.passengerList.map((psg, i) => {
            return (
              <div>
                <Descriptions title={`乘客信息${i + 1}`}>
                  <Descriptions.Item label="givenName">{psg.givenName}</Descriptions.Item>
                  <Descriptions.Item label="surName">{psg.surName}</Descriptions.Item>

                  <Descriptions.Item label="证件类型">{psg.cardType}</Descriptions.Item>
                  <Descriptions.Item label="证件号">{psg.cardNo}</Descriptions.Item>

                  <Descriptions.Item label="票种">{psg.travelerType}</Descriptions.Item>
                </Descriptions>
                {/* <br /> */}
                <ProForm.Group>
                  <ProFormText
                    width="sm"
                    name={`${psg.passengerId}-ticketNumber`}
                    value={psg.ticketNumber}
                    label="票号"
                    placeholder="请输入票号"
                  />

                  <ProFormText
                    width="sm"
                    name={`${psg.passengerId}-companyNumber`}
                    value={psg.companyNumber}
                    label="航司编号"
                    placeholder="请输入航司编号"
                  />
                  <ProFormText
                    width="sm"
                    name={`${psg.passengerId}-pnr`}
                    value={psg.pnr}
                    label="PNR"
                    placeholder="请输入PNR"
                  />
                </ProForm.Group>
              </div>
            );
          })
        : null}
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

export default TicketForm;
