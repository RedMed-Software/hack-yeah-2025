using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HackYeah2025.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            AuthResponse response = await _authService.RegisterAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return CreateErrorResponse(ex);
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        try
        {
            AuthResponse response = await _authService.LoginAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return CreateErrorResponse(ex);
        }
    }

    private ActionResult<AuthResponse> CreateErrorResponse(InvalidOperationException exception)
    {
        return exception.Message switch
        {
            "InvalidCredentials" => Unauthorized(new { error = exception.Message }),
            "AccountInactive" => StatusCode(StatusCodes.Status403Forbidden, new { error = exception.Message }),
            _ => BadRequest(new { error = exception.Message })
        };
    }
}
