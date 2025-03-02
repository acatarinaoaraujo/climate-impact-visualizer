namespace Backend.Models
{
     public class ClimateDisastersAggDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }
        public List<ClimateDisastersIndicatorDataModel> Indicators { get; set; }
    }

}