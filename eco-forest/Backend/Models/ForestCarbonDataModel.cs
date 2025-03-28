using System.Collections.Generic;

namespace Backend.Models
{
    public class ForestCarbonDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }

        public required string Indicator { get; set; }

        public required Dictionary<string, double?> YearlyData { get; set; }
    }
}
