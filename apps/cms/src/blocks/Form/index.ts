import type { Block } from 'payload'

import richText from '../../fields/richText'

/**
 * フォームブロック
 * フォームを埋め込むためのブロック（フォームコレクションが必要）
 */
export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Form Block',
    plural: 'Form Blocks',
  },
  graphQL: {
    singularName: 'FormBlock',
  },
  fields: [
    {
      name: 'formContent',
      type: 'textarea',
      label: 'Form Content',
      required: true,
    },
    {
      name: 'enableIntro',
      label: 'Enable Intro Content',
      type: 'checkbox',
    },
    richText({
      name: 'introContent',
      label: 'Intro Content',
      admin: {
        condition: (_: any, siblingData: any) => Boolean(siblingData?.enableIntro),
      },
    }),
  ],
}
