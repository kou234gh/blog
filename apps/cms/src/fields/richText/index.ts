import type { Field } from 'payload'

import deepMerge from '../../utilities/deepMerge'

type RichText = (overrides?: Partial<Field>) => Field

/**
 * リッチテキストフィールドを生成する
 * @param overrides - フィールド定義の上書き設定
 * @returns リッチテキストフィールドの定義
 */
const richText: RichText = (overrides) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    overrides || {},
  )

export default richText
