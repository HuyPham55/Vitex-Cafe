import { Coffee, DollarSign, Users, Clock, CheckCircle, MoreVertical, Filter, Download } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Today's performance and live orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-background-dark/50 border border-primary/20 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary/5 transition-colors">
            <Filter className="size-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            <Download className="size-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <DollarSign className="size-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">$1,245.00</h3>
        </div>
        
        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Coffee className="size-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+8.2%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Orders</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">142</h3>
        </div>

        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
              <Users className="size-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">0.0%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">New Customers</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">24</h3>
        </div>

        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
              <Clock className="size-6" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">+1.2m</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Avg. Prep Time</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">4m 12s</h3>
        </div>
      </div>

      {/* Live Orders Table */}
      <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-primary/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Live Orders Queue
          </h3>
          <div className="flex gap-2">
            <button className="text-xs font-bold px-3 py-1.5 rounded-md bg-primary text-white">All (12)</button>
            <button className="text-xs font-bold px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">New (4)</button>
            <button className="text-xs font-bold px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">Brewing (5)</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-primary/5">
              
              {/* Row 1 - New */}
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold text-primary">#402</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-slate-100">John D.</p>
                  <p className="text-xs text-slate-500">Mobile App</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-slate-100">1x Caramel Macchiato</p>
                  <p className="text-xs text-slate-500">Large, Extra Caramel</p>
                </td>
                <td className="px-6 py-4 text-slate-500">2 mins ago</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    <div className="size-1.5 rounded-full bg-blue-500"></div> New
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-primary text-white rounded hover:bg-primary/90" title="Start Brewing">
                      <Coffee className="size-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 - Brewing */}
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold text-primary">#401</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Sarah M.</p>
                  <p className="text-xs text-slate-500">In-Store Kiosk</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-slate-100">1x Cold Brew</p>
                  <p className="text-xs text-slate-500">Oat Milk, Light Ice</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">1x Butter Croissant</p>
                </td>
                <td className="px-6 py-4 text-slate-500">6 mins ago</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800">
                    <div className="size-1.5 rounded-full bg-orange-500 animate-pulse"></div> Brewing
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600" title="Mark Ready">
                      <CheckCircle className="size-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3 - Ready */}
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group bg-slate-50/30 dark:bg-white/5">
                <td className="px-6 py-4 font-bold text-slate-500">#400</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Michael R.</p>
                  <p className="text-xs text-slate-500">Mobile App</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-slate-100">2x Double Espresso</p>
                </td>
                <td className="px-6 py-4 text-slate-500">12 mins ago</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800">
                    <div className="size-1.5 rounded-full bg-green-500"></div> Ready
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold px-3">
                      Complete
                    </button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
