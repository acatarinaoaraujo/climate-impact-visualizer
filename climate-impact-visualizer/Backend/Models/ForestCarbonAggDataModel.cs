namespace Backend.Models
{
     public class ForestCarbonAggDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }
        public required List<ForestCarbonIndicatorDataModel> Indicators { get; set; }
    }

}