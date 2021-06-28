// Вам потрібно реалізувати мінімум 3 строрінки.
// 1) Реєстрація
// 2) Логінація.
// 3) Список всіх юзерів.
//
//     Створити файлик з юзерами, який буде виступати в ролі бази данних.
//
//     При реєстрації юзер вводин логін та пороль і ви його данні дописуєте у файлик.
//     Якщо такий мейл вже є, то видаємо помилку.
//
//     При логінації юзер так само ввоить мейл та пароль і вам необхідно знайти юзера в файлі. Якщо такий мейлик з таким паролем є, то привіти юзера на платформі показати інформацію про нього та кнопочку, яка перекине нас на список всіх юзерів.
//     В інакшому випадку сказати, що необхідно реєструватись.
//
//     І відображення всіх юзерів це відповідно просто виведення списку вісх юзерів.
//
//     При реєстрації мейли не можуть повторюватись

const express = require('express');
const expressHbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const usersDB = require('./static/usersDB.json');
const usersPath = path.join(__dirname, 'static', 'usersDB.json');

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'static'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

app.listen(PORT, () => {
    console.log(`App listen ${PORT}`);
});

app.engine('.hbs', expressHbs({
    defaultLayout: false
}));

app.get('/', ((req, res) => {
    res.render('index')
}));

app.get('/users', (req, res) => {
    _users().then(users => {
        res.render('users', {users});
    })
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/login', ((req, res) => {

    const {login, password} = req.body;

    for (const user of usersDB) {
        if (user.login === login && user.password === password) {
            res.render('user');
            return;
        }
    }
    res.render("error");
}));

app.post('/register', (req, res) => {
    const {email, password, name, login, phone} = req.body;
    for (const user of usersDB) {
        if (user.email === email || user.login === login) {
            res.render('register', {regErr: true});
            return;
        }
    }
    usersDB.push({email, password, name, login, phone});
    fs.writeFile(usersPath, JSON.stringify(usersDB), err => {
        if (err) {
            console.log(err);
        }
    });
    res.render('login')
});


function _users() {
    return new Promise(resolve => {

        fs.readFile(usersPath, (err, user) => {
            if (err) {
                console.log(err);
                return;
            }
            resolve(JSON.parse(user.toString()));
        });
    });
}