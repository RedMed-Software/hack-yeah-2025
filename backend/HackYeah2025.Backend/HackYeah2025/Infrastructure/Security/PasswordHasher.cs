using System.Globalization;
using System.Security.Cryptography;

namespace HackYeah2025.Infrastructure.Security;

public static class PasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100000;
    private const char Separator = ':';

    public static string Hash(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        using Rfc2898DeriveBytes algorithm = new(password, salt, Iterations, HashAlgorithmName.SHA256);
        byte[] key = algorithm.GetBytes(KeySize);
        return string.Join(Separator, Iterations.ToString(CultureInfo.InvariantCulture), Convert.ToBase64String(salt), Convert.ToBase64String(key));
    }

    public static bool Verify(string password, string hashedPassword)
    {
        string[] parts = hashedPassword.Split(Separator);
        if (parts.Length != 3)
        {
            return false;
        }

        if (!int.TryParse(parts[0], NumberStyles.Integer, CultureInfo.InvariantCulture, out int iterations))
        {
            return false;
        }

        byte[] salt = Convert.FromBase64String(parts[1]);
        byte[] expectedKey = Convert.FromBase64String(parts[2]);

        using Rfc2898DeriveBytes algorithm = new(password, salt, iterations, HashAlgorithmName.SHA256);
        byte[] actualKey = algorithm.GetBytes(KeySize);

        return CryptographicOperations.FixedTimeEquals(actualKey, expectedKey);
    }
}
