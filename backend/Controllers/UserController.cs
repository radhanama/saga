using saga.Services;
using saga.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using saga.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace saga.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var token = await _userService.AuthenticateAsync(loginDto);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("resetPasswordRequet")]
        public async Task<IActionResult> ResetPasswordRequest(RequestResetPasswordDto loginDto)
        {
            try
            {
                await _userService.ResetPasswordRequestAsync(loginDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("resetPassword")]
        [Authorize(Roles = "ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto loginDto)
        {
            try
            {
                var token = await _userService.ResetPasswordAsync(loginDto);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string? search = null)
        {
            try
            {
                var users = await _userService.GetAllUsersAsync(page, size, search);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
