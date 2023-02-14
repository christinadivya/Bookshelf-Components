import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import inviteCtrl from '../controllers/invitation.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:inviteId')
  /** GET /api/invites/:inviteId - Get invite */
  .get(inviteCtrl.get);

/** Load invite when API with inviteId route parameter is hit */
router.param('inviteId', inviteCtrl.load);

export default router;
