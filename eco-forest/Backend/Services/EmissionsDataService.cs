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
    public class EmissionsDataService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<EmissionsDataService> _logger;

        private readonly Dictionary<string, string> _indicatorMapping = new()
        {
            { "CO2 Emissions Embodied in Production", "Production" },
            { "CO2 Emissions Embodied in Gross Imports", "Gross Imports" },
            { "CO2 Emissions Embodied in Gross Exports", "Gross Exports" },
            { "CO2 Emissions Embodied in Final Domestic Demand", "Final Domestic Demand" }
        };

        public EmissionsDataService(HttpClient httpClient, ILogger<EmissionsDataService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<EmissionsDataModel>> GetProcessedDataAsync()
        {
            var dataList = new List<EmissionsDataModel>();
            int offset = 0;
            int limit = 1000; // Default maxRecordCount

            try
            {
                while (true)
                {
                    var url = $"https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_7_1_Trade_related_Indicators_CO2_emissions_embodied_in_trade/FeatureServer/0/query?where=1%3D1&outFields=Country,ISO2,Indicator,F1995,F1996,F1997,F1998,F1999,F2000,F2001,F2002,F2003,F2004,F2005,F2006,F2007,F2008,F2009,F2010,F2011,F2012,F2013,F2014,F2015,F2016,F2017,F2018,F2019,F2020,F2021&outSR=4326&f=json&resultRecordCount={limit}&resultOffset={offset}";

                    _logger.LogInformation($"Fetching data from: {url}");

                    var response = await _httpClient.GetStringAsync(url);
                    if (string.IsNullOrEmpty(response)) break;

                    using var jsonDoc = JsonDocument.Parse(response);
                    var root = jsonDoc.RootElement;
                    if (!root.TryGetProperty("features", out var features) || features.GetArrayLength() == 0) break;

                    foreach (var feature in features.EnumerateArray())
                    {
                        var attributes = feature.GetProperty("attributes");

                        var iso2 = attributes.GetProperty("ISO2").GetString();
                        if (string.IsNullOrEmpty(iso2))
                            continue;

                        var indicator = attributes.GetProperty("Indicator").GetString() ?? "";
                        if (!_indicatorMapping.ContainsKey(indicator))
                            continue; // Skip unmapped indicators

                        var data = new EmissionsDataModel
                        {
                            Country = attributes.GetProperty("Country").GetString()!,
                            ISO2 = iso2,
                            Indicator = _indicatorMapping[indicator],
                            YearlyData = new Dictionary<string, double?>()
                        };

                        for (int year = 1995; year <= 2021; year++)
                        {
                            string key = $"F{year}";
                            data.YearlyData[key] = attributes.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.Number
                                ? value.GetDouble()
                                : null;
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

        public async Task<List<EmissionsAggDataModel>> GetEmissionsAggDataAsync()
        {
            var dataList = await GetProcessedDataAsync();

            // Aggregate data by country
            var aggregatedData = dataList
                .GroupBy(d => d.Country)
                .Select(g => new EmissionsAggDataModel
                {
                    Country = g.Key,
                    ISO2 = g.First().ISO2,
                    Indicators = g
                        .GroupBy(d => d.Indicator)
                        .Where(tg => _indicatorMapping.ContainsValue(tg.Key)) // Ensure only mapped indicators are included
                        .Select(tg => new EmissionsIndicatorDataModel
                        {
                            Name = tg.Key,
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
