using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

public class LlmService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public LlmService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<string> AskQuestion(
        string countryName,
        string question,
        string indicatorType,
        Dictionary<string, double> indicatorData,
        int? selectedYear,
        double? rateChange
    )
    {
        var apiKey = _config["OpenRouter:ApiKey"];
        var baseUrl = _config["OpenRouter:BaseUrl"];

        // Building the system prompt dynamically
        var systemPrompt = new StringBuilder();
        systemPrompt.AppendLine(
            $"You are a helpful assistant that explains climate indicators for {countryName}."
        );
        systemPrompt.AppendLine($"The selected indicator is '{indicatorType}'.");

        if (selectedYear.HasValue)
        {
            systemPrompt.AppendLine($"The user is interested in the year {selectedYear}.");
        }
        if (rateChange.HasValue)
        {
            systemPrompt.AppendLine($"The rate of change is {rateChange.Value:F2}.");
        }
        if (indicatorData != null && indicatorData.Any())
        {
            var dataSummary = string.Join(
                ", ",
                indicatorData.OrderBy(kvp => kvp.Key).Select(kvp => $"{kvp.Key}: {kvp.Value}")
            );
            systemPrompt.AppendLine($"Here is the indicator data: {dataSummary}.");
        }

        var body = new
        {
            model = "mistralai/mistral-7b-instruct",
            messages = new[]
            {
                new { role = "system", content = systemPrompt.ToString() },
                new { role = "user", content = question },
            },
        };

        var content = new StringContent(
            JsonSerializer.Serialize(body),
            Encoding.UTF8,
            "application/json"
        );
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            apiKey
        );

        var response = await _httpClient.PostAsync(baseUrl, content);
        var responseString = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseString);
        return doc
            .RootElement.GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();
    }
}
