import { jwtPayloadRole } from '~/utils/jwtRole';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/admin/login') return;

  const token = useCookie<string | null>('admin_token');
  if (!token.value) {
    return navigateTo('/admin/login');
  }
  if (jwtPayloadRole(token.value) !== 'admin') {
    return navigateTo('/admin/login?forbidden=1');
  }
});
