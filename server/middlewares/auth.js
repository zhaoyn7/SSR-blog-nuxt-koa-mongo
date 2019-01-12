module.exports = {
  // 定义函数，检查用户是否已登录，如未登录，则执行相关逻辑逻辑
  async checkLogin (ctx, next) {
    if (!ctx.session.user) {
      ctx.throw(401, '请登录')
    }
    await next()
  }
}