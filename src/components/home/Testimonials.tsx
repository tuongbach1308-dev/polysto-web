'use client';

const customerImages = [
  { id: 1, emoji: '👨‍💼' },
  { id: 2, emoji: '👩‍🎓' },
  { id: 3, emoji: '🧑‍💻' },
  { id: 4, emoji: '👨‍🦱' },
  { id: 5, emoji: '👩‍🦰' },
  { id: 6, emoji: '🧑‍🎨' },
  { id: 7, emoji: '👨‍🏫' },
  { id: 8, emoji: '👩‍⚕️' },
];

export default function Testimonials() {
  return (
    <section className="border border-border rounded-2xl bg-white overflow-hidden py-6 px-6">
      {/* Title */}
      <h2 className="text-sm md:text-base font-bold text-text-dark text-center uppercase tracking-widest mb-5">
        Cảm ơn khách hàng đã tin tưởng POLY Store
      </h2>

      {/* Single row marquee */}
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
          {[...customerImages, ...customerImages].map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="shrink-0 w-[280px] lg:w-[320px] aspect-[4/3] bg-bg-gray rounded-xl flex items-center justify-center overflow-hidden"
            >
              <span className="text-7xl">{img.emoji}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
