namespace Backend.Models
{
     public class ForestCarbonIndicatorDataModel
    {
        public string Name { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}