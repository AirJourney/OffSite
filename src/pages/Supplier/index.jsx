import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import SupplierForm from './components/SupplierForm';
import { getSupplier, updateSupplier, createSupplier, deleteSupplier } from '@/services/supplier';

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

  const delSupplier = async (record) => {
    const delRes = await deleteSupplier(record._id);

    if (delRes.status) {
      actionRef.current.reloadAndRest();

      message.success('提交成功');
    } else {
      message.error('提交失败，请重试');
    }
  };

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
      title: <FormattedMessage id="supplierCode" defaultMessage="供应商编号" />,
      dataIndex: 'supplierCode',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="supplierName" defaultMessage="供应商名称" />,
      dataIndex: 'supplierName',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCCSearchId" defaultMessage="IPCCSearchId" />,
      dataIndex: 'IPCCSearchId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="IPCCSearch" defaultMessage="查询IPCC" />,
      dataIndex: 'IPCCSearch',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCCBookingId" defaultMessage="IPCCBookingId" />,
      dataIndex: 'IPCCSearchId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="IPCCBooking" defaultMessage="订位IPCC" />,
      dataIndex: 'IPCCBooking',
      valueType: 'textarea',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="exchangeType" defaultMessage="汇率方式" />,
      dataIndex: 'exchangeType',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="sellSwitch" defaultMessage="售卖开关" />,
      dataIndex: 'sellSwitch',
      valueEnum: {
        true: { text: '售卖中', status: 'Success' },
        false: { text: '售卖关闭', status: 'Error' },
        // running: { text: '运行中', status: 'Processing' },
        // online: { text: '已上线', status: 'Success' },
        // error: { text: '异常', status: 'Error' },
      },
      // hideInSearch: true,
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
          key="del"
          onClick={() => {
            setCurrentRow(record);
            delSupplier(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'supplierList',
          defaultMessage: '供应商配置列表',
        })}
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        params={filterParams}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          params.group = JSON.parse(localStorage.currentUser).group;
          const supplierRes = await getSupplier(params);

          return {
            data: supplierRes.content,

            success: supplierRes.status,

            total: supplierRes.content.length,
          };
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({});
              setModalVisit(true);
            }}
            // hidden=
            // {() => {
            //   if (JSON.parse(localStorage.currentUser).group != 'Molly') {
            //     return "true";
            //   } else {
            //     return "false";
            //   }
            // }}
          >
            <PlusOutlined />
            新建供应商
          </Button>,
        ]}
      />

      <SupplierForm
        title="供应商配置编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updateSupplier(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            values.group = JSON.parse(localStorage.currentUser).group;

            const createRes = await createSupplier(values);
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
    </PageContainer>
  );
};

export default TableList;
