using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services
{
    public class RenewableEnergyDataService
    {
        private readonly HttpClient _httpClient;

        public RenewableEnergyDataService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<RenewableEnergyDataModel>> GetProcessedDataAsync()
        {
            var response = await _httpClient.GetStringAsync("https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services/Indicator_4/FeatureServer/0/query?where=1%3D1&outFields=Country,Technology,Unit,F2000,F2001,F2002,F2003,F2004,F2005,F2006,F2007,F2008,F2009,F2010,F2011,F2012,F2013,F2014,F2015,F2016,F2017,F2018,F2019,F2020,F2021,F2022,F2023&outSR=4326&f=json");

            // Deserialize and process the data as needed
            var data = JsonSerializer.Deserialize<List<RenewableEnergyDataModel>>(response);

            // Perform any additional data wrangling or calculations here

            return data;
        }
    }
}
