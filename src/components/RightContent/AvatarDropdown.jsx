import React, { useCallback, useState } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, message } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { outLogin } from '@/services/ant-design-pro/api';
import { changePassword } from '@/services/staff';
/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query; // Note: There may be security issues, please note

  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const changePwd = async ({id ,oldPwd, newPwd}) => {
  const {msg, status} = await changePassword({
    id,
    oldPwd,
    newPwd,
  })
  if(!status){
    message.error(msg);
    return
  }
  await loginOut();
}

const AvatarDropdown = ({ menu }) => {
  const [modalVisit, setModalVisit] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }

      if(key === 'changePwd') {
        setModalVisit(true);
        return
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="changePwd">
        <UserOutlined />
        修改密码
      </Menu.Item>

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        <ModalForm
          title="修改密码"
          visible={modalVisit}
          onFinish={(d)=>changePwd({...d, id: currentUser._id})}
          onOpenChange={setModalVisit}
          modalProps={{
            destroyOnClose: true,
            onCancel: () => {
              setModalVisit(false);
            },
          }}
          >
            <ProFormText.Password
              width="md"
              name="oldPwd"
              label="旧密码"
              rules={[{ required: true, message: '请输入旧密码!' }]}
            />
            <ProFormText.Password
              width="md"
              name="newPwd"
              label="新密码"
              rules={[{ required: true, message: '请输入新密码!' }]}
            />
          </ModalForm>
      </span>
      
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
