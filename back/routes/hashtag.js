const express = require('express');

const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {  //해쉬태그 관련 게시글 가져오기
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.Hashtag,
                where: {
                    name: decodeURIComponent(req.params.tag),
                },
            }, {
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Comment,
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: db.User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Image,
            }],
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
        return res.json(posts);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;