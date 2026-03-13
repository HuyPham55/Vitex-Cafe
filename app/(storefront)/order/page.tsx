import Link from 'next/link';
import { CheckCircle, CreditCard, Info, Receipt, ArrowRight, Coffee } from 'lucide-react';

export default function OrderStatus() {
  return (
    <div className="flex flex-col items-center w-full py-10">
      <div className="w-full max-w-[800px] px-4 md:px-10">
        
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50">
            <CheckCircle className="size-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Thank you, Sarah. Your order #401 is being prepared.</p>
        </div>

        {/* Status Tracker */}
        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 md:p-10 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
            <Coffee className="text-primary size-6" /> Order Status
          </h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
            <div className="absolute left-6 top-0 h-1/2 w-0.5 bg-primary -z-10"></div>

            {/* Steps */}
            <div className="flex flex-col gap-8">
              {/* Step 1: Received */}
              <div className="flex items-start gap-6">
                <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <CheckCircle className="size-6" />
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Order Received</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">8:42 AM</p>
                </div>
              </div>

              {/* Step 2: Brewing (Active) */}
              <div className="flex items-start gap-6">
                <div className="size-12 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center font-bold shadow-md shrink-0 relative">
                  <span className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-ping"></span>
                  <div className="size-3 bg-primary rounded-full"></div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-primary">Brewing</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Estimated time: 3 mins</p>
                </div>
              </div>

              {/* Step 3: Ready */}
              <div className="flex items-start gap-6 opacity-50">
                <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold shrink-0">
                  <div className="size-3 bg-slate-400 rounded-full"></div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Ready for Pickup</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Waiting for you at the counter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Order Summary */}
          <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-primary/10 pb-4">
              <Receipt className="text-primary size-5" /> Order Summary
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkbI1-ZJo_WO6FbDN32c1-wwVEKTb094nKohwqI9aJRIrsD5JJt5kj_ReYd_OlPIhvtcK0gC9aNWEPU7LmAXpmv3ma8I45v9iYd0P4Ym7W1KlkRKvD_c9m683htOLDERgN5E6cyx8rsAnIQeNL-w3uerMED3dWF-dyVFxi0SrU8db_-iGQLlFT1PPg2IFXY-dd-lRSXQWu_bT-uapqj8CnZHtIrqWV_GQnqLtF8-70avGOJLmdrHNUSDQOuuA4-Y2mv7W344_U")' }}></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">1x Cold Brew</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Medium, Oat Milk, Light Ice</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100">$5.00</p>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbQIeoGOlULjaVq3mWKB-HzIwIuq-EZIFiA4nc6eS2ole1_eRJ7C1yrnScBEJKfZ0KU4n0dYYppLkFfCyFdWncmTEcE3yN_qKIg5sKvnk2NU0FMOlK_vWzFxEAJS-mbM22eXtSOYM4ADvOrkWWWguQAVvZOCQ6NTJ9EPKU-_j9xsviX6u9Aq7KHgVruEoRBhmXDhNASVwVADuT_vx2KKVkBMLYBy4Cbuu4_5a9UAV2bI3BbrEekpUoFsWAtLg-JDe7OCaYGcr-")' }}></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">1x Butter Croissant</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Warmed</p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100">$3.50</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-primary/10 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>$8.50</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Tax</span>
                <span>$0.68</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 dark:text-slate-100 mt-2 pt-2 border-t border-primary/10">
                <span>Total</span>
                <span>$9.18</span>
              </div>
            </div>
          </div>

          {/* Payment & Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 border-b border-primary/10 pb-4">
                <CreditCard className="text-primary size-5" /> Payment Details
              </h3>
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-sm font-bold text-slate-600 dark:text-slate-300">VISA</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">•••• •••• •••• 4242</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
              <Info className="text-blue-500 size-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Pickup Instructions</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Head straight to the mobile order pickup counter on the left side of the register. Show your order number #401 to the barista.</p>
              </div>
            </div>
            
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
              Return to Home <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
