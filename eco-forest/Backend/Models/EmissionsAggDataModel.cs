namespace Backend.Models
{
     public class EmissionsAggDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }
        public List<EmissionsIndicatorDataModel> Indicators { get; set; }
    }

}