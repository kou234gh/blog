import type { CollectionConfig } from 'payload'

import { checkRole } from './Users/checkRole'

/**
 * Usersコレクション
 * 認証とロールベースのアクセス制御を提供
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            // 最初のユーザーは自動的にadminロールを付与
            if (req.user === null && !value) {
              return ['admin']
            }
            return value
          },
        ],
      },
      access: {
        update: ({ req: { user } }) => checkRole(['admin'], user || undefined),
      },
    },
  ],
}
