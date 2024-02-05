/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    molly: currentUser && currentUser.group === 'Molly', // 超管
    admin:
      (currentUser && currentUser.role === 'admin') ||
      (currentUser && currentUser.group === 'Molly'),
    staff:
      (currentUser && (currentUser.role === 'staff' || currentUser.role === 'admin')) ||
      (currentUser && currentUser.group === 'Molly'),
    llc: currentUser && (currentUser.group === 'LCC' || currentUser.role === 'admin'),
  };
}
