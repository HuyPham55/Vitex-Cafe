import { Plus, Search, Filter, Edit, Trash2, MoreVertical, Sliders } from 'lucide-react';

export default function AdminMenu() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Menu Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage products, categories, and variants.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
          <Plus className="size-4" /> Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Menu List */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-primary/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button className="text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white whitespace-nowrap">All Items</button>
                <button className="text-sm font-bold px-4 py-2 rounded-lg bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap">Espresso</button>
                <button className="text-sm font-bold px-4 py-2 rounded-lg bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap">Lattes</button>
                <button className="text-sm font-bold px-4 py-2 rounded-lg bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap">Cold Drinks</button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input className="w-full pl-9 pr-3 py-2 bg-white dark:bg-background-dark border border-primary/20 rounded-lg focus:ring-1 focus:ring-primary text-sm outline-none" placeholder="Search items..." type="text" />
                </div>
                <button className="p-2 border border-primary/20 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                  <Filter className="size-4" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5">
                    <th className="px-6 py-4 font-semibold">Item</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Base Price</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-primary/5">
                  
                  {/* Item 1 */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqxTQmid1lbZfKsKmx88LzOVmWPE2QbbAcAhquVLrv-Rodv1PAwTPzxKdHAfglaxs0tlmMQMAfMSeZfxVfWOOd6R_Eg_htkzSa9zgzeczpklEEYkPLZtDjU1EVUjYdtrVftKJ4BUSoKtAYDT2_jnmlZMOOFO-Wo_hmgVQq8wTqE0xD_uKA37UvGTesYKoP_l0zhmRCB-PNcZoBEgZ7R7nmzloL9084ctmFME0Si4lUtoI1hrcovJWUTdCeBqyjnWk3MRRqgwbe")' }}></div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">Signature Iced Latte</p>
                          <p className="text-xs text-primary">3 Variants Linked</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Cold Drinks</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">$5.50</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 2 */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbQIeoGOlULjaVq3mWKB-HzIwIuq-EZIFiA4nc6eS2ole1_eRJ7C1yrnScBEJKfZ0KU4n0dYYppLkFfCyFdWncmTEcE3yN_qKIg5sKvnk2NU0FMOlK_vWzFxEAJS-mbM22eXtSOYM4ADvOrkWWWguQAVvZOCQ6NTJ9EPKU-_j9xsviX6u9Aq7KHgVruEoRBhmXDhNASVwVADuT_vx2KKVkBMLYBy4Cbuu4_5a9UAV2bI3BbrEekpUoFsWAtLg-JDe7OCaYGcr-")' }}></div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">Double Espresso</p>
                          <p className="text-xs text-slate-500">No Variants</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Espresso</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">$3.50</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Item 3 */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group opacity-60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCyor6kX_YGwThWivnNbcAddOpLC-Fndby-USPym63L2eztQJetBsiowEBugchkuiZTL_doY_43chBBBSVrK1wCopcU4Gg2WPBUnrN5G1FRDpCMVrSIUFd6FHqdU_KAEQ5hQlk0nMGrc-WldB3_skdxCC5rzfl9dSV6-FTxwOfP5Yxh6GBKOETD_VN04kd1G3egAp0X58OZYIIGbhvyHSTdpBK7fiFicX5QpPY49EcrEkl32q8sQEikn4ZytKdgHP-TwVibAS2")' }}></div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">Honey Lavender Latte</p>
                          <p className="text-xs text-primary">2 Variants Linked</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Lattes</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">$5.75</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        Draft
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                          <Edit className="size-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-primary/10 flex justify-between items-center text-sm text-slate-500">
              <span>Showing 1-3 of 24 items</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-primary/20 rounded hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 border border-primary/20 rounded bg-primary text-white">1</button>
                <button className="px-3 py-1 border border-primary/20 rounded hover:bg-slate-50 dark:hover:bg-white/5">2</button>
                <button className="px-3 py-1 border border-primary/20 rounded hover:bg-slate-50 dark:hover:bg-white/5">3</button>
                <button className="px-3 py-1 border border-primary/20 rounded hover:bg-slate-50 dark:hover:bg-white/5">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Variants Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-primary/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="size-5 text-primary" /> Global Variant Types
              </h3>
              <button className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Add Variant Type">
                <Plus className="size-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Define options that can be applied to multiple menu items.</p>
              
              {/* Variant Group 1 */}
              <div className="border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Size</h4>
                    <p className="text-xs text-slate-500">Single Choice</p>
                  </div>
                  <button className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Small (+$0.00)</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Medium (+$0.50)</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Large (+$1.00)</span>
                </div>
              </div>

              {/* Variant Group 2 */}
              <div className="border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Milk Options</h4>
                    <p className="text-xs text-slate-500">Single Choice</p>
                  </div>
                  <button className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Whole (+$0.00)</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Skim (+$0.00)</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Oat (+$0.75)</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Almond (+$0.75)</span>
                </div>
              </div>

              {/* Variant Group 3 */}
              <div className="border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Ice Level</h4>
                    <p className="text-xs text-slate-500">Single Choice</p>
                  </div>
                  <button className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Regular Ice</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Light Ice</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">No Ice</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
