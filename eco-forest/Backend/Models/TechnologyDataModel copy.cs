namespace Backend.Models
{
     public class TechnologyDataModel
    {
        public string Technology { get; set; }

        public Dictionary<string, double> YearlyData { get; set; }
    }

}