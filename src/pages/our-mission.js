import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TertiaryNav from "../components/TertiaryNav.jsx"
import { graphql, Link } from 'gatsby'

const ourMissionPage = ({data}) => {
  const pageContext = data.allOurMissionJson.nodes;
  return (
    <Layout>
      <SEO title="Our Mission" />
        <div className="side-wrapper">
          <div className="container-wide main">
            <div className="content">
              <h1>Our Mission</h1>
              <p>Get Involved with OpenLawNZ</p>
              {
                pageContext.map(({title, description, fields}, idx) => {
                  return (
                    <div className="module-block" key={idx}>
                      <h2>{title}</h2>
                      <p>{description} 
                        <br/>
                        <Link to={`/our-mission${fields.slug}`}>View Page</Link>
                      </p>
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>
      <TertiaryNav 
      base="/our-mission" 
      data={
        pageContext.map(({title}) =>  {
          return {title: title}
      })  
      }/>
    </Layout>
  )
}



export const aboutQuery = graphql`
query ourMissionQuery {
  allOurMissionJson {
    nodes {
      description
      title
      fields {
        slug
      }
    }
  }
}

`
export default ourMissionPage
