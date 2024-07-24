const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const cors = require('cors');
const app = express();

/*

      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
      BY : FB.COM/IAMKIRYU | GITHUB.COM/KIRYUDEV
     
      - updated 6/28/24 (fixed error handling & added create_email (custom name))
*/

const API = 'https://t-mail.tech';

/*
      api by kenlie navacilla jugarap
      ~ https://www.facebook.com/kenlienjugarap
*/

const MSG = {
    no_email: function() {
        return 'no emails available';
    },
    gen_error: function() {
        return 'could not generate email';
    },
    inbox_error: function() {
        return 'could not retrieve inbox. domain may be invalid';
    },
    server_error: function() {
        return 'server error. please try again';
    },
    provide: function() {
        return 'please provide email';
    },
    create_error: function() {
        return 'could not create email. domain may be invalid';
    }
};

app.use(cors());

/* retrieve domains, pag pinalitan structure ayosin nyo nalang */

app.get('/api/emails', async (req, res) => {
    try {
        const { data } = await axios.get(API);
        const $ = cheerio.load(data);
        const emails = [];
        $('#domainSelect option').each((index, elem) => {
            const em = $(elem).attr('value');
            emails.push(em);
        });
        if (emails.length === 0) {
            return res.json({
                status: false,
                error: MSG.no_email()
            });
        }
        res.json({
            status: true,
            emails
        });
    } catch {
        res.json({
            status: false,
            error: MSG.server_error()
        });
    }
});

/* generate random email */

app.get('/api/generate_email', async (req, res) => {
    try {
        const req = await axios.get(API+'/generate_email.php');
        const dat = req.data;

        if (dat.status) {
            res.json({
                status: true,
                email: dat.response
            });
        } else {
            res.json({
                status: false,
                error: MSG.gen_error()
            });
        }
    } catch {
        res.json({
            status: false,
            error: MSG.server_error()
        });
    }
});

/* retrieve inbox */

app.get('/api/inbox', async (req, res) => {
    const em = req.query.email;
    if (!em) {
        return res.json({ status: false, error: MSG.provide() });
    }
    try {
        const req = await axios.get(API+'/fetch_emails.php', { params: { email: em } });
        const dat = req.data;

        if (dat.status) {
            res.json({
                status: true,
                data: dat.response
            });
        } else {
            res.json({
                status: false,
                error: MSG.inbox_error()
            });
        }
    } catch (e) {
        if (!e.response.data.status) {
            res.json({
                status: false,
                error: MSG.inbox_error()
            });
        } else {
            res.json({
                status: false,
                error: MSG.server_error()
            });
        }
    }
});

/* delete email */

app.get('/api/delete_email', async (req, res) => {
    const em = req.query.email;
    if (!em) {
        return res.json({ status: false, error: MSG.provide() });
    }
    try {
        const req = await axios.get(API+'/delete_email.php', { params: { email: em } });
        const dat = req.data;

        if (dat.status) {
            res.json({
                status: true,
                message: dat.response
            });
        } else {
            res.json({
                status: false,
                error: MSG.inbox_error()
            });
        }
    } catch {
        res.json({
            status: false,
            error: MSG.server_error()
        });
    }
});

/* create email */

app.get('/api/create_email', async (req, res) => {
    const em = req.query.email;
    if (!em) {
        return res.json({ status: false, error: MSG.provide() });
    }
    try {
        const req = await axios.post(API+'/check_email.php', {'email':em}, { headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        const dat = req.data;
        if (dat.status) {
            res.json({
                status: true,
                email: em
            });
        } else {
            res.json({
                status: false,
                error: MSG.create_error()
            });
        }
    } catch (e) {
        if (!e.response.data.status) {
            res.json({
                status: false,
                error: MSG.create_error()
            });
        } else {
            res.json({
                status: false,
                error: MSG.server_error()
            });
        }
    }
});

app.listen(process.env.PORT || 4545, () => {
    console.log('i am alive');
});