import type { GemItem } from '@/types/gem'
import { GemRow } from '@/components/gemrow'
import { groupBy } from '@/utils/groupBy'



const items: GemItem[] = [
  {
    id: '1',
    sku: 'GEM-001',
    name: 'Round Brilliant Diamond',
    caratWeight: 1.2,
    color: 'F',
    clarity: 'VS1',
    cut: 'Excellent',
    cost: 5000,
    price: 7500,
    status: 'in_stock',
  },
  {
    id: '2',
    sku: 'GEM-002',
    name: 'Princess Cut Diamond',
    caratWeight: 0.8,
    color: 'G',
    clarity: 'VVS2',
    cut: 'Very Good',
    cost: 3000,
    price: 4500,
    status: 'sold',
  },
  {
    id: '3',
    sku: 'GEM-003',
    name: 'Emerald Cut Diamond',
    caratWeight: 1.5,
    color: 'H',
    clarity: 'SI1',
    cut: 'Good',
    cost: 4000,
    price: 6000,
    status: 'on_memo',
  },
  {
    id: '4',
    sku: 'GEM-004',
    name: 'Oval Cut Diamond',
    caratWeight: 1.0,
    color: 'D',
    clarity: 'IF',
    cut: 'Excellent',
    cost: 6000,
    price: 9000,
    status: 'in_stock',
  },
  {
    id: '5',
    sku: 'GEM-005',
    name: 'Cushion Cut Diamond',
    caratWeight: 1.3,
    color: 'E',
    clarity: 'VS2',
    cut: 'Very Good',
    cost: 5500,
    price: 8250,
    status: 'sold',
  },
  {
    id: '6',
    sku: 'GEM-006',
    name: 'Pear Cut Diamond',
    caratWeight: 0.9,
    color: 'F',
    clarity: 'VVS1',
    cut: 'Good',
    cost: 3500,
    price: 5250,
    status: 'on_memo',
  },
  // add 4 more, and vary the statuses: 'sold', 'on_memo', 'in_stock'
]
const grouped = groupBy(items, 'caratWeight')
console.log(grouped)
function App() {
  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Carat Weight</th>
          <th>Color</th>
          <th>Clarity</th>
          <th>Cut</th>
          <th>Price</th>
          <th>Status</th>
          {/* add the rest of the column headings, in the same order as GemRow */}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <GemRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  )
}

export default App