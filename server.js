// server.js
// ──────────────────────────────────────────────────────────────
// 개발용 Mock API (Express) - 단일 파일 전체 코드 (정상 버전)
// ──────────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// 공통 미들웨어
app.use(cors());
app.use(express.json());

// 업로드 폴더 + 정적 서빙
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer 설정
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file?.originalname || '');
    cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

// ──────────────────────────────────────────────────────────────
// 인메모리 데이터 (실서버 대신 메모리에 저장)
// ──────────────────────────────────────────────────────────────
const db = {
  performsTop10: [
    { mt20id: 'A1', prfnm: '테스트 콘서트',    poster: 'https://picsum.photos/seed/A1/400/600' },
    { mt20id: 'A2', prfnm: '여름 공연 페스티벌', poster: 'https://picsum.photos/seed/A2/400/600' },
  ],
  performsUpcoming: [
    { mt20id: 'U1', prfnm: '다가오는 공연', poster: 'https://picsum.photos/seed/U1/400/600' },
  ],
  festivalsSummer: [
    { mt20id: 'S1', prfnm: '여름 축제', poster: 'https://picsum.photos/seed/S1/400/600' },
  ],
  reviews: [
    {
      id: 1,
      userId: 1,
      placeId: 1,
      scheduleId: 1,
      rating: 5,
      content: '정말 맛있었어요! 경기장 근처에서 식사하기 좋은 곳이에요.',
      mediaUrls: ['https://picsum.photos/seed/rev1/800/600'],
      isVisited: true,
      createdAt: '2024-12-25T12:00:00',
      updatedAt: '2024-12-25T12:00:00',
      placeName: '문학동 맛집',
      placeCategory: 'DINING',
      placeAddress: '인천광역시 미추홀구 문학동',
    },
  ],
};
let nextReviewId = db.reviews.length ? Math.max(...db.reviews.map(r => r.id)) + 1 : 1;

// 장소 레퍼런스 (placeId로 조회용)
const places = {
  1: { name: '문학동 맛집', category: 'DINING', address: '인천광역시 미추홀구 문학동' },
};

// 찜 데이터(유저별)
const likesPerform = [
  { userId: 1, externalId: 'PF271665', likedAt: '2025-08-21T16:35:10+09:00' },
  { userId: 1, externalId: 'PF271666', likedAt: '2025-08-20T10:11:00+09:00' },
  { userId: 2, externalId: 'PF999999', likedAt: '2025-08-18T09:00:00+09:00' },
];

// 간이 인증(개발 편의: 헤더 없으면 1로 대입)
function requireUserDev(req, _res, next) {
  let userId = parseInt(req.header('x-user-id'), 10);
  if (!userId) userId = 1;
  req.userId = userId;
  next();
}

// 페이지네이션 유틸
function paginate(arr, page = 0, size = 20) {
  const start = page * size;
  const end = start + size;
  const content = arr.slice(start, end);
  return {
    content,
    page,
    size,
    totalElements: arr.length,
    totalPages: Math.ceil(arr.length / size),
  };
}

// ──────────────────────────────────────────────────────────────
// ① 공연/축제 API
// ──────────────────────────────────────────────────────────────
app.get('/api/performs/fixed/top10', (_req, res) => res.json(db.performsTop10));
app.get('/api/performs/fixed/upcoming', (_req, res) => res.json(db.performsUpcoming));
app.get('/api/performs/fixed/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Number(req.query.limit || 50);
  const all = [...db.performsTop10, ...db.performsUpcoming, ...db.festivalsSummer];
  const filtered = q
    ? all.filter(v => String(v.prfnm).toLowerCase().includes(q.toLowerCase()))
    : all;
  res.json(filtered.slice(0, limit));
});
app.get('/api/festivals/summer', (_req, res) => res.json(db.festivalsSummer));

// ──────────────────────────────────────────────────────────────
// ② 찜(좋아요) API — 일원화
// ──────────────────────────────────────────────────────────────
app.get('/api/likes/perform/me', requireUserDev, (req, res) => {
  const page = parseInt(req.query.page ?? '0', 10);
  const size = parseInt(req.query.size ?? '20', 10);
  const mine = likesPerform
    .filter(it => it.userId === req.userId)
    .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
    .map(({ externalId, likedAt }) => ({ externalId, likedAt }));
  res.json(paginate(mine, page, size));
});

app.get('/api/likes/perform/:externalId', requireUserDev, (req, res) => {
  const { externalId } = req.params;
  const mine = likesPerform
    .filter(it => it.userId === req.userId && it.externalId === externalId)
    .sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
  res.json({ externalId, liked: mine.length > 0, likedAt: mine[0]?.likedAt });
});

function toggleLike(req, res) {
  const { externalId } = req.params;
  if (!externalId) return res.status(400).json({ message: 'externalId required' });

  const idx = likesPerform.findIndex(it => it.userId === req.userId && it.externalId === externalId);
  if (idx >= 0) {
    likesPerform.splice(idx, 1);
    return res.json({ externalId, liked: false });
  } else {
    const likedAt = new Date().toISOString().replace('Z', '+09:00');
    likesPerform.push({ userId: req.userId, externalId, likedAt });
    return res.json({ externalId, liked: true, likedAt });
  }
}
app.post('/api/likes/perform/:externalId', requireUserDev, toggleLike);
app.put('/api/likes/perform/:externalId', requireUserDev, toggleLike);
app.delete('/api/likes/perform/:externalId', requireUserDev, (req, res) => {
  const { externalId } = req.params;
  const idx = likesPerform.findIndex(it => it.userId === req.userId && it.externalId === externalId);
  if (idx >= 0) likesPerform.splice(idx, 1);
  res.json({ externalId, liked: false });
});

// ──────────────────────────────────────────────────────────────
// ③ 리뷰 API
// ──────────────────────────────────────────────────────────────
app.post('/api/reviews', (req, res) => {
  try {
    const {
      userId,
      placeId,
      scheduleId,
      rating,
      content,
      mediaUrls = [],
      isVisited = true,
    } = req.body || {};

    if (!userId || !placeId || !scheduleId || !rating) {
      return res.status(400).json({ success: false, message: '필수 값 누락' });
    }

    const now = new Date().toISOString().slice(0, 19);
    const placeRef = places[placeId] || { name: '알수없음', category: 'UNKNOWN', address: '' };

    const newReview = {
      id: nextReviewId++,
      userId,
      placeId,
      scheduleId,
      rating,
      content: content ?? '',
      mediaUrls,
      isVisited,
      createdAt: now,
      updatedAt: now,
      placeName: placeRef.name,
      placeCategory: placeRef.category,
      placeAddress: placeRef.address,
    };

    db.reviews.unshift(newReview);
    return res.status(201).json({ success: true, id: newReview.id, message: '리뷰가 생성되었습니다.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 내 리뷰 목록
app.get('/api/reviews', (req, res) => {
  const userId = Number(req.query.userId);
  const list = Number.isFinite(userId) ? db.reviews.filter(r => r.userId === userId) : db.reviews;
  return res.json({
    success: true,
    data: list,
    message: '리뷰 목록을 성공적으로 조회했습니다.',
  });
});

// 사진 양식 스펙에 맞는 단건 조회
app.get('/api/reviews/:reviewId', (req, res) => {
  const id = Number(req.params.reviewId);
  const found = db.reviews.find(r => r.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: '리뷰를 찾을 수 없습니다.' });
  }
  return res.json({
    success: true,
    data: found,
    message: '리뷰를 성공적으로 조회했습니다.',
  });
});

// ──────────────────────────────────────────────
// ⑤ 공연 상세조회 API (InformationPage에서 사용)
// GET /api/performs/by-external/:externalId
// ──────────────────────────────────────────────
app.get('/api/performs/by-external/:externalId', (req, res) => {
  const { externalId } = req.params;
  const all = [...db.performsTop10, ...db.performsUpcoming, ...db.festivalsSummer];

  const found = all.find(p => String(p.mt20id) === String(externalId));
  if (!found) {
    return res.status(404).json({ success: false, message: '공연을 찾을 수 없습니다.' });
  }

  const payload = {
    externalId: found.mt20id,
    title: found.prfnm,
    startDate: found.startDate ?? '2025-08-30',
    endDate:   found.endDate   ?? '2025-08-31',
    venueName: found.venueName ?? '테스트홀',
    synopsis:  found.synopsis  ?? '테스트 공연 상세 설명입니다.',
    posterUrl: found.poster,
  };
  return res.json(payload);
});

// ──────────────────────────────────────────────────────────────
// ④ 파일 업로드 (단일/다중) — URL 반환
// ──────────────────────────────────────────────────────────────
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});
app.post('/api/files/upload-multiple', upload.array('files', 10), (req, res) => {
  const urls = (req.files || []).map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
