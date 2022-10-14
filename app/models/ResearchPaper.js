class ResearchPaper {

  constructor (row) {
    this.email_id = row?.email
    this.paper_id = row?.paper_id
    this.title = row?.paper_title
    this.authors = JSON.parse(row?.paper_authors).authors
    this.status = row?.paper_status
    this.year_of_conf = row?.year_of_conf
    this.link = row?.link
  }

  static toString () {
    return this.toString()
  }

  set paperStatus (status) {
    if (status !== 0 || status !== 1) {
      this.status = 0
    } else {
      this.status = status
    }
  }
}

module.exports = ResearchPaper
