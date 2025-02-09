import { HttpContext } from '@adonisjs/core/http';
import { NextFn } from '@adonisjs/core/types/http';

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user;

    // Verifique se o usuário tem o papel de admin
    if (user && user.admin) {
      await next(); // Continue a requisição
      
    } else {
      return ctx.response.unauthorized('Você não tem permissão para acessar esta rota.');
    }
  }
}
