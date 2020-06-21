import React from "react"
import Accordion from "../components/Accordion"
import Wizard from "../components/Wizard/Wizard"

const ModuleSelector = (props) => {
    
    module = props.module

    let title = module.title.replace(/\s/g, '-').toLowerCase()
    
    const errorModule = (message) => {
      return <div className="microsite-paragraph" name={title}>
        <h4>{module.title}</h4>
        Error: {message}
      </div>
    }
    
    switch(module.type) { 
      case "text": // Single heading, multiple paragraphs.
        return (
          <div name={title} className="module-block">
            <h3>{module.title}</h3>
            {
              module.content.map(({content_html}, idx) => {
                return (
                  <div key={idx}
                    className="microsite-paragraph"
                    dangerouslySetInnerHTML={{ __html: content_html }}
                  />
                ) 
              })
            }
          </div>
        )
        case "faqs":
            return (
            <div name={title}  className="module-block">
                <h4>{module.title}</h4>
                <Accordion id={`faqs-${props.idx}`} items={module.content.map(faq => {
                return { title: faq.question, content: faq.answer }
                })}/>
            </div>
            )
        case "contributors":
            return (
              <div>
                <h3>{module.title}</h3>
                <div className="cards-list">
                  {
                    module.contributors.map(({image_url, title}, idx) => {
                      return(
                        <div key={idx} className="card-item-small">
                          <div>
                            <img src={image_url} alt={title}/>
                            <strong>{title}</strong>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
        case "directors":
            return (
                <div>
                <h3>{module.title}</h3>
                <div className="cards-list directors">
                    {module.directors.map(({name, bio, image_url}, idx) => {
                    return (
                        <div className="card-item" key={idx}>
                        <img src={image_url} alt={name}></img>
                        <strong>{name}</strong>
                        <p>{bio}</p>
                        </div>
                    )
                    })}
                </div>
                
                </div>
            )
        case "wizard":
            // This is uncomfortably fragile but the Netlify CMS does not support auto-generated ID/key fields
            // as of 29/05/2020
            const wizardData = props.wizardData.find(wizard => wizard.key === module.wizard)
            if (!wizardData) return errorModule("Wizard data not found")
            return (
            <div className="module-block" name={wizardData.title.replace(/\s/g, '-').toLowerCase()}>
                <Wizard title={wizardData.title} background={wizardData.background} steps={wizardData.steps} />
            </div>
            )
        default: //Error Paragraph
            return (
            errorModule("Module type not found")
            )
    }
}

export default ModuleSelector
