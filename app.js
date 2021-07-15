const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const superagent = require('superagent');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer');
var firebase = require('firebase');
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBdEfLrxJZlrzrG_O5py-qZdvli79d4buc",
  authDomain: "dialaway-65fc9.firebaseapp.com",
  projectId: "dialaway-65fc9",
  storageBucket: "dialaway-65fc9.appspot.com",
  messagingSenderId: "173723884462",
  appId: "1:173723884462:web:5608b0378a861156fcc63f",
  measurementId: "G-78YWSZFE8D"
};

// var firebaseConfig = {
//     apiKey: "AIzaSyAHtUrLkK8faRh8cYN57cBOC3_IY9T-lLU",
//     authDomain: "mentorweb-fae19.firebaseapp.com",
//     projectId: "mentorweb-fae19",
//     storageBucket: "mentorweb-fae19.appspot.com",
//     messagingSenderId: "717698230916",
//     appId: "1:717698230916:web:9b476b4b00256e260f30d1",
//     measurementId: "G-1WJW09HGQ1"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const db = firebase.firestore();

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);
app.use(bodyParser.urlencoded({extended: true}));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const base_url = "https://1rgco4uv03.execute-api.us-east-2.amazonaws.com/uat/";
var mentorDetails;
var mentorid = "";
var mentorObject = {};
var BearerToken;
var imgLink = "/logo.jpeg";
var panimgLink = "/logo.jpeg";
var imgpath;
var panimgpath;
var selectedday = "Monday";
var selectedtimezone = "";
var completedsessions = [];
var scheduledsessions = [];
var cancelledsessions = [];
var pendingsessions = [];
var chatusers = [];
var pageno = 1;
var pagesize = 10;
var sortby = "experience";

var slots = {
  "Monday": [],
  "Tuesday": [],
  "Wednesday": [],
  "Thursday": [],
  "Friday": [],
  "Saturday": [],
  "Sunday": []
};

const aamslots = [
  {
    "start": "01 : 00",
    "end": "01 : 30",
    "display": "inline - block"
  }, {
    "start": "01 : 30",
    "end": "02 : 00",
    "display": "inline-block"
  }, {
    "start": "02 : 00",
    "end": "02 : 30",
    "display": "inline-block"
  }, {
    "start": "02 : 30",
    "end": "03 : 00",
    "display": "inline-block"
  }, {
    "start": "03 : 00",
    "end": "03 : 30",
    "display": "inline-block"
  }, {
    "start": "03 : 30",
    "end": "04 : 00",
    "display": "inline-block"
  }, {
    "start": "04 : 00",
    "end": "04 : 30",
    "display": "inline-block"
  }, {
    "start": "04 : 30",
    "end": "05 : 00",
    "display": "inline-block"
  }, {
    "start": "05 : 00",
    "end": "05 : 30",
    "display": "inline-block"
  }, {
    "start": "05 : 30",
    "end": "06 : 00",
    "display": "inline-block"
  }, {
    "start": "06 : 00",
    "end": "06 : 30",
    "display": "inline-block"
  }, {
    "start": "06 : 30",
    "end": "07 : 00",
    "display": "inline-block"
  }, {
    "start": "07 : 00",
    "end": "07 : 30",
    "display": "inline-block"
  }, {
    "start": "07 : 30",
    "end": "08 : 00",
    "display": "inline-block"
  }, {
    "start": "08 : 00",
    "end": "08 : 30",
    "display": "inline-block"
  }, {
    "start": "08 : 30",
    "end": "09 : 00",
    "display": "inline-block"
  }, {
    "start": "09 : 00",
    "end": "09 : 30",
    "display": "inline-block"
  }, {
    "start": "09 : 30",
    "end": "10 : 00",
    "display": "inline-block"
  }, {
    "start": "10 : 00",
    "end": "10 : 30",
    "display": "inline-block"
  }, {
    "start": "10 : 30",
    "end": "11 : 00",
    "display": "inline-block"
  }, {
    "start": "11 : 00",
    "end": "11 : 30",
    "display": "inline-block"
  }
];

const amslots = [
  {
    "start": "00 : 00 am",
    "end": "00 : 30 am",
    "display": "inline-block"
  }, {
    "start": "00 : 30 am",
    "end": "01 : 00 am",
    "display": "inline-block"
  }, {
    "start": "01 : 00 am",
    "end": "01 : 30 am",
    "display": "inline-block"
  }, {
    "start": "01 : 30 am",
    "end": "02 : 00 am",
    "display": "inline-block"
  }, {
    "start": "02 : 00 am",
    "end": "02 : 30 am",
    "display": "inline-block"
  }, {
    "start": "02 : 30 am",
    "end": "03 : 00 am",
    "display": "inline-block"
  }, {
    "start": "03 : 00 am",
    "end": "03 : 30 am",
    "display": "inline-block"
  }, {
    "start": "03 : 30 am",
    "end": "04 : 00 am",
    "display": "inline-block"
  }, {
    "start": "04 : 00 am",
    "end": "04 : 30 am",
    "display": "inline-block"
  }, {
    "start": "04 : 30 am",
    "end": "05 : 00 am",
    "display": "inline-block"
  }, {
    "start": "05 : 00 am",
    "end": "05 : 30 am",
    "display": "inline-block"
  }, {
    "start": "05 : 30 am",
    "end": "06 : 00 am",
    "display": "inline-block"
  }, {
    "start": "06 : 00 am",
    "end": "06 : 30 am",
    "display": "inline-block"
  }, {
    "start": "06 : 30 am",
    "end": "07 : 00 am",
    "display": "inline-block"
  }, {
    "start": "07 : 00 am",
    "end": "07 : 30 am",
    "display": "inline-block"
  }, {
    "start": "07 : 30 am",
    "end": "08 : 00 am",
    "display": "inline-block"
  }, {
    "start": "08 : 00 am",
    "end": "08 : 30 am",
    "display": "inline-block"
  }, {
    "start": "08 : 30 am",
    "end": "09 : 00 am",
    "display": "inline-block"
  }, {
    "start": "09 : 00 am",
    "end": "09 : 30 am",
    "display": "inline-block"
  }, {
    "start": "09 : 30 am",
    "end": "10 : 00 am",
    "display": "inline-block"
  }, {
    "start": "10 : 00 am",
    "end": "10 : 30 am",
    "display": "inline-block"
  }, {
    "start": "10 : 30 am",
    "end": "11 : 00 am",
    "display": "inline-block"
  }, {
    "start": "11 : 00 am",
    "end": "11 : 30 am",
    "display": "inline-block"
  }, {
    "start": "11 : 30 am",
    "end": "12 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "12 : 00 pm",
    "end": "12 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "12 : 30 am",
    "end": "01 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "01 : 00 pm",
    "end": "01 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "01 : 30 pm",
    "end": "02 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "02 : 00 pm",
    "end": "02 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "02 : 30 pm",
    "end": "03 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "03 : 00 pm",
    "end": "03 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "03 : 30 pm",
    "end": "04 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "04 : 00 pm",
    "end": "04 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "04 : 30 pm",
    "end": "05 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "05 : 00 pm",
    "end": "05 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "05 : 30 pm",
    "end": "06 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "06 : 00 pm",
    "end": "06 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "06 : 30 pm",
    "end": "07 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "07 : 00 pm",
    "end": "07 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "07 : 30 pm",
    "end": "08 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "08 : 00 pm",
    "end": "08 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "08 : 30 pm",
    "end": "09 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "09 : 00 pm",
    "end": "09 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "09 : 30 pm",
    "end": "10 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "10 : 00 pm",
    "end": "10 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "10 : 30 pm",
    "end": "11 : 00 pm",
    "display": "inline-block"
  }, {
    "start": "11 : 00 pm",
    "end": "11 : 30 pm",
    "display": "inline-block"
  }, {
    "start": "11 : 30 pm",
    "end": "00 : 00 am",
    "display": "inline-block"
  }
];

// const AllSlots = {};
// amslots.forEach(function(item, i){
//   AllSlots[i+1]=[item.start, item.end, item.display];
// });
// amslots.forEach(function(item, i){
//   AllSlots[item.start]=[item.start, item.end, item.display];
// });
// console.log(AllSlots);

// var allslots={"Monday":JSON.parse(JSON.stringify(amslots)),"Tuesday":JSON.parse(JSON.stringify(amslots)),"Wednesday":JSON.parse(JSON.stringify(amslots)),"Thursday":JSON.parse(JSON.stringify(amslots)),"Friday":JSON.parse(JSON.stringify(amslots)),"Saturday":JSON.parse(JSON.stringify(amslots)),"Sunday":JSON.parse(JSON.stringify(amslots))};

// var allslots = {"Monday": JSON.parse(JSON.stringify(AllSlots)), "Tuesday": JSON.parse(JSON.stringify(AllSlots)), "Wednesday": JSON.parse(JSON.stringify(AllSlots)), "Thursday": JSON.parse(JSON.stringify(AllSlots)), "Friday": JSON.parse(JSON.stringify(AllSlots)), "Saturday": JSON.parse(JSON.stringify(AllSlots)), "Sunday": JSON.parse(JSON.stringify(AllSlots))};

var timeslot = {
  "mentorId": "",
  "days": [
    {
      "day": "Monday",
      "timeslots": []
    }, {
      "day": "Tuesday",
      "timeslots": []
    }, {
      "day": "Wednesday",
      "timeslots": []
    }, {
      "day": "Thursday",
      "timeslots": []
    }, {
      "day": "Friday",
      "timeslots": []
    }, {
      "day": "Saturday",
      "timeslots": []
    }, {
      "day": "Sunday",
      "timeslots": []
    }
  ]
};

const currency = {
  "AED": "United Arab Emirates dirham",
  "AFN": "Afghan afghani",
  "ALL": "Albanian lek",
  "AMD": "Armenian dram",
  "ANG": "Netherlands Antillean guilder",
  "AOA": "Angolan kwanza",
  "ARS": "Argentine peso",
  "AUD": "Australian dollar",
  "AWG": "Aruban florin",
  "AZN": "Azerbaijani manat",
  "BAM": "Bosnia and Herzegovina convertible mark",
  "BBD": "Barbados dollar",
  "BDT": "Bangladeshi taka",
  "BGN": "Bulgarian lev",
  "BHD": "Bahraini dinar",
  "BIF": "Burundian franc",
  "BMD": "Bermudian dollar",
  "BND": "Brunei dollar",
  "BOB": "Boliviano",
  "BRL": "Brazilian real",
  "BSD": "Bahamian dollar",
  "BTN": "Bhutanese ngultrum",
  "BWP": "Botswana pula",
  "BYN": "New Belarusian ruble",
  "BYR": "Belarusian ruble",
  "BZD": "Belize dollar",
  "CAD": "Canadian dollar",
  "CDF": "Congolese franc",
  "CHF": "Swiss franc",
  "CLF": "Unidad de Fomento",
  "CLP": "Chilean peso",
  "CNY": "Renminbi|Chinese yuan",
  "COP": "Colombian peso",
  "CRC": "Costa Rican colon",
  "CUC": "Cuban convertible peso",
  "CUP": "Cuban peso",
  "CVE": "Cape Verde escudo",
  "CZK": "Czech koruna",
  "DJF": "Djiboutian franc",
  "DKK": "Danish krone",
  "DOP": "Dominican peso",
  "DZD": "Algerian dinar",
  "EGP": "Egyptian pound",
  "ERN": "Eritrean nakfa",
  "ETB": "Ethiopian birr",
  "EUR": "Euro",
  "FJD": "Fiji dollar",
  "FKP": "Falkland Islands pound",
  "GBP": "Pound sterling",
  "GEL": "Georgian lari",
  "GHS": "Ghanaian cedi",
  "GIP": "Gibraltar pound",
  "GMD": "Gambian dalasi",
  "GNF": "Guinean franc",
  "GTQ": "Guatemalan quetzal",
  "GYD": "Guyanese dollar",
  "HKD": "Hong Kong dollar",
  "HNL": "Honduran lempira",
  "HRK": "Croatian kuna",
  "HTG": "Haitian gourde",
  "HUF": "Hungarian forint",
  "IDR": "Indonesian rupiah",
  "ILS": "Israeli new shekel",
  "INR": "Indian rupee",
  "IQD": "Iraqi dinar",
  "IRR": "Iranian rial",
  "ISK": "Icelandic króna",
  "JMD": "Jamaican dollar",
  "JOD": "Jordanian dinar",
  "JPY": "Japanese yen",
  "KES": "Kenyan shilling",
  "KGS": "Kyrgyzstani som",
  "KHR": "Cambodian riel",
  "KMF": "Comoro franc",
  "KPW": "North Korean won",
  "KRW": "South Korean won",
  "KWD": "Kuwaiti dinar",
  "KYD": "Cayman Islands dollar",
  "KZT": "Kazakhstani tenge",
  "LAK": "Lao kip",
  "LBP": "Lebanese pound",
  "LKR": "Sri Lankan rupee",
  "LRD": "Liberian dollar",
  "LSL": "Lesotho loti",
  "LYD": "Libyan dinar",
  "MAD": "Moroccan dirham",
  "MDL": "Moldovan leu",
  "MGA": "Malagasy ariary",
  "MKD": "Macedonian denar",
  "MMK": "Myanmar kyat",
  "MNT": "Mongolian tögrög",
  "MOP": "Macanese pataca",
  "MRO": "Mauritanian ouguiya",
  "MUR": "Mauritian rupee",
  "MVR": "Maldivian rufiyaa",
  "MWK": "Malawian kwacha",
  "MXN": "Mexican peso",
  "MXV": "Mexican Unidad de Inversion",
  "MYR": "Malaysian ringgit",
  "MZN": "Mozambican metical",
  "NAD": "Namibian dollar",
  "NGN": "Nigerian naira",
  "NIO": "Nicaraguan córdoba",
  "NOK": "Norwegian krone",
  "NPR": "Nepalese rupee",
  "NZD": "New Zealand dollar",
  "OMR": "Omani rial",
  "PAB": "Panamanian balboa",
  "PEN": "Peruvian Sol",
  "PGK": "Papua New Guinean kina",
  "PHP": "Philippine peso",
  "PKR": "Pakistani rupee",
  "PLN": "Polish złoty",
  "PYG": "Paraguayan guaraní",
  "QAR": "Qatari riyal",
  "RON": "Romanian leu",
  "RSD": "Serbian dinar",
  "RUB": "Russian ruble",
  "RWF": "Rwandan franc",
  "SAR": "Saudi riyal",
  "SBD": "Solomon Islands dollar",
  "SCR": "Seychelles rupee",
  "SDG": "Sudanese pound",
  "SEK": "Swedish krona",
  "SGD": "Singapore dollar",
  "SHP": "Saint Helena pound",
  "SLL": "Sierra Leonean leone",
  "SOS": "Somali shilling",
  "SRD": "Surinamese dollar",
  "SSP": "South Sudanese pound",
  "STD": "São Tomé and Príncipe dobra",
  "SVC": "Salvadoran colón",
  "SYP": "Syrian pound",
  "SZL": "Swazi lilangeni",
  "THB": "Thai baht",
  "TJS": "Tajikistani somoni",
  "TMT": "Turkmenistani manat",
  "TND": "Tunisian dinar",
  "TOP": "Tongan paʻanga",
  "TRY": "Turkish lira",
  "TTD": "Trinidad and Tobago dollar",
  "TWD": "New Taiwan dollar",
  "TZS": "Tanzanian shilling",
  "UAH": "Ukrainian hryvnia",
  "UGX": "Ugandan shilling",
  "USD": "United States dollar",
  "UYI": "Uruguay Peso en Unidades Indexadas",
  "UYU": "Uruguayan peso",
  "UZS": "Uzbekistan som",
  "VEF": "Venezuelan bolívar",
  "VND": "Vietnamese đồng",
  "VUV": "Vanuatu vatu",
  "WST": "Samoan tala",
  "XAF": "Central African CFA franc",
  "XCD": "East Caribbean dollar",
  "XOF": "West African CFA franc",
  "XPF": "CFP franc",
  "YER": "Yemeni rial",
  "ZAR": "South African rand",
  "ZMW": "Zambian kwacha",
  "ZWL": "Zimbabwean dollar"
};

const timezone = [
  {
    "offset": "(GMT-12:00)",
    "name": "Etc GMT-12"
  }, {
    "offset": "(GMT-11:00)",
    "name": "Etc GMT-11"
  }, {
    "offset": "(GMT-11:00)",
    "name": "Pacific Midway"
  }, {
    "offset": "GMT-10:00",
    "name": "America Adak"
  }, {
    "offset": "(GMT-09:00)",
    "name": "America Anchorage"
  }, {
    "offset": "(GMT-09:00)",
    "name": "Pacific Gambier"
  }, {
    "offset": "(GMT-08:00)",
    "name": "America Dawson_Creek"
  }, {
    "offset": "(GMT-08:00)",
    "name": "America Ensenada"
  }, {
    "offset": "(GMT-08:00)",
    "name": "America Los_Angeles"
  }, {
    "offset": "(GMT-07:00)",
    "name": "America Chihuahua"
  }, {
    "offset": "(GMT-07:00)",
    "name": "America Denver"
  }, {
    "offset": "(GMT-06:00)",
    "name": "America Belize"
  }, {
    "offset": "(GMT-06:00)",
    "name": "America Cancun"
  }, {
    "offset": "(GMT-06:00)",
    "name": "America Chicago"
  }, {
    "offset": "(GMT-06:00)",
    "name": "Chile EasterIsland"
  }, {
    "offset": "(GMT-05:00)",
    "name": "America Bogota"
  }, {
    "offset": "(GMT-05:00)",
    "name": "America Havana"
  }, {
    "offset": "(GMT-05:00)",
    "name": "America New_York"
  }, {
    "offset": "(GMT-04:30)",
    "name": "America Caracas"
  }, {
    "offset": "(GMT-04:00)",
    "name": "America Campo_Grande"
  }, {
    "offset": "(GMT-04:00)",
    "name": "America Glace_Bay"
  }, {
    "offset": "(GMT-04:00)",
    "name": "America Goose_Bay"
  }, {
    "offset": "(GMT-04:00)",
    "name": "America Santiago"
  }, {
    "offset": "(GMT-04:00)",
    "name": "America La_Paz"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Argentina Buenos_Aires"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Montevideo"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Araguaina"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Godthab"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Miquelon"
  }, {
    "offset": "(GMT-03:00)",
    "name": "America Sao_Paulo"
  }, {
    "offset": "(GMT-03:30)",
    "name": "America St_Johns"
  }, {
    "offset": "(GMT-02:00)",
    "name": "America Noronha"
  }, {
    "offset": "(GMT-01:00)",
    "name": "Atlantic Cape_Verde"
  }, {
    "offset": "(GMT)",
    "name": "Europe Belfast"
  }, {
    "offset": "(GMT)",
    "name": "Africa Abidjan"
  }, {
    "offset": "(GMT)",
    "name": "Europe Dublin"
  }, {
    "offset": "(GMT)",
    "name": "Europe Lisbon"
  }, {
    "offset": "(GMT)",
    "name": "Europe London"
  }, {
    "offset": "(UTC)",
    "name": "UTC"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Africa Algiers"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Africa Windhoek"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Atlantic Azores"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Atlantic Stanley"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Europe Amsterdam"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Europe Belgrade"
  }, {
    "offset": "(GMT+01:00)",
    "name": "Europe Brussels"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Africa Cairo"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Africa Blantyre"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Asia Beirut"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Asia Damascus"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Asia Gaza"
  }, {
    "offset": "(GMT+02:00)",
    "name": "Asia Jerusalem"
  }, {
    "offset": "(GMT+03:00)",
    "name": "Africa Addis_Ababa"
  }, {
    "offset": "(GMT+03:00)",
    "name": "Asia Riyadh89"
  }, {
    "offset": "(GMT+03:00)",
    "name": "Europe Minsk"
  }, {
    "offset": "(GMT+03:30)",
    "name": "Asia Tehran"
  }, {
    "offset": "(GMT+04:00)",
    "name": "Asia Dubai"
  }, {
    "offset": "(GMT+04:00)",
    "name": "Asia Yerevan"
  }, {
    "offset": "(GMT+04:00)",
    "name": "Europe Moscow"
  }, {
    "offset": "(GMT+04:30)",
    "name": "Asia Kabul"
  }, {
    "offset": "(GMT+05:00)",
    "name": "Asia Tashkent"
  }, {
    "offset": "GMT+05:30",
    "name": "Asia Kolkata"
  }, {
    "offset": "(GMT+05:45)",
    "name": "Asia Katmandu"
  }, {
    "offset": "(GMT+06:00)",
    "name": "Asia Dhaka"
  }, {
    "offset": "(GMT+06:00)",
    "name": "Asia Yekaterinburg"
  }, {
    "offset": "(GMT+06:30)",
    "name": "Asia Rangoon"
  }, {
    "offset": "(GMT+07:00)",
    "name": "Asia Bangkok"
  }, {
    "offset": "(GMT+07:00)",
    "name": "Asia Novosibirsk"
  }, {
    "offset": "(GMT+08:00)",
    "name": "Etc GMT+8"
  }, {
    "offset": "(GMT+08:00)",
    "name": "Asia Hong_Kong"
  }, {
    "offset": "(GMT+08:00)",
    "name": "Asia Krasnoyarsk"
  }, {
    "offset": "(GMT+08:00)",
    "name": "Australia Perth"
  }, {
    "offset": "(GMT+08:45)",
    "name": "Australia Eucla"
  }, {
    "offset": "(GMT+09:00)",
    "name": "Asia Irkutsk"
  }, {
    "offset": "(GMT+09:00)",
    "name": "Asia Seoul"
  }, {
    "offset": "(GMT+09:00)",
    "name": "Asia Tokyo"
  }, {
    "offset": "(GMT+09:30)",
    "name": "Australia Adelaide"
  }, {
    "offset": "(GMT+09:30)",
    "name": "Australia Darwin"
  }, {
    "offset": "(GMT+09:30)",
    "name": "Pacific Marquesas"
  }, {
    "offset": "(GMT+10:00)",
    "name": "Etc GMT+10"
  }, {
    "offset": "(GMT+10:00)",
    "name": "Australia Brisbane"
  }, {
    "offset": "(GMT+10:00)",
    "name": "Australia Hobart"
  }, {
    "offset": "(GMT+10:00)",
    "name": "Asia Yakutsk"
  }, {
    "offset": "(GMT+10:30)",
    "name": "Australia Lord_Howe"
  }, {
    "offset": "(GMT+11:00)",
    "name": "Asia Vladivostok"
  }, {
    "offset": "(GMT+11:30)",
    "name": "Pacific Norfolk"
  }, {
    "offset": "(GMT+12:00)",
    "name": "Etc GMT+12"
  }, {
    "offset": "GMT+12:00",
    "name": "Asia Anadyr"
  }, {
    "offset": "(GMT+12:00)",
    "name": "Asia Magadan"
  }, {
    "offset": "(GMT+12:00)",
    "name": "Pacific Auckland"
  }, {
    "offset": "(GMT+12:45)",
    "name": "Pacific Chatham"
  }, {
    "offset": "(GMT+13:00)",
    "name": "Pacific Tongatapu"
  }, {
    "offset": "(GMT+14:00)",
    "name": "Pacific Kiritimati"
  }
];

//=============================================================================================================================================================================
// Base Route
app.get("/", function(req, res) {
  res.redirect("/loginscreen");
});

//=============================================================================================================================================================================
// LoginScreen
app.get("/loginscreen", function(req, res) {
  res.render("loginscreen");
});

app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;
  const phoneNumber = req.body.phno;
  const url = base_url + "user/";
  firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
    var user = userCredential.user;
    const authToken = user.b.b.h;
    const bearerToken = "Bearer " + authToken;
    BearerToken = bearerToken;
    console.log(bearerToken);
    superagent.get(url).set('Authorization', bearerToken).then((response) => {
      // console.log(response);
      var data = response.body;
      // console.log(data);
      console.log(data["model"]);
      mentorObject = data["model"];
      mentorid = data["model"].id;
      timeslot["mentorId"] = mentorid;
      res.redirect("/homescreen");
    }).catch(console.log(error));
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
});

//=============================================================================================================================================================================
//RegistrationScreen
app.get("/registerscreen", function(req, res) {
  res.render("registrationscreen");
});

app.post("/register", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;
  const phoneNumber = req.body.phno;
  const userName = req.body.name;
  const url = base_url + "register-user/mentor/";

  firebase.auth().createUserWithEmailAndPassword(email, password).then(async function(userCredential) {
    var user = userCredential.user;
    const authToken = user.b.b.h;
    const bearerToken = "Bearer " + authToken;
    BearerToken = bearerToken;
    console.log(bearerToken);
    console.log(BearerToken);
    console.log(url);
    const axiosConfig = {
      headers: {
        "Authorization": bearerToken
      }
    }
    const postData = {
      "name": userName,
      "email": email,
      "phone": phoneNumber
    }
    superagent.post(url).set('Authorization', bearerToken).send(postData).then((response) => {
      // console.log(response.text);
      var data = response.text;
      // console.log(data);
      mentorDetails = JSON.parse(data);
      mentorObject = mentorDetails["model"];
      mentorid = mentorDetails["model"].id;
      res.redirect("/homescreen");

    }).catch((error) => {
      console.log(error);
    });

  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
});

//homescreen
app.get("/homescreen", async function(req, res) {
  const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  const scheduledurl = url + "/ACCEPTED";
  const startedurl = url + "/STARTED"
  var scheduledSessions = [];
  console.log(mentorid);
  const monthlyurl = base_url + "session/mentor/session/" + mentorid + "/Monthly";
  const yearlyurl = base_url + "session/mentor/session/" + mentorid + "/Yearly";
  const weeklyurl = base_url + "session/mentor/session/" + mentorid + "/Weekly";
  var weekly = [], monthly = [], yearly = [];
  const pagingData = {
    "pageNo": pageno,
    "pageSize": pagesize,
    "sort": sortby
  };
  await superagent.post(startedurl).set('Authorization', BearerToken).send(pagingData).then(async function(response){
    const data = response.body;
    if(data["model"]){
      data["model"].forEach(function(item) {
        scheduledSessions.push(item);
      });
    }
    await superagent.post(scheduledurl).set('Authorization', BearerToken).send(pagingData).then((response)=>{
      const dataa = response.body;
      console.log(dataa);
      if(dataa){
        if(dataa["model"]){
        dataa["model"].forEach(function(item2){
          scheduledSessions.push(item2);
        });
      }}
      console.log(dataa);
      console.log(scheduledSessions);
    }).catch((error)=>{
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });

  const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var years = [];

  await superagent.get(monthlyurl).set('Authorization', BearerToken).then((response)=>{
    const data = response.body;
    if( data && data["model"]){
      months.forEach(function(month, i){ monthly.push(data['model'][month]); });
    }
    console.log(monthly);
  }).catch((error)=>{
    console.log(error);
  });

  await superagent.get(yearlyurl).set('Authorization', BearerToken).then((response)=>{
    const data = response.body;
    if( data && data["model"]){
      const dataa = data['model'];
      for(var year in dataa){
        years.push(year);
        yearly.push(dataa[year]);
      };
    }

    console.log(yearly);

  }).catch((error)=>{
    console.log(error);
  });

  const paymenturl = base_url + "mentor/dashboard/paymentsummary";
  var total_payout="", pending_payout="";
  await superagent.get(paymenturl).set('Authorization', BearerToken).then((response)=>{
    const data = response.body;
    pending_payout = data["model"].pending_payout;
    total_payout = data["model"].total_payout;
  }).catch((error)=>{
    console.log(error);
  });

  const todourl = base_url + "mentor/dashboard/todo";
  var todomsg = "";
  await superagent.get(todourl).set("Authorization", BearerToken).then((response)=>{
    const data = response.body;
    todomsg = data["model"][0];
  }).catch((error)=>{
    console.log(error);
  });

  const forimgurl = base_url + "management/mentor/" + mentorid;
  await superagent.get(forimgurl).set('Authorization', BearerToken).then((response)=>{
    const data = JSON.parse(response.text);
    imgLink = data["model"].photoUrl;
  }).catch((error)=>{
    console.log(error);
  });

  if(!imgLink){
    imgLink = "";
  }
  console.log(imgLink);
  res.render("homescreen", {
    scheduledSessions: scheduledSessions,
    months: months,
    years: years,
    yearly: yearly,
    monthly, monthly,
    whichgraph: "monthly",
    total_payout: total_payout,
    pending_payout: pending_payout,
    todomsg: todomsg,
    imgLink: imgLink
  });
});

//=============================================================================================================================================================================
//Sessions related
app.get("/allsessionsscreen", async function(req, res) {
  // const url = base_url + "session/mentor/session/" + mentorid;
  const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  // const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  console.log(url);
  const startedurl = url + "/STARTED";
  const requestpendingurl = url + "/REQUEST_PENDING";
  const scheduledurl = url + "/ACCEPTED";
  const completedurl = url + "/COMPLETED";
  const cancelledurl = url + "/CANCELLED";
  var completedSessions = [];
  var cancelledSessions = [];
  var scheduledSessions = [];
  var pendingSessions = [];
  const allurl = url + "/ALL";
  const pagingurl = base_url + "store/mentorlist";
  const pagingData = {
    "pageNo": pageno,
    "pageSize": pagesize,
    "sort": sortby
  };
  console.log(imgLink);
  // await superagent.post(allurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
  //   const dataa = JSON.parse(response.text);
  //   const data = dataa["model"];
  //   data.forEach(function(item, i) {
  //      item["status"]="REQUEST_PENDING";
  //     if (item["status"] == 'REQUEST_PENDING' || item["status"] == 'START' || item["status"] == 'SCHEDULE') {
  //       scheduledSessions.push(item);
  //     } else if (item["status"] == 'CANCEL') {
  //       cancelledSessions.push(item);
  //     } else if (item["status"] == 'COMPLETE') {
  //       completedSessions.push(item);
  //     }
  //   });
  // }).catch((error) => {
  //   console.log(error);
  // });
  //===================================================================================================================
  // console.log(allurl);
  // await superagent.get(allurl).set('Authorization', BearerToken).then((response) => {
  //   const dataa = JSON.parse(response.text);
  //   const data = dataa["model"];
  //   data.forEach(function(item, i) {
  //     if (item["status"] == 'REQUEST_PENDING' || item["status"] == 'START' || item["status"] == 'SCHEDULE') {
  //       scheduledSessions.push(item);
  //     } else if (item["status"] == 'CANCEL') {
  //       cancelledSessions.push(item);
  //     } else if (item["status"] == 'COMPLETE') {
  //       completedSessions.push(item);
  //     }
  //   });
  // }).catch((error) => {
  //   console.log(error);
  // });
  //===================================================================================================================
  await superagent.post(completedurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    // console.log(response.body);
    const data = response.body;
    if (data != []) {
      data["model"].forEach(function(item) {
        completedSessions.push(item);
      });
    }
  }).catch((error) => {
    console.log(error);
  });

  await superagent.post(cancelledurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    const data = response.body;
    if (data != []) {
      data["model"].forEach(function(item) {
        cancelledSessions.push(item);
      });
    }
  }).catch((error) => {
    console.log(error);
  });

  await superagent.post(requestpendingurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      pendingSessions.push(item);
    });
  }).catch((error) => {
    console.log(error);
  });
  await superagent.post(startedurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      // console.log(item);
      scheduledSessions.push(item);
    });
    console.log(scheduledsessions);
    console.log(cancelledurl);
  }).catch((error) => {
    console.log(error);
  });
  await superagent.post(scheduledurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      scheduledSessions.push(item);
    });
    console.log(scheduledsessions);
  }).catch((error) => {
    console.log(error);
  });
  // console.log(scheduledsessions);
  //===================================================================================================================
  scheduledsessions = scheduledSessions;
  cancelledsessions = cancelledSessions;
  completedsessions = completedSessions;
  pendingsessions = pendingSessions;
  // res.redirect("/allsessions/Scheduled");
  res.redirect("/allsessions/REQUEST_PENDING");
});

app.get("/paginatedsessionsscreen/:pageno/:whichbutton", async function(req, res) {
  const whichbutton = req.params.whichbutton;
  pageno = req.params.pageno;
  console.log(whichbutton);
  // const url = base_url + "session/mentor/session/" + mentorid;
  const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  // const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  console.log(url);
  const startedurl = url + "/STARTED";
  const requestpendingurl = url + "/REQUEST_PENDING";
  const scheduledurl = url + "/ACCEPTED";
  const completedurl = url + "/COMPLETED";
  const cancelledurl = url + "/CANCELLED";
  var completedSessions = [];
  var cancelledSessions = [];
  var scheduledSessions = [];
  var pendingSessions = [];
  const allurl = url + "/ALL";
  const pagingurl = base_url + "store/mentorlist";
  const pagingData = {
    "pageNo": pageno,
    "pageSize": pagesize,
    "sort": sortby
  };
  console.log(pagingData);
  if (whichbutton == "REQUEST_PENDING") {
    superagent.post(requestpendingurl).send(pagingData).then((response) => {
      console.log(requestpendingurl);
      const data = response.body;
      // console.log(data);
      if (data) {
        data["model"].forEach(function(item) {
          pendingSessions.push(item);
        });
        // pendingsessions = pendingSessions;
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  if (whichbutton == "Scheduled") {
    superagent.post(startedurl).send(pagingData).then((response) => {
      console.log(startedurl);
      const data = response.body;
      // console.log(data);
      if (data) {
        data["model"].forEach(function(item) {
          // console.log(item);
          scheduledSessions.push(item);
        });
      }
      // pendingsessions = pendingSessions;
    }).catch((error) => {
      console.log(error);
    });
  }
  if (whichbutton == "Completed") {
    superagent.post(completedurl).send(pagingData).then((response) => {
      console.log(completedurl);
      const data = response.data;
      if (data) {
        data["model"].forEach(function(item) {
          completedSessions.push(item);
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  if (whichbutton == "Cancelled") {
    superagent.post(cancelledurl).send(pagingData).then((response) => {
      console.log(cancelledurl);
      const data = response.data;
      if (data) {
        data["model"].forEach(function(item) {
          cancelledSessions.push(item);
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  // console.log(scheduledsessions);
  // scheduledsessions = scheduledSessions;
  // cancelledsessions = cancelledSessions;
  // completedsessions = completedSessions;
  // pendingsessions = pendingSessions;
  res.status(200).json({
    "whichbutton": whichbutton,
    "scheduledsessions": scheduledSessions,
    "cancelledsessions": cancelledSessions,
    "completedsessions": completedSessions,
    "pendingsessions": pendingSessions,
    documents: [],
    imgLink: imgLink,
    "pageno": parseInt(pageno)
  });
});

app.get("/pagesessionsscreen/:pageno/:whichbutton", async function(req, res) {
  const whichbutton = req.params.whichbutton;
  pageno = req.params.pageno;
  // const url = base_url + "session/mentor/session/" + mentorid;
  const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  // const url = base_url + "session/mentor/session/60926f8bcec85169b059491c";
  console.log(url);
  const startedurl = url + "/STARTED";
  const requestpendingurl = url + "/REQUEST_PENDING";
  const scheduledurl = url + "/ACCEPTED";
  const completedurl = url + "/COMPLETED";
  const cancelledurl = url + "/CANCELLED";
  var completedSessions = [];
  var cancelledSessions = [];
  var scheduledSessions = [];
  var pendingSessions = [];
  const allurl = url + "/ALL";
  const pagingurl = base_url + "store/mentorlist";
  const pagingData = {
    "pageNo": pageno,
    "pageSize": pagesize,
    "sort": sortby
  };
  console.log(pagingData);
  await superagent.post(completedurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    // console.log(response.body);
    const data = response.body;
    if (data != []) {
      data["model"].forEach(function(item) {
        completedSessions.push(item);
      });
    }
  }).catch((error) => {
    console.log(error);
  });

  await superagent.post(cancelledurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    const data = response.body;
    if (data != []) {
      data["model"].forEach(function(item) {
        cancelledSessions.push(item);
      });
    }
  }).catch((error) => {
    console.log(error);
  });

  await superagent.post(requestpendingurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      pendingSessions.push(item);
    });
  }).catch((error) => {
    console.log(error);
  });
  await superagent.post(startedurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      // console.log(item);
      scheduledSessions.push(item);
    });
    console.log(scheduledsessions);
    console.log(cancelledurl);
  }).catch((error) => {
    console.log(error);
  });
  await superagent.post(scheduledurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
    // console.log(response);
    const data = response.body;
    // console.log(data);
    data["model"].forEach(function(item) {
      scheduledSessions.push(item);
    });
    console.log(scheduledsessions);
  }).catch((error) => {
    console.log(error);
  });
  // console.log(scheduledsessions);
  scheduledsessions = scheduledSessions;
  cancelledsessions = cancelledSessions;
  completedsessions = completedSessions;
  pendingsessions = pendingSessions;
  res.status(200).json({
    "whichbutton": whichbutton,
    "scheduledsessions": scheduledSessions,
    "cancelledsessions": cancelledSessions,
    "completedsessions": completedSessions,
    "pendingsessions": pendingSessions,
    documents: [],
    imgLink: imgLink,
    "pageno": parseInt(pageno)

  });
});

app.get("/allsessions/:whichbutton", function(req, res) {
  // console.log(scheduledsessions);
  // db.collection('messages').doc(mentorid)
  //   .get()
  //   .then(querySnapshot => {
  //     console.log(querySnapshot.docs);
  //     const documents = querySnapshot.docs.map(doc => doc.data())
  //     console.log(documents);
  //      do something with documents
  //     const whichbutton = req.params.whichbutton;
  //
  //   });
  const whichbutton = req.params.whichbutton;
  // finalallsessionsscreen
  res.render("allsessionsscreen", {
    "whichbutton": whichbutton,
    "scheduledsessions": scheduledsessions,
    "cancelledsessions": cancelledsessions,
    "completedsessions": completedsessions,
    "pendingsessions": pendingsessions,
    documents: [],
    "pageno": parseInt(pageno),
    imgLink: imgLink
  });
});

app.post("/reschedulesession2/:mentorId/:menteeId/:timeZoneA/:timeZoneB/:durationA/:durationB/:sessionAmount/:currency/:sessionid", async function(req, res) {
  console.log("entered");
  const sessionid = req.params.sessionid;
  status = "CANCELLED";
  const mentorurl = base_url + "session/mentor/session/" + sessionid + "/" + status;
  const menteeurl = base_url + "session/mentee/session/" + sessionid + "/" + status;
  // Remove mentee api
  // await superagent.put(menteeurl).set('Authorization', BearerToken).then(async function(response){
  // await superagent.put(mentorurl).set('Authorization', BearerToken).then(async function(response) {
  // const dataa = JSON.parse(response.text);
  // console.log(dataa);
  const mentorId = req.params.mentorId;
  const menteeId = req.params.menteeId;
  const timeZoneA = req.params.timeZoneA;
  const timeZoneB = req.params.timeZoneB;
  const timeZone = [timeZoneA, timeZoneB].join(' ');
  console.log(timeZone);
  const durationA = req.params.durationA;
  const durationB = req.params.durationB;
  const duration = [durationA, durationB].join(' ');
  console.log(duration);
  const sessionAmount = req.params.sessionAmount;
  const currency = req.params.currency;
  const s = req.body.editstartdatetime;
  console.log(s);
  console.log(typeof(s));
  var data = s.split('T')
  var date = data[0].split('-').join('-');
  var time = data[1];
  const obj = {
    "id": sessionid,
    "menteeId": menteeId,
    "mentorId": mentorId,
    "startDate": date,
    "startTime": time,
    "timeZone": timeZone,
    "duration": duration,
    "sessionAmout": sessionAmount,
    "currency": currency,
    "status": "REQUEST_PENDING"
  };
  console.log(obj);
  const url = base_url + "session/mentee/session";
  await superagent.post(url).set('Authorization', BearerToken).send(obj).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    res.redirect("/homescreen");
  }).catch((error) => {
    console.log(error);
  });
  //   res.redirect("/allsessionsscreen");
  // }).catch((error) => {
  //   console.log(error);
  // });
  // });
  // .catch((error)=>{
  //   console.log(error);
  // });

});

app.post("/reschedulesession/:mentorId/:menteeId/:timeZoneA/:timeZoneB/:durationA/:durationB/:sessionAmount/:currency/:sessionid", async function(req, res) {
  console.log("entered");
  const sessionid = req.params.sessionid;
  status = "CANCELLED";
  const mentorurl = base_url + "session/mentor/session/" + sessionid + "/" + status;
  const menteeurl = base_url + "session/mentee/session/" + sessionid + "/" + status;
  // Remove mentee api
  // await superagent.put(menteeurl).set('Authorization', BearerToken).then(async function(response){
  // await superagent.put(mentorurl).set('Authorization', BearerToken).then(async function(response) {
  // const dataa = JSON.parse(response.text);
  // console.log(dataa);
  const mentorId = req.params.mentorId;
  const menteeId = req.params.menteeId;
  const timeZoneA = req.params.timeZoneA;
  const timeZoneB = req.params.timeZoneB;
  const timeZone = [timeZoneA, timeZoneB].join(' ');
  console.log(timeZone);
  const durationA = req.params.durationA;
  const durationB = req.params.durationB;
  const duration = [durationA, durationB].join(' ');
  console.log(duration);
  const sessionAmount = req.params.sessionAmount;
  const currency = req.params.currency;
  const s = req.body.editstartdatetime;
  console.log(s);
  console.log(typeof(s));
  var data = s.split('T')
  var date = data[0].split('-').join('-');
  var time = data[1];
  const obj = {
    "id": sessionid,
    "menteeId": menteeId,
    "mentorId": mentorId,
    "startDate": date,
    "startTime": time,
    "timeZone": timeZone,
    "duration": duration,
    "sessionAmout": sessionAmount,
    "currency": currency,
    "status": "REQUEST_PENDING"
  };
  console.log(obj);
  const url = base_url + "session/mentee/session";
  await superagent.post(url).set('Authorization', BearerToken).send(obj).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    res.redirect("/allsessionsscreen");
  }).catch((error) => {
    console.log(error);
  });
  //   res.redirect("/allsessionsscreen");
  // }).catch((error) => {
  //   console.log(error);
  // });
  // });
  // .catch((error)=>{
  //   console.log(error);
  // });

});

app.get("/session/:status/:sessionid", async function(req, res) {
  const status = req.params.status;
  const sessionid = req.params.sessionid;
  // Remove mentee api -- change
  const mentorurl = base_url + "session/mentor/session/" + sessionid + "/" + status;
  const menteeurl = base_url + "session/mentee/session/" + sessionid + "/" + status;
  // await superagent.put(menteeurl).set('Authorization', BearerToken).then(async function(response) {
  await superagent.put(mentorurl).set('Authorization', BearerToken).then(async function(response) {
    const data = JSON.parse(response.text);
    // console.log(data);
    res.redirect("/allsessionsscreen");
  }).catch((error) => {
    console.log(error);
  });
  // }).catch((error) => {
  //   console.log(error);
  // });
});

//=============================================================================================================================================================================
// Call Screen
app.get("/joincall/:sessionid", async function(req, res) {
  const sessionid = req.params.sessionid;
  // const url = base_url + "common/callobject";
  const url = base_url + "joincall/" + sessionid;
  console.log(url);
  await superagent.get(url).set('Authorization', BearerToken).then((response) => {
    const data = response.body;
    console.log(data);
    const roomName = data["model"].room;
    const serverUrl = data["model"].serverUrl;
    const subject = data["model"].subject;
    res.render("callscreen", {
      roomName: roomName,
      serverUrl: serverUrl,
      subject: subject,
      sessionid: sessionid,
      imgLink: imgLink
    });
    // const callAccessToken = data["model"].accessToken;
    // const callChannelName = data["model"].channelName;
    // const callAppId = data["model"].appid;
    // console.log(callAccessToken);
    // console.log(callChannelName);
    // console.log(callAppId);
    // res.render("callscreen", {
    //   callAccessToken: callAccessToken,
    //   callChannelName: callChannelName,
    //   callAppId: callAppId
    // });
  }).catch((error) => {
    console.log(error);
  });
});

//=============================================================================================================================================================================
//Time slots screens

app.get('/timeslotscreen', async function(req, res) {

  console.log(imgLink);
  const url = base_url + "store/timeslot";
  const postData = {
    "mentorId": String(mentorid)
  };
  const AllSlots = {};
  amslots.forEach(function(item, i) {
    AllSlots[item.start] = [item.start, item.end, item.display];
  });

  var allslots = {
    "Monday": JSON.parse(JSON.stringify(AllSlots)),
    "Tuesday": JSON.parse(JSON.stringify(AllSlots)),
    "Wednesday": JSON.parse(JSON.stringify(AllSlots)),
    "Thursday": JSON.parse(JSON.stringify(AllSlots)),
    "Friday": JSON.parse(JSON.stringify(AllSlots)),
    "Saturday": JSON.parse(JSON.stringify(AllSlots)),
    "Sunday": JSON.parse(JSON.stringify(AllSlots))
  };

  await superagent.post(url).set('Authorization', BearerToken).send(postData).then((response) => {
    const dataa = JSON.parse(response.text);
    data = dataa["model"];
    var day;
    if (data) {
      data['days'].forEach(function(item, i) {
        day = item["day"];
        console.log(item["timeslots"]);
        if (item["timeslots"]) {
          item["timeslots"].forEach(function(slot, i) {
            allslots[item['day']][slot['slot']][2] = 'none';
          });
        }
      });
      res.render("LatestTimeslotScreen2", {amslots: allslots, imgLink: imgLink});
    }
  }).catch((error) => {
    console.log(error);
  });
});

app.put("/saveslot", function(req, res) {
  const data = req.body;
  console.log(data);
  console.log(typeof(data));
  const url = base_url + "management/mentor/time_slot";
  var timeslot = {
    "mentorId": mentorid,
    "days": data["slots"]
  };
  console.log(data["slots"][4].timeslots);
  console.log(timeslot);
  superagent.post(url).set('Authorization', BearerToken).send(timeslot).then((response) => {
    console.log(response.text);
    res.status(200).json({});
  }).catch((error) => {
    res.status(200).json({});
    console.log(error);
  });
  // res.status(200).json({});
});

app.get("/timeslotsscreen", async function(req, res) {

  const url = base_url + "store/timeslot";
  // const id = mentorObject["role"].id;
  const postData = {
    "mentorId": String(mentorid)
  };
  await superagent.post(url).set('Authorization', BearerToken).send(postData).then(async function(response) {
    const dataa = JSON.parse(response.text);
    data = dataa["model"];
    if (data) {
      data['days'].forEach(function(item, i) {
        const day = item["day"];
        item["timeslots"].forEach(function(slot, i) {
          allslots[day].forEach(function(allslotsslot, i) {
            if (allslotsslot['start'] == slot['slot']) {
              allslotsslot['display'] = 'none';
            }
          });
        });
      });
    }
    const url2 = base_url + "session/mentor/session/60926f8bcec85169b059491c";
    console.log(url2);
    var completedSessions = [];
    var cancelledSessions = [];
    var scheduledSessions = [];
    var pendingSessions = [];
    const allurl = url2 + "/ALL";
    console.log(allurl);
    const pagingData = {
      "pageNo": pageno,
      "pageSize": pagesize,
      "sort": sortby
    };
    await superagent.post(allurl).set('Authorization', BearerToken).send(pagingData).then((response) => {
      const dataa = JSON.parse(response.text);
      const data = dataa["model"];
      data.forEach(function(item, i) {
        if (item["status"] == 'REQUEST_PENDING') {
          pendingSessions.push(item);
        } else if (item["status"] == 'START' || item["status"] == 'SCHEDULE') {
          scheduledSessions.push(item);
        } else if (item["status"] == 'CANCEL') {
          cancelledSessions.push(item);
        } else if (item["status"] == 'COMPLETE') {
          completedSessions.push(item);
        }
      });
    }).catch((error) => {
      console.log(error);
    });

    res.render("LatestTimeslotScreen", {
      "dayselect": true,
      "timezone": timezone,
      "selectedday": selectedday,
      "selectedtimezone": selectedtimezone,
      "amslots": allslots,
      completedsessions: completedSessions,
      scheduledsessions: scheduledSessions,
      cancelledsessions: cancelledSessions,
      pendingsessions: pendingSessions,
      imgLink: imgLink
    });
  }).catch(console.log((error) => {
    console.log(error);
  }));

  // res.render("newLatestTimeslotScreen", {
  //   "dayselect": true,
  //   "timezone": timezone,
  //   "selectedday": selectedday,
  //   "selectedtimezone": selectedtimezone,
  //   "amslots": allslots[selectedday]
  // });
});

app.get("/slots/:selectedday", function(req, res) {
  selectedday = req.params.selectedday;
  // console.log(selectedday);
  // console.log(allslots[selectedday]);
  res.status(200).json({"dayselect": true, "timezone": timezone, "selectedday": selectedday, "selectedtimezone": selectedtimezone, "amslots": allslots, imgLink: imgLink});
  // res.render("newLatestTimeslotScreen", {
  //   "dayselect": true,
  //   "timezone": timezone,
  //   "selectedday": selectedday,
  //   "selectedtimezone": selectedtimezone,
  //   "amslots": allslots[selectedday]
  // });
});

app.get("/slots/:selectedday/:timezone", function(req, res) {
  selectedday = req.params.selectedday;
  selectedtimezone = req.params.timezone;
  console.log(timeslot);
  // console.log(day);
  res.render("LatestTimeslotScreen", {
    "dayselect": true,
    "timezone": timezone,
    "selectedday": selectedday,
    "selectedtimezone": selectedtimezone,
    "amslots": allslots,
    imgLink: imgLink
  });
});

app.get("/addslot/:selectedday/:slotstart/:slotend", function(req, res) {
  const slotstart = req.params.slotstart;
  const slotend = req.params.slotend;
  const slotname = slotstart + " " + slotend;
  const selectedday = req.params.selectedday;
  if (slots[selectedday].indexOf(slotname) == -1) {
    slots[selectedday].push(slotname);
    console.log(slots);
    // console.log(slots[0].slice(0,10));
    console.log(selectedday);
    allslots[selectedday].forEach(function(item) {
      // console.log(item);
      if (item["start"] == slotstart) {
        console.log(slotstart);
        item["display"] = "none";
        console.log(item);
      }
    });
    // timeslot["days"].forEach(function(item) {
    //   if (item.day == selectedday) {
    //     item.timeslots.push({"slot": slotstart, "status": "Available"});
    //   }
    // });

    // res.render("LatestTimeslotScreen", {
    //   "dayselect": true,
    //   "timezone": timezone,
    //   "selectedday": selectedday,
    //   "selectedtimezone": selectedtimezone,
    //   "amslots": allslots[selectedday]
    // });
    res.status(200).json({"dayselect": true, "timezone": timezone, "selectedday": selectedday, "selectedtimezone": selectedtimezone, "amslots": allslots, imgLink: imgLink});
    // console.log("==========================================================================");
    // console.log(allslots[selectedday]);
    // console.log("==========================================================================its ending=======================");
  } else {
    console.log(slots);
    res.status(200).json({"dayselect": true, "timezone": timezone, "selectedday": selectedday, "selectedtimezone": selectedtimezone, "amslots": allslots, imgLink: imgLink});
    // res.render("newLatestTimeslotScreen", {
    //   "dayselect": true,
    //   "timezone": timezone,
    //   "selectedday": selectedday,
    //   "selectedtimezone": selectedtimezone,
    //   "amslots": allslots[selectedday]
    // });
    // res.json({
    //   "dayselect": true,
    //   "timezone": timezone,
    //   "selectedday": selectedday,
    //   "selectedtimezone": selectedtimezone,
    //   "amslots": allslots[selectedday]
    // });
  }
});

app.get("/removeslot/:selectedday/:slotstart/:slotend", function(req, res) {
  const slotstart = req.params.slotstart;
  const slotend = req.params.slotend;
  const slotname = slotstart + " " + slotend;
  const selectedday = req.params.selectedday;
  if (slots[selectedday].indexOf(slotname) != -1) {
    for (var i = 0; i < slots[selectedday].length; i++) {
      if (slots[selectedday][i] == slotname) {
        slots[selectedday].splice(i, 1);
      }
    }
    for (var i = 0; i < timeslot["days"].length; i++) {
      if (timeslot["days"][i].day == selectedday) {
        console.log(timeslot["days"][i]["timeslots"]);
        for (var j = 0; j < timeslot["days"][i]["timeslots"].length; j++) {
          console.log(timeslot["days"][i]["timeslots"][j]);
          if (timeslot["days"][i]["timeslots"][j].slot == slotstart) {
            timeslot["days"][i]["timeslots"].splice(j, 1);
          }
        }
      }
    }
    console.log(timeslot);
    allslots[selectedday].forEach(function(item) {
      if (item["start"] == slotstart) {
        item["display"] = "inline-block";
      }
    });
    res.status(200).json({"dayselect": true, "timezone": timezone, "selectedday": selectedday, "selectedtimezone": selectedtimezone, "amslots": allslots, imgLink: imgLink});
    // res.render("newLatestTimeslotScreen", {
    //   "dayselect": true,
    //   "timezone": timezone,
    //   "selectedday": selectedday,
    //   "selectedtimezone": selectedtimezone,
    //   "amslots": allslots[selectedday]
    // });
  } else {
    console.log(slots);
    res.status(200).json({"dayselect": true, "timezone": timezone, "selectedday": selectedday, "selectedtimezone": selectedtimezone, "amslots": allslots, imgLink: imgLink});
    // res.render("newLatestTimeslotScreen", {
    //   "dayselect": true,
    //   "timezone": timezone,
    //   "selectedday": selectedday,
    //   "selectedtimezone": selectedtimezone,
    //   "amslots": allslots[selectedday]
    // });
  }
});

app.post("/saveslots", async function(req, res) {
  const url = base_url + "management/mentor/time_slot";
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  days.forEach(function(day) {
    allslots[day].forEach(function(slot) {
      if (slot['display'] == 'none') {
        timeslot['days'].forEach(function(time) {
          if (time['day'] == day) {
            time['timeslots'].push({"slot": slot['start'], "status": "Available"});
          }
        });
      }
    });
  });
  console.log(timeslot);
  superagent.post(url).set('Authorization', BearerToken).send(timeslot).then((response) => {
    console.log(response.text);
    // var data = response.text;
    // console.log(data);
    // mentorDetails = JSON.parse(data);
    // mentorid = mentorDetails["model"].id;
    res.redirect("/homescreen");

  }).catch(console.log((error) => {
    console.log(error);
  }));
});

//=============================================================================================================================================================================
//Saving upload pan pic
app.post("/upload-pan-pic", function(req, res) {
  const imgoriginal = req.body.profile_pic;
  const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };
  let upload = multer({storage: storage, fileFilter: imageFilter}).single('profile_pic');
  var img;
  var imgsrc;
  upload(req, res, async function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      console.log(req.fileValidationError);
    } else if (!req.file) {
      console.log('Please select an image to upload');
    } else if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    } else {
      console.log(req.file.path);
      img = req.file.path;
      console.log(img);
      imgpath = img;
      // Display uploaded image for user validation
      const url2 = base_url + "s3/upload/";
      console.log(url2);
      console.log(BearerToken);
      await superagent.post(url2).attach('file', img).set('Authorization', BearerToken).set('Content-Type', 'multipart/form-data').then((response) => {
        // console.log(response);
        // console.log(typeof(response));
        const data = response.body;
        // console.log(data["model"]);
        // console.log(data["model"].link);
        imgsrc = data["model"].link;
        panimgLink = imgsrc;
        const url3 = base_url + "management/mentor/" + mentorid;
        superagent.get(url3).set('Authorization', BearerToken).then((response) => {
          const data = JSON.parse(response.text);
          // console.log(data);
          if (data["model"]) {
            data["model"]["paymentProfile"].panPhotoUrl = panimgLink;
            const url5 = base_url + "management/mentor/";
            superagent.post(url5).set('Authorization', BearerToken).send(data["model"]).then((response) => {
              res.render("LatestPaymentsScreen", {imgsrc: data["model"]["paymentProfile"].panPhotoUrl,
                currency: currency,
                timezone: timezone,
                data: data["model"],
                msg: "",
                confirmaccountnumber: data["model"]["paymentProfile"].accountNumber,
                accountnumber: data["model"]["paymentProfile"].accountNumber,
                imgLink: imgLink
              });
            }).catch((error) => {
              console.log(error);
            });
          } else {
            const temp = {
              "id": "",
              "name": "",
              "phoneNumber": "",
              "pinCode": "",
              "city": "",
              "state": "",
              "country": "",
              "userName": "",
              "emailAddress": "",
              "timeZone": "",
              "photoUrl": "/logo.jpeg",
              "currentCompany": "",
              "designation": "",
              "previousCompany": "",
              "totalExperienceYears": "",
              "responsibilities": "",
              "coverLine": "",
              "callRatePerMin": "",
              "chatRatePerMin": "",
              "currency": "",
              "linkedinProfile": "",
              "paymentProfile": {
                "id": null,
                "paymentMode": "",
                "accountHolderFullName": "",
                "accountNumber": "",
                "ifscCode": "",
                "panCard": "",
                "panPhotoUrl": "/logo.jpeg"
              },
              "exprienceProfile": [],
              "educationProfile": [],
              "reviews": []
            }
            res.render("LatestPaymentsScreen", {
              imgsrc: "/logo.jpeg",
              currency: currency,
              timezone: timezone,
              data: temp,
              msg: "",
              confirmaccountnumber: "",
              accountnumber: "",
              imgLink: imgLink
            });
          }

        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
      // res.render("mentorDetails", {needupload: false});
    }

  });
});

//=============================================================================================================================================================================
//Saving upload profile pic
app.post("/upload-profile-pic", async function(req, res) {
  const imgoriginal = req.body.profile_pic;
  console.log(imgoriginal);
  const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };
  let upload = multer({storage: storage, fileFilter: imageFilter}).single('profile_pic');
  var img;
  var imgsrc;
  upload(req, res, async function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      console.log(req.fileValidationError);
    } else if (!req.file) {
      console.log('Please select an image to upload');
    } else if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    } else {
      console.log(req.file.path);
      img = req.file.path;
      console.log(img);
      imgpath = img;
      // Display uploaded image for user validation
      const url2 = base_url + "s3/upload/";
      console.log(url2);
      console.log(BearerToken);
      await superagent.post(url2).attach('file', img).set('Authorization', BearerToken).set('Content-Type', 'multipart/form-data').then((response) => {
        // console.log(response);
        // console.log(typeof(response));
        const data = response.body;
        // console.log(data["model"]);
        // console.log(data["model"].link);
        imgsrc = data["model"].link;
        imgLink = imgsrc;
        const url3 = base_url + "management/mentor/" + mentorid;
        superagent.get(url3).set('Authorization', BearerToken).then((response) => {
          const data = JSON.parse(response.text);
          // console.log(data);
          if (data["model"]) {
            data["model"].photoUrl = imgLink;
            const url5 = base_url + "management/mentor/";
            console.log("===========================================================================================================================================");
            console.log("data is:");
            console.log(data["model"]);
            console.log("===========================================================================================================================================");
            superagent.post(url5).set('Authorization', BearerToken).send(data["model"]).then((response) => {
              console.log("===========================================================================================================================================");
              console.log("response is:");
              console.log(response.text);
              console.log("===========================================================================================================================================");
              res.render("LatestMentorDetailsScreen", {
                imgsrc: data["model"].photoUrl,
                currency: currency,
                timezone: timezone,
                data: data["model"],
                imgLink: imgLink
              });
            }).catch((error) => {
              console.log(error);
            });
          } else {
            const temp = {
              "id": "",
              "name": "",
              "phoneNumber": "",
              "pinCode": "",
              "city": "",
              "state": "",
              "country": "",
              "userName": "",
              "emailAddress": "",
              "timeZone": "",
              "photoUrl": imgLink,
              "currentCompany": "",
              "designation": "",
              "previousCompany": "",
              "totalExperienceYears": "",
              "responsibilities": "",
              "coverLine": "",
              "callRatePerMin": "",
              "chatRatePerMin": "",
              "currency": "",
              "linkedinProfile": "",
              "paymentProfile": {
                "id": null,
                "paymentMode": "",
                "accountHolderFullName": "",
                "accountNumber": "",
                "ifscCode": "",
                "panCard": "",
                "panPhotoUrl": ""
              },
              "exprienceProfile": [],
              "educationProfile": [],
              "reviews": []
            }
            res.render("LatestMentorDetailsScreen", {
              imgsrc: "logo.jpeg",
              currency: currency,
              timezone: timezone,
              data: temp,
              imgLink: imgLink
            });
          }

        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
      // res.render("mentorDetails", {needupload: false});
    }

  });
});

//=============================================================================================================================================================================
//mentor details screens
app.get("/mentordetailsscreen", function(req, res) {
  const url = base_url + "management/mentor/" + mentorid;
  superagent.get(url).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]) {
      res.render("LatestMentorDetailsScreen", {
        imgsrc: data["model"].photoUrl,
        currency: currency,
        timezone: timezone,
        data: data["model"],
        imgLink: imgLink
      });
    } else {
      const temp = {
        "id": "",
        "name": "",
        "phoneNumber": "",
        "pinCode": "",
        "city": "",
        "state": "",
        "country": "",
        "userName": "",
        "emailAddress": "",
        "timeZone": "",
        "photoUrl": "/logo.jpeg",
        "currentCompany": "",
        "designation": "",
        "previousCompany": "",
        "totalExperienceYears": "",
        "responsibilities": "",
        "coverLine": "",
        "callRatePerMin": "",
        "chatRatePerMin": "",
        "currency": "",
        "linkedinProfile": "",
        "paymentProfile": {
          "id": null,
          "paymentMode": "",
          "accountHolderFullName": "",
          "accountNumber": "",
          "ifscCode": "",
          "panCard": "",
          "panPhotoUrl": ""
        },
        "exprienceProfile": [],
        "educationProfile": [],
        "reviews": []
      }
      res.render("LatestMentorDetailsScreen", {
        imgsrc: "/logo.jpeg",
        currency: currency,
        timezone: timezone,
        data: temp,
        imgLink: imgLink
      });
    }

  }).catch((error) => {
    console.log(error);
  });
  // res.render("LatestMentorDetailsScreen", {imgsrc: imgLink, currency: currency, timezone: timezone,data: {"name": "hel"}});
});

app.post("/saveMentor", async function(req, res) {
  const data = req.body;
  console.log(BearerToken);
  console.log(mentorid);
  console.log(data.name);
  console.log(data.timezone);
  const img = data.profileimg;
  const url2 = base_url + "s3/upload/";
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const dataa = JSON.parse(response.text);
    if (dataa["model"]) {
      const mentor = {
        "id": mentorid,
        "name": data.name,
        "phoneNumber": String(data.phno),
        "pinCode": String(data.pincode),
        "city": data.city,
        "state": data.state,
        "country": data.country,
        "userName": data.username,
        "emailAddress": data.email,
        "timeZone": String(data.timezones),
        "photoUrl": dataa["model"].photoUrl,
        "currentCompany": data.currentcompany,
        "designation": data.designation,
        "previousCompany": data.previouscompany,
        "totalExperienceYears": data.totalexperience,
        "responsibilities": data.responsibilities,
        "coverLine": data.coverline,
        "callRatePerMin": dataa["model"].callRatePerMin,
        "chatRatePerMin": dataa["model"].chatRatePerMin,
        "currency": dataa["model"].currency,
        "linkedinProfile": dataa["model"].linkedinProfile,
        "paymentProfile": dataa["model"].paymentProfile,
        "exprienceProfile": dataa["model"].exprienceProfile,
        "educationProfile": dataa["model"].educationProfile,
        "reviews": dataa["model"].reviews
      }
      const url = base_url + "management/mentor/";
      console.log("reached");
      console.log(BearerToken);
      // console.log(mentor);
      console.log(mentorid);
      superagent.post(url).set('Authorization', BearerToken).send(mentor).then((response) => {
        // console.log(response);
        console.log(data.timezones);
        res.redirect("/mentordetailsscreen");
      }).catch((err) => {
        console.log(err);
      });
    }
  }).catch((error) => {
    console.log(error);
  });
});

//=============================================================================================================================================================================
//Profile details Screens
app.get("/profiledetailsscreen", function(req, res) {
  const url = base_url + "management/mentor/" + mentorid;
  superagent.get(url).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]) {
      console.log(data["model"]);
      res.render("LatestProfileScreen", {
        imgsrc: data["model"].photoUrl,
        currency: currency,
        timezone: timezone,
        data: data["model"],
        imgLink: imgLink
      });
    } else {
      const temp = {
        "id": "",
        "name": "",
        "phoneNumber": "",
        "pinCode": "",
        "city": "",
        "state": "",
        "country": "",
        "userName": "",
        "emailAddress": "",
        "timeZone": "",
        "photoUrl": "/logo.jpeg",
        "currentCompany": "",
        "designation": "",
        "previousCompany": "",
        "totalExperienceYears": "",
        "responsibilities": "",
        "coverLine": "",
        "callRatePerMin": "",
        "chatRatePerMin": "",
        "currency": "",
        "linkedinProfile": "",
        "paymentProfile": {
          "id": null,
          "paymentMode": "",
          "accountHolderFullName": "",
          "accountNumber": "",
          "ifscCode": "",
          "panCard": "",
          "panPhotoUrl": ""
        },
        "exprienceProfile": [],
        "educationProfile": [],
        "reviews": []
      }
      res.render("LatestProfileScreen", {
        imgsrc: "/logo.jpeg",
        currency: currency,
        timezone: timezone,
        data: temp,
        imgLink: imgLink
      });
    }

  }).catch((error) => {
    console.log(error);
  });
  // res.render("LatestMentorDetailsScreen", {imgsrc: imgLink, currency: currency, timezone: timezone,data: {"name": "hel"}});
});

//=============================================================================================================================================================================
//Experience Details Screens
app.get("/experiencedetailsscreen", async function(req, res) {

  const url3 = base_url + "management/mentor/" + mentorid;
  await superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    // res.render("LatestMentorDetailsScreen", {
    //   whichbutton: "addedexperience",
    //   data: data["model"]["exprienceProfile"]
    // });
    res.redirect("/mentordetailsscreen");
  }).catch((error) => {
    console.log(error);
  });

});

app.get("/experience/:whichbutton", async function(req, res) {
  const whichbutton = req.params.whichbutton;
  const url3 = base_url + "management/mentor/" + mentorid;
  await superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    res.render("LatestExperienceDetailsScreen", {
      whichbutton: whichbutton,
      data: data["model"]["exprienceProfile"],
      imgLink: imgLink
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.post("/saveexperience", async function(req, res) {
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    const companyName = req.body.companyname;
    const jobTitle = req.body.jobtitle;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const currentlyWorkingHere = req.body.workmethod;
    const experience = {
      "id": "",
      "company": req.body.companyname,
      "jobTitle": req.body.jobtitle,
      "startDate": req.body.startdate,
      "endDate": req.body.enddate,
      "currentlyWorkingHere": currentlyWorkingHere[0] === 'true'
    }
    console.log(experience);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    experience["id"] = String(data["model"]["exprienceProfile"].length + 1);
    console.log(data["model"]["exprienceProfile"]);
    data["model"]["exprienceProfile"].push(experience);
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"]["exprienceProfile"],
      "educationProfile": data["model"]["educationProfile"],
      "reviews": data["model"]["reviews"]
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      console.log(responsee);
      res.redirect("/experiencedetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/editexperience/:id", function(req, res) {
  const id = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    console.log(data["model"]["exprienceProfile"]);
    for (var i = 0; i < data["model"]["exprienceProfile"].length; i++) {
      console.log("================================================================================================================================");
      console.log(id);
      if (data["model"]["exprienceProfile"][i]["id"] == id) {
        console.log(data["model"]["exprienceProfile"][i]);
        res.render("LatestExperienceDetailsScreen", {
          whichbutton: "editexperience",
          data: data["model"]["exprienceProfile"][i],
          imgLink: imgLink
        });
        break;
      }
    }
  }).catch((error) => {
    console.log(error);
  });
});

app.post("/editsaveexperience/:id", function(req, res) {
  const receivedid = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  console.log(url3);
  console.log("Lorem ipsum");
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    console.log(data["model"]["exprienceProfile"]);
    // console.log(data["model"]["exprienceProfile"][0]);
    console.log("reached");
    for (var i = 0; i < data["model"]["exprienceProfile"].length; i++) {
      console.log("================================================================================================================================");
      console.log(receivedid + "" + i);
      // const temp = JSON.parse(data["model"]["exprienceProfile"][i]);
      console.log(data["model"]["exprienceProfile"][i]);
      console.log(data["model"]["exprienceProfile"][i].id);
      console.log(typeof(data["model"]["exprienceProfile"][i]));
      if (data["model"]["exprienceProfile"][i].id == receivedid) {
        console.log(data["model"]["exprienceProfile"][i]);
        const companyName = req.body.editcompanyname;
        const jobTitle = req.body.editjobtitle;
        const startdate = req.body.editstartdate;
        const enddate = req.body.editenddate;
        const currentlyWorkingHere = req.body.editworkmethod;
        // console.log(currentlyWorkingHere);
        const experience = {
          "id": receivedid,
          "company": req.body.editcompanyname,
          "jobTitle": req.body.editjobtitle,
          "startDate": req.body.editstartdate,
          "endDate": req.body.editenddate,
          "currentlyWorkingHere": currentlyWorkingHere[0] === 'true'
        }
        console.log("here");
        data["model"]["exprienceProfile"][i] = experience;
        break;
      }
    }
    console.log("out of for loop");
    // console.log(data["model"]["exprienceProfile"]);
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"]["exprienceProfile"],
      "educationProfile": [],
      "reviews": []
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      console.log(responsee);
      res.redirect("/experiencedetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/deleteexperience/:id", function(req, res) {
  const id = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    console.log(data["model"]["exprienceProfile"]);
    for (var i = 0; i < data["model"]["exprienceProfile"].length; i++) {
      console.log("================================================================================================================================");
      console.log(id);
      if (data["model"]["exprienceProfile"][i]["id"] == id) {
        console.log(data["model"]["exprienceProfile"][i]);
        data["model"]["exprienceProfile"].splice(i, 1);
        break;
      }
    }
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"]["exprienceProfile"],
      "educationProfile": data["model"]["educationProfile"],
      "reviews": data["model"]["reviews"]
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      console.log(responsee);
      res.redirect("/experiencedetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

//=============================================================================================================================================================================
//Education Details Screens
app.get("/educationdetailsscreen", async function(req, res) {
  const url3 = base_url + "management/mentor/" + mentorid;
  await superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["exprienceProfile"] == undefined) {
      data["model"]["exprienceProfile"] = [];
    }
    // console.log(data["model"]["educationProfile"]);
    //   res.render("", {
    //     whichbutton: "addededucation",
    //     data: data["model"]["educationProfile"]
    //   });
    res.redirect("/mentordetailsscreen");
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/education/:whichbutton", async function(req, res) {
  const whichbutton = req.params.whichbutton;
  const url3 = base_url + "management/mentor/" + mentorid;
  await superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["educationProfile"] == undefined) {
      data["model"]["educationProfile"] = [];
    }
    res.render("LatestEducationDetailsScreen", {
      whichbutton: whichbutton,
      data: data["model"]["educationProfile"],
      imgLink: imgLink
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.post("/saveeducation", function(req, res) {
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    const school = req.body.schoolname;
    const degree = req.body.degree;
    const fieldOfStudy = req.body.fieldofstudy;
    const startYear = req.body.startyear;
    const endDate = req.body.endyear;
    const grade = req.body.grade;
    const description = req.body.description;
    const education = {
      "id": "",
      "school": school,
      "degree": degree,
      "fieldOfStudy": fieldOfStudy,
      "startYear": startYear,
      "endDate": endDate,
      "grade": grade,
      "description": description
    }
    console.log(education);
    if (data["model"]["educationProfile"] == undefined) {
      data["model"]["educationProfile"] = [];
    }
    education["id"] = String(data["model"]["educationProfile"].length + 1);
    console.log(data["model"]["educationProfile"]);
    data["model"]["educationProfile"].push(education);
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"].exprienceProfile,
      "educationProfile": data["model"]["educationProfile"],
      "reviews": data["model"]["reviews"]
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      console.log(responsee);
      res.redirect("/educationdetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.post("/editsaveeducation/:id", function(req, res) {
  const id = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    const school = req.body.editschoolname;
    const degree = req.body.editdegree;
    const fieldOfStudy = req.body.editfieldofstudy;
    const startYear = req.body.editstartyear;
    const endDate = req.body.editendyear;
    const grade = req.body.editgrade;
    const description = req.body.editdescription;
    const education = {
      "id": "",
      "school": school,
      "degree": degree,
      "fieldOfStudy": fieldOfStudy,
      "startYear": startYear,
      "endDate": endDate,
      "grade": grade,
      "description": description
    }
    console.log(education);
    if (data["model"]["educationProfile"] == undefined) {
      data["model"]["educationProfile"] = [];
    }
    education["id"] = String(data["model"]["educationProfile"].length + 1);
    console.log(data["model"]["educationProfile"]);
    for (var i = 0; i < data["model"]["educationProfile"].length; i++) {
      console.log("====================================================================================================================================================================");
      if (data["model"]["educationProfile"][i].id == id) {
        console.log("HERE");
        console.log("====================================================================================================================================================================");
        data["model"]["educationProfile"][i] = education;
        break;
      }
    }
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"].exprienceProfile,
      "educationProfile": data["model"]["educationProfile"],
      "reviews": data["model"]["reviews"]
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      // console.log(responsee);
      res.redirect("/educationdetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/editeducation/:id", function(req, res) {
  const id = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["educationProfile"] == undefined) {
      data["model"]["educationProfile"] = [];
    }
    console.log(data["model"]["educationProfilee"]);
    for (var i = 0; i < data["model"]["educationProfile"].length; i++) {
      console.log("================================================================================================================================");
      console.log(id);
      if (data["model"]["exprienceProfile"][i]["id"] == id) {
        console.log(data["model"]["educationProfile"][i]);
        res.render("LatestEducationDetailsScreen", {
          whichbutton: "editeducation",
          data: data["model"]["educationProfile"][i],
          imgLink: imgLink
        });
        break;
      }
    }
  }).catch((error) => {
    console.log(error);
  });
});

app.get("/deleteeducation/:id", function(req, res) {
  const id = req.params.id;
  const url3 = base_url + "management/mentor/" + mentorid;
  superagent.get(url3).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]["educationProfile"] == undefined) {
      data["model"]["educationProfile"] = [];
    }
    console.log(data["model"]["educationProfile"]);
    for (var i = 0; i < data["model"]["educationProfile"].length; i++) {
      console.log("================================================================================================================================");
      console.log(id);
      if (data["model"]["educationProfile"][i]["id"] == id) {
        console.log(data["model"]["educationProfile"][i]);
        data["model"]["educationProfile"].splice(i, 1);
        break;
      }
    }
    const temp = {
      "id": data["model"].id,
      "name": data["model"].name,
      "phoneNumber": data["model"].phoneNumber,
      "pinCode": data["model"].pinCode,
      "city": data["model"].city,
      "state": data["model"].state,
      "country": data["model"].country,
      "userName": data["model"].userName,
      "emailAddress": data["model"].emailAddress,
      "timeZone": data["model"].timeZone,
      "photoUrl": data["model"].photoUrl,
      "currentCompany": data["model"].currentCompany,
      "designation": data["model"].designation,
      "previousCompany": data["model"].previousCompany,
      "totalExperienceYears": data["model"].totalExperienceYears,
      "responsibilities": data["model"].responsibilities,
      "coverLine": data["model"].coverLine,
      "callRatePerMin": data["model"].callRatePerMin,
      "chatRatePerMin": data["model"].chatRatePerMin,
      "currency": data["model"].currency,
      "linkedinProfile": data["model"].linkedinProfile,
      "paymentProfile": {
        "id": data["model"]["paymentProfile"].id,
        "paymentMode": data["model"]["paymentProfile"].paymentMode,
        "accountHolderFullName": data["model"]["paymentProfile"].accountHolderFullName,
        "accountNumber": data["model"]["paymentProfile"].accountNumber,
        "ifscCode": data["model"]["paymentProfile"].ifscCode,
        "panCard": data["model"]["paymentProfile"].panCard,
        "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
      },
      "exprienceProfile": data["model"].exprienceProfile,
      "educationProfile": data["model"]["educationProfile"],
      "reviews": data["model"]["reviews"]
    }
    console.log(temp);
    const url = base_url + "management/mentor/";
    console.log(url);
    superagent.post(url).set('Authorization', BearerToken).send(temp).then((responsee) => {
      console.log(responsee);
      res.redirect("/educationdetailsscreen");
    }).catch((err) => {
      console.log(err);
    });
  }).catch((error) => {
    console.log(error);
  });
});

//=============================================================================================================================================================================
//Saving payment details
app.get("/accountdetailsscreen", function(req, res) {
  const url = base_url + "management/mentor/" + mentorid;
  superagent.get(url).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    if (data["model"]) {
      console.log(data["model"]["paymentProfile"].panPhotoUrl);
      console.log(data["model"]["paymentProfile"]);
      res.render("LatestPaymentsScreen", {imgsrc: data["model"]["paymentProfile"].panPhotoUrl,
        currency: currency,
        timezone: timezone,
        data: data["model"],
        msg: "",
        confirmaccountnumber: data["model"]["paymentProfile"].accountNumber,
        accountnumber: data["model"]["paymentProfile"].accountNumber,
        imgLink: imgLink
      });
    } else {
      const temp = {
        "id": "",
        "name": "",
        "phoneNumber": "",
        "pinCode": "",
        "city": "",
        "state": "",
        "country": "",
        "userName": "",
        "emailAddress": "",
        "timeZone": "",
        "photoUrl": "/logo.jpeg",
        "currentCompany": "",
        "designation": "",
        "previousCompany": "",
        "totalExperienceYears": "",
        "responsibilities": "",
        "coverLine": "",
        "callRatePerMin": "",
        "chatRatePerMin": "",
        "currency": "",
        "linkedinProfile": "",
        "paymentProfile": {
          "id": null,
          "paymentMode": "",
          "accountHolderFullName": "",
          "accountNumber": "",
          "ifscCode": "",
          "panCard": "",
          "panPhotoUrl": ""
        },
        "exprienceProfile": [],
        "educationProfile": [],
        "reviews": []
      }
      console.log("calledfromhere");
      res.render("LatestPaymentsScreen", {
        imgsrc: "/logo.jpeg",
        currency: currency,
        imgLink: imgLink,
        timezone: timezone,
        data: temp,
        msg: "",
        confirmaccountnumber: "",
        accountnumber: ""
      });
    }

  }).catch((error) => {
    console.log(error);
  });
});

app.post("/savepaymentdetails", async function(req, res) {
  const gotdata = req.body;
  const url = base_url + "management/mentor/" + mentorid;
  await superagent.get(url).set('Authorization', BearerToken).then((response) => {
    const data = JSON.parse(response.text);
    // console.log(data);
    const url2 = base_url + "management/mentor/";
    if (data["model"]) {
      if (gotdata.confirmaccountnumber != gotdata.accountnumber) {
        res.render("LatestPaymentsScreen", {imgsrc: data["model"]["paymentProfile"].panPhotoUrl,
          currency: currency,
          timezone: timezone,
          data: data["model"],
          imgLink: imgLink,
          msg: "Account numbers not matched. Please Enter again!",
          confirmaccountnumber: gotdata.confirmaccountnumber,
          accountnumber: gotdata.accountnumber
        });
      }
      const temp = {
        "id": data["model"].id,
        "name": data["model"].name,
        "phoneNumber": data["model"].phoneNumber,
        "pinCode": data["model"].pinCode,
        "city": data["model"].city,
        "state": data["model"].state,
        "country": data["model"].country,
        "userName": data["model"].userName,
        "emailAddress": data["model"].emailAddress,
        "timeZone": data["model"].timeZone,
        "photoUrl": data["model"].photoUrl,
        "currentCompany": data["model"].currentCompany,
        "designation": data["model"].designation,
        "previousCompany": data["model"].previousCompany,
        "totalExperienceYears": data["model"].totalExperienceYears,
        "responsibilities": data["model"].responsibilities,
        "coverLine": data["model"].coverLine,
        "callRatePerMin": data["model"].callRatePerMin,
        "chatRatePerMin": data["model"].chatRatePerMin,
        "currency": data["model"].currency,
        "linkedinProfile": data["model"].linkedinProfile,
        "paymentProfile": {
          "id": null,
          "paymentMode": gotdata.paymentmode,
          "accountHolderFullName": gotdata.accountholderfullname,
          "accountNumber": gotdata.accountnumber,
          "ifscCode": gotdata.ifsccode,
          "panCard": gotdata.pancard,
          "panPhotoUrl": data["model"]["paymentProfile"].panPhotoUrl
        },
        "exprienceProfile": data["model"].exprienceProfile,
        "educationProfile": data["model"].educationProfile,
        "reviews": data["model"].reviews
      }
      // data["model"]["paymentProfile"]["paymentMode"] = gotdata.paymentmode;
      // data["model"]["paymentProfile"]["accountHolderFullName"] = gotdata.accountholderfullname;
      // data["model"]["paymentProfile"]["accountNumber"] = gotdata.accountnumber;
      // data["model"]["paymentProfile"]["ifscCode"] = gotdata.ifsccode;
      // data["model"]["paymentProfile"]["panCard"] = gotdata.pancard;
      // data["model"]["paymentProfile"]["panPhotoUrl"] = panimgLink;
      // console.log(data);
      superagent.post(url2).set('Authorization', BearerToken).send(temp).then((response) => {
        console.log(response.text);
        res.redirect("/mentordetailsscreen");
      }).catch((err) => {
        console.log(err);
      });
    } else {
      const temp = {
        "id": "",
        "name": "",
        "phoneNumber": "",
        "pinCode": "",
        "city": "",
        "state": "",
        "country": "",
        "userName": "",
        "emailAddress": "",
        "timeZone": "",
        "photoUrl": "/logo.jpeg",
        "currentCompany": "",
        "designation": "",
        "previousCompany": "",
        "totalExperienceYears": "",
        "responsibilities": "",
        "coverLine": "",
        "callRatePerMin": "",
        "chatRatePerMin": "",
        "currency": "",
        "linkedinProfile": "",
        "paymentProfile": {
          "id": null,
          "paymentMode": gotdata.paymentmode,
          "accountHolderFullName": gotdata.accountholderfullname,
          "accountNumber": gotdata.accountnumber,
          "ifscCode": gotdata.ifsccode,
          "panCard": gotdata.pancard,
          "panPhotoUrl": panimgLink
        },
        "exprienceProfile": [],
        "educationProfile": [],
        "reviews": []
      }
      superagent.post(url2).set('Authorization', BearerToken).send(temp).then((response) => {
        console.log(response.text);
        res.redirect("/homescreen");
      }).catch((err) => {
        console.log(err);
      });

    }

  }).catch((error) => {
    console.log(error);
  });
});

//=============================================================================================================================================================================
//Chat Screens
app.get("/chatscreen/:mentorId/:menteeId", function(req, res) {
  const mentorId = req.params.mentorId;
  const menteeId = req.params.menteeId;
  console.log("=======================================");
  console.log("mentor: " + mentorId);
  console.log("mentee: " + menteeId);
  console.log("=======================================");
  db.collection('messages').doc(mentorId).collection(menteeId).orderBy("timestamp").get().then(querySnapshot => {
    // console.log(querySnapshot.docs);
    const documents = querySnapshot.docs.map(doc => doc.data())
    // console.log(documents);
    // res.status(200).json({
    //   completedsessions: completedsessions,
    //   scheduledsessions: scheduledsessions,
    //   cancelledsessions: cancelledsessions,
    //   documents: documents.reverse()
    // });
    res.render("chatscreen", {
      mentorId: mentorId,
      menteeId: menteeId,
      imgLink: imgLink,
      documents: documents.reverse()
    });
  });
});

app.get("/storemessage/:mentorId/:menteeId/:newmessage", function(req, res) {
  const mentorId = req.params.mentorId;
  const menteeId = req.params.menteeId;
  const message = req.params.newmessage;
  db.collection('messages').doc(mentorId).collection(menteeId).add({
    name: "null",
    photo: "",
    receiver: menteeId,
    sender: mentorId,
    text: message,
    "timestamp": firebase.firestore.FieldValue.serverTimestamp()
  });
  db.collection('messages').doc(menteeId).collection(mentorId).add({
    name: "null",
    photo: "",
    receiver: menteeId,
    sender: mentorId,
    text: message,
    "timestamp": firebase.firestore.FieldValue.serverTimestamp()
  });
  db.collection('messages').doc(mentorId).collection(menteeId).orderBy("timestamp").get().then(querySnapshot => {
    // console.log(querySnapshot.docs);
    const documents = querySnapshot.docs.map(doc => doc.data())
    // console.log(documents);
    // do something with documents
    res.status(200).json({mentorId: mentorId, menteeId: menteeId, imgLink: imgLink, documents: documents.reverse(),});
  });
});

app.get("/loadmessages/:mentorId/:menteeId", function(req, res) {
  const mentorId = req.params.mentorId;
  const menteeId = req.params.menteeId;
  db.collection('messages').doc(mentorId).collection(menteeId).orderBy("timestamp").get().then(querySnapshot => {
    // console.log(querySnapshot.docs);
    const documents = querySnapshot.docs.map(doc => doc.data())
    // console.log(documents);
    // do something with documents
    res.status(200).json({mentorId: mentorId, menteeId: menteeId, imgLink: imgLink, documents: documents.reverse(),});
  });
});

//=============================================================================================================================================================================
//Logout
app.get("/logout", function(req, res) {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logged out");
    res.redirect("/");
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });

});

//=============================================================================================================================================================================
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function() {
  console.log("Server started on port 5000");
});
