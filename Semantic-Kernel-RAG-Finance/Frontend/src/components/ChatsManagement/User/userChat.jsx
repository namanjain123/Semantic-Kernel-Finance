import React from 'react'
export default function Userchat({data}) {
  return (
    <>{data !=="null"&&data!=="No data"?(
    <div className="msg right-msg">
      <div className="imguser">
          <img src='userimg.png'/>
        </div>
      <div className="msg-bubble">
        <div className="msg-text">
        {data}
        </div>
      </div>
    </div>):<></>}
    </>
  )
}
