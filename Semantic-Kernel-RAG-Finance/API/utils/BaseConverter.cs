using Domain.Interfaces;
using Models.Chat;

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;

namespace API.utils;

public static class BaseConverter
{
    public static IFormFileCollection ConvertToFormFileCollection(List<FileInput> fileInputs)
    {
        var formFiles = fileInputs.Select(fileInput => new FormFile(
            new MemoryStream(Convert.FromBase64String(fileInput.content)),
            0, // Placeholder for length, as it's not used in your example
            Convert.FromBase64String(fileInput.content).Length,
            fileInput.name,
            fileInput.name)
        {
            Headers = new HeaderDictionary(),
            ContentType = fileInput.Type
        }).ToList();
        var result=new FormFileCollection();
        result.AddRange(formFiles);
        return result;
    }

}
