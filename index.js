const express = require('express');
const cheerio = require('cheerio');
const {get} = require('axios');
const cors = require('cors');
const app = express();


const API = 'https://t-mail.tech';


const msg = {
  emailxx: function() {
    return 'لا توجد رسائل بريد إلكتروني متاحة';
  },
  merr: function() {
    return 'لا يمكن إنشاء البريد الإلكتروني';
  },
  inboxErr: function() {
    return 'تعذر استرداد البريد الوارد. قد يكون الرابط غير صالح';
  },
  provide: function() {
    return 'ادخل ايمىل';
  },
  svrErr: function() {
    return 'حدث خطاء';
  },
  crtErr: function() {
    return 'لا يمكن الانشاء حالياً';
  }
};

app.use(cors());



app.get('/email', async (req, res) => {
  try {
    const { data } = await get(API);
    const $ = cheerio.load(data);
    const email = [];
    $('#domainSelect option').each((index, elem) => {
      const em = $(elem).attr('value');
      email.push(em);
    });
    if (email.length === 0) {
      return res.json({
        status: false,
        error: msg.emailxx()
      });
    }
    res.json({
      status: true,
      email
    });
  } catch {
    res.json({
      status: false,
      error: msg.svrErr()
    });
  }
});



app.get('/randomemail', async (req, res) => {
  try {
    const req = await get(API + '/generate_emails.php');
    const dat = req.data;

    if (dat.status) {
      res.json({
        status: true,
        email: dat.response
      });
    } else {
      res.json({
        status: false,
        error: msg.merr()
      });
    }
  } catch {
    res.json({
      status: false,
      error: msg.svrErr()
    });
  }
});



app.get('/inbox', async (req, res) => {
  const em = req.query.email;
  if (!em) {
    return res.json({ status: false, error: msg.provide() });
  }
  try {
    const req = await get(API + '/fetch_emails.php', { params: { email: em } });
    const dat = req.data;

    if (dat.status) {
      res.json({
        status: true,
        data: dat.response
      });
    } else {
      res.json({
        status: false,
        error: msg.inboxErr()
      });
    }
  } catch (e) {
    if (!e.response.data.status) {
      res.json({
        status: false,
        error: msg.inboxErr()
      });
    } else {
      res.json({
        status: false,
        error: msg.svrErr()
      });
    }
  }
});



app.get('/delemail', async (req, res) => {
  const em = req.query.email;
  if (!em) {
    return res.json({ status: false, error: msg.provide() });
  }
  try {
    const req = await get(API + '/delete_email.php', { params: { email: em } });
    const dat = req.data;
    
    if (dat.status) {
      res.json({
        status: true,
        message: dat.response === "Email deleted" ? "تم الحذف بنجاح" : "حدث خطاء " /*kssl*/
      });
    } else {
      res.json({
        status: false,
        error: msg.inboxErr()
      });
    }
  } catch {
    res.json({
      status: false,
      error: msg.svrErr()
    });
  }
});



app.get('/createmail', async (req, res) => {
  const em = req.query.email;
  if (!em) {
    return res.json({ status: false, error: msg.provide() });
  }
  try {
    const req = await axios.post(API + '/check_email.php', { 'email': em }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const dat = req.data;
    if (dat.status) {
      res.json({
        status: true,
        email: em
      });
    } else {
      res.json({
        status: false,
        error: msg.crtErr()
      });
    }
  } catch (e) {
    if (!e.response.data.status) {
      res.json({
        status: false,
        error: msg.crtErr()
      });
    } else {
      res.json({
        status: false,
        error: msg.svrErr()
      });
    }
  }
});

app.listen(process.env.PORT || 4545, () => {
  console.log('liveeexx');
});
