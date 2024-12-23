export const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Amount (High to Low)', value: 'amountDesc' },
  { label: 'Amount (Low to High)', value: 'amountAsc' },
];

export const sortItems = (items, sortBy) => {
  const sorted = [...items];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    case 'amountDesc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amountAsc':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
};

export const filterItems = (items, category, searchText) => {
  return items.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = searchText === '' || 
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText);
    return matchesCategory && matchesSearch;
  });
};
