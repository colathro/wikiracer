using System.Threading;

namespace Web
{
    /// <summary>
    /// This is the entrypoint for the host process that hosts the service.
    /// </summary>
    public static class Program
    {
        public static void Main(string[] args)
        {
            Thread.Sleep(Timeout.Infinite);
        }
    }
}
