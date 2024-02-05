import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import { getExchangeList } from '@/services/exchange';

const TableList = () => {
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [filterParams, setfilterParams] = useState();
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
      title: <FormattedMessage id="fromCurrency" defaultMessage="原始币种" />,
      dataIndex: 'fromCurrency',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="toCurrency" defaultMessage="转换币种" />,
      dataIndex: 'toCurrency',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="rate" defaultMessage="汇率" />,
      dataIndex: 'rate',
      valueType: 'textarea',
      hideInSearch: true,
    },
  ];
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'exchangeList',
          defaultMessage: '汇率列表',
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
          const exchangeRes = await getExchangeList(params);

          return {
            data: exchangeRes.content,

            success: exchangeRes.status,

            total: exchangeRes.content.length,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
