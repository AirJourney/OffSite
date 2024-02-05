import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProForm,
  ProFormGroup,
  ProFormRadio,
  ProFormDigit,
  ProFormDateRangePicker,
  ProFormSwitch,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import { InputNumber, Divider } from 'antd';
import { getFlightList } from '@/services/flight';
import ReactJson from 'react-json-view';
import moment from 'moment';

const TableList = () => {
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
    {
      title: <FormattedMessage id="flightType" defaultMessage="行程类型" />,
      dataIndex: 'flightType',
      valueEnum: {
        OW: {
          text: <FormattedMessage id="OW" defaultMessage="单程" />,
        },
        RT: {
          text: <FormattedMessage id="RT" defaultMessage="往返" />,
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="depart" defaultMessage="出发" />,
      dataIndex: 'depart',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="arrive" defaultMessage="到达" />,
      dataIndex: 'arrive',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="dateRange" defaultMessage="旅行时间段" />,
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      initialValue: [moment(), moment().add(1, 'day')],
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="adult" defaultMessage="成人数" />,
      dataIndex: 'adult',
      hideInTable: true,
      render: () => {
        return <InputNumber min={1} max={9} defaultValue={1} />;
      },
    },
    {
      title: <FormattedMessage id="child" defaultMessage="儿童数" />,
      dataIndex: 'child',
      hideInTable: true,
      render: () => {
        return <InputNumber min={0} max={9} defaultValue={0} />;
      },
    },
    {
      title: <FormattedMessage id="inf" defaultMessage="婴儿数" />,
      dataIndex: 'inf',
      hideInTable: true,
      render: () => {
        return <InputNumber min={0} max={9} defaultValue={0} />;
      },
    },
    {
      title: <FormattedMessage id="cabinType" defaultMessage="舱位" />,
      dataIndex: 'cabinType',
      valueEnum: {
        E: {
          text: <FormattedMessage id="E" defaultMessage="经济舱" />,
        },
        B: {
          text: <FormattedMessage id="B" defaultMessage="公务舱" />,
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="currency" defaultMessage="币种" />,
      dataIndex: 'currency',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="content" defaultMessage="查询结果" />,
      dataIndex: 'content',

      hideInSearch: true,
      render: (val) => {
        return <ReactJson src={jsonView} />;
      },
    },
  ];
  const [jsonView, setJsonView] = useState();

  return (
    <PageContainer>
      <ProForm
        onFinish={async (params) => {
          if (!params.depart) {
            return;
          }
          params.group = JSON.parse(localStorage.currentUser).group;
          const flightRes = await getFlightList(params);

          setJsonView(flightRes);
        }}
      >
        <ProFormGroup title="航班查询条件">
          <ProFormSelect
            name="flightType"
            label="行程类型"
            valueEnum={{
              OW: '单程',
              RT: '往返',
            }}
            width="sm"
            rules={[{ required: true, message: '此项为必填项' }]}
          />
          <ProFormText width="sm" name="depart" label="出发" />
          <ProFormText width="sm" name="arrive" label="到达" />
          <ProFormDateRangePicker name="dateRange" label="旅行时间段" />
          <ProFormDigit label="成人数" name="adult" width="sm" min={1} max={9} defaultValue={1} />
          <ProFormDigit label="儿童数" name="child" width="sm" min={0} max={9} defaultValue={0} />
          <ProFormDigit label="婴儿数" name="inf" width="sm" min={0} max={9} defaultValue={0} />
          <ProFormSelect
            name="cabinType"
            label="舱位"
            valueEnum={{
              E: '经济舱',
              B: '公务舱',
            }}
            width="sm"
            rules={[{ required: true, message: '此项为必填项' }]}
          />
          <ProFormText width="sm" name="currency" label="币种" />
        </ProFormGroup>
      </ProForm>
      <Divider orientation="left" orientationMargin="0">
        查询结果
      </Divider>
      <ReactJson src={jsonView} collapsed={true} />
    </PageContainer>
  );
};

export default TableList;
