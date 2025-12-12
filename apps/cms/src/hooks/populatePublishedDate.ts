import type { CollectionBeforeChangeHook } from 'payload'

/**
 * 公開日を自動設定するフック
 * 作成または更新時に公開日が指定されていない場合、現在の日時を設定する
 */
export const populatePublishedDate: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    if (data && !data.publishedDate) {
      const now = new Date()
      return {
        ...data,
        publishedDate: now,
      }
    }
  }

  return data
}
