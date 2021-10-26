const router = require("express").Router();
const controller = require("./tables.controller");
const notAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).post(controller.create).all(notAllowed);
router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.finishTable)
  .all(notAllowed);

module.exports = router;
