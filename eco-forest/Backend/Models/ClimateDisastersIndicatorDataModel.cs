namespace Backend.Models
{
     public class ClimateDisastersIndicatorDataModel
    {
        public string Name { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}