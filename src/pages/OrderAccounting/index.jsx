import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Input,
  Drawer,
  InputNumber,
  Tag,
  Tooltip,
  Modal,
  Form,
  Descriptions,
  List,
  Avatar,
} from 'antd';
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
import ProDescriptions from '@ant-design/pro-descriptions';

import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getBillList } from '@/services/accounting';
import moment from 'moment';
import CreateExcel from 'js-export-excel';

import { getGroup } from '@/services/group';

const download = (billList, dateRange) => {
  let data = billList;
  let option = {};
  let dataTable = [];

  const group = JSON.parse(localStorage.currentUser).group;

  option.fileName = `${group} ${dateRange[0]}~${dateRange[1]} Bill List`; //excel文件名称
  // option.fileName = `订单账务`; //excel文件名称
  data.map((v) => {
    let normalInfo = {
      订单编号: v.orderId,
      创单时间: v.clientTime,
      行程类型: v.flightType,
      航程: v.segment,
      旅行时间段: v.dateRange,
      金额: v.totalPrice,
      币种: v.currency,
      结算币种: v.usdPrice,
      票务信息: v.passengerInfoList
        .map((p) => {
          return JSON.stringify({
            cardNo: p.cardNo,
            pnr: p.pnr,
            ticketNumber: p.ticketNumber,
            companyNumber: p.companyNumber,
          });
        })
        .join(','),
    };

    if (group == 'Molly') {
      normalInfo['集团'] = v.group;
      normalInfo['分销渠道'] = v.mktportal;
      normalInfo['终端平台'] = v.channel;
      normalInfo['联系人'] = JSON.stringify(v.contactInfo[0]);
      normalInfo['支付渠道'] = v.payChannel;
      normalInfo['支付时间'] = v.txnTime;
      normalInfo['支付流水号'] = v.netsTxnRef;
      normalInfo['支付备注'] = v.remark;
      normalInfo['市场'] = v.locale;
    }

    dataTable.push(normalInfo);
  });

  const normalHeader = [
    '订单编号',
    '创单时间',
    '行程类型',
    '航程',
    '旅行时间段',
    '金额',
    '币种',
    '结算币种',
    '票务信息',
  ];

  if (group == 'Molly') {
    normalHeader.push(
      '集团',
      '分销渠道',
      '终端平台',
      '联系人',
      '支付渠道',
      '支付时间',
      '支付流水号',
      '支付备注',
      '市场',
    );
  }
  option.datas = [
    {
      sheetData: dataTable,
      sheetName: 'sheet',
      sheetFilter: normalHeader,
      sheetHeader: normalHeader,
    },
  ];
  let toExcel = new CreateExcel(option);
  toExcel.saveExcel();
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const [billList, setBillList] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
  const [swtichVal, setSwtich] = useState();
  const [dateRange, setDateRange] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
    {
      title: <FormattedMessage id="group" defaultMessage="集团" />,
      dataIndex: 'group',
      initialValue: 'all',
      request: async () => {
        let params = {};
        const groupRes = await getGroup(params);
        let groupList = [{ label: '全部', value: 'all' }];

        groupRes.content.forEach((s) => {
          groupList.push({ label: s.groupCode, value: s.groupCode });
        });
        return groupList;
      },
      hideInSearch: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
      hideInTable: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
    },

    {
      //  0:出票中/ 1:出票成功/ 2:出票失败/ 10:改签中/ 11:改签成功/ 12:改签失败/ 20:退票中/ 21:退票成功/ 22:退票失败
      title: <FormattedMessage id="mktportal" defaultMessage="分销渠道" />,
      dataIndex: 'mktportal',
      valueEnum: {
        kayak: {
          text: <FormattedMessage id="kayak" defaultMessage="kayak" />,
        },
        wego: {
          text: <FormattedMessage id="wego" defaultMessage="wego" />,
        },
        skyscanner: {
          text: <FormattedMessage id="skyscanner" defaultMessage="skyscanner" />,
        },
        customer: {
          text: <FormattedMessage id="customer" defaultMessage="customer" />,
        },
      },
      hideInSearch: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
      hideInTable: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
    },
    {
      //  0:出票中/ 1:出票成功/ 2:出票失败/ 10:改签中/ 11:改签成功/ 12:改签失败/ 20:退票中/ 21:退票成功/ 22:退票失败
      title: <FormattedMessage id="locale" defaultMessage="分销站点" />,
      dataIndex: 'locale',
      valueType: 'textarea',
      hideInSearch: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
      hideInTable: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
    },
    {
      title: <FormattedMessage id="dateRange" defaultMessage="创单日期范围" />,
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      initialValue: [moment().add(-1, 'month'), moment()],
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="_id" defaultMessage="_id" />,
      dataIndex: '_id',
      valueType: '_id',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="orderId" defaultMessage="订单编号" />,
      dataIndex: 'orderId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="clientTime" defaultMessage="创单时间" />,
      dataIndex: 'clientTime',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

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
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="segment" defaultMessage="航程" />,
      dataIndex: 'segment',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="dateRange" defaultMessage="旅行时间段" />,
      dataIndex: 'dateRange',
      valueType: 'textarea',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="totalPrice" defaultMessage="金额" />,
      dataIndex: 'totalPrice',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="currency" defaultMessage="币种" />,
      dataIndex: 'currency',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="currency" defaultMessage="结算金额(USD)" />,
      dataIndex: 'usdPrice',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="channel" defaultMessage="终端平台" />,
      dataIndex: 'channel',
      hideInSearch: true,
      hideInTable: (() => {
        if (JSON.parse(localStorage.currentUser).group != 'Molly') {
          return true;
        } else {
          return false;
        }
      })(),
    },
  ];

  const expandedRowRender = (row) => {
    const contactInfo = row.contactInfo && row.contactInfo.length == 1 ? row.contactInfo[0] : {};
    const passengerList = row.passengerInfoList;

    return (
      <div>
        {JSON.parse(localStorage.currentUser).group === 'Molly' && (
          <Descriptions title="支付信息">
            <Descriptions.Item label="支付渠道">{row.payChannel}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{row.txnTime}</Descriptions.Item>
            <Descriptions.Item label="支付流水号">{row.netsTxnRef}</Descriptions.Item>
            <Descriptions.Item label="支付备注">{row.remark}</Descriptions.Item>
          </Descriptions>
        )}
        {JSON.parse(localStorage.currentUser).group === 'Molly' && (
          <Descriptions title="联系人信息">
            <Descriptions.Item label="联系人">{contactInfo.contactName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{contactInfo.email}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{`${contactInfo.phoneArea}-${contactInfo.mobilePhone}`}</Descriptions.Item>
          </Descriptions>
        )}

        {passengerList.map((psg, i) => {
          return (
            <Descriptions title={`乘客信息${i + 1}`}>
              <Descriptions.Item label="givenName">{psg.givenName}</Descriptions.Item>
              <Descriptions.Item label="surName">{psg.surName}</Descriptions.Item>
              <Descriptions.Item label="性别">{psg.gender}</Descriptions.Item>
              <Descriptions.Item label="生日">{psg.birthDay}</Descriptions.Item>
              <Descriptions.Item label="国家">{psg.nationality}</Descriptions.Item>
              <Descriptions.Item label="证件类型">{psg.cardType}</Descriptions.Item>
              <Descriptions.Item label="证件号">{psg.cardNo}</Descriptions.Item>
              <Descriptions.Item label="证件有效期">{psg.passportLimit}</Descriptions.Item>
              <Descriptions.Item label="票种">{psg.travelerType}</Descriptions.Item>
              <Descriptions.Item label="票号">{psg.ticketNumber}</Descriptions.Item>
              <Descriptions.Item label="航司大编">{psg.companyNumber}</Descriptions.Item>
              <Descriptions.Item label="PNR">{psg.pnr}</Descriptions.Item>
            </Descriptions>
          );
        })}
      </div>
    );
  };

  return (
    <PageContainer>
      <ProTable
        expandable={{ expandedRowRender }}
        headerTitle={intl.formatMessage({
          id: '订单账务查询',
          defaultMessage: '订单账务查询',
        })}
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              download(billList, dateRange);
            }}
          >
            <PlusOutlined />
            导出当前账单
          </Button>,
        ]}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          setDateRange(params.dateRange);
          params.group = JSON.parse(localStorage.currentUser).group;
          const billRes = await getBillList(params);
          setBillList(billRes.content);
          return {
            data: billRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: billRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: billRes.content.length,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
