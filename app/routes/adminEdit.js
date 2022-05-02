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

const { getResearchPaperByQuery } = require('../db/admin/papergetters')
const ResearchPaper = require('../models/ResearchPaper')
const { updatePaperStatus } = require('../db/admin/papersetters')

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

// ADMIN EDIT FIELDS GET
adminEditRouter.get('/dates', async (req, res) => {
  try {
    let newdates = await getEventImportantDates()
    res.json({
      status: 200,
      dates: newdates
    })
  } catch (returned_val) {
    res.json({
      status: returned_val,
      errorMessage: returned_val.errorMessage
    })
  }
})
adminEditRouter.get('/contacts', async (req, res) => {
  try {
    let newcontacts = await getEventContacts()
    res.json({
      status: 200,
      contacts: newcontacts
    })
  } catch (returned_val) {
    res.json({
      status: returned_val,
      errorMessage: returned_val.errorMessage
    })
  }
})
adminEditRouter.get('/paperdetails', async (req, res) => {
  try {
    let newpaperdetails = await getEventPaperDetails()
    res.json({
      status: 200,
      paperdetails: newpaperdetails
    })
  } catch (returned_val) {
    res.json({
      status: returned_val,
      errorMessage: returned_val.errorMessage
    })
  }
})
adminEditRouter.get('/accdetails', async (req, res) => {
  try {
    let newaccdetails = await getEventAccountDetails()
    res.json({
      status: 200,
      accdetails: newaccdetails
    })
  } catch (returned_val) {
    res.json({
      status: returned_val,
      errorMessage: returned_val.errorMessage
    })
  }
})

// ADMIN PAPER (UPDATION AND RETRIEVAL) GET
adminEditRouter.get('/search/:searchquery', async (req, res) => {
  try {
    const response = await getResearchPaperByQuery(req?.params?.searchquery)
    let result = []
    response.forEach(row => {
      const researchPaper = new ResearchPaper(row)
      result.push(researchPaper)
    })
    res.json({
      status: 200,
      result: result
    })
  } catch (returned_val) {
    res.json({
      status: returned_val,
      errorMessage: returned_val.errorMessage
    })
  }
})

// POSTERS
adminEditRouter.post('/datesupdate', async (req, res) => {
  let newdates = { ...req.body.olddata, ...req.body.newdata }

  try {
    const updateddates = await setEventImportantDates(newdates)
    res.json({
      status: 200,
      dates: updateddates
    })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
})

adminEditRouter.post('/contactsupdate', async (req, res) => {
  let newcontacts = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newcontacts)

  try {
    const updatedcontacts = await setEventContacts(newcontacts)
    res.json({
      status: 200,
      contacts: updatedcontacts
    })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
})

adminEditRouter.post('/paperdetailsupdate', async (req, res) => {
  let newpaperdetails = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newpaperdetails)

  try {
    const updatedpaperdetails = await setEventPaperDetails(newpaperdetails)
    res.json({
      status: 200,
      paperdetails: updatedpaperdetails
    })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
})

adminEditRouter.post('/accdetailsupdate', async (req, res) => {
  let newaccdetails = { ...req.body.olddata, ...req.body.newdata }
  //   console.log(newaccdetails)

  try {
    const updatedaccdetails = await setEventAccountDetails(newaccdetails)
    res.json({
      status: 200,
      accdetails: updatedaccdetails
    })
  } catch (returned_val) {
    res.json({
      status: returned_val.status,
      errorMessage: returned_val.errorMessage
    })
  }
})

adminEditRouter.post('/update-status', async (req, res) => {
  console.log(req.body.password, req.body.newStatus, req.body.paper_email_id)

  try {
    const result = await updatePaperStatus(
      req.body.paper_email_id,
      req.body.password,
      req.body.newStatus
    )

    res.send({
      status: 200,
      updated: result
    })
  } catch (returned_val) {
    res.send({
      status: returned_val.status,
      errorMessage: 'Some error occured. Try updating later'
    })
  }
})

module.exports = { dates, contacts, paperdetails, accdetails, adminEditRouter }
