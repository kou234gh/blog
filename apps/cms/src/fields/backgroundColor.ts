import type { Field, SelectField } from 'payload'

import deepMerge from '../utilities/deepMerge'

interface Args {
  overrides?: Partial<SelectField>
}

/**
 * 背景色選択フィールドを生成する
 * @param overrides - フィールド定義の上書き設定
 * @returns 背景色選択フィールドの定義
 */
export const backgroundColor = ({ overrides = {} }: Args): Field =>
  deepMerge(
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Black',
          value: 'black',
        },
      ],
    },
    overrides,
  )
