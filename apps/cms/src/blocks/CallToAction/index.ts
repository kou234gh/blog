import type { Block } from 'payload'

import { backgroundColor } from '../../fields/backgroundColor'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'

/**
 * Call to Actionブロック
 * 行動喚起用のセクション
 */
export const CallToAction: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    backgroundColor({ overrides: { name: 'ctaBackgroundColor' } }),
    richText(),
    linkGroup({
      appearances: ['primary', 'secondary'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
}
