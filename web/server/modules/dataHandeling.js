const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;

const userDataFolder = path.join(__dirname, '../user_data');

if (!fs.existsSync(userDataFolder)) {
    fs.mkdirSync(userDataFolder);
}

function encryptStr(str) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return reject(err);
            bcrypt.hash(str, salt, function (err, hash) {
                if (err) return reject(err);
                resolve(hash);
            });
        });
    });
}

function comparingPassword(plainStr, encryptedStr) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainStr, encryptedStr, function (err, result) {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

async function createUser(email, password, name, username) {
    const encryptedPassword = await encryptStr(password);
    const userFolder = path.join(userDataFolder, username);

    if (fs.existsSync(userFolder)) {
        return "UserAlreadyExists"
    }

    fs.mkdirSync(userFolder);

    const userInfo = {
        username,
        email,
        name,
        passwordHash: encryptedPassword,
        createdAt: new Date().toISOString(),
        hasPaid: false
    };

    fs.writeFileSync(path.join(userFolder, 'info.gmg'), JSON.stringify(userInfo, null, 4));
    return true;
}


async function login(username, password) {
    const userFolder = path.join(userDataFolder, username);
    const userFile = path.join(userFolder, 'info.gmg');

    if (!fs.existsSync(userFile)) {
        return "No user with this name"
    }

    const userInfo = JSON.parse(fs.readFileSync(userFile));
    const isValid = await comparingPassword(password, userInfo.passwordHash);

    if (!isValid) {
        return "Invalid password"
    }

    return {
        username: userInfo.username,
        email: userInfo.email,
        name: userInfo.name,
        hasPaid: userInfo.hasPaid,
        createdAt: userInfo.createdAt
    };
}


module.exports = {
    createUser,
    login
};
