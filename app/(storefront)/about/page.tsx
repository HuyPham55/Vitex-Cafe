import { Leaf, Coffee } from 'lucide-react';
import { endpoints, getImageUrl } from '@/lib/api';

async function getAboutContent() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}${endpoints.settings}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const data = await getAboutContent();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Daily Grind';

  const heroTitle = data?.aboutHeroTitle || 'The soul of the daily grind.';
  const heroSubtitle = data?.aboutHeroSubtitle || 'Crafting moments of clarity through uncompromising artisanal roasting since 2012.';
  const heroImage = data?.aboutHeroImage ? getImageUrl(data.aboutHeroImage) : 'https://lh3.googleusercontent.com/aida-public/AB6AXuALaUAgMIkWyeLYO9HglaaGGd7UUCPKqb-8PoqIC06XPLoxf1U3dA3ZO2Pe6U-2aPoUhljShi8GdTY-xDZrB7wnMpAcoYwh0baLWlr-KBGtUjnS67r_ajZ5ZevFHIXDGjNuHIBQTlkZNGhVDcDTyBfs-iJoV9hRDNA3GRtrTU0KmIQNZn5rcze5_I69HXM4V1dTBzvcEMDe5Ncl7sa9A9nj8fw1-8fGEvnAo9yguDIREINrDGgFUnNrE5kxz-rkJ-ejObeCJm1s';

  const originTitle = data?.aboutOriginTitle || 'Our Origin Story';
  const originP1 = data?.aboutOriginParagraph1 || `${siteName} didn't start in a boardroom. It began in a tiny, drafty garage with a second-hand roaster and an obsession for the perfect extraction.`;
  const originP2 = data?.aboutOriginParagraph2 || "We realized that specialty coffee had become too clinical. We wanted to bring back the warmth, the tactile joy of the ritual, while elevating the bean to its highest potential. It's not just science; it's an artisanal craft driven by instinct and deep respect for the farmers.";

  const founder1Name = data?.aboutFounder1Name || 'Alex';
  const founder1Role = data?.aboutFounder1Role || 'Master Roaster';
  const founder1Bio = data?.aboutFounder1Bio || 'With over a decade of sensory analysis and green buying experience, approaches roasting like a composer—finding the perfect harmony of origin characteristics and caramelization.';
  const founder1Photo = data?.aboutFounder1Photo ? getImageUrl(data.aboutFounder1Photo) : 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4eA-eLC_1-gQ-dYT6bk1XtMPH742sbB9KpTYh63YO4b8DVVHDA9bv0RsaEvpVyenQIsv5DJkG8hhv6i4WoQ73ao_0Wco7L5chaYu-enO6ElA6ZVEjVw8yHAd6b7SWHtTw_ToflmEfkiqd3qBLFT1oLqTv72pFUqnZYmUXpF8SYWIX7lmlaoMBmhMoMOsBXs2lyrtC-tZ8MTB90BMGEmlncuUExpumSGzivqeeiSvpqvpXr_J_aiNd__Nc6ehLm2uZMtjX-KLY';

  const founder2Name = data?.aboutFounder2Name || 'Jordan';
  const founder2Role = data?.aboutFounder2Role || 'Director of Sourcing';
  const founder2Bio = data?.aboutFounder2Bio || "Spends half the year at origin, building relationships with small-lot farmers. Their uncompromising standards ensure every bean meets the roast profile before it leaves the port.";
  const founder2Photo = data?.aboutFounder2Photo ? getImageUrl(data.aboutFounder2Photo) : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC734kJXxif90Q54k4mQbejaJwvtIV3AcY2VuKzD0khokOGTPqx95e1a5fRMApvsH3tapdxpmCPdss91Rakvz0_5GqR5ziZVBE7cmKb4WY9lDAPeMldRtg6Vv2E764iZrJjT6hsAi6V2ClzcBpjtGm4VxU0ogEFvhiZ1_yl0l-MBCIzhj6aFUR3WhjaAApKvIfLezOYenPoLSGZcmXmMMT4NGxABvZjXpPCg3fDotxkI6pchTnlyN70NcLGCC1trN0mxeGQLH8Z';

  const qualityTitle = data?.aboutQualityTitle || 'Uncompromising Quality';
  const qualityContent = data?.aboutQualityContent || "We source exclusively from single-estate farms prioritizing sustainable agriculture. Our roasting process is meticulously calibrated in small batches. We don't rely on automation; we rely on sight, smell, and the sound of the first crack.";
  const qualityImage = data?.aboutQualityImage ? getImageUrl(data.aboutQualityImage) : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX0xpppdAawMq2YsIo-neDQb6bSsjaghW83i5e_lnRzIpW0tbLjykNZaXFxRAleiUSHzpBQALHWzNiAuOc9asHcbyJKhzxv64aZNnlCdjJMV8ampDswzcEEZS3Hjlb9kh3-WAeBnWMvAFTR45tsdorJL-s9av7HDskLT7kseQitoGDcK2sGxoeHejEo2f-EuDm6DxSdGn2Rwj6hsyMPRaeDdjULIFYruu69GS9TlGDVp3-9c9CKdXTJeE2s4br90Jv-pEw01ap';

  const missionStatement = data?.aboutMissionStatement || 'To transform your daily ritual from a mundane habit into a moment of mindful appreciation, one perfectly extracted cup at a time.';

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] px-4 md:px-10 py-10 space-y-24">

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-12 relative">
          <div className="md:w-1/2 space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
              {heroTitle}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              {heroSubtitle}
            </p>
          </div>
          <div className="md:w-1/2 w-full h-[420px] md:h-[520px] relative rounded-2xl overflow-hidden shadow-lg">
            <img
              alt="Our Story"
              className="object-cover w-full h-full"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
        </section>

        {/* Origin Story */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 md:col-start-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{originTitle}</h2>
          </div>
          <div className="md:col-span-6 space-y-6 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            <p>{originP1}</p>
            <p>{originP2}</p>
          </div>
        </section>

        {/* Meet the Founders */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Meet the Founders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder 1 */}
            <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 flex flex-col gap-6 shadow-sm hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-300">
              <div className="w-28 h-28 rounded-full overflow-hidden self-center border-4 border-primary/20 shadow-md">
                <img alt={founder1Name} className="object-cover w-full h-full" src={founder1Photo} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{founder1Name}</h3>
                <p className="text-sm text-primary uppercase tracking-widest font-bold">{founder1Role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-base pt-4">{founder1Bio}</p>
              </div>
            </div>
            {/* Founder 2 */}
            <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 flex flex-col gap-6 shadow-sm hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/5 transition-all duration-300">
              <div className="w-28 h-28 rounded-full overflow-hidden self-center border-4 border-primary/20 shadow-md">
                <img alt={founder2Name} className="object-cover w-full h-full" src={founder2Photo} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{founder2Name}</h3>
                <p className="text-sm text-primary uppercase tracking-widest font-bold">{founder2Role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-base pt-4">{founder2Bio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Uncompromising Quality */}
        <section className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Leaf className="size-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{qualityTitle}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{qualityContent}</p>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto">
            <img
              alt="Quality Beans"
              className="object-cover w-full h-full"
              src={qualityImage}
            />
          </div>
        </section>

        {/* Mission Statement */}
        <section className="text-center max-w-3xl mx-auto py-12 px-6">
          <Coffee className="text-primary size-12 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-8">Our Mission</h2>
          <p className="text-2xl text-slate-500 dark:text-slate-400 leading-relaxed italic">
            &ldquo;{missionStatement}&rdquo;
          </p>
        </section>
      </div>
    </div>
  );
}
