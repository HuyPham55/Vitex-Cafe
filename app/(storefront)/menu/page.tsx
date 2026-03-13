import Link from 'next/link';
import { Coffee, IceCream } from 'lucide-react';

export default function Menu() {
  return (
    <div className="flex flex-col items-center w-full py-5">
      <div className="w-full max-w-[1200px] px-4 md:px-10">
        <div className="sticky top-[73px] bg-white/90 dark:bg-background-dark/90 backdrop-blur z-40 pb-3 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex border-b border-primary/10 justify-between overflow-x-auto no-scrollbar">
            <a href="#espresso" className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-3 pt-4 px-4 whitespace-nowrap">
              <p className="text-sm font-bold tracking-wide">Espresso</p>
            </a>
            <a href="#brewed" className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 px-4 whitespace-nowrap hover:text-primary transition-colors">
              <p className="text-sm font-bold tracking-wide">Brewed Coffee</p>
            </a>
            <a href="#lattes" className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 px-4 whitespace-nowrap hover:text-primary transition-colors">
              <p className="text-sm font-bold tracking-wide">Specialty Lattes</p>
            </a>
            <a href="#cold" className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-4 px-4 whitespace-nowrap hover:text-primary transition-colors">
              <p className="text-sm font-bold tracking-wide">Cold Drinks</p>
            </a>
          </div>
        </div>

        <section id="espresso" className="pt-8">
          <div className="flex items-center gap-3 px-2 mb-6">
            <Coffee className="text-primary size-6" />
            <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight">Espresso Classics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {[
              { name: 'Double Espresso', price: '$3.50', desc: 'Pure, rich, and full-bodied double shot of our signature blend.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbQIeoGOlULjaVq3mWKB-HzIwIuq-EZIFiA4nc6eS2ole1_eRJ7C1yrnScBEJKfZ0KU4n0dYYppLkFfCyFdWncmTEcE3yN_qKIg5sKvnk2NU0FMOlK_vWzFxEAJS-mbM22eXtSOYM4ADvOrkWWWguQAVvZOCQ6NTJ9EPKU-_j9xsviX6u9Aq7KHgVruEoRBhmXDhNASVwVADuT_vx2KKVkBMLYBy4Cbuu4_5a9UAV2bI3BbrEekpUoFsWAtLg-JDe7OCaYGcr-' },
              { name: 'Americano', price: '$4.00', desc: 'Signature espresso softened with hot water for a smooth finish.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7yq_NgcbZYkLl2YtJ-_Ma_Y-GNE-NeK6F8wi1kWdKRVacEswOwIlCe3HtASnxU3m-YfdmP7lsslCTEBUNGcdEdLdnxGPSewIFZei3kN0GhpJtwD8ATCeA2VKBSkjyok79wz-DOGpmCetRH3fXSjPuVpVuwqumi1wB1TVkRX16TBhouc0CVnuCWeA7bI1l4cp3FpRvhUmpJOVYjPdFMyFIfG_Qp24Mg50zXYdvhwRc29pZMyFf8ixDRfjBKHj4Vp1WTbKjD5_v' },
              { name: 'Macchiato', price: '$3.75', desc: 'Double espresso marked with a dollop of velvety milk foam.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCco8URNoOlex7xMNO09-gIq7mCZQ5YMwkr2QR8LBqcJpsmqMBqULqoBDVCxiy7gltWT8enuTsHEt4m7ZS4eNfpVoENPCf0MmhKecTTdk_InVMek7Chf8pjc_1d6tczmtL__5u3vsD2EjZUdRmL3tuE8NCAZBDS8OcnVUkp2DwYvG6NJ-R-oDw0shL2ZG2cVSPhfryAvJUUUvriDIKjhaYPXNqx1ciWq_GVFYKYERNwByHqTxWn1SwKptKFFlaL0ulWalRD2qwe' },
              { name: 'Cortado', price: '$4.25', desc: 'Equal parts espresso and warm milk for a balanced strength.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkCzzHKIDw4NDsVhPkQJxHSR22yYsKlV15JNS1lVBFsA6UYFXXCeZrAAUGFLTHOWRtjBUrMiHcTBNRQUrkgJE3rO0R38_qrpg3eN9y__h7SOS6GgXhWWia7gALSVBiITAIkDHnS5OSBiY2gE8ulLBaljPTPiA-o62ieiWlMJT9DAMcgzKcx5O-1LAMZehpdmfqlnlypyoOtA3yPyXFa5OiqLpL1AnEIuA2_CsbfqB5XP6HkS-f5-7xTtn2C0Cv_-dS4cucDlTP' }
            ].map((item, i) => (
              <Link href="/product" key={i} className="group flex flex-col gap-3 pb-4 bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: `url("${item.img}")` }}></div>
                <div className="px-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-slate-900 dark:text-slate-100 text-base font-bold">{item.name}</p>
                    <p className="text-primary font-bold">{item.price}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal line-clamp-2">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="lattes" className="pt-12">
          <div className="flex items-center gap-3 px-2 mb-6">
            <Coffee className="text-primary size-6" />
            <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight">Specialty Lattes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {[
              { name: 'Honey Lavender', price: '$5.75', desc: 'Espresso, steamed milk, local honey, and a hint of organic lavender.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCyor6kX_YGwThWivnNbcAddOpLC-Fndby-USPym63L2eztQJetBsiowEBugchkuiZTL_doY_43chBBBSVrK1wCopcU4Gg2WPBUnrN5G1FRDpCMVrSIUFd6FHqdU_KAEQ5hQlk0nMGrc-WldB3_skdxCC5rzfl9dSV6-FTxwOfP5Yxh6GBKOETD_VN04kd1G3egAp0X58OZYIIGbhvyHSTdpBK7fiFicX5QpPY49EcrEkl32q8sQEikn4ZytKdgHP-TwVibAS2' },
              { name: 'Dark Mocha', price: '$6.00', desc: '70% dark Belgian chocolate melted into espresso and silky milk.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKP0wZ4UBp9Nwzgiwn1uvspQ1JctfUOhE_Lp4cPRDyC9wH86DdC1Y90gSwzWTv24AKlI7P-9dtihBuQq2BFLHVazuJqNRzBbzsIyTvq3MYI8lC8qEjVrtV8Z8qwES16AMJXbQrGWG8SrzEoUCI8soT9dbkp5g5HVmyJGiDkNWS_51JMSGmvJkNjic2RaVgZDLbisv0zj2ri8P_RKRXh7RI0on3OXYS6f21zwG2g6pwMiMYpsD4_OPvnCKL3PAMcsCRpxbNe1P2' },
              { name: 'Vanilla Bean', price: '$5.50', desc: 'Real Madagascar vanilla beans infused into a classic creamy latte.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkk_QCugmjFkTY0eLkFhbkIntCpwOy4ArYc-lF5teuEpsQ6sq5LBRECRRlFXzrFFsMGeb6rdjtQWzbeVwjLifAgZosYXWYuA0-TaJrcn58F6T2oqnAfBSjabnjqKN9ICGv12ZQWrqoALZRwlZCkBEqtyHDn97enHEyS3w-CF0tCw5ypMeLK0D7burYP-3lOkQTpGcMVqnhW6unHa5b5ZyZTfg1VwOFoAO-Z0BwgblDsbgTc0jdj9uWO-YOA-KHXI2WjvRqLZED' }
            ].map((item, i) => (
              <Link href="/product" key={i} className="group flex flex-col gap-3 pb-4 bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: `url("${item.img}")` }}></div>
                <div className="px-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-slate-900 dark:text-slate-100 text-base font-bold">{item.name}</p>
                    <p className="text-primary font-bold">{item.price}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal line-clamp-2">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="cold" className="pt-12 pb-20">
          <div className="flex items-center gap-3 px-2 mb-6">
            <IceCream className="text-primary size-6" />
            <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight">Cold Drinks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {[
              { name: 'Nitro Cold Brew', price: '$5.25', desc: '18-hour steep, nitrogen-infused for a creamy, stout-like finish.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATUR9TAl4gykyBfabg7ZX12zuZmoxFKtIHDambe8nmtSUoS6SdKT_cLrdybDaVneNNJAPypOwd1Z0jdUmM4N6L37W7JRbb6anEgPZlaWJAnT8WK5m9jFCuU2_DEobmqU60kfMg5GNC4qKxHLXwE82Qjw8ebYrxjGBapTdUduo8-ESQ7VAfcDwh_x_avYl_toFDZlmmNO2-6suWsFIK1DES932BZM' },
              { name: 'Iced Caramel', price: '$5.50', desc: 'Cold brew, milk, and house-made caramel syrup over ice.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALMv2u4cm05dpeEri-b5zaABgMLB7yUsTYU0_GnqtaRPZhG-GK-pIadaCtBmZff9E0AuEaTUUbY745kgI3CYgZL8sTQuoCd7vnNhSe2wTOf2in6a-FLkh5IWcIX6fhx6BFI3AhIFHddZbozK5Ygt4tm1_c7YwwlXLKkr81DYGU8LmRBDsuMlFyyUhr3Sp2exx05I9nZ5Xi6nat0Ghg9NC5PFZukiaK8XESuWUWyof3G0ADQNjx8B8eyyfRC77tge0uQBSPa5iu' },
              { name: 'Iced Matcha', price: '$6.00', desc: 'Ceremonial grade matcha whisked with oat milk and lightly sweetened.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDVvg6RvcogS3T8xXzeeMHZWVIqnCJi8kDvdK1j_oHxjtrzZfdLs5ZiZypIzV3YGeg7YJU-caaECRVHMq1Z-k9Bwz6kg2-IwvcREXZQGe9iEHhjzb0cRIwaNJRQqO_ac_rTgYXMuHD1F8BOqc5mMSu_loAyPsWYUKYjQzr9QO2FFnv0rWHFxL9kzN3_ws-M6hDqygsi7RxUh1aZyf7j6LTjQ1ItuDOvtSAqSBIbeBFEPfzj2j2sxZe2Qz20BHRaPqi5aMYyKCe' }
            ].map((item, i) => (
              <Link href="/product" key={i} className="group flex flex-col gap-3 pb-4 bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: `url("${item.img}")` }}></div>
                <div className="px-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-slate-900 dark:text-slate-100 text-base font-bold">{item.name}</p>
                    <p className="text-primary font-bold">{item.price}</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal line-clamp-2">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
