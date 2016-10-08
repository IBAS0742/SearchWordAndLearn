using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Externsion;

namespace AboutHtmlElement.Externsion
{
    public class Externsion
    {
        public IDictionary<string, List<string>> Attribute_Get { get; } = new Dictionary<string, List<string>>();
        public Externsion()
        {
        }
        public void Add_(string key,string val)
        {
            if (Attribute_Get.ContainsKey(key))
            {
                Attribute_Get[key].Add_(val);
            }
        }
    }
}
