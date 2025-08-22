// server.js
// ──────────────────────────────────────────────────────────────
// 개발용 Mock API (Express)
// ──────────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// 업로드 폴더 + 정적 서빙
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

// ──────────────────────────────────────────────────────────────
// ① 목 데이터 (메모리)
// ──────────────────────────────────────────────────────────────
const db = {
  performsTop10: [
    { mt20id: 'A1', prfnm: '테스트 콘서트', poster: 'https://picsum.photos/seed/A1/400/600' },
    { mt20id: 'A2', prfnm: '여름 공연 페스티벌', poster: 'https://picsum.photos/seed/A2/400/600' },
  ],
  performsUpcoming: [
    { mt20id: 'U1', prfnm: '다가오는 공연', poster: 'https://picsum.photos/seed/U1/400/600' },
  ],
  festivalsSummer: [
    { mt20id: 'S1', prfnm: '여름 축제', poster: 'https://picsum.photos/seed/S1/400/600' },
  ],
  reviews: [],
};

// 찜 데이터(유저별)
const likesPerform = [
  { userId: 1, externalId: 'PF271665', likedAt: '2025-08-21T16:35:10+09:00' },
  { userId: 1, externalId: 'PF271666', likedAt: '2025-08-20T10:11:00+09:00' },
  { userId: 2, externalId: 'PF999999', likedAt: '2025-08-18T09:00:00+09:00' },
];

// 간이 인증(개발 편의: 헤더 없으면 1로 대입)
function requireUserDev(req, res, next) {
  let userId = parseInt(req.header('x-user-id'), 10);
  if (!userId) userId = 1;
  req.userId = userId;
  next();
}

// 페이지네이션
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
// ② 공연/축제 API
// ──────────────────────────────────────────────────────────────
app.get('/api/performs/fixed/top10', (req, res) => res.json(db.performsTop10));
app.get('/api/performs/fixed/upcoming', (req, res) => res.json(db.performsUpcoming));
app.get('/api/performs/fixed/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Number(req.query.limit || 50);
  const all = [...db.performsTop10, ...db.performsUpcoming, ...db.festivalsSummer];
  const filtered = q ? all.filter(v => String(v.prfnm).toLowerCase().includes(q.toLowerCase())) : all;
  res.json(filtered.slice(0, limit));
});
app.get('/api/festivals/summer', (req, res) => res.json(db.festivalsSummer));

// ──────────────────────────────────────────────────────────────
// ③ 찜(좋아요) API — 일원화
//    목록: GET  /api/likes/perform/me?page=0&size=20
//    단건: GET  /api/likes/perform/:externalId
//    토글: POST /api/likes/perform/:externalId   (PUT도 하위호환 지원)
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
app.put('/api/likes/perform/:externalId', requireUserDev, toggleLike); // 하위호환

// ──────────────────────────────────────────────────────────────
// ④ 리뷰 API
// ──────────────────────────────────────────────────────────────
app.post('/api/reviews', (req, res) => {
  const body = req.body || {};
  const id = db.reviews.length + 1;
  const review = {
    id,
    userId: body.userId ?? 1,
    placeId: body.placeId ?? 1,
    scheduleId: body.scheduleId ?? 1,
    rating: body.rating ?? 0,
    content: body.content ?? '',
    mediaUrls: Array.isArray(body.mediaUrls) ? body.mediaUrls : [],
    createdAt: body.createdAt ?? new Date().toISOString(),
  };
  db.reviews.push(review);
  res.status(201).json(review);
});
app.get('/api/reviews', (req, res) => res.json(db.reviews));

// ──────────────────────────────────────────────────────────────
// ⑤ 파일 업로드
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
