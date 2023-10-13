const router = require("express").Router();
const {
  getAmount,
  temp,
  waterttracking,
  waterRate,
  getWaterRate,
  allPaymentStatus,
  waterTotalAmount,
  updateWaterState,
  getWaterState,
  getAllUsertakingrecords,
  singleTotalWater,
  waterAmountUpdate
} = require("../controllers/water");

router.get("/waterusage", getAmount);
router.post("/temperature", temp);
router.post("/waterTrack", waterttracking);
router.post("/waterbill", waterRate);
router.get("/billrate", getWaterRate);
router.get("/totalwater", waterTotalAmount);
router.get("/totalpayment", allPaymentStatus);
router.post("/updatewaterstate/:id", updateWaterState)
router.get("/waterState/:macAddress", getWaterState)
router.get("/watertrackingraph", getAllUsertakingrecords)
router.get("/singletotalwater/:id", singleTotalWater )
router.post("/waterAmountUpdate", waterAmountUpdate)

module.exports = router;
