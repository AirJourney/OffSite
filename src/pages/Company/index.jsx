import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Image } from 'antd';
import { getCompanyList } from '@/services/company';

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
      title: <FormattedMessage id="companyCode" defaultMessage="航司编码" />,
      dataIndex: 'companyCode',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="companyCName" defaultMessage="航司简体名" />,
      dataIndex: 'companyCName',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: <FormattedMessage id="companyEName" defaultMessage="航司英文名" />,
      dataIndex: 'companyEName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="companyName" defaultMessage="航司繁体名" />,
      dataIndex: 'companyName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="logoUrl" defaultMessage="航司图标" />,
      dataIndex: 'logoUrl',

      hideInSearch: true,
      render: (val) => {
        if (val) {
          return <Image src={val} width={30} preview={false} />;
        } else {
          return <Image src="error" width={30} preview={false} />;
        }
      },
    },
  ];
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'companyList',
          defaultMessage: '航司列表',
        })}
        options={false}
        actionRef={actionRef}
        rowKey="companyCode"
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
          const companyRes = await getCompanyList(params);

          return {
            data: companyRes.content,

            success: companyRes.status,

            total: companyRes.content.length,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
