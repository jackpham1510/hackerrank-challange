const router = require('express-promise-router').default();
const Profile = require('../models/Profile');
const Submission = require('../models/Submission');
const moment = require('moment');
const { Op, QueryTypes } = require('sequelize');
const db = require('../provider/postgres');
const axios = require('axios').default;

function getDateRange(from, to) {
  try {
    from = moment(from);
    to = moment(to);
    if (!from.isValid() || !to.isValid() || to.isBefore(from)) {
      throw "Invalid date range";
    }
  } catch {
    from = moment()
    to = moment()
  }

  return {
    from: from.startOf('date').toDate(),
    to: to.endOf('date').toDate()
  }
}

router.post('/submission/put', async (req, res) => {
  const subDto = await Submission.findOne({
    where: {
      challengeId: req.body.challengeId
    }
  });

  if (subDto !== null) {
    await Submission.update({
      score: req.body.score,
      updatedAt: req.body.updatedAt
    }, {
      where: { 
        challengeId: req.body.challengeId,
        hackerId: req.body.hackerId,
        score: {
          [Op.gt]: req.body.score
        }
      }
    });
  } else {
    await Submission.create(req.body);
  }
  res.json({ success: true });
});

router.get('/submission/getlistbyhackerid', async (req, res) => {
  const { from, to, hackerId } = req.query;
  const dateRange = getDateRange(from, to);

  const submissions = await Submission.findAll({
    hackerId,
    updatedAt: {
      [Op.gte]: dateRange.from,
      [Op.lte]: dateRange.to
    },
    order: [
      ['updatedAt', 'DESC']
    ]
  });

  res.json({ success: true, body: submissions })
});

const getOneProfileQuery = `
SELECT "p"."hackerId", "p"."username", "p"."avatar", SUM("s"."score") AS "totalScore"
FROM "Profiles" AS "p"
LEFT JOIN (
  SELECT "score", "hackerId"
  FROM "Submissions"
  WHERE "updatedAt" >= :from AND "updatedAt" <= :to
) AS "s" ON "p"."hackerId" = "s"."hackerId"
WHERE "p"."username" = :username
GROUP BY "p"."hackerId", "p"."username", "p"."avatar"
`

router.get('/profile/getone', async (req, res) => {
  const { from, to, username } = req.query;
  const dateRange = getDateRange(from, to);

  const count = await Profile.count({
    where: { username }
  });
  
  if (count === 0) {
    const { data } = await axios.get(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`);
    await Profile.create({
      username,
      hackerId: data.model.id,
      avatar: data.model.avatar
    });
  }

  let [result] = await db.query(getOneProfileQuery, {
    type: QueryTypes.SELECT,
    replacements: {
      username,
      from: dateRange.from,
      to: dateRange.to,
    }
  });

  // if (!result) {
  //   result = await Profile.findOne({
  //     where: { username }
  //   });
  // }

  res.json({ success: true, body: result });
});

const getLeaderBoardQuery = `
SELECT "p"."hackerId", "p"."username", "p"."avatar", SUM("s"."score") AS "totalScore"
FROM "Profiles" AS "p"
LEFT JOIN (
  SELECT "score", "hackerId"
  FROM "Submissions"
  WHERE "updatedAt" >= :from AND "updatedAt" <= :to
) AS "s" ON "p"."hackerId" = "s"."hackerId"
GROUP BY "p"."hackerId", "p"."username", "p"."avatar"
ORDER BY "totalScore" DESC
`;

router.get('/leaderboard/get', async (req, res) => {
  const { from, to } = req.query;
  const dateRange = getDateRange(from, to);

  const results = await db.query(getLeaderBoardQuery, {
    type: QueryTypes.SELECT,
    replacements: {
      from: dateRange.from,
      to: dateRange.to
    }
  });

  res.json({ success: true, body: results });
});

module.exports = router;