const express = require('express')
let adminEditRouter = express.Router()
const {
  getEventImportantDates,
  getEventContacts,
  getEventPaperDetails,
  getEventAccountDetails,
  getSearchedPaper
} = require('../db/admin/getters')

const {
  setEventImportantDates,
  setEventContacts,
  setEventPaperDetails,
  setEventAccountDetails
} = require('../db/admin/setters')

let dates = {
  date1: '28/03/2022',
  date2: '15/05/2022',
  date3: '15/06/2022',
  date4: '30/06/2022',
  date5: '30/06/2022',
  date6: '16th - 17th December 2022'
}

let contacts = {
  address:
    'Galgotias College of Engineering and Technology,1, Knowledge Park-II,Greater Noida, (U.P.), India – 201306.',
  supportemail1: 'support@icac3n.in',
  supportemail2: 'icac3n22@gmail.com',
  contactno: '7835878146',
  email1: 'hodcs@galgotiacollege.edu',
  email2: 'vishnu.sharma@galgotiacollege.edu',
  email3: 'vishnusharma97@gmail.com'
}

let paperdetails = {
  submitPaperLink: 'https://cmt3.research.microsoft.com/ICAC3N2022',
  paperTemplateLink: 'https://cmt3.research.microsoft.com/ICAC3N2022'
}

let accdetails = {
  accountNumber: '6420000100006852',
  accountName: 'GALGOTIAS COLLEGE OF ENGINEERING AND TECHNOLOGY',
  ifscCode: 'PUNB0671700',
  swiftCode: 'PUNBINBBMSN',
  accountType: 'Saving',
  bankName: 'PUNJAB NATIONAL BANK',
  bankAddress:
    'Punjab National Bank, Sector-63 Gautam Buddha Nagar-201301, U.P.'
}

// GETTERS
adminEditRouter.get('/dates', async (req, res) => {
  let newdates = await getEventImportantDates()
  res.status(200).json({
    dates: newdates
  })
})
adminEditRouter.get('/contacts', async (req, res) => {
  let newcontacts = await getEventContacts()
  res.status(200).json({
    contacts: newcontacts
  })
})
adminEditRouter.get('/paperdetails', async (req, res) => {
  let newpaperdetails = await getEventPaperDetails()
  res.status(200).json({
    paperdetails: newpaperdetails
  })
})
adminEditRouter.get('/accdetails', async (req, res) => {
  let newaccdetails = await getEventAccountDetails()
  res.status(200).json({
    accdetails: newaccdetails
  })
})

// POSTERS
adminEditRouter.post('/datesupdate', async (req, res) => {
  let newdates = { ...req.body.olddata, ...req.body.newdata }
  const updateddates = await setEventImportantDates(newdates)
  res.json({
    message: 'received',
    dates: updateddates
  })
})

adminEditRouter.post('/contactsupdate', async (req, res) => {
  let newcontacts = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newcontacts)
  const updatedcontacts = await setEventContacts(newcontacts)
  res.json({
    message: 'received',
    contacts: updatedcontacts
  })
})

adminEditRouter.post('/paperdetailsupdate', async (req, res) => {
  let newpaperdetails = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newpaperdetails)
  const updatedpaperdetails = await setEventPaperDetails(newpaperdetails)
  res.json({
    message: 'received',
    paperdetails: updatedpaperdetails
  })
})

adminEditRouter.post('/accdetailsupdate', async (req, res) => {
  let newaccdetails = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newaccdetails)
  const updatedaccdetails = await setEventAccountDetails(newaccdetails)
  res.json({
    message: 'received',
    accdetails: updatedaccdetails
  })
})

adminEditRouter.post('/search', async (req, res) => {
  console.log(req.body.searchedValue)
  res.json({
    searchedPapers: getSearchedPaper(req.body.searchedValue)
  })
})

module.exports = { dates, contacts, paperdetails, accdetails, adminEditRouter }
