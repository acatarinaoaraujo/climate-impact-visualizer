using System.Collections.Generic;

namespace Backend.Models
{
    public class RenewableEnergyDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }

        public required string Technology { get; set; }
        public required Dictionary<string, double?> YearlyData { get; set; }
    }
}
