const express = require('express')
let usersRouter = express.Router()

// * METHODS TO FETCH IMPORTANT DETAILS FROM SQL DATABASE RELATED TO THE CONFERENCE
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

usersRouter.get('/important-dates', async (req, res) => {
  try {
    const response = await getEventImportantDates()
    res.json(response)
  } catch (err) {
    console.error('imp dates', err)
    res.json(err)
  }
})

usersRouter.get('/contacts', async (req, res) => {
  try {
    const response = await getEventContacts()
    res.json(response)
  } catch (err) {
    console.error('contacts', err)
    res.json(err)
  }
})

usersRouter.get('/paper-details', async (req, res) => {
  try {
    const response = await getEventPaperDetails()
    res.json(response)
  } catch (err) {
    console.error('paper details', err)
    res.json(err)
  }
})

usersRouter.get('/account-details', async (req, res) => {
  try {
    const response = await getEventAccountDetails()
    res.json(response)
  } catch (err) {
    console.error('account', err)
    res.json(err)
  }
})

usersRouter.get('/event-speakers', async (req, res) => {
  try {
    const response = await getEventSpeakersDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})

usersRouter.get('/org-committee', async (req, res) => {
  try {
    const response = await getEventOrgCommitteeDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})

usersRouter.get('/tech-prg-committee', async (req, res) => {
  try {
    const response = await getEventTechPrgCommitteeDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})

usersRouter.get('/adv-board', async (req, res) => {
  try {
    const response = await getEventAdvisoryBoardDetails()
    res.json(response)
  } catch (err) {
    console.error('speakers', err)
    res.json(err)
  }
})


module.exports = {
  usersRouter
}
