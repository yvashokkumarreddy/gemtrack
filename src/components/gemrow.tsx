import type { GemItem } from '@/types/gem'

interface GemRowProps {
  item: GemItem
}

export function GemRow({ item }: GemRowProps) {
  return (
    <tr>
      <td>{item.sku}</td>
      <td>{item.name}</td>
      <td>{item.caratWeight}</td>
      <td>{item.color}</td>
      <td>{item.clarity}</td>
      <td>{item.cut}</td>
      <td>{item.price}</td>
      <td>{item.status}</td>
    </tr>
  )
}