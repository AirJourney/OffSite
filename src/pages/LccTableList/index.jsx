import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Divider, Drawer, Descriptions, InputNumber, Modal } from 'antd';
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
import ProfitForm from './components/ProfitForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getProfit, editProfit, getDefaultProfit, editDefaultProfit } from '@/services/lcc';
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
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
  const [percentNum, setPercentNum] = useState();
  const [commition, setCommition] = useState();
  const [profit, setProfit] = useState();
  const [commitionF9, setCommitionF9] = useState();
  const [profitF9, setProfitF9] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();
  const columns = [
    {
      title: <FormattedMessage id="_id" defaultMessage="_id" />,
      dataIndex: '_id',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    // {
    //   title: <FormattedMessage id="flightType" defaultMessage="行程类型" />,
    //   dataIndex: 'flightType',
    //   valueEnum: {
    //     OW: {
    //       text: <FormattedMessage id="OW" defaultMessage="单程" />,
    //     },
    //     RT: {
    //       text: <FormattedMessage id="RT" defaultMessage="往返" />,
    //     },
    //   },
    //   formItemProps: {
    //     rules: [
    //       {
    //         required: true,
    //         message: '此项为必填项',
    //       },
    //     ],
    //   },
    // },
    {
      title: <FormattedMessage id="from" defaultMessage="出发" />,
      dataIndex: 'from',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="to" defaultMessage="到达" />,
      dataIndex: 'to',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: <FormattedMessage id="dateRange" defaultMessage="起飞日期范围" />,
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      initialValue: [moment(), moment().add(1, 'day')],
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="date" defaultMessage="起飞日期值" />,
      dataIndex: 'date',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="dateDisplay" defaultMessage="起飞日期" />,
      dataIndex: 'dateDisplay',

      hideInSearch: true,
      renderText: (dateArray) => {
        {
          {
            if (dateArray.length == 1) {
              return dateArray[0];
            } else {
              return (
                <div>
                  <span>{dateArray[0]}</span> <br />
                  <span>{dateArray[1]}</span>
                </div>
              );
            }
          }
        }
      },
    },
    {
      title: <FormattedMessage id="number" defaultMessage="航班号" />,
      dataIndex: 'number',
      valueType: 'textarea',
      hideInSearch: true,
      filters: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="numberDisplay" defaultMessage="航班号" />,
      dataIndex: 'numberDisplay',

      hideInSearch: true,
      renderText: (numberDisplay) => {
        {
          {
            if (numberDisplay.length == 1) {
              return numberDisplay[0];
            } else {
              return (
                <div>
                  <span>{numberDisplay[0]}</span> <br />
                  <span>{numberDisplay[1]}</span>
                </div>
              );
            }
          }
        }
      },
    },

    {
      title: <FormattedMessage id="lowestPrice" defaultMessage="外放最低价" />,
      dataIndex: 'lowestPrice',
      valueType: 'textarea',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="settlementPrice" defaultMessage="票面价" />,
      dataIndex: 'settlementPrice',
      valueType: 'textarea',
      hideInSearch: true,
    },
    // {
    //   title: <FormattedMessage id="companyDisplay" defaultMessage="航司" />,
    //   dataIndex: 'companyDisplay',

    //   hideInSearch: true,
    //   renderText: (companyDisplay) => {
    //     {
    //       {
    //         if (companyDisplay.length == 1) {
    //           return companyDisplay[0];
    //         } else {
    //           return (
    //             <div>
    //               <span>{companyDisplay[0]}</span> <br />
    //               <span>{companyDisplay[1]}</span>
    //             </div>
    //           );
    //         }
    //       }
    //     }
    //   },
    // },
    // {
    //   title: <FormattedMessage id="cabin" defaultMessage="舱位" />,
    //   dataIndex: 'cabin',
    //   // sorter: true,
    //   valueType: 'textarea',
    //   hideInSearch: true,
    //   filters: true,
    //   hideInTable: true,
    // },
    // {
    //   title: <FormattedMessage id="cabinDisplay" defaultMessage="舱位" />,
    //   dataIndex: 'cabinDisplay',

    //   hideInSearch: true,
    //   renderText: (cabinDisplay) => {
    //     {
    //       {
    //         if (cabinDisplay.length == 1) {
    //           return cabinDisplay[0];
    //         } else {
    //           return (
    //             <div>
    //               <span>{cabinDisplay[0]}</span> <br />
    //               <span>{cabinDisplay[1]}</span>
    //             </div>
    //           );
    //         }
    //       }
    //     }
    //   },
    // },
    {
      title: <FormattedMessage id="commition" defaultMessage="返点" />,
      dataIndex: 'commition',
      search: false,
      // renderText: (val) =>
      //   `${val}${intl.formatMessage({
      //     id: 'commition',
      //     defaultMessage: ' % ',
      //   })}`,
    },

    {
      title: <FormattedMessage id="profit" defaultMessage="留钱" />,
      dataIndex: 'profit',
      search: false,
      // renderText: (val) =>
      //   `${val}${intl.formatMessage({
      //     id: 'commition',
      //     defaultMessage: ' % ',
      //   })}`,
    },

    {
      title: <FormattedMessage id="edit" defaultMessage="调整扣率" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="editProfit" defaultMessage="调整扣率" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <Descriptions
        title="默认扣率：(1-扣率)*100%+留钱"
        extra={
          <Button
            type="primary"
            onClick={async () => {
              const editRes = await editDefaultProfit({ commition, profit, company: 'NK' });

              if (editRes.status) {
                Modal.success({
                  content: `NK默认扣率已经调整成功，扣率: ${commition} ; 留钱: ${profit}`,
                });
              }

              const editF9Res = await editDefaultProfit({
                commition: commitionF9,
                profit: profitF9,
                company: 'F9',
              });

              if (editF9Res.status) {
                Modal.success({
                  content: `F9默认扣率已经调整成功，扣率: ${commitionF9} ; 留钱: ${profitF9}`,
                });
              }
            }}
          >
            修改默认扣率
          </Button>
        }
      >
        <Descriptions.Item label="NK扣率">
          <InputNumber
            min={-100}
            max={100}
            value={commition}
            size="small"
            onChange={(value) => {
              setCommition(value);
            }}
          />
          {` %`}
        </Descriptions.Item>
        <Descriptions.Item label="NK留钱">
          <InputNumber
            min={-100}
            max={100}
            value={profit}
            size="small"
            onChange={(value) => {
              setProfit(value);
            }}
          />
          {`  RMB`}
        </Descriptions.Item>
        <br></br>
        <Descriptions.Item label="F9扣率">
          <InputNumber
            min={-100}
            max={100}
            value={commitionF9}
            size="small"
            onChange={(value) => {
              setCommitionF9(value);
            }}
          />
          {` %`}
        </Descriptions.Item>
        <Descriptions.Item label="F9留钱">
          <InputNumber
            min={-100}
            max={100}
            value={profitF9}
            size="small"
            onChange={(value) => {
              setProfitF9(value);
            }}
          />
          {`  RMB`}
        </Descriptions.Item>
      </Descriptions>

      <Divider plain></Divider>

      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '扣率查询',
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
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        toolbar={{
          filter: (
            <LightFilter
              onFinish={(val) => {
                console.log(val.number);
                console.log(val.company);
                console.log(val.cabin);
                setfilterParams(val);
              }}
            >
              <ProFormText name="number" label="航班号" />
              {/* <ProFormText name="company" label="航司" />
              <ProFormText name="cabin" label="舱位" /> */}
            </LightFilter>
          ),
        }}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const defaultProfit = await getDefaultProfit('NK');
          setCommition(defaultProfit.content.commition);
          setProfit(defaultProfit.content.profit);
          const defaultProfitF9 = await getDefaultProfit('F9');
          setCommitionF9(defaultProfitF9.content.commition);
          setProfitF9(defaultProfitF9.content.profit);
          let profitRes = null;
          if (!params.from || !params.to) {
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
            profitRes = await getProfit(params);
          }

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
      <ProfitForm
        onNumberChange={(value) => {
          setPercentNum(value);
        }}
        onFinish={async (value) => {
          const hide = message.loading('扣率编辑中');
          hide();
          value._id = currentRow ? currentRow._id : undefined;
          console.log(value);

          const editRes = await editProfit(value);

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
        values={currentRow || {}}
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
