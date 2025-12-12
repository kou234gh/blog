import type { Access } from 'payload'

import { checkRole } from '../collections/Users/checkRole'

/**
 * 管理者または公開済みコンテンツへのアクセス制御
 * 管理者はすべてのコンテンツにアクセス可能
 * 非管理者は公開済みコンテンツのみアクセス可能
 */
export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user && checkRole(['admin'], user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
