import type { ArrayField, Field } from 'payload'

import deepMerge from '../utilities/deepMerge'
import type { LinkAppearances } from './link'
import link from './link'

type LinkGroupType = (options?: {
  overrides?: Partial<ArrayField>
  appearances?: LinkAppearances[] | false
}) => Field

/**
 * リンクグループフィールドを生成する
 * 複数のリンクを配列として管理できる
 * @param overrides - フィールド定義の上書き設定
 * @param appearances - 各リンクの表示スタイル
 * @returns リンクグループフィールドの定義
 */
const linkGroup: LinkGroupType = ({ overrides = {}, appearances } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      link({
        appearances,
      }),
    ],
  }

  return deepMerge(generatedLinkGroup, overrides)
}

export default linkGroup
