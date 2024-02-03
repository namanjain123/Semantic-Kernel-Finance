import React, { useEffect, useRef, useState } from "react";
import TableMaker from "./tableMaker";
import ChartMaker from "./chartmaker";
import ReactMarkdown from "react-markdown";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";
import Feedback from "./Feedback";
import axios from "axios";
import "./AiChat.css";
import toast, { Toaster } from 'react-hot-toast';
export default function AiChat({ lastchat, data, id_ai, report_data_change,chat_id }) {
  const [chart_configuration, setchartconfig] = useState("");
  const [downloadButtonenabler, setDownloadButton] = useState(true);
  const [MarkdownText, setMarkdown] = useState(true);
  const [reportChange, setreport] = useState(true);
  const [showChangeOption, setChangeOption] = useState(false);
  const captureRef = useRef(null);
  //chart maker
  const chartMaker = (data_send, chartType) => {
    const data_used = JSON.parse(data_send);
    let labels = [];
    let values = [];
    let Mainlabels = [];
    if (data_used.length > 0) {
      const firstItem = data_used[0];
      if (firstItem.Year !== undefined && firstItem.Quarter !== undefined) {
        Mainlabels = data_used.map(
          (element) => `Q${element.Quarter} ${element.Year}`
        );
      } else if (firstItem.Year !== undefined) {
        Mainlabels = data_used.map((item) => item.Year);
      } else if (firstItem.Quarter !== undefined) {
        Mainlabels = data_used.map((item) => item.Quarter);
      } else {
        Mainlabels.push("Data");
      }
      for (const item of data_used) {
        for (const key in item) {
          if (
            key !== "Year" &&
            key !== "Quarter" &&
            key !== "year" &&
            key !== "quarter" &&
            !labels.includes(key)
          ) {
            labels.push(key);
          }
        }
      }

      for (const item of data_used) {
        const itemValues = [];
        for (const label of labels) {
          itemValues.push(item[label] || 0);
        }
        values.push(itemValues);
      }

      const config = {
        type: chartType,
        data: {
          labels: Mainlabels,
          datasets: labels.map((label, index) => ({
            label,
            data: values.map((item) => item[index]),
            borderColor: [
              "#76ADFF",
              "rgb(255, 99, 132)",
              "#FFB067",
              "#22A800",
              "#D13829",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
              "rgb(25, 99, 132)",
              "rgb(125, 159, 64)",
              "rgb(225, 205, 86)",
              "rgb(5, 192, 192)",
              "rgb(14, 162, 235)",
              "rgb(0, 102, 255)",
              "rgb(200, 203, 207)",
            ],
            backgroundColor: [
              "#76ADFF",
              "rgb(255, 99, 132)",
              "#FFB067",
              "#22A800",
              "#D13829",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
              "rgb(25, 99, 132)",
              "rgb(125, 159, 64)",
              "rgb(225, 205, 86)",
              "rgb(5, 192, 192)",
              "rgb(14, 162, 235)",
              "rgb(0, 102, 255)",
              "rgb(200, 203, 207)",
            ],
            borderWidth: chartType === "bar" ? 2 : 0,
            borderRadius: chartType === "bar" ? 20 : 0,
          })),
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };
      setchartconfig(config);
    }
  };
  useEffect(() => {
    if (data.message == null) {
      setChangeOption(true);
      const chartType = lastchat.includes("pie")
        ? "pie"
        : lastchat.includes("line")
        ? "line"
        : "bar";
      chartMaker(data.data, chartType);
    } else {
      if (data.message.includes("<b>")) {
        setMarkdown(false);
      }
    }
  }, [data]);
  const handleSendmail=async(emailid)=>{
    try {
      const sendData = {
        email_id: emailid,
        report: data.report,
      };
      const response = await axios.post(
        "https://localhost:43373/api/Email",
        sendData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Email send");
        toast.success('Successfully Send the Email');
      } else {
        console.error("API Error:", response.data.message);
        toast.error("No Able to Send The mail");
      }
    } catch (error) {
      setChangeOption(true);
      console.error("API Error:", error);
      setreport(true);
    }
  };
  const handlePdfDownload = async () => {
    try {
      setDownloadButton(false);
      const chartType = lastchat.includes("pie")
        ? "pie"
        : lastchat.includes("line")
        ? "line"
        : "bar";
      await chartMaker(data.data, chartType);
      const senddata = {
        chart_config: JSON.stringify(chart_configuration),
        data: data.data,
        report: data.report, // Send the chart configuration directly, no need to stringify it
      };
      const response = await axios.post(
        "https://localhost:43373/api/PdfMaker",
        senddata,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data === "genrated") {
        setDownloadButton(true);
        pdfDownload();
      } else {
        console.error("API Error:", response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const onCopyClick = () => {
    if (data.message != null) {
      copy(data.message);
    } else {
      copy(data.report);
    }
  };

  const pdfDownload = async () => {
    const blobName = "output.pdf";
    try {
      const a = document.createElement("a");
      a.href =
        "https://32skstorageaccount.blob.core.windows.net/petronascopilot/output.pdf";
      a.download = blobName;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const handlePowerPointDownload=()=>{};
  const onReportChange = async (option) => {
    setreport(false);
    try {
      const sendData = {
        options: option,
        report: data.report,
        userId:"1",
        chatId:chat_id.id,
        arrayId:id_ai,
      };
      console.log(sendData)
      const response = await axios.post(
        "https://localhost:43373/api/OptionManagement",
        sendData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        data.report = response.data.report;
        setreport(true);
        setChangeOption(true);
        report_data_change(id_ai, response.data.report);
      } else {
        setChangeOption(true);
        console.error("API Error:", response.data.message);
      }
    } catch (error) {
      setChangeOption(true);
      console.error("API Error:", error);
      setreport(true);
    }
  };
  const workbook = new Excel.Workbook();
  const getRangePoints = (rows, columns) => {
    const lastColLetter = String.fromCharCode(65 + columns - 1);
    // Build the Excel-style range string
    const rangeString = String(`A1:${lastColLetter}${rows}`);
    return rangeString;
  };
  const excelExport = () => {
    try {
      const fileName = "ReportData.xlsx";
      const worksheet = workbook.addWorksheet("Report Table");
      var data_used = JSON.parse(data.data);
      // Define the columns for your Excel sheet based on the keys in your data
      const columns = Object.keys(data_used[0]);
      //No of ROWS
      const rows = data_used.length + 1;
      //Get Rows range
      const range = getRangePoints(rows, columns.length);
      // Add headers to the worksheet
      worksheet.columns = columns.map((column) => ({
        header: column,
        key: column,
      }));
      worksheet.getRow(1).font = { bold: true };
      data_used.forEach((rowData) => {
        worksheet.addRow(rowData);
      });
      // let dataRange=worksheet.getSheetValues(range);
      // const drawing = worksheet.addDrawing();

      // // Create a chart and attach it to the drawing
      // const chart = drawing.addChart('line', dataRange, 'auto');
      // chart.title.text = "Repport data";
      // chart.legend.position = Excel.ChartLegendPosition.right;
      // chart.legend.format.fill.setSolidColor("white");
      // chart.dataLabels.format.font.size = 15;
      // chart.dataLabels.format.font.color = "black";
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        toast.success('Successfully Downloaded Excel');
        // Save the blob as a file using file-saver
        saveAs(blob, fileName);
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  return (
    <div className="msg left-msg">
      <Toaster
  position="top-right"
  reverseOrder={false}
/>
      <div className="imgai">
        <img src="ailogo.png" alt="AI Logo" />{" "}
        {/* Add alt text for accessibility */}
      </div>
      <div className="msg-bubble">
        <div className="msg-info">
          {data.message != null ? (
            <></>
          ) : downloadButtonenabler ? (
            <div style={{ display: "flex" }}>
              <p className="Report-start-text" style={{ marginRight: "10px" }}>
                Sure, here's everything Copilot has found from your query
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div ref={captureRef}>
          <div className="msg-text">
            {data.message != null ? (
              <div className="text-message">
                {MarkdownText ? (
                  <ReactMarkdown>{data.message}</ReactMarkdown>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.message.replace(/-|\.|<\/b>/g, (match) => {
                        if (match === "-") {
                          return "<li>";
                        } else if (match === ".") {
                          return "<br/><br/>";
                        } else if (match === "</b>") {
                          return "</b><br>";
                        }
                      }),
                    }}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="GraphicalRepresentation">
                  <b className="Text-Head-AI">Graphical Representation :</b>
                  <br />
                  <br />
                  <ChartMaker
                    data_chart={data.data}
                    id_chart={id_ai}
                    config={chart_configuration}
                  />
                </div>
                <br />
                <div className="TabularData">
                  <br />
                  <b className="Text-Head-AI">Tabular Data :</b>
                  <br />
                  <TableMaker data_table={data.data} />
                  <br />
                </div>
                {reportChange ? (
                  <div>
                    <br />
                    <b className="Text-Head-AI">Report:</b>
                    <div className="reportText">
                      <ReactMarkdown>{data.report}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="loading-container">
                    <div className="loading-dot first"></div>
                    <div className="loading-dot second"></div>
                    <div className="loading-dot thrid"></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Feedback
          onCopyClick={onCopyClick}
          onReportChange={onReportChange}
          showOption={showChangeOption}
          excelExport={excelExport}
          emailExport={handleSendmail}
          pdfExport={handlePdfDownload}
          powerpointExport={handlePowerPointDownload}
        />
      </div>
    </div>
  );
}

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const pdfGeneration = () => {
//   const captureElement = captureRef.current;
//   const dpi = window.devicePixelRatio;

//   html2canvas(captureElement, { scale: dpi }).then((canvas) => {
//     const width = captureElement.offsetWidth;
//     const height = captureElement.offsetHeight;

//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF({
//       orientation: 'portrait', // Correct the typo: 'portratit' -> 'portrait'
//       unit: 'px',
//       format: [width, height]
//     });

//     pdf.addImage(imgData, 'PNG', 20, 20);
//     pdf.save('Report.pdf');
//   });
// };
