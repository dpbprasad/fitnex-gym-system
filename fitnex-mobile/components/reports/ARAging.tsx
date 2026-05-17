'use client';

import Card from '@/components/ui/Card';

interface ARItem {
  memberName: string;
  amount: number;
  daysOverdue: number;
}

interface ARAgingProps {
  items: ARItem[];
}

export default function ARAging({ items }: ARAgingProps) {
  const getAgingColor = (days: number) => {
    if (days <= 30) return 'bg-yellow-100 text-yellow-800';
    if (days <= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getAgingLabel = (days: number) => {
    if (days <= 30) return '0-30 days';
    if (days <= 60) return '31-60 days';
    return '60+ days';
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Accounts Receivable Aging</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No overdue payments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.memberName}</p>
                  <p className="text-sm text-gray-600">${item.amount.toFixed(2)} overdue</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getAgingColor(
                    item.daysOverdue
                  )}`}
                >
                  {getAgingLabel(item.daysOverdue)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {item.daysOverdue} days overdue
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
