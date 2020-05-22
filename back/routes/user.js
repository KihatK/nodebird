const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/', async (req, res, next) => {  //회원가입
    try {
        const exUser = await db.User.findOne({ where: { UserId: req.body.userId } });
        if (exUser) {
            return res.send('이미 존재하는 아이디입니다.');
        }
        const exNickname = await db.User.findOne({ where: { nickname: req.body.nickname } });
        if (exNickname) {
            return res.send('이미 존재하는 닉네임입니다.');
        }
        const hash = await bcrypt.hash(req.body.password, 12);
        const newUser = await db.User.create({
            UserId: req.body.userId,
            password: hash,
            nickname: req.body.nickname,
        });
        return res.send('회원가입 완료');
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(e);
            return next(e);
        }
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, async (loginErr) => {
            try {
                if (loginErr) {
                    return next(loginErr);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname'],
                });
                return res.json(fullUser);
            }
            catch (e) {
                next(e);
            }
        });
    })(req, res, next)
});
router.get('/login', async (req, res, next) => {  //로그인 중인지 확인
    try {
        if (!req.user) {
            return res.status(401).send('로그인이 필요합니다.');
        }
        const user = Object.assign({}, req.user.toJSON());
        delete user.password;
        return res.json(user);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('로그아웃 성공');
});
router.get('/:id', async (req, res, next) => {  //유저 정보 가져오기
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                through: 'Follow',
                as: 'Followers',
                attributes: ['id'],
            }, {
                model: db.User,
                through: 'Follow',
                as: 'Followings',
                attributes: ['id'],
            }],
        });
        const jsonUser = Object.assign({}, user.toJSON());
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        return res.json(jsonUser);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
})

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {  //팔로우 하기
    try {
        const me = await db.User.findOne({ where: { id: req.user.id } });
        await me.addFollowing(req.params.id);
        return res.json(parseInt(req.params.id, 10));
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({ where: { id: req.user.id } });
        await me.removeFollowing(req.params.id);
        return res.json(parseInt(req.params.id, 10));
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {  //팔로워 지우기
    try {
        const me = await db.User.findOne({ where: { id: req.user.id } });
        await me.removeFollower(req.params.id);
        return res.json(parseInt(req.params.id, 10));
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/:id/posts', async (req, res, next) => {
    try {
        let where = {
            UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        };
        if (parseInt(req.query.lastId, 10)) {
            where = {
                ...where,
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Comment,
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }],
            }],
            order: [['createdAt', 'DESC']],
            limit: 10,
        });
        res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/:id/followers', async (req, res, next) => {  //팔로워들 가져오기
    try {
        const user = await db.User.findOne({
            where: {
                id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
            } 
        });
        let followers = [];
        if (user) {
            followers = await user.getFollowers({
                attributes: ['id', 'nickname'],
                offset: parseInt(req.query.offset, 10),
                limit: 3,
            });
        }
        return res.json(followers);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.get('/:id/followings', async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
            },
        });
        let followings = [];
        if (user) {
            followings = await user.getFollowings({
                attributes: ['id', 'nickname'],
                offset: parseInt(req.query.offset, 10),
                limit: 3,
            });
        }
        return res.json(followings);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {  //닉네임 수정하기
    try {
        const me = await db.User.findOne({ where: { id: req.user.id } });
        if (me.nickname === req.body.nickname) {
            return res.status(403).send('이미 사용하고 계신 닉네임입니다.');
        }
        const user = await db.User.findOne({ where: { nickname: req.body.nickname } });
        if (user) {
            return res.status(403).send('다른 사용자가 이미 사용중인 닉네임입니다.');
        }
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: {
                id: req.user.id,
            },
        });
        return res.json(req.body.nickname);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;