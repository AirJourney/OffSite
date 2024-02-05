import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, InputNumber, Tag, Tooltip, Modal, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProfitForm from './components/ProfitForm';
import moment from 'moment';
import { getBaggageList, addBaggage, updateBaggage, deleteBaggage } from '@/services/baggage';

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return;

  try {
    await deleteBaggage(
      selectedRows.map((row) => row._id),
    );
    hide();
    message.success('删除成功');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
  }
};

const TableList = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
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
    },
    {
      title: <FormattedMessage id="from" defaultMessage="出发" />,
      dataIndex: 'from',
    },
    {
      title: <FormattedMessage id="to" defaultMessage="到达" />,
      dataIndex: 'to',
    },
    {
      title: <FormattedMessage id="dateRange" defaultMessage="旅行时间段" />,
      dataIndex: 'dateRange',
      hideInSearch: true,
      renderText: (_,data) => {
        if (!data.dateEnd && !data.dateStart) {
          return '--';
        }
        return (
          <div>
            <span>
              {moment(data.dateStart).format('YYYY-MM-DD')||""}~{moment(data.dateEnd).format('YYYY-MM-DD')||""}
            </span>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="numberDisplay" defaultMessage="航班号" />,
      dataIndex: 'flightNo',
      hideInSearch: true,
      renderText: (flightNo) => {
          return flightNo.join(',')
      },
    },
    {
      title: <FormattedMessage id="companyDisplay" defaultMessage="航司" />,
      dataIndex: 'company',
    },
    {
      title: <FormattedMessage id="cabinDisplay" defaultMessage="舱位" />,
      dataIndex: 'cabin',
      hideInSearch: true,
      renderText: (cabin) => {
        return cabin.join(',')
      },
    },
    {
      title: <FormattedMessage id="edit" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            setModalVisit(true);
          }}
        >
          <FormattedMessage id="edit" defaultMessage="编辑" />
        </a>,
        // <a
        //   key="config"
        //   onClick={async () => {
        //     setCurrentRow(record);
        //     const createRes = await addBaggage(record);
        //     if (createRes.status) {
        //       message.success('提交成功');
        //       actionRef.current.reloadAndRest();
        //     } else {
        //       message.error('提交失败，请重试');
        //     }
        //   }}
        // >
        //   <FormattedMessage id="copy" defaultMessage="复制" />
        // </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="行李额查询"
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
            key="primary"
            onClick={() => {
              setCurrentRow({});
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建行李额政策
          </Button>,
        ]}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          const {dateRange,pageSize,current,...left} = params;
          const profitRes = await getBaggageList({
            ...left,
            dateStart: dateRange?.[0],
            dateEnd: dateRange?.[1],
            limit: pageSize,
            skip: (current-1) * pageSize,
          });
          return {
            data: profitRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: profitRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: profitRes.total,
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
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}

      <ProfitForm
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // await waitTime(2000);
          //console.log(values);
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updateBaggage(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            // values.group = JSON.parse(localStorage.currentUser).group;
            const createRes = await addBaggage(values);
            if (createRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
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
