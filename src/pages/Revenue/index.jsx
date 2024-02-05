import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, InputNumber, Tag, Tooltip, Modal, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProfitForm from './components/RevenueForm';
import { getRevenue, createRevenue, updateRevenue, deleteRevenue } from '@/services/revenue';

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
    await deleteRevenue({
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
  const [modalVisit, setModalVisit] = useState(false);
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
      title: <FormattedMessage id="supplierId" defaultMessage="supplierId" />,
      dataIndex: 'supplierId',
      valueType: 'supplierId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="group" defaultMessage="集团" />,
      dataIndex: 'group',
      valueType: 'group',
    },
    {
      title: <FormattedMessage id="carrierType" defaultMessage="航司类型" />,
      dataIndex: 'carrierType',
      valueEnum: {
        LCC: {
          text: <FormattedMessage id="LCC" defaultMessage="廉航" />,
        },
        FSC: {
          text: <FormattedMessage id="FSC" defaultMessage="全服务" />,
        },
      },
    },
    {
      title: <FormattedMessage id="supplierName" defaultMessage="供应商名称" />,
      dataIndex: 'supplierName',
      valueType: 'supplierName',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCC" defaultMessage="IPCC" />,
      dataIndex: 'IPCC',
      valueType: 'IPCC',
    },
    {
      title: <FormattedMessage id="revenueType" defaultMessage="加价类型" />,
      dataIndex: 'revenueType',
      search: false,
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="fixedPrice" defaultMessage="票面一口价" />,
      dataIndex: 'fixedPrice',
      search: false,
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="fixedTax" defaultMessage="税费一口价" />,
      dataIndex: 'fixedTax',
      search: false,
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="percent" defaultMessage="扣率" />,
      dataIndex: 'percent',
      search: false,
      renderText: (val) =>
        val
          ? `${val}${intl.formatMessage({
              id: 'percent',
              defaultMessage: ' % ',
            })}`
          : '-',
    },
    {
      title: <FormattedMessage id="trim" defaultMessage="调整值" />,
      dataIndex: 'trim',
      search: false,
      valueType: 'textarea',
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
          <FormattedMessage id="editProfit" defaultMessage="调整扣率" />
        </a>,
        <a
          key="config"
          onClick={async () => {
            setCurrentRow(record);
            const createRes = await createRevenue(record);
            if (createRes.status) {
              message.success('提交成功');
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          }}
        >
          <FormattedMessage id="copyProfit" defaultMessage="复制扣率" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '加价查询',
          defaultMessage: '加价查询',
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
            key="primary"
            onClick={() => {
              setCurrentRow({});
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建加价政策
          </Button>,
        ]}
        toolbar={{}}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          // params.group = JSON.parse(localStorage.currentUser).group;
          const profitRes = await getRevenue(params);

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
        title="价格政策编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // await waitTime(2000);
          //console.log(values);
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updateRevenue(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            // values.group = JSON.parse(localStorage.currentUser).group;
            const createRes = await createRevenue(values);
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
