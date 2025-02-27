namespace Backend.Models
{
     public class IncomeLossVariableDataModel
    {
        public string Name { get; set; }
        public Dictionary<string, double> YearlyData { get; set; }
    }

}