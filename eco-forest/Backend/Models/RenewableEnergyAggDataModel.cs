namespace Backend.Models
{
     public class RenewableEnergyAggDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }
        public required List<RenewableEnergyTechDataModel> Technologies { get; set; }
    }

}