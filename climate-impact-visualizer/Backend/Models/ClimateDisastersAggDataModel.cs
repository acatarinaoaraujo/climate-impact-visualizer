namespace Backend.Models
{
     public class ClimateDisastersAggDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }
        public required List<ClimateDisastersIndicatorDataModel> Indicators { get; set; }
    }

}