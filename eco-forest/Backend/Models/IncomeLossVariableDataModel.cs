namespace Backend.Models
{
     public class IncomeLossVariableDataModel
    {
        public string Variable { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}