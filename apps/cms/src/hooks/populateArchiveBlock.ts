import type { CollectionAfterReadHook } from 'payload'

/**
 * アーカイブブロックのデータを自動的に取得して注入するフック
 * populateBy が 'collection' の場合、指定されたコレクションからデータを取得する
 */
export const populateArchiveBlock: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  // layout が存在しない場合は早期リターン
  if (!doc.layout) {
    return doc
  }

  // アーカイブブロックがある場合、populateBy が 'collection' なら自動取得
  const layoutWithArchive = await Promise.all(
    doc.layout.map(async (block: any) => {
      if (block.blockType === 'archive') {
        const archiveBlock = block as any & {
          populatedDocs: Array<{
            relationTo: 'posts'
            value: string
          }>
        }

        if (archiveBlock.populateBy === 'collection') {
          const res: { totalDocs: number; docs: any[] } = await payload.find({
            collection: archiveBlock.relationTo,
            limit: archiveBlock.limit || 10,
            where: {},
            sort: '-publishedDate',
          })

          return {
            ...block,
            populatedDocsTotal: res.totalDocs,
            populatedDocs: res.docs.map((thisDoc: any) => ({
              relationTo: archiveBlock.relationTo,
              value: thisDoc.id,
            })),
          }
        }
      }

      return block
    }),
  )

  return {
    ...doc,
    layout: layoutWithArchive,
  }
}
