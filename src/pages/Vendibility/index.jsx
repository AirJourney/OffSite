import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Badge, Drawer, Switch, Tag, Tooltip, Modal, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProfitForm from './components/VendibilityForm';
import {
  getVendibility,
  updateVendibility,
  batchUpdateVendibility,
  createVendibility,
  deleteVendibility,
  asyncVendibility,
} from '@/services/vendibility';

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
    await deleteVendibility({
      key: selectedRows.map((row) => row._id),
    });
    hide();
    message.success('删除成功');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
  }
};

const handleBatch = async (selectedRows, isVendibility) => {
  const hide = message.loading('正在批量操作');
  if (!selectedRows) return;

  try {
    await batchUpdateVendibility(
      {
        key: selectedRows.map((row) => row._id),
      },
      isVendibility,
    );
    hide();
    message.success('批量操作成功');
  } catch (error) {
    hide();
    message.error('批量操作失败，请重试');
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
      title: <FormattedMessage id="company" defaultMessage="出票航司" />,
      dataIndex: 'company',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="isVendibility" defaultMessage="销售状态" />,
      dataIndex: 'isVendibility',
      valueEnum: {
        true: {
          text: <FormattedMessage id="true" defaultMessage="在售" />,
        },
        false: {
          text: <FormattedMessage id="false" defaultMessage="停售" />,
        },
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="vendibilityDisplay" defaultMessage="状态" />,
      dataIndex: 'isVendibility',
      hideInSearch: true,
      render: (val) => {
        if (val) {
          return <Tag color="#87d068">在售</Tag>;
        } else {
          return <Tag color="#f50">停售</Tag>;
        }
      },
    },

    {
      title: <FormattedMessage id="edit" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Switch
          checkedChildren="在售"
          unCheckedChildren="停售"
          checked={record.isVendibility}
          onChange={async (checked) => {
            console.log(checked);
            setCurrentRow(record);
            record.isVendibility = checked;
            const updateRes = await updateVendibility(record);
            if (updateRes.status) {
              message.success('提交成功');
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          }}
        ></Switch>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '销售航司配置查询',
          defaultMessage: '销售航司配置查询',
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
              asyncVendibility({ group: JSON.parse(localStorage.currentUser).group });
            }}
          >
            <PlusOutlined />
            同步销售航司配置
          </Button>,
        ]}
        toolbar={{}}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          params.group = JSON.parse(localStorage.currentUser).group;
          const vendibilityRes = await getVendibility(params);

          return {
            data: vendibilityRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: vendibilityRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: vendibilityRes.content.length,
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
              await handleBatch(selectedRowsState, true);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="批量打开销售" defaultMessage="批量打开销售" />
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await handleBatch(selectedRowsState, false);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="批量停止销售" defaultMessage="批量停止销售" />
          </Button>
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
        title="销售航司配置编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // await waitTime(2000);
          console.log(values);

          values.group = JSON.parse(localStorage.currentUser).group;
          const createRes = await createVendibility(values);
          if (createRes.status) {
            message.success('提交成功');
            setModalVisit(false);
            actionRef.current.reloadAndRest();
          } else {
            message.error('提交失败，请重试');
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
