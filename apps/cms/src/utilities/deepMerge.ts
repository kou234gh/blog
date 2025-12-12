/**
 * オブジェクトかどうかをチェックする
 * @param item - チェック対象
 * @returns オブジェクトの場合はtrue
 */
export function isObject(item: unknown): item is Record<string, any> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 2つのオブジェクトをディープマージする
 * @param target - マージ先のオブジェクト
 * @param source - マージ元のオブジェクト
 * @returns マージされたオブジェクト
 */
export default function deepMerge<T extends Record<string, any>, R extends Record<string, any>>(
  target: T,
  source: R,
): T {
  const output: any = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
