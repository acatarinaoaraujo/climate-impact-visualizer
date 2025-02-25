using System.Collections.Generic;

namespace Backend.Models
{
    public class RenewableEnergyDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }

        public string Technology { get; set; }
        public Dictionary<string, double?> YearlyData { get; set; }
    }
}
