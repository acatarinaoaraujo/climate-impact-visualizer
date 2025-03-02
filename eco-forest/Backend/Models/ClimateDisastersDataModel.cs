using System.Collections.Generic;

namespace Backend.Models
{
    public class ClimateDisastersDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }

        public string Indicator { get; set; }

        public Dictionary<string, double?> YearlyData { get; set; }
    }
}
