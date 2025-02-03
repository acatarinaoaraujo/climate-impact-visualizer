using Backend.Services;
using Backend.Models;
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

        [HttpGet]
        public async Task<ActionResult<List<RenewableEnergyDataModel>>> Get()
        {
            var data = await _renewableEnergyDataService.GetProcessedDataAsync();
            return Ok(data);
        }
    }
}
