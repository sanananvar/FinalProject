using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace CA.Application.Extensions.FileUploadExtensions
{
    public static class FileUpload
    {
        private static readonly string[] AllowedFileTypes = { "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };


        public static bool isImage(this IFormFile file)
        {
            return file.ContentType.Contains("image");
        }

        public static bool IsDocument(this IFormFile file)
        {
            return Array.Exists(AllowedFileTypes, type => file.ContentType.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        public static bool isSizeOk(this IFormFile file, int mb)
        {
            return file.Length / 1024 / 1024 <= mb;
        }

        public static string CreateImage(this IFormFile file, string root, string path)
        {
            string sanitizedFileName = Regex.Replace(file.FileName, @"[^a-zA-Z0-9\._]+", "-");
            string FileName = Guid.NewGuid().ToString() + sanitizedFileName;
            string FullPath = Path.Combine(root, path, FileName);

            using (FileStream strem = new FileStream(FullPath, FileMode.Create))
            {
                file.CopyTo(strem);
            }
            return FileName;
        }

        public static string SaveDocument(this IFormFile file, string root, string path)
        {
            string sanitizedFileName = Regex.Replace(file.FileName, @"[^a-zA-Z0-9\._]+", "-");
            string fileName = Guid.NewGuid().ToString() + "-" + sanitizedFileName;
            string fullPath = Path.Combine(root, path, fileName);

            using (FileStream stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return fileName;
        }
    }
}

