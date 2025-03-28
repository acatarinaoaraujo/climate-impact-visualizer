using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        [HttpGet("aggregated")]
        public async Task<ActionResult<List<RenewableEnergyAggDataModel>>> GetAggregatedData()
        {
            var data = await _renewableEnergyDataService.GetAggregatedDataAsync();
            return Ok(data);
        }
    }
}
