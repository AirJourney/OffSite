import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import IPCCForm from './components/IPCCForm';
import SegmentForm from './components/segmentForm';
import {
  getIPCC,
  createIPCC,
  updateIPCC,
  deleteIPCC,
  syncSellSegment,
  deleteIPCCSegment,
} from '@/services/ipcc';
import {
  getSegment,
  createSegment,
  updateSegment,
  deleteSegment,
  pitchCreateSegment,
} from '@/services/segment';
import { read, utils } from 'xlsx';

const TableList = () => {
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [filterParams, setfilterParams] = useState();
  const [modalVisit, setModalVisit] = useState(false);

  const [currentSegRow, setCurrentSegRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

  const [modalSegVisit, setModalSegVisit] = useState(false);

  const handleRemove = async (selectedRows) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return;

    try {
      await deleteIPCCSegment({
        key: selectedRows.map((row) => row._id),
      });
      hide();
      message.success('删除成功');
      actionRef.current.reloadAndRest();
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
    }
  };

  const syncSegment = async (record) => {
    const syncRes = await syncSellSegment(record);

    if (syncRes.status) {
      message.success('提交成功');

      actionRef.current.reloadAndRest();
    } else {
      message.error('提交失败，请重试');
    }
  };

  const delIPCC = async (record) => {
    // console.log(values);
    // return;
    const delRes = await deleteIPCC(record._id);

    if (delRes.status) {
      message.success('提交成功');

      actionRef.current.reloadAndRest();
    } else {
      message.error('提交失败，请重试');
    }
  };

  const delSegment = async () => {
    // console.log(values);
    // return;
    const delRes = await deleteSegment(currentSegRow._id);

    if (delRes.status) {
      message.success('提交成功');
    } else {
      message.error('提交失败，请重试');
    }
  };

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
      title: <FormattedMessage id="supplierName" defaultMessage="供应商名称" />,
      dataIndex: 'supplierName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCCId" defaultMessage="IPCCId" />,
      dataIndex: 'IPCCId',
      valueType: 'IPCCId',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: <FormattedMessage id="IPCCType" defaultMessage="IPCC类型" />,
      dataIndex: 'IPCCType',
      valueEnum: {
        search: {
          text: '查询/订位',
        },
        booking: {
          text: '订位',
        },
      },
    },

    {
      title: <FormattedMessage id="GDS" defaultMessage="查询渠道" />,
      dataIndex: 'GDS',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="GDSBooking" defaultMessage="订位渠道" />,
      dataIndex: 'GDSBooking',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="IPCC" defaultMessage="IPCC" />,
      dataIndex: 'IPCC',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="startDays" defaultMessage="可预订几天(不含)后机票" />,
      dataIndex: 'startDays',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="endDays" defaultMessage="可预定结束天数" />,
      dataIndex: 'endDays',
      valueType: 'textarea',
      hideInSearch: true,
    },

    {
      title: <FormattedMessage id="shoppingApi" defaultMessage="shoppingApi" />,
      dataIndex: 'shoppingApi',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },

    {
      title: <FormattedMessage id="checkApi" defaultMessage="checkApi" />,
      dataIndex: 'checkApi',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },

    {
      title: <FormattedMessage id="bookingApi" defaultMessage="bookingApi" />,
      dataIndex: 'bookingApi',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },

    {
      title: <FormattedMessage id="ticketApi" defaultMessage="ticketApi" />,
      dataIndex: 'ticketApi',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
    },

    {
      title: <FormattedMessage id="changeApi" defaultMessage="changeApi" />,
      dataIndex: 'changeApi',
      valueType: 'textarea',
      hideInSearch: true,
      // hideInTable: true,
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
          key="delete"
          onClick={() => {
            // action?.startEditable?.(record.id);
            setCurrentRow(record);
            delIPCC(record);
          }}
        >
          删除
        </a>,
        <a
          key="syncSegment"
          onClick={() => {
            if (JSON.parse(localStorage.currentUser).role === 'admin') {
              setCurrentRow(record);
              syncSegment(record);
            } else {
              message.error('您没有权限同步售卖航线');
            }
          }}
        >
          同步航线
        </a>,
      ],
    },
  ];

  const parseExcel = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 获取行范围，从第三行到最后一行
      const range = utils.decode_range(worksheet['!ref']);
      range.s.r = 1; // 第三行索引为2
      worksheet['!ref'] = utils.encode_range(range);

      const rows = utils.sheet_to_json(worksheet, { header: 1 });

      const headers = rows[0];
      const mappedData = rows.slice(1).map((row) => {
        const processedRow = row.map((cell) => (cell !== undefined ? cell : ''));
        const rowData = {};
        if (processedRow.length == 0) {
          return;
        }
        headers.forEach((header, index) => {
          try {
            const key = mapIndexToKey(index);
            if (key == 'departArrivalType') {
              const { departType, arrivalType } = mapValue(key, processedRow[index]);
              rowData['departType'] = departType;
              rowData['arrivalType'] = arrivalType;
            } else {
              const value = mapValue(key, processedRow[index]);
              rowData[key] = value;
            }
          } catch (ex) {
            console.warn(index);
            console.warn(mapIndexToKey(index));
            console.warn(mapIndexToKey(processedRow[index]));
            throw ex;
          }
        });

        rowData['group'] = JSON.parse(localStorage.currentUser).group;
        rowData['IPCCId'] = currentRow.IPCCId;

        return rowData;
      });

      console.log(mappedData);
      await pitchCreateSegment(mappedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // 根据索引映射对应的键名
  const mapIndexToKey = (index) => {
    const mapping = {
      0: 'departArrivalType',
      1: 'depart',
      2: 'arrival',
      3: 'tripType',
      4: 'startDays',
      5: 'endDays',
      6: 'vendibilityCompanies',
      8: 'overWrite',
      9: 'cabinType',
    };

    return mapping[index];
  };

  const mapValue = (key, value) => {
    if (key == 'overWrite') {
      return value === '是' ? 'yes' : 'no';
    } else if (key == 'departArrivalType') {
      console.log(value);
      const da = value.split('-');
      let departType = da[0];
      let arrivalType = da[1];

      departType = mapType(departType);
      arrivalType = mapType(arrivalType);
      return { departType, arrivalType };
    } else {
      return value;
    }
  };

  const mapType = (value) => {
    switch (value) {
      case '城市':
        return 'City';
      case '洲':
        return 'Continent';
      case '全球':
        return 'Global';
      case '国家':
        return 'Country';
    }
  };

  const expandedRowRender = (record) => {
    setCurrentRow(record);

    return (
      <ProTable
        columns={[
          {
            title: <FormattedMessage id="_id" defaultMessage="_id" />,
            dataIndex: '_id',
            valueType: 'textarea',
            hideInSearch: true,
            hideInTable: true,
          },
          {
            title: <FormattedMessage id="IPCCId" defaultMessage="IPCCId" />,
            dataIndex: 'IPCCId',
            valueType: 'textarea',
            hideInSearch: true,
            hideInTable: true,
          },
          {
            title: <FormattedMessage id="segmentId" defaultMessage="segmentId" />,
            dataIndex: 'segmentId',
            valueType: 'textarea',
            hideInSearch: true,
            hideInTable: true,
          },

          {
            title: <FormattedMessage id="departType" defaultMessage="出发类型" />,
            dataIndex: 'departType',
            valueEnum: {
              Global: {
                text: '全球',
              },
              Continent: {
                text: '洲',
              },
              Country: {
                text: '国家',
              },
              City: {
                text: '城市',
              },
            },
          },

          {
            title: <FormattedMessage id="arrivalType" defaultMessage="到达类型" />,
            dataIndex: 'arrivalType',
            valueEnum: {
              Global: {
                text: '全球',
              },
              Continent: {
                text: '洲',
              },
              Country: {
                text: '国家',
              },
              City: {
                text: '城市',
              },
            },
          },

          {
            title: <FormattedMessage id="depart" defaultMessage="出发" />,
            dataIndex: 'depart',
            valueType: 'textarea',
          },
          {
            title: <FormattedMessage id="arrival" defaultMessage="到达" />,
            dataIndex: 'arrival',
            valueType: 'textarea',
          },

          {
            title: <FormattedMessage id="tripType" defaultMessage="航程类型" />,
            dataIndex: 'tripType',
            valueEnum: {
              OW: {
                text: '单程',
              },
              RT: {
                text: '往返',
              },
              ALL: {
                text: '全部',
              },
            },
          },
          {
            title: <FormattedMessage id="startDays" defaultMessage="可预订几天(不含)后机票" />,
            dataIndex: 'startDays',
            valueType: 'textarea',
            hideInSearch: true,
          },
          {
            title: <FormattedMessage id="endDays" defaultMessage="可预定结束天数" />,
            dataIndex: 'endDays',
            valueType: 'textarea',
            hideInSearch: true,
          },
          {
            title: <FormattedMessage id="cabinType" defaultMessage="可售舱等" />,
            dataIndex: 'cabinType',
            valueType: 'textarea',
            hideInSearch: true,
          },
          {
            title: <FormattedMessage id="vendibilityCompanies" defaultMessage="可售航司" />,
            dataIndex: 'vendibilityCompanies',
            valueType: 'textarea',
            hideInSearch: true,
          },
          {
            title: <FormattedMessage id="overWrite" defaultMessage="是否覆盖" />,
            dataIndex: 'overWrite',
            hideInSearch: true,
            valueEnum: {
              yes: {
                text: '是',
              },
              no: {
                text: '否',
              },
            },
          },
          {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: (text, record, _, action) => [
              <a
                key="segmentEdit"
                onClick={() => {
                  setCurrentSegRow(record);
                  setModalSegVisit(true);
                }}
              >
                编辑
              </a>,
              <a
                key="segmentDel"
                onClick={() => {
                  // action?.startEditable?.(record.id);
                  setCurrentSegRow(record);
                  delSegment();
                }}
              >
                删除
              </a>,
            ],
          },
        ]}
        headerTitle={false}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        rowKey={(record) => record._id}
        options={false}
        pagination={false}
        request={async (params) => {
          params.IPCCId = currentRow.IPCCId;
          params.group = JSON.parse(localStorage.currentUser).group;
          const segmentRes = await getSegment(params);

          return {
            data: segmentRes.content,

            success: segmentRes.status,

            total: segmentRes.content.length,
          };
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentSegRow(null);
              setModalSegVisit(true);
            }}
          >
            <PlusOutlined />
            新建航线
          </Button>,
          <Upload beforeUpload={parseExcel}>
            <Button icon={<UploadOutlined />}>导入航线</Button>
          </Upload>,
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle={'IPCC列表'}
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        params={filterParams}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        expandable={{ expandedRowRender }}
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
            新建IPCC
          </Button>,
        ]}
        form={{
          ignoreRules: false,
        }}
        request={async (params) => {
          params.group = JSON.parse(localStorage.currentUser).group;
          const ipccRes = await getIPCC(params);

          return {
            data: ipccRes.content,

            success: ipccRes.status,

            total: ipccRes.content.length,
          };
        }}
        columns={columns}
      />

      <IPCCForm
        title="IPCC编辑"
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        values={currentRow || {}}
        onFinish={async (values) => {
          // console.log(values);
          // return;
          const editType = currentRow._id ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentRow._id;
            const editRes = await updateIPCC(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            values.group = JSON.parse(localStorage.currentUser).group;
            const createRes = await createIPCC(values);
            if (createRes.status) {
              message.success('提交成功');
              setModalVisit(false);
            } else {
              message.error('提交失败，请重试');
            }
          }
        }}
      />

      <SegmentForm
        title="航线编辑"
        modalVisit={modalSegVisit}
        setModalVisit={setModalSegVisit}
        values={currentSegRow || currentRow}
        onFinish={async (values) => {
          // console.log(values);
          // return;
          const editType = currentSegRow ? 'edit' : 'add';
          if (editType == 'edit') {
            values._id = currentSegRow._id;
            const editRes = await updateSegment(values);
            if (editRes.status) {
              message.success('提交成功');
              setModalSegVisit(false);
              actionRef.current.reloadAndRest();
            } else {
              message.error('提交失败，请重试');
            }
          } else {
            values.group = JSON.parse(localStorage.currentUser).group;
            values.IPCCId = currentRow.IPCCId;
            const createRes = await createSegment(values);
            if (createRes.status) {
              message.success('提交成功');
              setModalSegVisit(false);
            } else {
              message.error('提交失败，请重试');
            }
          }
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
            <FormattedMessage id="批量删除航线" defaultMessage="批量删除航线" />
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
