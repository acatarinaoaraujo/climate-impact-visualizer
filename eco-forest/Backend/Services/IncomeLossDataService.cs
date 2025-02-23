using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace Backend.Services
{
    public class IncomeLossDataService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<IncomeLossDataService> _logger;

        public IncomeLossDataService(HttpClient httpClient, ILogger<IncomeLossDataService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<IncomeLossDataModel>> GetProcessedDataAsync()
        {
            var dataList = new List<IncomeLossDataModel>();
            int offset = 0;
            int limit = 1000; // Default maxRecordCount

            try
            {
                while (true)
                {
                    var url = $"https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_16_4/FeatureServer/0/query?where=Indicator%20%3D%20'POTENTIAL%20NATIONAL%20INCOME%20LOSS%20FROM%20CLIMATE%20RISKS'&outFields=Country,Variable,F2023,F2024,F2025,F2026,F2027,F2028,F2029,F2030,F2031,F2032,F2033,F2034,F2035,F2036,F2037,F2038,F2039,F2040,ISO2,Unit&outSR=4326&f=json&resultRecordCount={limit}&resultOffset={offset}";

                    _logger.LogInformation($"Fetching data from: {url}");

                    var response = await _httpClient.GetStringAsync(url);
                    if (string.IsNullOrEmpty(response)) break;

                    using var jsonDoc = JsonDocument.Parse(response);
                    var root = jsonDoc.RootElement;
                    if (!root.TryGetProperty("features", out var features) || features.GetArrayLength() == 0) break;

                    foreach (var feature in features.EnumerateArray())
                    {
                        var attributes = feature.GetProperty("attributes");
                        var data = new IncomeLossDataModel
                        {
                            Country = attributes.GetProperty("Country").GetString(),
                            ISO2 = attributes.GetProperty("ISO2").GetString(),
                            Variable = attributes.GetProperty("Variable").GetString(),
                            Unit = attributes.GetProperty("Unit").GetString(),
                            YearlyData = new Dictionary<string, double?>()
                        };

                        for (int year = 2023; year <= 2040; year++)
                        {
                            string key = $"F{year}";
                            data.YearlyData[key] = attributes.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.Number ? value.GetDouble() : null;
                        }

                        dataList.Add(data);
                    }

                    offset += limit;
                }

                _logger.LogInformation($"Processed {dataList.Count} records.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching or processing data: {ex.Message}");
            }

            return dataList;
        }


        public async Task<List<IncomeLossAggDataModel>> GetIncomeLossAggDataAsync()
        {
            var dataList = await GetProcessedDataAsync();

            // Aggregate data by country
            var aggregatedData = dataList
                .GroupBy(d => d.Country)
                .Select(g => new IncomeLossAggDataModel
                {
                    Country = g.Key,
                    Variables = g
                        .GroupBy(d => d.Variable)
                        .Select(tg => new IncomeLossVariableDataModel
                        {
                            Variable = tg.Key,
                            Unit = tg.First().Unit,
                            YearlyData = tg
                                .SelectMany(d => d.YearlyData)
                                .GroupBy(d => d.Key)
                                .ToDictionary(
                                    d => d.Key,
                                    d => d.Sum(v => v.Value ?? 0)
                                )
                        })
                        .ToList()
                })
                .ToList();

            _logger.LogInformation($"Aggregated {aggregatedData.Count} records.");
            return aggregatedData;
        }

    }
}
