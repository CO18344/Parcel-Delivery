const express = require('express')
var cors = require('cors')
const b = require('buffer')
const b64toBlob = require('b64-to-blob');
const base64ToBlob = require('base64-blob')
const { body, checkSchema, validationResult } = require('express-validator')
const connection = require('./db')
const moment = require('moment')

const app = express()
const port = 3000

connection.connect()

app.use(cors())
app.use(express.json({limit:'20MB'}))
app.use(express.urlencoded({ limit:'20MB',extended: true }))

const registrationSchema = {
  email: {
    normalizeEmail: true,
    isEmail: {},
    withMessage: {
      errorMessage: "Invalid Email address"
    }
  }
  , phone: {
    isMobilePhone: {},
    errorMessage: "Invalid Mobile Number"
  },
  passwd: {
    isStrongPassword: {
      // default validation
    },
    withMessage: {
      errorMessage: "Password should be atleast of 8 characters including one lowercase, one uppercase, one digit and one special character"
    }
  },
  'passwd-confirm': {
    isStrongPassword: {
      // default validation
    },
    // custom: (async (confirmPassword, { req }) => {
    //   const password = req.body.passwd

    //   if (password !== confirmPassword) {
    //     throw new Error('Passwords and ConfirmPasswords mismatch')
    //   }
    // }),
    errorMessage: "Password should be atleast of 8 characters including one lowercase, one uppercase, one digit and one special character"
  },
  country: {
    notEmpty: true,
    errorMessage: "Invalid Country"
  },
  state: {
    notEmpty: true,
    errorMessage: "Invalid State"
  },
  city: {
    notEmpty: true,
    errorMessage: "Invalid City"
  },
  zip: {
    notEmpty: true,
    errorMessage: "Invalid Zip Code"
  },
  fname: {
    notEmpty: true,
    errorMessage: "Invalid First Name"
  }
}

const loginSchema = {
  email: {
    normalizeEmail: true,
    isEmail: {},
    errorMessage: "Invalid Email address"
  },
  passwd: {

  }
}

const otpVerificationSchema = {
  phone: {
    isMobilePhone: {},
    errorMessage: "Invalid Mobile Number"
  },
  otp: {
    notEmpty: true,
    withMessage: {
      errorMessage: "OTP verification failed"
    }
  }
}

app.post(
  '/api/users/create',
  checkSchema(registrationSchema),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    createUser(req.body)
    res.status(200).json({
      success: true,
      message: 'Registration successful',
    });

  })

app.post(
  '/api/users/activate',
  checkSchema(otpVerificationSchema),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      `select otp from UserMetaData where 1`
      , (err, rows, fields) => {
        if (err) throw err

        if (rows.length > 0) {
          if (rows[0].otp == req.body.otp) {
            return res.status(200).json({
              success: true,
              message: 'OTP verified',
            });
          }
        }
        return res.status(400).json({ errors: 'Otp mismatch' });
      })
  })

app.post(
  '/api/users/login',
  checkSchema(loginSchema),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      `select * from User where email="${req.body.email}" and password=sha2("${req.body.passwd}",256)`,
      (err, rows, fields) => {
        if (err) throw err;
        console.log(rows)
        if (rows.length > 0) {
          let token = getToken(1e4, 1e8);
          connection.query(
            `update UserMetaData set token="${token}" where email="${req.body.email}" `,
            (err, rows, fields) => {
              if (err) throw err;
              console.log('Got')
              res.status(200).json({
                'success': true,
                'token': token,
                'email': req.body.email
              })
            }
          )


        }
      }
    )

  })

app.post(
  '/api/orders/generateOrderId',
  (req, res) => {
    console.log(req.body);

    connection.query(
      `select ordersInitiated from UserMetaData where email="${req.body.email}"`,
      (err, rows, fields) => {
        if (err) throw err;
        console.log('!st test passed');

        if (rows.length > 0) {
          connection.query(
            `insert into OrderParcel (orderId,email) values ("${rows[0].ordersInitiated}","${req.body.email}")`,
            (err, rows2, fields) => {
              if (err) throw err;
              res.status(200).json({
                'success': true,
                'orderId': rows[0].ordersInitiated,
              })
            }
          )
        }
      });
  });

app.post(
  '/api/orders/upload',
  (req, res) => {
    console.log(req.body);
//     console.log(req.body.pic)
var contentType = 'image/jpeg';
let base64Location = req.body.pic.search('base64')
let b64Data = req.body.pic.slice(base64Location+7,)
var bufferValue = Buffer.from(b64Data,"base64");
var blob = new b.Blob(bufferValue)
require("fs").writeFile("out.jpeg", b64Data, 'base64', function(err) {
  console.log(err);
});
// connection.query(
//   `insert into OrderParcel (orderId,email,pic) values ("23","temp@gmail.com","${blob}")`,
//   (err,rows,fields)=>{
//     if(err) throw err;
//   }
// )
// var blob = b64toBlob(b64Data, contentType);
    res.json({
      'success':true
    })
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

var d = new Date().toLocaleString();
// console.log(d);
let datetime = moment().format('YYYY-MM-DD  HH:mm:ss');
console.log(datetime)
console.log('Original Moment ', moment())
let otpExpiry = moment().add(300, 'seconds').format('YYYY-MM-DD  HH:mm:ss')
console.log(otpExpiry)

let momentRecovered = moment(new Date(otpExpiry))
console.log('Recovered: ', momentRecovered)
// console.log(new Date().getTime() / 1000, new Date().getTime() / 1000 + 25)

function getOtp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getToken(min, max) {
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

console.log(getOtp(1e3, 1e4))
console.log(getToken(1e4, 1e8))

function createUser(user) {
  connection.query(
    `insert into User (firstName,lname,email,password,phone,country,state,city,zipcode) values ( "${user.fname}", "${user.lname}", "${user.email}", sha2("${user.passwd}",256), "${user.phone}", "${user.country}", "${user.state}", "${user.city}", "${user.zip}")`
    , (err, rows, fields) => {
      if (err) throw err
      console.log('Inserted User')
    })

  let otp = getOtp(1e3, 1e4)
  let expiry = moment().add(300, 'seconds').format('YYYY-MM-DD  HH:mm:ss')
  connection.query(
    `insert into UserMetaData (email,otp,expiry) values ( "${user.email}", "${otp}", "${expiry}")`
    , (err, rows, fields) => {
      if (err) throw err
      console.log('Inserted Otp')
    })
}

function verifyOtp(otpPack, res) {
  // let verificationStatus = false;
  connection.query(
    `select otp from UserMetaData where 1`
    , (err, rows, fields) => {
      if (err) throw err

      if (rows.length > 0) {
        if (rows[0].otp == otpPack.otp) {
          res.status(200).json({
            success: true,
            message: 'Registration successful',
          });
          // console.log('Inside: ',verificationStatus)
        }
      }
    })
  // console.log('Stats: ',verificationStatus)
  // return verificationStatus;
}

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = 'AC5a99bb7e40f347f6715e8d0ad201079f';
// const authToken = '7288e44944917efe6a31db3692d3a086';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'Your OTP is 9467',
//      from: '+19107202746',
//      to: '+917526916694'
//    })
//   .then(message => console.log(message.sid));
