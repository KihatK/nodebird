const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
})

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {  //게시글 만들기
    try {
        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => (
                db.Hashtag.findOrCreate({
                    where: {
                        name: tag.slice(1).toLowerCase(),
                    },
                })
            )));
            await newPost.addHashtags(result.map(v => v[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(req.body.image.map(i => (
                    db.Image.create({
                        PostId: newPost.id,
                        src: i,
                    })
                )));
                await newPost.addImages(images)
            }
            else {
                const image = await db.Image.create({
                    PostId: newPost.id,
                    src: req.body.image
                });
                await newPost.addImage(image);
            }
        }
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }],
        });
        return res.json(fullPost);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.post('/images', upload.array('image'), async (req, res) => {
    res.json(req.files.map(v => v.filename));
});
router.delete('/:id', isLoggedIn, async (req, res, next) => {  //게시글 지우기
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        if (post.UserId !== req.user.id) {
            return res.status(401).send('게시글의 작성자만 해당 게시글을 삭제할 수 있습니다.');
        }
        await db.Post.destroy({
            where: { id: req.params.id },
        });
        return res.send('deleted');
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {  //댓글 달기
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            res.status(403).send('게시글이 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: req.params.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        await post.addComment(newComment);
        const comment = await db.Comment.findOne({
            where: { id: newComment.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {  //좋아요 누르기
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.addLikers(req.user.id);
        const user = await db.User.findOne({
            where: { id: req.user.id },
            attributes: ['id'],
        });
        return res.json(user);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {  //좋아요 취소
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        const user = await db.User.findOne({
            where: { id: req.user.id },
            attributes: ['id'],
        });
        return res.json(user);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {  //리트윗 하기
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Post,
                as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        if (post.UserId === req.user.id || (post.Retweet && post.Retweet.UserId) === req.user.id) {
            return res.status(403).send('자신의 글은 리트윗하실 수 없습니다.');
        }
        const targetPost = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: targetPost,
            },
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗하신 글입니다.');
        }
        const retweet = await db.Post.create({
            content: 'retweet',
            UserId: req.user.id,
            RetweetId: targetPost,
        });
        const fullRetweet = await db.Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image,
                }],
            }, {
                model: db.Comment,
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }],
            }],
        });
        return res.json(fullRetweet);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Image,
            }]
        });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        if (post.RetweetId) {
            return res.status(403).send('리트윗한 글은 수정할 수 없습니다.');
        }
        return res.json(post);
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});
router.patch('/:id', isLoggedIn, upload.none(), async (req, res, next) => {  //게시글 수정
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        if (post.UserId !== req.user.id) {
            return res.status(401).send('작성자만 수정할 수 있습니다.');
        }
        if (post.RetweetId) {
            return res.status(403).send('리트윗한 게시글은 수정할 수 없습니다.');
        }
        const hashtags = await post.getHashtags({
            attributes: ['id', 'name'],
        });
        const images = await post.getImages({
            attributes: ['id', 'src'],
        });
        if (hashtags) {
            await post.removeHashtags(hashtags);
        }
        if (images) {
            await post.removeImages(images);
        }
        const newHashtags = req.body.content.match(/#[^\s]+/g);
        await db.Post.update({
            content: req.body.content,
        }, {
            where: { id: parseInt(req.params.id, 10) },
        });
        const newPost = await db.Post.findOne({ where: { id: parseInt(req.params.id, 10) } });
        if (newHashtags) {
            const result = await Promise.all(newHashtags.map(tag => {
                return db.Hashtag.findOrCreate({
                    where: {
                        name: tag.slice(1).toLowerCase(),
                    },
                });
            }));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                const images = await Promise.all(req.body.image.map(image => {
                    return db.Image.create({
                        src: image
                    });
                }));
                await newPost.addImages(images);
            }
            else {
                const image = await db.Image.create({
                    src: req.body.image,
                });
                await newPost.addImage(image);
            }
        }
        return res.send('edited');
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;