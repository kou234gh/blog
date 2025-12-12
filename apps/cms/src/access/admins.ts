import type { Access } from 'payload'

import { checkRole } from '../collections/Users/checkRole'

/**
 * 管理者権限をチェックするアクセス制御関数
 * ユーザーが管理者ロールを持っているかを検証する
 */
export const admins: Access = ({ req: { user } }) => {
  return checkRole(['admin'], user || undefined)
}
