namespace Backend.Models
{
     public class ForestCarbonAggDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }
        public List<ForestCarbonIndicatorDataModel> Indicators { get; set; }
    }

}