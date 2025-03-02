namespace Backend.Models
{
     public class EmissionsIndicatorDataModel
    {
        public string Name { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}