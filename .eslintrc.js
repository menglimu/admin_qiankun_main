/*
 * @Author: wenlin
 * @Date: 2020-05-06 16:28:59
 * @LastEditors: wenlin
 * @LastEditTime: 2020-11-11 14:36:58
 * @Description:
 *
 * "off" 或 0 - 关闭规则
 * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
 * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
 */

// 1. 关闭段落校验
// /* eslint-disable */
// /* eslint-enable */
// 2. 关闭当前行校验
// // eslint-disable-line
// 3. 关闭下一行校验
// // eslint-disable-next-line

module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {},
  extends: ["./node_modules/ml-lint/.eslintrc.js"],
};
