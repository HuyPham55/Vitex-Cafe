import Link from 'next/link';
import { Coffee, Droplets, Snowflake, Cuboid, User, FileEdit, ShoppingCart, Star, MessageSquare, Camera } from 'lucide-react';

export default function Product() {
  return (
    <div className="flex flex-col items-center w-full py-6">
      <div className="w-full max-w-[1200px] px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Product Image & Info */}
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-cover bg-center rounded-2xl shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqxTQmid1lbZfKsKmx88LzOVmWPE2QbbAcAhquVLrv-Rodv1PAwTPzxKdHAfglaxs0tlmMQMAfMSeZfxVfWOOd6R_Eg_htkzSa9zgzeczpklEEYkPLZtDjU1EVUjYdtrVftKJ4BUSoKtAYDT2_jnmlZMOOFO-Wo_hmgVQq8wTqE0xD_uKA37UvGTesYKoP_l0zhmRCB-PNcZoBEgZ7R7nmzloL9084ctmFME0Si4lUtoI1hrcovJWUTdCeBqyjnWk3MRRqgwbe")' }}>
            </div>
            
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black tracking-tight">Signature Iced Latte</h1>
                <p className="text-primary text-2xl font-bold">$5.50</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                Our signature espresso blend poured over ice and your choice of milk. A refreshing classic, perfectly balanced and smooth.
              </p>
            </div>

            {/* Reviews Summary */}
            <div className="flex items-center gap-4 bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl">
              <div className="flex items-center gap-1 text-primary">
                <Star className="size-5 fill-current" />
                <Star className="size-5 fill-current" />
                <Star className="size-5 fill-current" />
                <Star className="size-5 fill-current" />
                <Star className="size-5 fill-current opacity-50" />
              </div>
              <p className="text-slate-900 dark:text-slate-100 font-bold">4.8 <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">(124 reviews)</span></p>
            </div>
          </div>

          {/* Customization Form */}
          <div className="flex flex-col gap-8 bg-white dark:bg-background-dark/50 border border-primary/10 p-6 md:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-primary/10 pb-4">Customize Your Drink</h2>
            
            {/* Size */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                <Coffee className="size-5 text-primary" /> Size
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="size" className="peer sr-only" />
                  <div className="text-center py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                    Small
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="size" className="peer sr-only" defaultChecked />
                  <div className="text-center py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                    Medium
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="size" className="peer sr-only" />
                  <div className="text-center py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                    Large <span className="text-xs opacity-70">+$0.75</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Milk */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                <Droplets className="size-5 text-primary" /> Milk Options
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="milk" className="peer sr-only" defaultChecked />
                  <div className="px-4 py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary transition-all">
                    Whole Milk
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="milk" className="peer sr-only" />
                  <div className="px-4 py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary transition-all">
                    Oat Milk <span className="text-xs opacity-70">+$0.50</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="milk" className="peer sr-only" />
                  <div className="px-4 py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary transition-all">
                    Almond Milk <span className="text-xs opacity-70">+$0.50</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="milk" className="peer sr-only" />
                  <div className="px-4 py-3 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary transition-all">
                    Skim Milk
                  </div>
                </label>
              </div>
            </div>

            {/* Ice & Sugar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                  <Snowflake className="size-5 text-primary" /> Ice Level
                </div>
                <select className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option>Regular Ice</option>
                  <option>Light Ice</option>
                  <option>Extra Ice</option>
                  <option>No Ice</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                  <Cuboid className="size-5 text-primary" /> Sweetness
                </div>
                <select className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option>Standard (2 pumps)</option>
                  <option>Less Sweet (1 pump)</option>
                  <option>Extra Sweet (3 pumps)</option>
                  <option>Unsweetened</option>
                </select>
              </div>
            </div>

            {/* Name & Notes */}
            <div className="flex flex-col gap-4 border-t border-primary/10 pt-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                <input type="text" placeholder="Name for the order" className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div className="relative">
                <FileEdit className="absolute left-4 top-4 text-primary size-5" />
                <textarea placeholder="Special instructions (optional)" rows={2} className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"></textarea>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center justify-between bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl px-4 py-2 w-32">
                <button className="text-primary font-bold text-xl hover:text-primary/70">-</button>
                <span className="font-bold text-slate-900 dark:text-slate-100">1</span>
                <button className="text-primary font-bold text-xl hover:text-primary/70">+</button>
              </div>
              <Link href="/order" className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-4 font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                <ShoppingCart className="size-5" />
                Add to Order - $5.50
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-primary/10 pt-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <MessageSquare className="text-primary size-6" />
              Customer Reviews
            </h3>
            <button className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
              <Camera className="size-4" /> Add Review
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Jessica D.</p>
                    <p className="text-xs text-slate-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" />
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Perfectly balanced! The espresso isn't too bitter and the oat milk makes it super creamy. My go-to morning drink.</p>
            </div>
            <div className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">MR</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Mark R.</p>
                    <p className="text-xs text-slate-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex text-primary">
                  <Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 fill-current" /><Star className="size-4 opacity-30 fill-current" />
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Really good, but I recommend asking for light ice if you want more coffee. The flavor is fantastic though.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
