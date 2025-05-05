namespace Backend.Models
{
     public class EmissionsIndicatorDataModel
    {
        public required string Name { get; set; }
        public required Dictionary<string, double> YearlyData { get; set; }
    }

}