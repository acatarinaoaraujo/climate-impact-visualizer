using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmissionsController : ControllerBase
    {
        private readonly EmissionsDataService _emissionsDataService;

        public EmissionsController(EmissionsDataService emissionsDataService)
        {
            _emissionsDataService = emissionsDataService;
        }

        [HttpGet("aggregated")]
        public async Task<ActionResult<List<EmissionsDataModel>>> GetAggregatedData()
        {
            var data = await _emissionsDataService.GetEmissionsAggDataAsync();
            return Ok(data);
        }
    }
}

