import ReactMarkdown from "react-markdown";
import "./AiChat.css";
export default function AiChat({ lastchat, data, id_ai, report_data_change,chat_id }) {
  return (
    <div className="msg left-msg">
      <div className="imgai">
        <img src="ailogo.png" alt="AI Logo" />{" "}
      </div>
      <div className="msg-bubble">
        <div className="msg-info">
           <ReactMarkdown>{data.message}</ReactMarkdown>
          </div>
        </div>
      </div>
  );
}
