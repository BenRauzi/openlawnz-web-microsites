import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import TertiaryNav from "../components/TertiaryNav.jsx"
import { toSlug } from "../js/ToSlug"

import ModuleSelector from "../components/ModuleSelector"
export const MicrositeContent = ({ pageContext }) => ( 
  <div>
    <div className="side-wrapper">
      <div className="container-wide main">
        <div className="content">
          <h1>{pageContext.title} - {pageContext.section.title}</h1>
          <div className="microsite-section" name={pageContext.section.title}>
            {
              pageContext.section.modules.map((module, idx) => (
                <div key={idx}>
                  <ModuleSelector module={module} wizardModuleData={pageContext.wizardData} idx={idx}/>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
    <TertiaryNav 
      base={"/get-empowered/" + toSlug(pageContext.title)} 
      data={pageContext.section_headings.map((title) =>  {
          return {title: title}
      })}
      secondary_data={pageContext.section.modules.map(x => x.title)}
      page={pageContext.section.title}
      />
  </div>
)


const Microsite = ({ pageContext }) => (
  <Layout>
    <SEO title={`${pageContext.title} - ${pageContext.section.title}`} description={pageContext.description} />
    <MicrositeContent pageContext={pageContext} />
  </Layout>
)


export default Microsite