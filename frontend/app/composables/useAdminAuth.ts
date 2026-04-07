import { jwtPayloadRole } from '~/utils/jwtRole';

export function useAdminAuth() {
  const { token } = useAdminApi();

  function logout() {
    token.value = null;
    navigateTo('/admin/login');
  }

  function assertAdminToken(): boolean {
    if (!token.value) return false;
    return jwtPayloadRole(token.value) === 'admin';
  }

  return { token, logout, assertAdminToken };
}
