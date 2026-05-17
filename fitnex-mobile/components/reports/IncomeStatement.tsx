'use client';

import Card from '@/components/ui/Card';

interface IncomeStatementProps {
  revenue: number;
  expenses: number;
  netIncome: number;
}

export default function IncomeStatement({ revenue, expenses, netIncome }: IncomeStatementProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Income Statement</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-gray-700">Total Revenue</span>
          <span className="text-lg font-semibold text-green-600">
            ${revenue.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <span className="text-gray-700">Total Expenses</span>
          <span className="text-lg font-semibold text-red-600">
            ${expenses.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700 font-medium">Net Income</span>
          <span className={`text-lg font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netIncome.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
