using System.Collections.Generic;

namespace Backend.Models
{
    public class IncomeLossDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }

        public required string Variable { get; set; }

        public required Dictionary<string, double?> YearlyData { get; set; }
    }
}
