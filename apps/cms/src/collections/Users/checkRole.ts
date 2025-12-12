import type { User } from '../../payload-types'

/**
 * ユーザーが指定されたロールを持っているかチェックする
 * @param allRoles - チェックするロールの配列
 * @param user - チェック対象のユーザー
 * @returns ユーザーがいずれかのロールを持っている場合はtrue
 */
export const checkRole = (allRoles: string[] = [], user?: User): boolean => {
  if (user && 'roles' in user) {
    const userRoles = user.roles as string[] | undefined
    if (
      allRoles?.some((role) => {
        return userRoles?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}
