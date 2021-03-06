import React, { Component } from "react"
import Layout from "../components/layout"
import memoize from "fast-memoize"
import { Link, navigate } from "gatsby"
import SEO from "../components/seo"

import dateFormat from "date-fns/format"
import parseISO from "date-fns/parseISO"
// import SearchContainer from "../components/SearchContainer.jsx"
import ReactPaginate from "react-paginate"
import InfoCard from "../components/InfoCard.jsx"

import Next from "../images/svgs/next-page.svg"
import Previous from "../images/svgs/previous-page.svg"

const queryString = require("query-string")
const memoizedFetch = memoize((query, offset, end) =>
  fetch(
    `${process.env.GATSBY_SEARCH_API_URL}/cases?${query}&start=${offset}&end=${end}`
  )
)

const Results = ({ data = [] }) =>
  data.map((result, index) => (
    <tr key={index}>
      <td className="caseName">
        <Link to={`/case/${result.caseId}`}>{result.caseName}</Link>
      </td>
      <td>{result.citation === null ? "N / A" : result.citation}</td>
      {result.date && (
        <td className="caseDate">
          {dateFormat(parseISO(result.date), "dd/MM/yyyy")}
        </td>
      )}
    </tr>
  ))

const NoResults = () => (
  <tr>
    <td className="caseName">-------</td>
    <td>-------</td>
    <td className="caseDate">-------</td>
  </tr>
)

const Pagination = ({ onPageChange, pageCount, currentPage }) => (
  <div className="page-number">
    <ReactPaginate
      previousLabel={<Previous />}
      nextLabel={<Next />}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      forcePage={currentPage}
      marginPagesDisplayed={1}
      pageRangeDisplayed={window && window.innerWidth < 450 ? 2 : 4} // Fewer items provide better view on mobile
      onPageChange={onPageChange}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}
    />
  </div>
)

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      queryValue: "",
      advancedQuery: "",
      results: [],
      perPage: 10,
      offset: 0,
      currentPage: 0,
      length: 0,
      pageCount: 0,
      searchInProgress: true,
      paginationInProgress: false,
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  doSearch(query, offset) {
    const { perPage } = this.state
    return memoizedFetch(query, offset, offset + perPage).then(results => {
      results
        .clone() // Necessary because of memoization of fetch
        .json()
        .then(data => {
          // Check if is mounted to avoid performance issues with unmounted setState
          if (this._isMounted) {
            this.setState({
              results: data.results,
              length: parseInt(data.total),
              pageCount: parseInt(data.total) / perPage,
              paginationInProgress: false,
              searchInProgress: false,
            })
          }
        })
    })
  }

  handlePageClick(data) {
    const selected = data.selected
    const offset = selected * this.state.perPage
    const query = this.state.advancedQuery || this.state.query

    this.setState(
      { offset: offset, currentPage: selected, paginationInProgress: true },
      () => {
        this.doSearch(query, this.state.offset)
      }
    )
  }

  handleSubmit(searchString, query, type, queryValue) {
    navigate(`/search?${searchString}`);
    this.setState(prevState => {
      const newState = {
        ...prevState,
        currentPage: 0,
        queryValue,
        query: "",
        advancedQuery: "",
      }
      newState[type] = query
      return newState
    })
    this.doSearch(query, 0)
  }

  componentDidMount() {
    this._isMounted = true
    const { offset } = this.state
    const searchQuery = queryString.parse(window.location.search)
    const query = searchQuery.q
      ? `search=${searchQuery.q}`
      : window.location.search.replace("?", "")

    this.doSearch(query, offset)

    if (searchQuery.q) {
      this.setState({ query, queryValue: searchQuery.q })
    } else {
      this.setState({ advancedQuery: query })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const {
      query,
      queryValue,
      advancedQuery,
      results,
      length,
      perPage,
      currentPage,
      pageCount,
      paginationInProgress,
      searchInProgress,
    } = this.state
    if (!query && !advancedQuery) {
      return <p className="loading-text">Loading</p>
    }
    return (
      <Layout>
        <SEO title="Search results" />
        <div className="highlighted-content">
          <InfoCard classModifier="info-card--large info-card--title info-card--column">
            {searchInProgress ? (
              <span>
                SEARCHING RESULTS FOR{" "}
                {advancedQuery ? (
                  "ADVANCED SEARCH"
                ) : (
                  <b>{`"${queryValue.toUpperCase()}"`}</b>
                )}
              </span>
            ) : (
              <React.Fragment>
                <h1>{length}</h1>
                <span>
                  SEARCH RESULTS FOR{" "}
                  {advancedQuery ? (
                    "ADVANCED SEARCH"
                  ) : (
                    <b>{`"${queryValue.toUpperCase()}"`}</b>
                  )}
                </span>
              </React.Fragment>
            )}
          </InfoCard>
        </div>
        <div className="home-wrapper">
          <div className="container centre">
            {length >= perPage && (
              <Pagination
                onPageChange={this.handlePageClick}
                currentPage={currentPage}
                pageCount={pageCount}
              />
            )}
            <table className="table case-table">
              <thead>
                <tr>
                  <th>Case Name</th>
                  <th>Citation</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody
                className={
                  paginationInProgress || searchInProgress
                    ? "loading"
                    : undefined
                }
              >
                {length === 0 ? <NoResults /> : <Results data={results} />}
              </tbody>
            </table>
            {length >= perPage && (
              <Pagination
                onPageChange={this.handlePageClick}
                currentPage={currentPage}
                pageCount={pageCount}
              />
            )}
          </div>
        </div>
      </Layout>
    )
  }
}

export default SearchPage
