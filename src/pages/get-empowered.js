import React from "react"
import SEO from "../components/seo"
import Layout from "../components/layout"
import {Link, graphql} from "gatsby"
import TertiaryNav from "../components/TertiaryNav.jsx"
import { toSlug } from "../js/ToSlug"

const EmpowerPage = ({ data }) => {
  const micrositeData = data.allMicrositesJson.edges.map(n => n.node)

  return (
    <Layout>
      <SEO title="Get Empowered" />  
      <div className="tertiary-background">
        <div className="side-wrapper">
          <div className="container main">
            <div className="content">
            <h1>Get Empowered</h1>
              {
                micrositeData.map(({title, description, fields, content}, idx) => {
                    return (
                      <div className="microsite-paragraph" key={idx}>
                          <h3 name={fields.slug.slice(1)}>{title}</h3>
                          <p>{description}</p>
                          <Link to={`/get-empowered/${fields.slug}/${toSlug(content[0].title)}`}>View Site</Link>
                      </div>
                    )
                }) 
              }
            </div>
          </div>
        </div>
        <TertiaryNav 
        base= "/get-empowered/"
        data={micrositeData.map(({title, content}) =>  {
            return [title,`${toSlug(title)}/${toSlug(content[0].title)}`]
        })}
        />
      </div>
    </Layout>
  )
}

export const empowerQuery = graphql`
  query empowerQuery {
    allMicrositesJson {
      edges {
        node {
            fields {
                slug
            }
            title
            content {
              title
            }
            description
        }
      }
    }
  }
`
export default EmpowerPage