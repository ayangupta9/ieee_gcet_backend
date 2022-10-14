const express = require('express')
let adminEditRouter = express.Router()
const {
  getEventImportantDates,
  getEventContacts,
  getEventPaperDetails,
  getEventAccountDetails,
  getEventSpeakersDetails,
  getEventOrgCommitteeDetails,
  getEventTechPrgCommitteeDetails,
  getEventAdvisoryBoardDetails
} = require('../db/admin/getters')

const {
  setEventImportantDates,
  setEventContacts,
  setEventPaperDetails,
  setEventAccountDetails,
  setSpeakersDetails,
  setOrgCommitteeDetails,
  setTechPrgCommitteeDetails,
  setAdvisoryBoardDetails
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

// res.json({
//   status: returned_val,
//   errorMessage: returned_val.errorMessage
// })
// res.json({
//   status: newdates.status,
//   dates: newdates.data
// })

// ADMIN EDIT FIELDS GET
adminEditRouter.get('/dates', async (req, res) => {
  try {
    let response = await getEventImportantDates()
    res.json(response)
  } catch (returned_val) {
    res.json(returned_val)
  }
})
adminEditRouter.get('/contacts', async (req, res) => {
  try {
    let response = await getEventContacts()
    res.json(response)
  } catch (returned_val) {
    res.json(returned_val)
  }
})
adminEditRouter.get('/paperdetails', async (req, res) => {
  try {
    let response = await getEventPaperDetails()
    res.json(response)
  } catch (returned_val) {
    res.json(returned_val)
  }
})
adminEditRouter.get('/accdetails', async (req, res) => {
  try {
    let newaccdetails = await getEventAccountDetails()
    console.log(newaccdetails)
    res.json(newaccdetails)
  } catch (returned_val) {
    res.json(returned_val)
  }
})
adminEditRouter.get('/event-speakers', async (req, res) => {
  try {
    const response = await getEventSpeakersDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})
adminEditRouter.get('/org-committee', async (req, res) => {
  try {
    const response = await getEventOrgCommitteeDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})
adminEditRouter.get('/tech-prg-committee', async (req, res) => {
  try {
    const response = await getEventTechPrgCommitteeDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})
adminEditRouter.get('/adv-board', async (req, res) => {
  try {
    const response = await getEventAdvisoryBoardDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})

// * ADMIN PAPER (UPDATION AND RETRIEVAL) GET
adminEditRouter.get('/search/:searchquery', async (req, res) => {
  try {
    const response = await getResearchPaperByQuery(req?.params?.searchquery)
    let result = []
    response.forEach(row => {
      const researchPaper = new ResearchPaper(row)
      result.push(researchPaper)
    })

    console.log(result)

    res.json({status: 200,result: result})
  } catch (returned_val) {
    res.json({status: returned_val,errorMessage: returned_val.errorMessage})
  }
})

// * POST ENDPOINTS

// * UPDATE IMPORTANT DATES
adminEditRouter.post('/datesupdate', async (req, res) => {
  let newdates = { ...req.body.olddata, ...req.body.newdata }

  try {
    const updateddates = await setEventImportantDates(newdates)
    res.json({status: updateddates.status,dates: updateddates.data})
  } catch (returned_val) {
    res.json({status: returned_val.status,errorMessage: returned_val.errorMessage})
  }
})

// * UPDATE CONTACTS
adminEditRouter.post('/contactsupdate', async (req, res) => {
  let newcontacts = { ...req.body.olddata, ...req.body.newdata }

  try {
    const updatedcontacts = await setEventContacts(newcontacts)
    res.json({status: updatedcontacts.status,contacts: updatedcontacts.data})
  } catch (returned_val) {
    res.json({status: returned_val.status,errorMessage: returned_val.errorMessage})
  }
})

// * UPDATE PAPER DETAILS
adminEditRouter.post('/paperdetailsupdate', async (req, res) => {
  let newpaperdetails = { ...req.body.olddata, ...req.body.newdata }

  try {
    const updatedpaperdetails = await setEventPaperDetails(newpaperdetails)
    res.json({status: updatedpaperdetails.status,paperdetails: updatedpaperdetails.data})
  } catch (returned_val) {
    res.json({status: returned_val.status,errorMessage: returned_val.errorMessage})
  }
})

// * UPDATE ACCOUNT DETAILS
adminEditRouter.post('/accdetailsupdate', async (req, res) => {
  let newaccdetails = { ...req.body.olddata, ...req.body.newdata }

  try {
    const updatedaccdetails = await setEventAccountDetails(newaccdetails)
    res.json({status: updatedaccdetails.status,accdetails: updatedaccdetails.data})
  } catch (returned_val) {
    res.json({status: returned_val.status,errorMessage: returned_val.errorMessage})
  }
})

// * UPDATE SPEAKERS DETAILS
adminEditRouter.post('/speakers-update', async (req, res) => {
  let new_speaker_details = { ...req.body.olddata, ...req.body.newdata }
  try {
    const updated_speaker_details = await setSpeakersDetails(
      new_speaker_details
    )

    res.json(updated_speaker_details)
    // res.json({
    //   status: updatedaccdetails.status,
    //   accdetails: updatedaccdetails.data
    // })
  } catch (returned_val) {
    res.json(returned_val)
    // res.json({
    //   status: returned_val.status,
    //   errorMessage: returned_val.errorMessage
    // })
  }
})

// * UPDATE ORGANIZING COMMITTEE DETAILS
adminEditRouter.post('/org-committee-update', async (req, res) => {
  let new_org_committee_details = { ...req.body.olddata, ...req.body.newdata }
  try {
    const updated_org_committee_details = await setOrgCommitteeDetails(
      new_org_committee_details
    )

    res.json(updated_org_committee_details)
  } catch (returned_val) {
    res.json(returned_val)
  }
})

// * UPDATE TECHNICAL COMMITTEE DETAILS
adminEditRouter.post('/tech-prg-committee-update', async (req, res) => {
  let new_tech_prg_committee_details = {
    ...req.body.olddata,
    ...req.body.newdata
  }
  try {
    const updated_tech_prg_committee_details = await setTechPrgCommitteeDetails(
      new_tech_prg_committee_details
    )

    res.json(updated_tech_prg_committee_details)
  } catch (returned_val) {
    res.json(returned_val)
  }
})

// * UPDATE ADVISORY BOARD DETAILS
adminEditRouter.post('/adv-board-update', async (req, res) => {
  let new_adv_board_details = { ...req.body.olddata, ...req.body.newdata }
  try {
    const updated_adv_board_details = await setAdvisoryBoardDetails(
      new_adv_board_details
    )

    res.json(updated_adv_board_details)
  } catch (returned_val) {
    res.json(returned_val)
  }
})

// * UPDATE PAPER DETAILS 
// * REQUIRES ADMIN PASSWORD TO BE VERIFIED BEFORE MAKING THE CHANGES
adminEditRouter.post('/update-status', async (req, res) => {
  console.log(req.body.password, req.body.newStatus, req.body.paper_email_id)

  try {
    const result = await updatePaperStatus(req.body.paper_email_id,req.body.password,req.body.newStatus)
    console.log(result)

    res.send({status: 200,updated: result})
  } catch (returned_val) {
    res.send({status: returned_val.status,errorMessage: 'Some error occured. Try updating later'})
  }
})

module.exports = { dates, contacts, paperdetails, accdetails, adminEditRouter }
