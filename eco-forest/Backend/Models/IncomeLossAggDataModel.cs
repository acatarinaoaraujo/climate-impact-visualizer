namespace Backend.Models
{
     public class IncomeLossAggDataModel
    {
        public string Country { get; set; }

        public string ISO2 { get; set; }
        public List<IncomeLossVariableDataModel> Variables { get; set; }
    }

}