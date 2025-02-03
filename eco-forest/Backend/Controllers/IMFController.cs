using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class IMFController : ControllerBase
{
    [HttpGet("data")]
    public async Task<IActionResult> GetData()
    {
        var client = new HttpClient();
        var response = await client.GetStringAsync("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_4/FeatureServer/0/query?where=1%3D1&outFields=Country,Technology,Unit,F2000,F2001,F2002,F2003,F2004,F2005,F2006,F2007,F2008,F2009,F2010,F2011,F2012,F2013,F2014,F2015,F2016,F2017,F2018,F2019,F2020,F2021,F2022,F2023&outSR=4326&f=json");
        var data = JsonSerializer.Deserialize<object>(response); // Adjust type as needed
        return Ok(data);
    }
}
