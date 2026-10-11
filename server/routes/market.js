import express from 'express';

const router = express.Router();

// Market listings for explorer cards
const MARKET_LISTINGS = [
  { id: 'ml001', cardId: 'kilimanjaro-titan', seller: 'africamaster', price: '45.000 HIVE', listedAt: new Date().toISOString() },
  { id: 'ml002', cardId: 'sphinx-guardian', seller: 'pharaoh99', price: '180.000 HIVE', listedAt: new Date().toISOString() },
  { id: 'ml003', cardId: 'serengeti-queen', seller: 'wildlifeking', price: '48.000 HIVE', listedAt: new Date().toISOString() },
  { id: 'ml004', cardId: 'congo-shaman', seller: 'mysticshaman', price: '13.000 HIVE', listedAt: new Date().toISOString() },
  { id: 'ml005', cardId: 'ubuntu-elder', seller: 'ubuntuwarrior', price: '195.000 HIVE', listedAt: new Date().toISOString() },
];

router.get('/listings', (req, res) => {
  res.json(MARKET_LISTINGS);
});

router.get('/listings/:cardId', (req, res) => {
  const filtered = MARKET_LISTINGS.filter(l => l.cardId === req.params.cardId);
  res.json(filtered);
});

// Get market stats
router.get('/stats', (req, res) => {
  res.json({
    totalVolume: '12,450.000 HIVE',
    activeListings: MARKET_LISTINGS.length,
    averageCardPrice: '12.500 HIVE',
    topSeller: 'africamaster',
    recentSales: [
      { cardId: 'maasai-warrior', price: '4.800 HIVE', time: '2 hours ago' },
      { cardId: 'nile-priestess', price: '14.200 HIVE', time: '5 hours ago' },
      { cardId: 'kilimanjaro-titan', price: '52.000 HIVE', time: '1 day ago' },
    ]
  });
});

export default router;
