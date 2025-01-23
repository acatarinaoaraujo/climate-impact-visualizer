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
        var response = await client.GetStringAsync("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_4/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json");
        var data = JsonSerializer.Deserialize<object>(response); // Adjust type as needed
        return Ok(data);
    }
}
