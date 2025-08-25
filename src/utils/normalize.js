// src/utils/normalize.js
export const normalizePerforms = (arr = []) =>
  arr.map((it, i) => ({
    id: it?.mt20id ?? it?.id ?? `tmp-${i}`,
    externalId: it?.mt20id ?? it?.externalId ?? it?.id ?? `tmp-${i}`, // 외부ID 보장
    title: it?.prfnm ?? it?.title ?? '',
    image: it?.poster ?? it?.posterUrl ?? it?.image ?? '',
  }));
