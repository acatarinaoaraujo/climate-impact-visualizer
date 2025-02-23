namespace Backend.Models
{
     public class IncomeLossVariableDataModel
    {
        public string Variable { get; set; }
        public string Unit { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}