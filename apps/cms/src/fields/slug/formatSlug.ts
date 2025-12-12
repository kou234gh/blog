import type { FieldHook } from 'payload'

/**
 * 文字列をスラッグ形式にフォーマットする
 * - スペースをハイフンに変換
 * - 英数字とハイフン以外を削除
 * - 小文字に変換
 */
const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

/**
 * スラッグをフォーマットするフックを生成する
 * @param fallback - スラッグが指定されていない場合に使用するフィールド名
 * @returns フィールドフック関数
 */
const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    // 作成時にスラッグが指定されていない場合、fallbackフィールドから生成
    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

export default formatSlug
