using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RenewableEnergyController : ControllerBase
    {
        private readonly RenewableEnergyDataService _renewableEnergyDataService;

        public RenewableEnergyController(RenewableEnergyDataService renewableEnergyDataService)
        {
            _renewableEnergyDataService = renewableEnergyDataService;
        }

        [HttpGet("data")]
        public async Task<IActionResult> GetData()
        {
            var data = await rRenewableEnergyDataService.GetProcessedDataAsync();
            return Ok(data);
        }
    }
}
