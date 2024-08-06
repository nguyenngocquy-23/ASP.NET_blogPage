using apiServer.Data;
using apiServer.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Security.Cryptography;
namespace apiServer.services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        private static readonly byte[] fixedSalt = System.Text.Encoding.UTF8.GetBytes("HelloWorld");

        internal static string HashPw(string password)
        {
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: fixedSalt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return hashed;
        }

        internal static bool VerifyPassword(string inputPassword, string savedPassword)
        {
            string hashPw = HashPw(inputPassword);
            return hashPw == savedPassword;
        }
        internal static string GenerateActivationCode()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[32];
                rng.GetBytes(randomBytes);
                string base64String = Convert.ToBase64String(randomBytes);

                // Thay thế các ký tự không an toàn trong URL
                string base64UrlString = base64String
                    .Replace("+", "-")
                    .Replace("/", "_")
                    .Replace("=", "")
                    .Replace("%", "");

                return base64UrlString;
            }
        }
        internal static string GenerateVerificationCode()
        {
        Random random = new Random();
        int length = 6;
            const string digits = "0123456789";
            char[] code = new char[length];
            for (int i = 0; i < length; i++)
            {
                code[i] = digits[random.Next(digits.Length)];
            }
            return new string(code);
        }
    }
}
