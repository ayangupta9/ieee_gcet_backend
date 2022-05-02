class ResearchPaper {
  // constructor (
  //   // user_id,
  //   email_id,
  //   paper_id,
  //   title,
  //   authors,
  //   status,
  //   year_of_conf,
  //   link,
  // ) {
  //   // this.user_id = user_id
  //   this.email_id = email_id
  //   this.paper_id = paper_id
  //   this.title = title
  //   this.authors = JSON.parse(authors).authors
  //   this.status = status
  //   this.year_of_conf = year_of_conf
  //   this.link = link
  // }

  constructor (row) {
    // this.user_id = row?.user_id
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
