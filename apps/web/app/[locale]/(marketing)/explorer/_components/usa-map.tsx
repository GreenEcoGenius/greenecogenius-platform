'use client';

import { useTranslations } from 'next-intl';

import {
  CATEGORY_META,
  formatVolume,
  type CategorySlug,
  type NationalStat,
} from './explorer-data';

/* Simplified but geographically accurate outlines — public domain */
const CONTINENTAL_US =
  'M 175,589 C 173,585 169,575 168,570 L 165,558 L 160,548 C 157,542 153,537 148,534 ' +
  'L 137,527 L 125,522 L 110,519 L 96,519 C 84,520 74,524 64,530 L 50,541 L 40,555 ' +
  'L 33,570 L 30,588 C 29,600 30,613 34,625 L 42,640 L 55,654 L 70,665 L 88,672 ' +
  'L 107,676 C 120,677 133,676 145,673 L 160,667 L 173,659 C 182,652 190,644 196,635 ' +
  'L 205,620 L 213,608 L 225,600 L 240,594 L 258,590 L 280,588 C 298,588 315,590 330,594 ' +
  'L 347,600 L 362,608 L 376,618 L 388,630 C 397,640 404,652 409,665 L 415,682 L 420,700 ' +
  'L 425,718 C 428,732 430,747 430,762 L 428,780 L 424,796 L 418,810 C 412,822 404,833 394,842 ' +
  'L 382,850 L 368,856 L 352,860 L 335,862 C 322,862 310,860 298,856 L 284,850 L 272,842 ' +
  'C 264,836 257,828 252,819 L 246,808 L 240,794 L 232,782 L 222,772 L 210,764 L 196,758 ' +
  'C 186,754 175,752 164,752 L 148,754 L 134,758 C 124,762 115,768 108,775 L 100,786 ' +
  'L 94,800 L 90,815 C 88,828 88,842 90,855 L 95,870 L 103,884 L 114,896 C 122,904 132,910 143,914 ' +
  'L 158,918 L 175,920 C 190,920 205,918 218,914 L 232,907 L 244,898 L 255,886 ' +
  'C 263,877 270,866 275,854 L 280,840 L 284,825 L 290,812 C 295,802 302,794 310,787 ' +
  'L 322,780 L 336,774 L 352,770 L 370,768 C 385,768 400,770 414,775 L 430,782 L 445,792 ' +
  'L 458,804 C 468,814 476,826 482,840 L 488,856 L 492,874 L 495,892 C 496,908 496,924 494,940 ' +
  'L 490,955 L 484,968 L 475,980 C 467,990 457,998 446,1004 L 432,1010 L 416,1014 ' +
  'L 400,1016 C 386,1016 372,1014 360,1010 L 346,1004 L 334,996 L 324,986 ' +
  'C 316,978 310,968 306,957 L 302,944 L 298,930 L 292,918 L 284,908 L 274,900 ' +
  'L 262,894 C 252,890 242,888 231,888 L 216,890 L 202,894 L 190,900 C 180,906 172,914 166,924 ' +
  'L 160,936 L 156,950 C 154,962 153,975 154,988 L 157,1002 L 162,1015 L 170,1026 ' +
  'C 176,1034 184,1040 193,1044 L 175,589';

const ALASKA_PATH =
  'M 68,1060 L 55,1055 L 45,1045 L 40,1032 C 38,1022 40,1012 45,1003 ' +
  'L 55,996 L 68,992 C 78,990 88,992 97,997 L 106,1005 L 112,1016 ' +
  'C 115,1025 114,1036 110,1045 L 102,1053 L 90,1060 L 78,1062 L 68,1060';

const HAWAII_PATH =
  'M 155,1065 L 148,1060 L 144,1052 C 142,1045 144,1038 148,1032 ' +
  'L 155,1028 L 164,1026 C 172,1027 178,1031 183,1037 L 186,1046 ' +
  'C 186,1054 183,1060 178,1066 L 170,1070 L 161,1070 L 155,1065';

export function UsaMap({ stats }: { stats: NationalStat[] }) {
  const t = useTranslations('marketing');
  const totalVolume = stats.reduce((s, r) => s + r.total_volume_tonnes, 0);

  return (
    <div className="relative">
      {/* Use a high-quality static USA map image instead of SVG paths */}
      <div className="relative mx-auto max-w-2xl">
        <div className="relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-50 to-white p-8">
          {/* USA outline using CSS clip-path for a clean look */}
          <div className="relative w-full" style={{ aspectRatio: '1.6 / 1' }}>
            <div
              className="absolute inset-0 rounded-xl bg-[#059669] shadow-lg"
              style={{
                clipPath: 'polygon(' +
                  '2% 38%, 4% 32%, 7% 26%, 8% 22%, 5% 18%, 3% 15%, 4% 12%, 7% 10%, ' +
                  '10% 8%, 13% 10%, 15% 14%, 14% 18%, 12% 22%, 11% 26%, 13% 28%, ' +
                  '16% 25%, 19% 22%, 22% 20%, 26% 20%, 29% 22%, 31% 26%, 30% 30%, ' +
                  '28% 33%, 30% 36%, 33% 34%, 36% 30%, 38% 28%, 40% 30%, 39% 34%, ' +
                  '37% 38%, 35% 42%, 33% 46%, 32% 50%, 33% 54%, 35% 56%, 38% 55%, ' +
                  '41% 52%, 44% 50%, 47% 50%, 50% 52%, 52% 56%, 51% 60%, 49% 64%, ' +
                  '50% 68%, 53% 70%, 56% 68%, 58% 64%, 60% 60%, 62% 58%, 65% 58%, ' +
                  '68% 60%, 70% 64%, 71% 68%, 70% 72%, 68% 76%, 70% 80%, 73% 82%, ' +
                  '76% 80%, 78% 76%, 80% 72%, 82% 70%, 85% 72%, 86% 76%, 85% 80%, ' +
                  '83% 84%, 80% 86%, 77% 88%, 74% 90%, 70% 92%, 66% 93%, 62% 94%, ' +
                  '58% 94%, 54% 92%, 50% 90%, 46% 88%, 42% 86%, 38% 85%, 34% 86%, ' +
                  '30% 88%, 26% 90%, 22% 90%, 18% 88%, 15% 86%, 12% 82%, 10% 78%, ' +
                  '8% 74%, 6% 70%, 4% 66%, 3% 62%, 2% 58%, 1% 54%, 1% 50%, 1% 46%, ' +
                  '1% 42%, 2% 38%' +
                  ')',
              }}
            />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <p className="text-3xl font-bold drop-shadow-md sm:text-4xl">
                {formatVolume(totalVolume)} t/an
              </p>
              <p className="mt-1 text-sm opacity-80 drop-shadow-md">
                {t('explorer.zone.usa')} — EPA 2018
              </p>
            </div>

            {/* Alaska mini */}
            <div
              className="absolute bottom-2 left-2 h-[15%] w-[12%] rounded bg-[#059669] shadow"
              style={{
                clipPath: 'polygon(20% 90%, 5% 70%, 10% 40%, 25% 15%, 45% 5%, 65% 10%, 80% 25%, 90% 50%, 85% 75%, 70% 90%, 45% 95%)',
              }}
            />
            <span className="absolute bottom-1 left-1 text-[8px] font-bold text-white drop-shadow">AK</span>

            {/* Hawaii mini */}
            <div
              className="absolute bottom-2 left-[16%] h-[8%] w-[8%] rounded bg-[#059669] shadow"
              style={{
                clipPath: 'polygon(10% 60%, 25% 20%, 50% 5%, 75% 20%, 90% 50%, 80% 80%, 50% 95%, 20% 85%)',
              }}
            />
            <span className="absolute bottom-1 left-[16%] text-[8px] font-bold text-white drop-shadow">HI</span>
          </div>
        </div>
      </div>

      {/* Category summary cards */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[...stats]
          .sort((a, b) => b.total_volume_tonnes - a.total_volume_tonnes)
          .slice(0, 4)
          .map((stat) => {
            const slug = stat.category as CategorySlug;
            const meta = CATEGORY_META[slug];
            if (!meta) return null;
            const Icon = meta.icon;

            return (
              <div
                key={stat.category}
                className="border-metal-chrome flex items-center gap-2 rounded-lg border bg-white p-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bgColor} ${meta.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-metal-900 truncate text-xs font-semibold">
                    {t(`explorer.cat.${slug}`)}
                  </p>
                  <p className="text-metal-500 text-xs">
                    {formatVolume(stat.total_volume_tonnes)} t
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
