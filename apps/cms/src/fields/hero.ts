import type { Field } from 'payload'

import linkGroup from './linkGroup'

/**
 * ヒーローセクションのフィールド定義
 * タイプ選択、リッチテキスト、リンクグループ、メディアを含む
 */
export const hero: Field = {
  name: 'hero',
  label: false,
  type: 'group',
  fields: [
    {
      type: 'select',
      name: 'type',
      label: 'Type',
      required: true,
      defaultValue: 'lowImpact',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      label: 'Content',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, siblingData: any) =>
          ['highImpact', 'mediumImpact'].includes(siblingData?.type),
      },
    },
  ],
}
