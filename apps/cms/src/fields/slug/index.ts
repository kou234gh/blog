import type { Field } from 'payload'

import deepMerge from '../../utilities/deepMerge'
import formatSlug from '../../hooks/formatSlug'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

/**
 * スラッグフィールドを生成する
 * @param fieldToUse - スラッグ生成元のフィールド名（デフォルト: 'title'）
 * @param overrides - フィールド定義の上書き設定
 * @returns スラッグフィールドの定義
 */
export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
