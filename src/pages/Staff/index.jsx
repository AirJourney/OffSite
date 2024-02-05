import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, InputNumber, Tag, Tooltip, Modal, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import StaffForm from './components/StaffForm';
import { getStaff, createStaff, updateStaff, deleteStaff } from '@/services/staff';

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
    await deleteStaff({
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
      title: <FormattedMessage id="staffId" defaultMessage="staffId" />,
      dataIndex: 'staffId',
      valueType: 'staffId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="id" defaultMessage="账号" />,
      dataIndex: 'id',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="password" defaultMessage="密码" />,
      dataIndex: 'password',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="name" defaultMessage="用户名" />,
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="role" defaultMessage="角色" />,
      dataIndex: 'role',
      valueEnum: {
        admin: {
          text: <FormattedMessage id="admin" defaultMessage="管理员" />,
        },
        staff: {
          text: <FormattedMessage id="staff" defaultMessage="员工" />,
        },
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
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: '账号管理',
          defaultMessage: '账号管理',
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
            新建账号
          </Button>,
        ]}
        toolbar={{}}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          params.group = JSON.parse(localStorage.currentUser).group;
          const profitRes = await getStaff(params);

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

      <StaffForm
        title="账号编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updateStaff(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            values.group = JSON.parse(localStorage.currentUser).group;
            const createRes = await createStaff(values);
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
