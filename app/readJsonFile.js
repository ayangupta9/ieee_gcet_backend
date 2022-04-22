const fs = require('fs')

function saveJsonContent (value) {
  const jsonValue = {
    visit_count: value
  }

  fs.writeFileSync('./website_visit_count.json', JSON.stringify(jsonValue))
  console.log('saved website count')
}

function readJsonFileValue () {
  const val = fs.readFileSync('./website_visit_count.json', {
    encoding: 'utf-8'
  })
  console.log(JSON.parse(val))

  return JSON.parse(val)
}

module.exports = { saveJsonContent, readJsonFileValue }
