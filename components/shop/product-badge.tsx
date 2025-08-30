interface ProductBadgeProps {
  badge: 'Best Seller' | 'Premium' | 'Trending' | 'New'
}

export function ProductBadge({ badge }: ProductBadgeProps) {
  const getBadgeStyles = () => {
    switch (badge) {
      case 'Best Seller':
        return 'bg-gradient-to-r from-pink-500 to-rose-400 text-white'
      case 'Premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'Trending':
        return 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
      case 'New':
        return 'bg-gradient-to-r from-green-500 to-teal-400 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div
      className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${getBadgeStyles()} z-10`}
    >
      <span className="flex items-center gap-1">
        {badge === 'Best Seller' && '🔥'}
        {badge === 'Premium' && '💎'}
        {badge === 'Trending' && '📈'}
        {badge === 'New' && '✨'}
        {badge}
      </span>
    </div>
  )
}
