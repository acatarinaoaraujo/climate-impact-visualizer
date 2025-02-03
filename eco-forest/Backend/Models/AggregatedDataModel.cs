namespace Backend.Models
{
     public class AggregatedDataModel
    {
        public string Country { get; set; }
        public List<TechnologyDataModel> Technologies { get; set; }
    }

}