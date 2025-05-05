namespace Backend.Models
{
     public class ClimateDisastersIndicatorDataModel
    {
        public required string Name { get; set; }
        public required Dictionary<string, double> YearlyData { get; set; }
    }

}