import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ProFormText, LightFilter } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProfitForm from './components/PenaltyForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import {
  createPenalty,
  getPenalty,
  deletePenalty,
  updatePenalty,
  copyPenalty,
} from '@/services/penalty';
import moment from 'moment';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return;

  try {
    await deletePenalty({
      key: selectedRows.map((row) => row._id),
    });
    hide();
    message.success('删除成功');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
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
      title: <FormattedMessage id="from" defaultMessage="出发" />,
      dataIndex: 'from',
      valueType: 'textarea',
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
      title: <FormattedMessage id="to" defaultMessage="到达" />,
      dataIndex: 'to',
      valueType: 'textarea',
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
      title: <FormattedMessage id="segment" defaultMessage="航线" />,
      dataIndex: 'segment',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="dateStart" defaultMessage="销售开始日期距离起飞时间" />,
      dataIndex: 'dateStart',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },
    {
      title: <FormattedMessage id="dateEnd" defaultMessage="销售结束日期距离起飞时间" />,
      dataIndex: 'dateEnd',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },
    // {
    //   title: <FormattedMessage id="dateRange" defaultMessage="旅行时间段" />,
    //   dataIndex: 'dateRange',
    //   hideInSearch: true,
    //   renderText: (dateRange) => {
    //     {
    //       if (!dateRange) {
    //         return '--';
    //       }
    //       if (dateRange.length == 1) {
    //         return dateRange[0];
    //       } else {
    //         return (
    //           <div>
    //             <span>
    //               {dateRange[0]}~{dateRange[1]}
    //             </span>
    //           </div>
    //         );
    //       }
    //     }
    //   },
    // },
    {
      title: <FormattedMessage id="number" defaultMessage="航班号" />,
      dataIndex: 'number',
      valueType: 'textarea',
      hideInSearch: true,
      // filters: true,
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
      title: <FormattedMessage id="company" defaultMessage="航司" />,
      dataIndex: 'company',
      valueType: 'textarea',
      hideInSearch: true,
      // filters: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="companyDisplay" defaultMessage="航司" />,
      dataIndex: 'companyDisplay',

      hideInSearch: true,
      renderText: (companyDisplay) => {
        {
          {
            if (companyDisplay.length == 1) {
              return companyDisplay[0];
            } else {
              return (
                <div>
                  <span>{companyDisplay[0]}</span> <br />
                  <span>{companyDisplay[1]}</span>
                </div>
              );
            }
          }
        }
      },
    },
    {
      title: <FormattedMessage id="cabin" defaultMessage="舱等" />,
      dataIndex: 'cabin',
      // sorter: true,
      valueType: 'textarea',
      hideInSearch: true,
      // filters: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="cabinDisplay" defaultMessage="舱等" />,
      dataIndex: 'cabinDisplay',

      hideInSearch: true,
      renderText: (cabinDisplay) => {
        {
          {
            if (cabinDisplay.length == 1) {
              return cabinDisplay[0];
            } else {
              return (
                <div>
                  <span>{cabinDisplay[0]}</span> <br />
                  <span>{cabinDisplay[1]}</span>
                </div>
              );
            }
          }
        }
      },
    },
    {
      title: <FormattedMessage id="penaltyType" defaultMessage="退改类型" />,
      dataIndex: 'penaltyType',
      search: false,
      renderText: (val) => {
        let penaltyTypeDisplay = '';
        switch (val) {
          case 'bothNever':
            penaltyTypeDisplay = '不退不改';
            break;
          case 'both':
            penaltyTypeDisplay = '可退可改';
            break;
          case 'onlyRefund':
            penaltyTypeDisplay = '仅可退';
            break;
          case 'onlyChange':
            penaltyTypeDisplay = '仅可改';
            break;
          default:
            penaltyTypeDisplay = '未知';
        }
        return <span>{penaltyTypeDisplay}</span>;
      },
    },

    {
      title: <FormattedMessage id="FWTDisplay" defaultMessage="去程退改政策" />,
      dataIndex: 'FWTDisplay',
      valueType: 'textarea',
      hideInSearch: true,
      renderText: (FWTDisplay) => {
        {
          {
            return (
              <div>
                <span>去程起飞前退票: {FWTDisplay[0]}%</span> <br />
                <span>去程起飞后退票: {FWTDisplay[1]}%</span> <br />
                <span>去程起飞前改签: {FWTDisplay[2]}%</span> <br />
                <span>去程起飞后改签: {FWTDisplay[3]}%</span>
              </div>
            );
          }
        }
      },
    },
    {
      title: <FormattedMessage id="BWTDisplay" defaultMessage="回程退改政策" />,
      dataIndex: 'BWTDisplay',
      valueType: 'textarea',
      hideInSearch: true,
      renderText: (BWTDisplay) => {
        {
          {
            return (
              <div>
                <span>返程起飞前退票: {BWTDisplay[0]}%</span> <br />
                <span>返程起飞后退票: {BWTDisplay[1]}%</span> <br />
                <span>返程起飞前改签: {BWTDisplay[2]}%</span> <br />
                <span>返程起飞后改签: {BWTDisplay[3]}%</span>
              </div>
            );
          }
        }
      },
    },
    {
      title: <FormattedMessage id="abandonRTPercent" defaultMessage="弃程退票(%)" />,
      dataIndex: 'abandonRTPercent',
      valueType: 'textarea',
      hideInSearch: true,
    },
    // 以下是去程
    {
      title: <FormattedMessage id="refundBeforePercentFWT" defaultMessage="去程起飞前退票" />,
      dataIndex: 'refundBeforePercentFWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="refundAfterPercentFWT" defaultMessage="去程起飞后退票" />,
      dataIndex: 'refundAfterPercentFWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="changeBeforePercentFWT" defaultMessage="去程起飞前改签" />,
      dataIndex: 'changeBeforePercentFWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="changeAfterPercentFWT" defaultMessage="去程起飞后改签" />,
      dataIndex: 'changeAfterPercentFWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    // 以下是回程
    {
      title: <FormattedMessage id="refundBeforePercentBWT" defaultMessage="返程起飞前退票" />,
      dataIndex: 'refundBeforePercentBWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="refundAfterPercentBWT" defaultMessage="返程起飞后退票" />,
      dataIndex: 'refundAfterPercentBWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="changeBeforePercentBWT" defaultMessage="返程起飞前改签" />,
      dataIndex: 'changeBeforePercentBWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="changeAfterPercentBWT" defaultMessage="返程起飞后改签" />,
      dataIndex: 'changeAfterPercentBWT',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '操作',
      width: 160,
      key: 'option',
      valueType: 'option',
      fixed: 'right',

      render: (text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            // action?.startEditable?.(record.id);
            setCurrentRow(record);
            setModalVisit(true);
          }}
        >
          编辑
        </a>,
        <a
          key="config"
          onClick={async () => {
            setCurrentRow(record);
            const createRes = await createPenalty(record);
            if (createRes.status) {
              message.success('提交成功');
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          }}
        >
          <FormattedMessage id="copyPenalty" defaultMessage="复制退改" />
        </a>,
      ],
    },
  ];
  const [modalVisit, setModalVisit] = useState(false);
  const waitTime = (time = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '退改政策查询',
          defaultMessage: '退改政策查询',
        })}
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        params={filterParams}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurrentRow({});
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建退改政策
          </Button>,
        ]}
        // toolbar={{
        //   filter: (
        //     <LightFilter
        //       onFinish={(val) => {
        //         console.log(val.number);
        //         console.log(val.company);
        //         console.log(val.cabin);
        //         setfilterParams(val);
        //       }}
        //     >
        //       <ProFormText name="number" label="航班号" />
        //       <ProFormText name="company" label="航司" />
        //       <ProFormText name="cabin" label="舱位" />
        //     </LightFilter>
        //   ),
        // }}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          // if (!params.flightType || !params.from || !params.to) {
          //   return {
          //     data: [],
          //     // success 请返回 true，
          //     // 不然 table 会停止解析数据，即使有数据
          //     success: true,
          //     // 不传会使用 data 的长度，如果是分页一定要传
          //     total: 0,
          //   };
          // }
          params.group = JSON.parse(localStorage.currentUser).group;
          const profitRes = await getPenalty(params);

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
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
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
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current.reloadAndRest();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          {/* <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button> */}
        </FooterToolbar>
      )}

      <ProfitForm
        title="退改政策编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // await waitTime(2000);
          // console.log(values);
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updatePenalty(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            values.group = JSON.parse(localStorage.currentUser).group;
            const createRes = await createPenalty(values);
            if (createRes.status) {
              message.success('提交成功');
              setModalVisit(false);
            } else {
              message.error('提交失败，请重试');
            }
          }
        }}
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
