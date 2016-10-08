using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Externsion
{
    public static class IC_Externsion
    {
        public static int Add_<T>(this List<T> list,T data)
        {
            if (list.Contains(data))
            {
                return -1;
            } else
            {
                list.Add(data);
                return 0;
            }
        }
    }
}
