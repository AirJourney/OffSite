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
import TicketForm from './components/ticketForm';
import RefundForm from './components/refundForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getOrderList, updateOrder, refundOrder, orderChangeMail } from '@/services/order';
import moment from 'moment';

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

const handleChangeMail = async (selectedRow) => {
  const hide = message.loading('正在发送');
  if (!selectedRow) return true;
  const group = JSON.parse(localStorage.currentUser).group;
  const orderChangeMailRes = await orderChangeMail(selectedRow.orderId, group);
  hide();

  if (orderChangeMailRes.status) {
    message.success('发送成功');
    return true;
  } else {
    hide();
    message.error('发送失败,请重试');
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

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [refundModalVisible, handleRefundModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
  const [swtichVal, setSwtich] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [opType, setOpType] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
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
      hideInSearch: false,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="passengerList" defaultMessage="乘客票号" />,
      dataIndex: 'passengerList',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
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
      title: <FormattedMessage id="dateTime" defaultMessage="航程时间" />,
      dataIndex: 'dateTime',

      hideInSearch: true,
      hideInTable: false,
      renderText: (dateTime) => {
        if (!dateTime) {
          return null;
        }
        if (dateTime.length == 1) {
          return dateTime[0];
        } else {
          return (
            <div>
              <span>{dateTime[0]}</span> <br />
              <span>{dateTime[1]}</span>
            </div>
          );
        }
      },
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
      title: <FormattedMessage id="totalPriceUSD" defaultMessage="结算币种金额" />,
      dataIndex: 'totalPriceUSD',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="currencyUSD" defaultMessage="结算币种" />,
      dataIndex: 'currencyUSD',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      //  0:出票中/ 1:出票成功/ 2:出票失败/ 10:改签中/ 11:改签成功/ 12:改签失败/ 20:退票中/ 21:退票成功/ 22:退票失败
      title: <FormattedMessage id="status" defaultMessage="订单状态" />,
      dataIndex: 'status',

      valueEnum: {
        999: {
          text: <FormattedMessage id="999" defaultMessage="全部" />,
        },
        99: {
          text: <FormattedMessage id="99" defaultMessage="待支付" />,
        },
        0: {
          text: <FormattedMessage id="0" defaultMessage="出票中" />,
        },
        1: {
          text: <FormattedMessage id="1" defaultMessage="出票成功" />,
        },
        2: {
          text: <FormattedMessage id="2" defaultMessage="出票失败" />,
        },
        10: {
          text: <FormattedMessage id="10" defaultMessage="改签中" />,
        },
        11: {
          text: <FormattedMessage id="11" defaultMessage="改签成功" />,
        },
        12: {
          text: <FormattedMessage id="12" defaultMessage="改签失败" />,
        },
        20: {
          text: <FormattedMessage id="20" defaultMessage="退票中" />,
        },
        21: {
          text: <FormattedMessage id="21" defaultMessage="退票成功" />,
        },
        22: {
          text: <FormattedMessage id="22" defaultMessage="退票失败" />,
        },
      },
      hideInTable: true,
      // formItemProps: {
      //   rules: [
      //     {
      //       required: true,
      //       message: '此项为必填项',
      //     },
      //   ],
      // },
    },
    {
      //  0:出票中/ 1:出票成功/ 2:出票失败/ 10:改签中/ 11:改签成功/ 12:改签失败/ 20:退票中/ 21:退票成功/ 22:退票失败
      title: <FormattedMessage id="statusDisplay" defaultMessage="订单状态" />,
      dataIndex: 'statusDisplay',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="clientTime" defaultMessage="创单时间" />,
      dataIndex: 'clientTime',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: false,
    },

    {
      title: <FormattedMessage id="userId" defaultMessage="用户名" />,
      dataIndex: 'userId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: (() => {
        if (JSON.parse(localStorage.currentUser).role != 'admin') {
          return true;
        } else {
          return false;
        }
      })(),
    },

    {
      title: <FormattedMessage id="contactName" defaultMessage="联系人" />,
      dataIndex: 'contactName',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="email" defaultMessage="邮箱" />,
      dataIndex: 'email',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="option" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);

            // setSwtich(true);
          }}
        >
          <FormattedMessage id="ticket" defaultMessage="票务操作" />
        </a>,
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleChangeMail(record);
          }}
        >
          <FormattedMessage id="change" defaultMessage="票务邮件" />
        </a>,
        <a
          key="config"
          onClick={async () => {
            // setCurrentRow(record);
            handleRefundModalVisible(true);
            setCurrentRow(record);

            // const staff = JSON.parse(localStorage.currentUser);
            // record.status = 21;
            // const editRes = await updateOrder(record, staff._id, 'refund');

            // if (editRes.status) {
            //   message.success('退票成功');
            //   if (actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }
          }}
        >
          <FormattedMessage id="refund" defaultMessage="退票" />
        </a>,
      ],
    },
  ];

  const expandedRowRender = (row) => {
    const contactInfo = row.contactInfo;
    if (!row.shoppingInfo) {
      return <div>暂无信息</div>;
    }
    const flightList = row.shoppingInfo.flightGroupInfoList;
    const baggageList = row.shoppingInfo.policyInfo.baggageInfoList;
    const displayFlightInfoList = [];
    flightList.forEach((f, i) => {
      f.flightSegments.forEach((s, j) => {
        const baggagePiece = baggageList[i].checkedFormatted
          ? baggageList[i].checkedFormatted.adultDetail.piece
          : '';
        const baggageWeight = baggageList[i].checkedFormatted
          ? baggageList[i].checkedFormatted.adultDetail.weight
          : '';
        displayFlightInfoList.push({
          segmentNo: `航段信息 (航段${s.segmentNo})`,
          dPortCode: s.dPortInfo.code,
          dTerminal: s.dPortInfo.terminal,
          aPortCode: s.aPortInfo.code,
          aTerminal: s.aPortInfo.terminal,
          airline: s.airlineInfo.code,
          flightNo: s.flightNo,
          cabin: s.cabinClass,
          class: s.subClass,
          baggage: baggagePiece + '*' + baggageWeight,
        });
      });
    });

    return (
      <div>
        {displayFlightInfoList.map((item) => {
          return (
            <Descriptions title={item.segmentNo}>
              <Descriptions.Item label="出发机场">{item.dPortCode}</Descriptions.Item>
              <Descriptions.Item label="出发航站楼">{item.dTerminal}</Descriptions.Item>
              <Descriptions.Item label="到达机场">{item.aPortCode}</Descriptions.Item>
              <Descriptions.Item label="到达航站楼">{item.aTerminal}</Descriptions.Item>
              <Descriptions.Item label="航司编号">{item.airline}</Descriptions.Item>
              <Descriptions.Item label="航班号">{item.flightNo}</Descriptions.Item>
              <Descriptions.Item label="舱位">{item.class}</Descriptions.Item>
              <Descriptions.Item label="舱等">{item.cabin}</Descriptions.Item>
              <Descriptions.Item label="行李额">{item.baggage}</Descriptions.Item>
            </Descriptions>
          );
        })}
        {JSON.parse(localStorage.currentUser).role === 'admin' ? (
          <Descriptions title="联系人信息">
            <Descriptions.Item label="联系人">{contactInfo.contactName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{contactInfo.email}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{`${contactInfo.phoneArea}-${contactInfo.mobilePhone}`}</Descriptions.Item>
          </Descriptions>
        ) : null}

        {row.passengerList.map((psg, i) => {
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

        <Descriptions title="操作记录" />
        <List
          itemLayout="horizontal"
          bordered={true}
          dataSource={row.offLogList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '订单查询',
          defaultMessage: '订单查询',
        })}
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        params={filterParams}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        expandable={{ expandedRowRender }}
        toolBarRender={() => []}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          if (!params.status) {
            return {
              data: [],
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: 0,
            };
          }
          params.group = JSON.parse(localStorage.currentUser).group;
          params.role = JSON.parse(localStorage.currentUser).role;
          const profitRes = await getOrderList(params);

          return {
            data: profitRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: profitRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: profitRes.content.length,
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
      <TicketForm
        onFinish={async (value) => {
          console.log(value);
          // return;
          const hide = message.loading('处理中');
          hide();
          currentRow.status = isNaN(Number(value.statusDisplay))
            ? Number(currentRow.status)
            : Number(value.statusDisplay);
          const staff = JSON.parse(localStorage.currentUser);
          const editRes = await updateOrder(currentRow, staff._id, value);

          if (editRes.status) {
            handleUpdateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        // onCancel={() => {
        //   handleUpdateModalVisible(false);

        //   if (!showDetail) {
        //     setCurrentRow(undefined);
        //   }
        // }}
        updateModalVisible={updateModalVisible}
        onVisibleChange={handleUpdateModalVisible}
        values={currentRow ? currentRow : {}}
        // passengerList={currentRow ? currentRow.passengerList : [] || {}}
      />

      <RefundForm
        onCheckChange={(pasenger) => {
          console.log(pasenger);
          currentRow.passengerList.forEach((psg) => {
            if (psg.passengerId === pasenger.passengerId) {
              psg.isRefund = pasenger.isRefund;
            }
          });
        }}
        onFinish={async (value) => {
          const hide = message.loading('处理中');
          hide();
          currentRow.status = isNaN(Number(value.statusDisplay))
            ? Number(currentRow.status)
            : Number(value.statusDisplay);
          const staff = JSON.parse(localStorage.currentUser);
          const editRes = await refundOrder(currentRow, staff._id, value);

          if (editRes.status) {
            handleRefundModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        // onCancel={() => {
        //   handleUpdateModalVisible(false);

        //   if (!showDetail) {
        //     setCurrentRow(undefined);
        //   }
        // }}
        refundModalVisible={refundModalVisible}
        onVisibleChange={handleRefundModalVisible}
        values={currentRow ? currentRow : {}}
        // passengerList={currentRow ? currentRow.passengerList : [] || {}}
      />

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
