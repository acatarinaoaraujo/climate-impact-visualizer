using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.Extensions.Logging;

namespace Backend.Services
{
    public class RenewableEnergyDataService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<RenewableEnergyDataService> _logger;

        public RenewableEnergyDataService(HttpClient httpClient, ILogger<RenewableEnergyDataService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<RenewableEnergyDataModel>> GetProcessedDataAsync()
        {
            try
            {
                var url = "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_4/FeatureServer/0/query?where=1%3D1&outFields=Country,Technology,Unit,F2000,F2001,F2002,F2003,F2004,F2005,F2006,F2007,F2008,F2009,F2010,F2011,F2012,F2013,F2014,F2015,F2016,F2017,F2018,F2019,F2020,F2021,F2022,F2023&outSR=4326&f=json";
                _logger.LogInformation($"Fetching data from: {url}");

                var response = await _httpClient.GetStringAsync(url);
                _logger.LogInformation($"Response received: {response.Substring(0, Math.Min(response.Length, 500))}...");

                if (string.IsNullOrEmpty(response))
                {
                    _logger.LogWarning("Received empty response from API.");
                    return new List<RenewableEnergyDataModel>();
                }

                using var jsonDoc = JsonDocument.Parse(response);
                var root = jsonDoc.RootElement;

                if (!root.TryGetProperty("features", out var features))
                {
                    _logger.LogError("Invalid JSON format: 'features' property not found.");
                    return new List<RenewableEnergyDataModel>();
                }

                var dataList = new List<RenewableEnergyDataModel>();
                foreach (var feature in features.EnumerateArray())
                {
                    var attributes = feature.GetProperty("attributes");
                    var data = new RenewableEnergyDataModel
                    {
                        Country = attributes.GetProperty("Country").GetString(),
                        Technology = attributes.GetProperty("Technology").GetString(),
                        Unit = attributes.GetProperty("Unit").GetString(),
                        YearlyData = new Dictionary<string, double?>()
                    };

                    for (int year = 2000; year <= 2023; year++)
                    {
                        string key = $"F{year}";
                        if (attributes.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.Number)
                        {
                            data.YearlyData[key] = value.GetDouble();
                        }
                        else
                        {
                            data.YearlyData[key] = null;
                        }
                    }
                    dataList.Add(data);
                }

                _logger.LogInformation($"Processed {dataList.Count} records.");
                return dataList;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching or processing data: {ex.Message}");
                return new List<RenewableEnergyDataModel>();
            }
        }
    }
}
