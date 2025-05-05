namespace Backend.Models
{
     public class IncomeLossAggDataModel
    {
        public required string Country { get; set; }

        public required string ISO2 { get; set; }
        public required List<IncomeLossVariableDataModel> Variables { get; set; }
    }

}