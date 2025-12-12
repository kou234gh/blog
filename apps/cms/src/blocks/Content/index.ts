import type { Block, Field } from 'payload'

import { backgroundColor } from '../../fields/backgroundColor'
import link from '../../fields/link'
import richText from '../../fields/richText'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        value: 'oneThird',
        label: 'One Third',
      },
      {
        value: 'half',
        label: 'Half',
      },
      {
        value: 'twoThirds',
        label: 'Two Thirds',
      },
      {
        value: 'full',
        label: 'Full',
      },
    ],
  },
  richText(),
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_: any, siblingData: any) => Boolean(siblingData?.enableLink),
      },
    },
  }),
]

/**
 * コンテンツブロック
 * カラムレイアウトでコンテンツを表示
 */
export const Content: Block = {
  slug: 'content',
  fields: [
    backgroundColor({}),
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
