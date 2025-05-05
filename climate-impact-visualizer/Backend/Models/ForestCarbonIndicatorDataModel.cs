namespace Backend.Models
{
     public class ForestCarbonIndicatorDataModel
    {
        public required string Name { get; set; }
        public required Dictionary<string, double> YearlyData { get; set; }
    }

}