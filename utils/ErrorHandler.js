module.exports = (ctx, { message, status }) => {
  ctx.status = status;
  ctx.body = { error: message };
};