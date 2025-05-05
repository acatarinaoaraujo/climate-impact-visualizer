using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeLossController : ControllerBase
    {
        private readonly IncomeLossDataService _incomeLossDataService;

        public IncomeLossController(IncomeLossDataService incomeLossDataService)
        {
            _incomeLossDataService = incomeLossDataService;
        }

        [HttpGet("aggregated")]
        public async Task<ActionResult<List<IncomeLossDataModel>>> GetAggregatedData()
        {
            var data = await _incomeLossDataService.GetIncomeLossAggDataAsync();
            return Ok(data);
        }
    }
}
