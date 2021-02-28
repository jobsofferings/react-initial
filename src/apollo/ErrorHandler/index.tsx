import { notification } from 'antd'
import { get } from 'lodash'
import { ApolloError, isApolloError } from 'apollo-client'
import { NotificationInstance, ArgsProps } from 'antd/lib/notification'
import { GraphQLError, ExecutionResult } from 'graphql'
import './index.less'

export type NotifyFunc<T> = (msg: Error | string) => T
export type NotifyMsgType = keyof NotificationInstance
export type NotifyMsgConfig = Omit<ArgsProps, 'message' | 'key'>
export type NotifyMsgFunc<T = void> = (
  msg: Error | string,
  type?: NotifyMsgType,
  config?: NotifyMsgConfig,
) => T
export interface ApolloResult extends ExecutionResult {
  error?: ApolloError
}

const NotificationErrorKey = 'notification'

notification.config({
  placement: 'topRight',
  top: 80,
  duration: 3,
})

const AUTH_CODES = ['74017', '74007', 'UNAUTHENTICATED']
const isUnauthError = (e: GraphQLError) =>
  AUTH_CODES.find((code) => code === get(e, 'extensions.code'))

export const handleUnauthError = (error: ApolloError['graphQLErrors']) => {
  for (let err of error) {
    if (isUnauthError(err)) {
      // toLogin()
    }
  }
}

export const handleErrorInRes = (res?: ApolloResult) => {
  if (!res) return
  let errorObj = res.errors ? { graphQLErrors: res.errors } : res.error
  let msg = ''
  if (errorObj) {
    msg = getApolloErrorMsg(errorObj as ApolloError)
    notifyMsg(msg)
  }
  return msg
}

export const getApolloErrorMsg = (error: ApolloError) => {
  const { graphQLErrors, networkError } = error
  if (networkError) return '网络错误'
  return graphQLErrors
    .map((e) => e.message)
    .filter((msg) => !!msg)
    .join('\n')
}

export const getNotifyMsg: NotifyFunc<string> = (msg) => {
  if (!msg) return ''
  if (typeof msg === 'string') return msg
  if (isApolloError(msg)) {
    return getApolloErrorMsg(msg)
  }
  return msg instanceof Error ? msg.message : ''
}

export const notifyMsg: NotifyMsgFunc = (msg, type = 'error', config) => {
  notification.close(NotificationErrorKey)
  notification[type]({
    message: getNotifyMsg(msg),
    key: NotificationErrorKey,
    icon: null,
    className: 'notify-msg',
    ...config,
  })
}

export default notifyMsg
