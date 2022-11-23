import { Message } from 'element-ui'

/**
 * 成功消息彈窗
 * @param message
 */
export function assertSuccessMessage(message) {
  Message({
    message: message,
    type: 'success',
    duration: 5 * 1000
  })
}
/**
 * 失敗消息彈窗
 * @param message
 */
export function assertFailMessage(message) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
}
/**
 * 普通消息彈窗
 * @param message
 */
export function assertNormalMessage(message) {
  Message({
    message: message,
    type: 'info',
    duration: 5 * 1000
  })
}
