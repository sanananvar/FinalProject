using System;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace CA.Application.Helpers.CustomCoders;

public static class CustomCoder
{
    public static string EncodeToken(this string token)
    {
        byte[] bytesCode = Encoding.UTF8.GetBytes(token);
        return WebEncoders.Base64UrlEncode(bytesCode);
    }

    public static string DecodeToken(this string token)
    {
        var decodeToken = WebEncoders.Base64UrlDecode(token);
        return Encoding.UTF8.GetString(decodeToken);
    }
}

