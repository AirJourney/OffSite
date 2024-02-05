import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Badge, Drawer, Switch, Tag, Tooltip, Modal, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProhibitionForm from './components/ProhibitionForm';
import {
  getProhibition,
  updateProhibition,
  batchUpdateProhibition,
  createProhibition,
  deleteProhibition,
  asyncProhibition,
} from '@/services/prohibition';

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
    await deleteProhibition({
      key: selectedRows.map((row) => row._id),
    });
    hide();
    message.success('删除成功');
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
  }
};

const handleBatch = async (selectedRows, isProhibition) => {
  const hide = message.loading('正在批量操作');
  if (!selectedRows) return;

  try {
    await batchUpdateProhibition(
      {
        key: selectedRows.map((row) => row._id),
      },
      isProhibition,
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
      title: <FormattedMessage id="tripType" defaultMessage="航程类型" />,
      dataIndex: 'tripType',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="departType" defaultMessage="出发类型" />,
      dataIndex: 'departType',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="depart" defaultMessage="出发" />,
      dataIndex: 'depart',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="arrivalType" defaultMessage="到达类型" />,
      dataIndex: 'arrivalType',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="arrival" defaultMessage="到达" />,
      dataIndex: 'arrival',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="cabinType" defaultMessage="销售舱等" />,
      dataIndex: 'cabinType',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="vendibilityCompanies" defaultMessage="销售航司" />,
      dataIndex: 'vendibilityCompanies',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCC" defaultMessage="销售IPCC" />,
      dataIndex: 'IPCC',
      valueType: 'textarea',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="isProhibition" defaultMessage="销售状态" />,
      dataIndex: 'isProhibition',
      valueEnum: {
        true: {
          text: <FormattedMessage id="true" defaultMessage="禁售" />,
        },
        false: {
          text: <FormattedMessage id="false" defaultMessage="在售" />,
        },
      },
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="prohibitionDisplay" defaultMessage="销售状态" />,
      dataIndex: 'isProhibition',
      hideInSearch: true,
      render: (val) => {
        if (val) {
          return <Tag color="#f50">禁售</Tag>;
        } else {
          return <Tag color="#87d068">在售</Tag>;
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
          unCheckedChildren="禁售"
          checked={!record.isProhibition}
          onChange={async (checked) => {
            console.log(checked);
            setCurrentRow(record);
            record.isProhibition = !checked;
            const updateRes = await updateProhibition(record);
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
          id: '销售航线配置查询',
          defaultMessage: '销售航线配置查询',
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
            key="primary"
            onClick={() => {
              setCurrentRow({});
              asyncProhibition({ group: JSON.parse(localStorage.currentUser).group });
            }}
          >
            <PlusOutlined />
            同步销售航线配置
          </Button>,
        ]}
        toolbar={{}}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          params.group = JSON.parse(localStorage.currentUser).group;
          const prohibitionRes = await getProhibition(params);

          return {
            data: prohibitionRes.content,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: prohibitionRes.status,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: prohibitionRes.content.length,
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
            <FormattedMessage id="批量禁售" defaultMessage="批量禁售" />
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              await handleBatch(selectedRowsState, false);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="批量停止禁售" defaultMessage="批量停止禁售" />
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

      <ProhibitionForm
        title="销售航司配置编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // await waitTime(2000);
          console.log(values);

          values.group = JSON.parse(localStorage.currentUser).group;
          const createRes = await createProhibition(values);
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
