export default function sortNodes(data) {
  return Object.fromEntries(Object.entries(data)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value.sort((a, b) => a['sort'] - b['sort']).map(el => sortNodes(el))
      } else if (typeof value === 'object' && key === 'children') {
        value = Object.fromEntries(Object.entries(value)
          .sort(([keyA, valueA], [keyB, valueB]) => valueA.sort - valueB.sort)
          .map(([key, value]) => [key, sortNodes(value)])
        )
      }

      return [key, value]
    }))
}
