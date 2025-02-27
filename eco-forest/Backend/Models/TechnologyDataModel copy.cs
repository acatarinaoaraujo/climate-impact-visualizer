namespace Backend.Models
{
     public class TechnologyDataModel
    {
        public string Name { get; set; }

        public Dictionary<string, double> YearlyData { get; set; }
    }

}