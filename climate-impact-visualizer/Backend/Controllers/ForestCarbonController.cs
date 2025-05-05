using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForestCarbonController : ControllerBase
    {
        private readonly ForestCarbonDataService _forestCarbonDataService;

        public ForestCarbonController(ForestCarbonDataService forestCarbonDataService)
        {
            _forestCarbonDataService = forestCarbonDataService;
        }

        [HttpGet("aggregated")]
        public async Task<ActionResult<List<ForestCarbonDataModel>>> GetAggregatedData()
        {
            var data = await _forestCarbonDataService.GetForestCarbonAggDataAsync();
            return Ok(data);
        }
    }
}

