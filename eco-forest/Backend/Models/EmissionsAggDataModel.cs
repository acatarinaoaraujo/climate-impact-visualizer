namespace Backend.Models
{
     public class EmissionsAggDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }
        public required List<EmissionsIndicatorDataModel> Indicators { get; set; }
    }

}