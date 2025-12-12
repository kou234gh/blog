import type { CollectionAfterChangeHook } from 'payload'

/**
 * ホームページの場合は '/' に、それ以外は '/slug' の形式でURLを生成する
 */
export const formatAppURL = ({ doc }: { doc: any }): string => {
  const pathToUse = doc.slug === 'home' ? '' : doc.slug
  const { pathname } = new URL(`${process.env.PAYLOAD_PUBLIC_SITE_URL}/${pathToUse}`)
  return pathname
}

/**
 * ページの変更後に再検証APIを呼び出すフック
 * バックグラウンドで実行されるため、ユーザーは待つ必要がない
 */
export const revalidatePage: CollectionAfterChangeHook = ({ doc, req }) => {
  const revalidate = async (): Promise<void> => {
    let url

    try {
      url = formatAppURL({ doc })
      const res = await fetch(
        `${process.env.PAYLOAD_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_KEY}&revalidatePath=${url}`,
      )

      if (res.ok) {
        req.payload.logger.info(`Revalidated path ${url}`)
      } else {
        req.payload.logger.error(`Error revalidating path ${url}`)
      }
    } catch (err: unknown) {
      req.payload.logger.error(`Error hitting revalidate route for ${url}`)
    }
  }

  revalidate()

  return doc
}
