using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClimateDisastersController : ControllerBase
    {
        private readonly ClimateDisastersDataService _climateDisastersDataService;

        public ClimateDisastersController(ClimateDisastersDataService climateDisastersDataService)
        {
            _climateDisastersDataService = climateDisastersDataService;
        }

        [HttpGet("aggregated")]
        public async Task<ActionResult<List<ClimateDisastersDataModel>>> GetAggregatedData()
        {
            var data = await _climateDisastersDataService.GetClimateDisastersAggDataAsync();
            return Ok(data);
        }
    }
}

