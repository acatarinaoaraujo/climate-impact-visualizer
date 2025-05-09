using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/llm")]
public class LlmController : ControllerBase
{
    private readonly LlmService _llmService;

    public LlmController(LlmService llmService)
    {
        _llmService = llmService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] LlmRequest request)
    {
        var answer = await _llmService.AskQuestion(
            request.Country,
            request.Question,
            request.IndicatorType,
            request.IndicatorData,
            request.SelectedYear,
            request.RateChange
        );

        return Ok(new { response = answer });
    }

    public record LlmRequest(
        string Country,
        string Question,
        string IndicatorType,
        Dictionary<string, double> IndicatorData,
        int? SelectedYear,
        double? RateChange
    );
}
