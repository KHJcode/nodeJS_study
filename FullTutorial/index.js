if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    { User } = require('./models/User'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

    
app.get('/',(req, res) => {
    res.send('Hello nodeapp!');
});

app.post('/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err});
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, userInfo) => {
        if(!userInfo) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다"});
            }
            userInfo.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                //토큰을 쿠키에 저장
                res.cookie("x_auth", user.token)
                .status(200).json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

app.listen(PORT);