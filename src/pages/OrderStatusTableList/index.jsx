import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Divider, Drawer, Descriptions, InputNumber, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  LightFilter,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import { getOrderStatus, editIssue } from '@/services/orderStatus';
import moment from 'moment';

const TableList = () => {
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();

  const handleSaveDesc = (billId, desc) => {
    editIssue({ billId, desc });
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
    {
      title: <FormattedMessage id="dateRange" defaultMessage="生单日期范围" />,
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      initialValue: [moment(), moment().add(1, 'day')],
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="billId" defaultMessage="出票单号" />,
      dataIndex: 'billId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="IssueStatus" defaultMessage="订单状态" />,
      dataIndex: 'IssueStatus',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
      renderText: (val) => (val == '1' ? '未出票' : '已出票'),
    },
    {
      title: <FormattedMessage id="orderDate" defaultMessage="生单时间" />,
      dataIndex: 'orderDate',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="issueDate" defaultMessage="出票时间" />,
      dataIndex: 'issueDate',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="tips" defaultMessage="分析结果" />,
      dataIndex: 'tips',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="policyCode" defaultMessage="政策编码" />,
      dataIndex: 'policyCode',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="redisKey" defaultMessage="日期-航线" />,
      dataIndex: 'redisKey',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="flightNo" defaultMessage="航班号" />,
      dataIndex: 'flightNo',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="total" defaultMessage="票面价" />,
      dataIndex: 'total',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },
    {
      title: <FormattedMessage id="redisPrice" defaultMessage="缓存价" />,
      dataIndex: 'redisPrice',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="ticketCount" defaultMessage="乘客数" />,
      dataIndex: 'ticketCount',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="redisSeatCount" defaultMessage="外放座位数" />,
      dataIndex: 'redisSeatCount',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="desc" defaultMessage="备注" />,
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
      render: (_, record) => [
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 100px)' }}
            defaultValue={record.desc}
            onChange={(val) => {
              record.desc = val.target.value;
            }}
          />
          <Button
            id={record.billId}
            type="primary"
            onClick={() => {
              handleSaveDesc(record.billId, record.desc);
            }}
          >
            保存
          </Button>
        </Input.Group>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '订单扫仓查询',
          defaultMessage: '订单扫仓查询',
        })}
        options={false}
        actionRef={actionRef}
        rowKey={(record) => Math.random()}
        params={filterParams}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleUpdateModalVisible(true);
          //     setCurrentRow(undefined);
          //   }}
          // >
          //   <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          // </Button>,
        ]}
        toolbar={
          {
            // filter: (
            //   <LightFilter
            //     onFinish={(val) => {
            //       console.log(val.number);
            //       console.log(val.company);
            //       console.log(val.cabin);
            //       setfilterParams(val);
            //     }}
            //   >
            //     <ProFormText name="number" label="航班号" />
            //     {/* <ProFormText name="company" label="航司" />
            //     <ProFormText name="cabin" label="舱位" /> */}
            //   </LightFilter>
            // ),
          }
        }
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          let orderStatusRes = null;
          if (!params.dateRange) {
            return {
              data: [],
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: 0,
            };
            // profitRes = await getDefaultProfit();
          } else {
            orderStatusRes = await getOrderStatus(params);
          }

          return {
            data: orderStatusRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: orderStatusRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: orderStatusRes.content.length,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
    </PageContainer>
  );
};

export default TableList;
