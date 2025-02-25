using System.Collections.Generic;

namespace Backend.Models
{
    public class IncomeLossDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }

        public string Variable { get; set; }

        public Dictionary<string, double?> YearlyData { get; set; }
    }
}
