using Domain.Interfaces;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.Logging;
using Services;
using Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using Xceed.Words.NET;

namespace Domain
{
    public class SummarizationLogic : ISummarizationLogic
    {
        private readonly ISumarizationLLMService _summaryService;
        private readonly ILogger<SummarizationLogic> _logger;

        public SummarizationLogic(ISumarizationLLMService summaryService, ILogger<SummarizationLogic> logger)
        {
            _summaryService = summaryService;
            _logger = logger;
        }

        public async Task<string> DocumentToSummary(string filename, params FileInfo[] textFiles)
        {
            try
            {
                // Convert to Type
                var convertedFiles = new List<FileInfo>();
                foreach (var textFile in textFiles)
                {
                    if (textFile.Extension.Equals(".txt", StringComparison.OrdinalIgnoreCase))
                    {
                        convertedFiles.Add(textFile);
                    }
                    else if (textFile.Extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase) ||
                             textFile.Extension.Equals(".docx", StringComparison.OrdinalIgnoreCase))
                    {
                        // Convert PDF and DOCX to TXT and then import
                        FileInfo textContent = ConvertToText(textFile);

                        if (textContent != null)
                        {
                            convertedFiles.Add(textContent);
                        }
                        else
                        {
                            return "eror occured in file process"; // Conversion failed
                        }
                    }
                    else
                    {
                        return "Unsupported File Type"; // Unsupported file type
                    }
                }

                string result = await _summaryService.SummarizeAsync(convertedFiles.ToArray());
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "summarizedocs");
                Directory.CreateDirectory(uploadsFolder);

                // Specify the file path
                string filePath = Path.Combine(uploadsFolder, $"{filename}.txt");

                // Create a FileInfo object
                FileInfo fileInfo = new FileInfo(filePath);

                using (StreamWriter writer = fileInfo.CreateText())
                {
                    // Write the string to the file
                    writer.Write(result);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during DocumentToEmbedding.");
                return ex.Message;
            }
        }

        private FileInfo ConvertToText(FileInfo inputFile)
        {
            string resultText;
            try
            {
                //Convert pdf
                if (inputFile.Extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    // Convert PDF to text using PdfPig
                    using (PdfDocument pdfDocument = PdfDocument.Open(inputFile.FullName))
                    {
                        StringWriter textWriter = new StringWriter();
                        foreach (Page page in pdfDocument.GetPages())
                        {
                            string text = ContentOrderTextExtractor.GetText(page);
                            textWriter.WriteLine(text);
                        }
                        resultText = textWriter.ToString();
                    }
                }
                //Convert docx
                else if (inputFile.Extension.Equals(".docx", StringComparison.OrdinalIgnoreCase))
                {
                    // Convert DOCX to text using DocX
                    using (DocX doc = DocX.Load(inputFile.FullName))
                    {
                        resultText = doc.Text;
                    }
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during ConvertToText.");
                return null;
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploadsTemp");
            Directory.CreateDirectory(uploadsFolder);

            // Specify the file path
            string filePath = Path.Combine(uploadsFolder, $"{Path.GetFileNameWithoutExtension(inputFile.Name)}.txt");

            // Create a FileInfo object
            FileInfo fileInfo = new FileInfo(filePath);

            using (StreamWriter writer = fileInfo.CreateText())
            {
                // Write the string to the file
                writer.Write(resultText);
            }

            return fileInfo;
        }
    }
}