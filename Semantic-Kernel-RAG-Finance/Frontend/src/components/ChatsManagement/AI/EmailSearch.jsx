import React from 'react'

export default function EmailSearch(setEmailMenu,input_email,handleMessageChange,sendMail) {
  return (
    <>
                  <div className="MailForm-Container">
                    <div className="MailForm">
                      <div className="MailContainer-Header" >
                        <div className= "MailHeader-Text">Share Data</div>
                          <button onClick={() => setEmailMenu(false)} type="button" className= "btn btn-info MailHeader-Close" >
                          </button>
                        </div>
                        <input className="MailContainer-input" value={input_email} placeholder="Search by name or E-mail"
                        onChange={handleMessageChange()}/>
                        <div className="MailContainer-Buttons">
                          <button onClick={() => setEmailMenu(false)} className="MailButtons-Cancel">
                              <div className="MailCancelBtn-text">Cancel</div>
                          </button>
                          <button className="MailButtons-Send" onClick={()=>sendMail(input_email)}>
                              <div className="MailSendBtn-text" >Send</div>
                          </button>
                        </div>
                    </div>
                    </div>
                  </>
  )
}
